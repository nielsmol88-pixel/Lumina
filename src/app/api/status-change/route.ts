import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import type { PatientStatus, LanguagePref } from "@/types/supabase";

const TEMPLATES: Record<string, { es: string; en: string }> = {
  consult_confirm: { es: "lumina_consult_confirm_es", en: "lumina_consult_confirm_en" },
  surgery_confirm: { es: "lumina_surgery_confirm_es", en: "lumina_surgery_confirm_en" },
  postop_day1:     { es: "lumina_postop_day1_es",     en: "lumina_postop_day1_en"     },
};

const STATUS_TEMPLATE_MAP: Partial<Record<PatientStatus, string>> = {
  Consult_Booked: "consult_confirm",
  Surgery_Booked: "surgery_confirm",
  Post_Op:        "postop_day1",
};

/**
 * POST /api/status-change
 * Called when a patient's status changes on the dashboard.
 * Fires the appropriate WhatsApp template automatically.
 *
 * Calls WATI directly — no internal HTTP round-trip.
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { patient_id, new_status } = await req.json() as {
      patient_id: string;
      new_status: PatientStatus;
    };

    if (!patient_id || !new_status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const templateId = STATUS_TEMPLATE_MAP[new_status];
    if (!templateId) return NextResponse.json({ ok: true, triggered: false });

    const service = createServiceClient();
    const { data: patient } = await service
      .from("patients")
      .select("id, phone, language_preference")
      .eq("id", patient_id)
      .single();

    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    // Cast to known shape — Supabase partial select loses type inference
    const { phone, language_preference } = patient as unknown as {
      id: string;
      phone: string;
      language_preference: LanguagePref;
    };

    const templateName = TEMPLATES[templateId]?.[language_preference];
    if (!templateName) return NextResponse.json({ ok: true, triggered: false });

    const watiEndpoint = process.env.WATI_API_ENDPOINT;
    const watiToken = process.env.WATI_API_TOKEN;

    if (!watiEndpoint || !watiToken) {
      console.warn("[status-change] WATI not configured — skipping WhatsApp trigger");
      return NextResponse.json({ ok: true, triggered: false });
    }

    const normalizedPhone = phone.replace(/\s+/g, "").replace(/^00/, "+");

    const response = await fetch(
      `${watiEndpoint}/sendTemplateMessage?whatsappNumber=${encodeURIComponent(normalizedPhone)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${watiToken}` },
        body: JSON.stringify({
          template_name: templateName,
          broadcast_name: `lumina_${templateId}_${Date.now()}`,
          parameters: [],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("[status-change] WATI error:", result);
      // Don't fail the status change — WhatsApp is best-effort
      return NextResponse.json({ ok: true, triggered: false, watiError: result });
    }

    // Log outbound message
    await (service.from("messages") as any).insert({
      patient_id,
      direction: "outbound",
      body: `[Template: ${templateId}]`,
      template_id: templateId,
      wati_id: result?.messageId ?? null,
    });

    return NextResponse.json({ ok: true, triggered: true, template: templateId });
  } catch (err) {
    console.error("[status-change]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
