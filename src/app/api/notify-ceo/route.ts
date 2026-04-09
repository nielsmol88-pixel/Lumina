import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/notify-ceo
 * Fires a sanitized (no PII) webhook to Make.com / Telegram
 * when a new lead is created. Called by PatientIntakeForm.
 *
 * GDPR: Only anonymized metadata is fetched and forwarded.
 * PII (name, phone, email) and health data NEVER leave the system.
 */
export async function POST(req: NextRequest) {
  try {
    const { patient_id } = await req.json();
    if (!patient_id) {
      return NextResponse.json({ error: "Missing patient_id" }, { status: 400 });
    }

    // Fetch ONLY the three non-sensitive fields needed for the notification.
    // Do NOT use select("*") — that loads PII into server memory unnecessarily.
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("patients")
      .select("id, created_at, language_preference")
      .eq("id", patient_id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Cast to known shape — Supabase partial select loses type inference
    const { id, created_at, language_preference } = data as unknown as {
      id: string;
      created_at: string;
      language_preference: string;
    };

    const sanitizedPayload = {
      event: "new_lead",
      patient_id: id,
      created_at,
      language: language_preference,
      // No name, phone, email, or health data leaves the system
    };

    const notifications: Promise<unknown>[] = [];

    // Make.com webhook
    if (process.env.MAKE_WEBHOOK_URL) {
      notifications.push(
        fetch(process.env.MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sanitizedPayload),
        })
      );
    }

    // Telegram bot
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `🔔 *LÚMINA — Nuevo Lead*\nID: \`${id.slice(0, 8)}\`\nIdioma: ${language_preference.toUpperCase()}\nFecha: ${new Date(created_at).toLocaleString("es-ES")}`;
      notifications.push(
        fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: message,
              parse_mode: "Markdown",
            }),
          }
        )
      );
    }

    await Promise.allSettled(notifications);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notify-ceo]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
