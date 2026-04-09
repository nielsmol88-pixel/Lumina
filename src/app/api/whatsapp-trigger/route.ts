import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";

const TEMPLATES: Record<string, { es: string; en: string }> = {
  consult_confirm:  { es: "lumina_consult_confirm_es",  en: "lumina_consult_confirm_en"  },
  surgery_confirm:  { es: "lumina_surgery_confirm_es",  en: "lumina_surgery_confirm_en"  },
  postop_day1:      { es: "lumina_postop_day1_es",       en: "lumina_postop_day1_en"      },
  postop_day7:      { es: "lumina_postop_day7_es",       en: "lumina_postop_day7_en"      },
  lead_received:    { es: "lumina_lead_received_es",     en: "lumina_lead_received_en"    },
};

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { patient_id, phone, template_id, language = "es" } = await req.json();
    if (!phone || !template_id) {
      return NextResponse.json({ error: "Missing phone or template_id" }, { status: 400 });
    }

    const templateName = TEMPLATES[template_id]?.[language as "es" | "en"];
    if (!templateName) {
      return NextResponse.json({ error: "Unknown template" }, { status: 400 });
    }

    const normalizedPhone = phone.replace(/\s+/g, "").replace(/^00/, "+");
    const watiEndpoint = process.env.WATI_API_ENDPOINT;
    const watiToken = process.env.WATI_API_TOKEN;

    if (!watiEndpoint || !watiToken) {
      return NextResponse.json({ error: "WATI not configured" }, { status: 503 });
    }

    const response = await fetch(
      `${watiEndpoint}/sendTemplateMessage?whatsappNumber=${encodeURIComponent(normalizedPhone)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${watiToken}` },
        body: JSON.stringify({
          template_name: templateName,
          broadcast_name: `lumina_${template_id}_${Date.now()}`,
          parameters: [],
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      console.error("[whatsapp-trigger] WATI error:", result);
      return NextResponse.json({ error: "WATI API error", detail: result }, { status: 502 });
    }

    // Store outbound message in thread
    if (patient_id) {
      const service = createServiceClient();
      await (service.from("messages") as any).insert({
        patient_id,
        direction: "outbound",
        body: `[Template: ${template_id}]`,
        template_id,
        wati_id: result?.messageId ?? null,
      });
    }

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[whatsapp-trigger]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
