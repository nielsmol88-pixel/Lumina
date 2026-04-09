import { createClient } from "@/lib/supabase/client";

interface LeadPayload {
  full_name: string;
  phone: string;
  email?: string;
  chief_complaint?: string;
  area_of_interest?: string;
  language: "es" | "en";
  gdpr_consent: true;           // required — caller must have obtained explicit consent
  gdpr_consent_at: string;      // ISO timestamp of when consent was given
  source?: string;
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const supabase = createClient();

  // Type cast needed: Database Insert type is stricter than the actual schema
  const supabaseAny = supabase as any;

  const { data: patient, error: patientError } = await supabaseAny
    .from("patients")
    .insert({
      full_name: payload.full_name,
      phone: payload.phone,
      email: payload.email ?? null,
      language_preference: payload.language,
      gdpr_consent: payload.gdpr_consent,
      gdpr_consent_at: payload.gdpr_consent_at,
      source: payload.source ?? "home",
      status: "Lead",
    })
    .select("id")
    .single();

  if (patientError) throw new Error(patientError.message);

  const { error: intakeError } = await supabaseAny
    .from("medical_intake")
    .insert({
      patient_id: patient.id,
      chief_complaint: payload.chief_complaint ?? "Consulta general",
      area_of_interest: payload.area_of_interest ?? null,
    });

  if (intakeError) throw new Error(intakeError.message);

  // Fire-and-forget CEO notification (no PII sent)
  fetch("/api/notify-ceo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id: patient.id }),
  }).catch(() => {});
}
