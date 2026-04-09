import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/whatsapp-webhook
 * Receives inbound WhatsApp messages from WATI and stores them.
 * WATI sends a webhook payload for every incoming message.
 * No auth header — secured by a shared secret in the query string.
 */
export async function POST(req: NextRequest) {
  // Verify shared secret to prevent spoofing
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.WATI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = await req.json();

    // WATI inbound payload shape (simplified):
    // { waId: "34600123456", text: { body: "Hola" }, id: "wamid.xxx", timestamp: "..." }
    const phone = payload.waId ? `+${payload.waId}` : null;
    const body = payload.text?.body ?? payload.body ?? null;
    const watiId = payload.id ?? null;

    if (!phone || !body) {
      return NextResponse.json({ ok: true }); // ignore non-text events
    }

    const supabase = createServiceClient();

    // Find patient by phone (normalize: strip spaces and leading zeros)
    const normalizedPhone = phone.replace(/\s+/g, "");
    const { data: patientData } = await (supabase as any)
      .from("patients")
      .select("id")
      .or(`phone.eq.${normalizedPhone},phone.eq.${normalizedPhone.replace("+", "00")}`)
      .single();

    const patient = patientData as { id: string } | null;

    if (!patient) {
      console.warn("[whatsapp-webhook] Unknown phone:", normalizedPhone);
      return NextResponse.json({ ok: true });
    }

    // Dedup by wati_id
    if (watiId) {
      const { data: existing } = await (supabase as any)
        .from("messages")
        .select("id")
        .eq("wati_id", watiId)
        .single();
      if (existing) return NextResponse.json({ ok: true });
    }

    await (supabase.from("messages") as any).insert({
      patient_id: patient.id,
      direction: "inbound",
      body,
      wati_id: watiId,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[whatsapp-webhook]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
