"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  intakeFormTranslations,
  type IntakeFormLocale,
} from "@/lib/i18n/intake-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormState = "idle" | "loading" | "success" | "error";

interface FieldErrors {
  full_name?: string;
  phone?: string;
  area_of_interest?: string;
  chief_complaint?: string;
  gdpr_consent?: string;
}

export default function PatientIntakeForm({ source = "home" }: { source?: string }) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [consent, setConsent] = useState(false);
  const [teleConsent, setTeleConsent] = useState(false);
  const [aiScribeConsent, setAiScribeConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [locale, setLocale] = useState<IntakeFormLocale>("es");
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    area_of_interest: "",
    chief_complaint: "",
  });

  const t = intakeFormTranslations[locale];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (form.full_name.trim().length < 2) errors.full_name = t.nameMinLength;
    if (!form.phone.trim()) errors.phone = t.phoneRequired;
    if (!form.area_of_interest) errors.area_of_interest = t.areaRequired;
    if (!form.chief_complaint.trim()) errors.chief_complaint = t.complaintRequired;
    if (!consent) errors.gdpr_consent = t.consentRequired;
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setFormState("loading");
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const patientId = crypto.randomUUID();

      const { error } = await supabase
        .from("patients")
        .insert({
          id: patientId,
          full_name: form.full_name,
          phone: form.phone,
          email: form.email || null,
          language_preference: locale,
          gdpr_consent: true,
          gdpr_consent_at: new Date().toISOString(),
          telemedicine_consent: teleConsent,
          telemedicine_consent_at: teleConsent ? new Date().toISOString() : null,
          ai_scribe_consent: aiScribeConsent,
          ai_scribe_consent_at: aiScribeConsent ? new Date().toISOString() : null,
          source,
          status: "Lead",
        });

      if (error) throw error;

      await supabase.from("medical_intake").insert({
        patient_id: patientId,
        chief_complaint: form.chief_complaint,
        area_of_interest: form.area_of_interest || null,
      });

      // Fire-and-forget CEO notification — no PII sent
      fetch("/api/notify-ceo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId }),
      }).catch(() => {});

      setFormState("success");
    } catch (err) {
      console.error(err);
      setErrorMsg(t.errorMessage);
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="py-10 text-center">
        <p className="text-[22px]">{t.successTitle}</p>
        <p className="mt-1 text-sm text-slate-500">{t.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex gap-1">
        <button type="button" onClick={() => setLocale("es")}
          className={cn("rounded-sm px-3 py-1 text-xs font-medium transition-colors",
            locale === "es" ? "bg-amber-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
          ES
        </button>
        <button type="button" onClick={() => setLocale("en")}
          className={cn("rounded-sm px-3 py-1 text-xs font-medium transition-colors",
            locale === "en" ? "bg-amber-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
          EN
        </button>
      </div>

      <div>
        <Label htmlFor="full_name">{t.fullName} *</Label>
        <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange}
          placeholder={t.fullNamePlaceholder} className={cn("mt-1.5", fieldErrors.full_name && "border-red-500")} />
        {fieldErrors.full_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p>}
      </div>

      <div>
        <Label htmlFor="phone">{t.phone} *</Label>
        <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
          placeholder={t.phonePlaceholder} className={cn("mt-1.5", fieldErrors.phone && "border-red-500")} />
        {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
      </div>

      <div>
        <Label htmlFor="email">{t.email}</Label>
        <Input id="email" name="email" type="email" value={form.email} onChange={handleChange}
          placeholder={t.emailPlaceholder} className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="area_of_interest">{t.areaOfInterest} *</Label>
        <select id="area_of_interest" name="area_of_interest" value={form.area_of_interest} onChange={handleChange}
          className={cn("mt-1.5 flex h-9 w-full rounded-sm border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-600",
            fieldErrors.area_of_interest && "border-red-500")}>
          <option value="" disabled>{t.selectPlaceholder}</option>
          {t.areas.map((area) => <option key={area} value={area}>{area}</option>)}
        </select>
        {fieldErrors.area_of_interest && <p className="mt-1 text-xs text-red-600">{fieldErrors.area_of_interest}</p>}
      </div>

      <div>
        <Label htmlFor="chief_complaint">{t.chiefComplaint} *</Label>
        <Textarea id="chief_complaint" name="chief_complaint" value={form.chief_complaint} onChange={handleChange}
          placeholder={t.chiefComplaintPlaceholder}
          className={cn("mt-1.5 min-h-[100px]", fieldErrors.chief_complaint && "border-red-500")} />
        {fieldErrors.chief_complaint && <p className="mt-1 text-xs text-red-600">{fieldErrors.chief_complaint}</p>}
      </div>

      <div className={cn("rounded-sm border border-slate-200 bg-slate-50 p-4", fieldErrors.gdpr_consent && "border-red-500")}>
        <label className="flex cursor-pointer gap-3">
          <input type="checkbox" checked={consent} onChange={(e) => {
            setConsent(e.target.checked);
            if (e.target.checked) setFieldErrors((prev) => ({ ...prev, gdpr_consent: undefined }));
          }} />
          <span className="text-xs text-slate-600">{t.gdprConsent} *</span>
        </label>
        {fieldErrors.gdpr_consent && <p className="mt-1 text-xs text-red-600">{fieldErrors.gdpr_consent}</p>}
      </div>

      {/* Telemedicine consent (optional) */}
      <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
        <label className="flex cursor-pointer gap-3">
          <input type="checkbox" checked={teleConsent} onChange={(e) => setTeleConsent(e.target.checked)} />
          <span className="text-xs text-slate-600">{t.teleConsent}</span>
        </label>
      </div>

      {/* AI Scribe consent — EU AI Act Reg.2024/1689 — optional, C-3 in LUM-DOC-003 */}
      <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
        <label className="flex cursor-pointer gap-3">
          <input type="checkbox" checked={aiScribeConsent} onChange={(e) => setAiScribeConsent(e.target.checked)} />
          <span className="text-xs text-slate-600">{t.aiScribeConsent}</span>
        </label>
      </div>

      {formState === "error" && <p className="text-[13px] text-red-600">{errorMsg}</p>}

      <Button type="submit" variant={consent ? "gold" : "default"} disabled={formState === "loading"}
        className={cn(!consent && "cursor-not-allowed bg-slate-300 hover:bg-slate-300")}>
        {formState === "loading" ? t.submitting : t.submit}
      </Button>
    </form>
  );
}
