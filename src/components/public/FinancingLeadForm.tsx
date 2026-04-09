"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { submitLead } from "@/utils/submitLead";

const treatmentsES = [
  "Cirugía Refractiva (Lasik/SMILE)",
  "Lentes ICL Premium",
  "Cataratas con Lente Premium",
  "Tratamiento Retiniano",
  "Otro",
];

const treatmentsEN = [
  "Refractive Surgery (Lasik/SMILE)",
  "Premium ICL Lenses",
  "Cataract with Premium Lens",
  "Retinal Treatment",
  "Other",
];

const copy = {
  es: {
    tag: "Solicitud de Financiación",
    heading: "Solicite su Plan de Financiación",
    subtitle: "Complete el formulario y le enviaremos un presupuesto personalizado con opciones de financiación 0% adaptadas a su caso.",
    nameLabel: "Nombre completo",
    namePlaceholder: "Dr. / Sra. / Sr.",
    emailLabel: "Email",
    emailPlaceholder: "su@email.com",
    phoneLabel: "Teléfono",
    phonePlaceholder: "+34 600 000 000",
    treatmentLabel: "Tratamiento de interés",
    treatmentPlaceholder: "Seleccione tratamiento",
    installmentsLabel: "Plazo preferido",
    installmentsPlaceholder: "Seleccione plazo",
    submitButton: "Solicitar Presupuesto de Financiación",
    submitting: "Enviando solicitud…",
    disclaimer: "Sin compromiso. Le contactaremos en menos de 24h con su presupuesto y opciones de financiación.",
    successTitle: "Solicitud recibida",
    successDesc: "Le enviaremos su presupuesto con opciones de financiación en breve.",
    errorTitle: "Error al enviar",
    errorDesc: "Inténtelo de nuevo o contacte por WhatsApp.",
    treatments: treatmentsES,
    installments: ["3 meses · 0% TAE", "6 meses · 0% TAE", "12 meses · 0% TAE", "24 meses"],
  },
  en: {
    tag: "Financing Application",
    heading: "Apply for Your Financing Plan",
    subtitle: "Fill out the form and we'll send you a personalised quote with 0% financing options tailored to your case.",
    nameLabel: "Full name",
    namePlaceholder: "Dr. / Mrs. / Mr.",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    phoneLabel: "Phone",
    phonePlaceholder: "+34 600 000 000",
    treatmentLabel: "Treatment of interest",
    treatmentPlaceholder: "Select treatment",
    installmentsLabel: "Preferred term",
    installmentsPlaceholder: "Select term",
    submitButton: "Request Financing Quote",
    submitting: "Submitting…",
    disclaimer: "No commitment. We'll contact you within 24h with your quote and financing options.",
    successTitle: "Application received",
    successDesc: "We'll send your financing quote shortly.",
    errorTitle: "Submission error",
    errorDesc: "Please try again or contact us via WhatsApp.",
    treatments: treatmentsEN,
    installments: ["3 months · 0% APR", "6 months · 0% APR", "12 months · 0% APR", "24 months"],
  },
};

const FinancingLeadForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [gdprError, setGdprError] = useState(false);
  const { language } = useLanguage();
  const t = copy[language];

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tratamiento: "",
    plazo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gdprConsent) {
      setGdprError(true);
      return;
    }

    setIsSubmitting(true);
    setGdprError(false);

    try {
      await submitLead({
        full_name: formData.nombre,
        phone: formData.telefono,
        email: formData.email || undefined,
        chief_complaint: `Solicitud financiación – ${formData.tratamiento || "no especificado"} – plazo: ${formData.plazo || "no especificado"}`,
        area_of_interest: formData.tratamiento || undefined,
        language: language as "es" | "en",
        gdpr_consent: true,
        gdpr_consent_at: new Date().toISOString(),
        source: "financing",
      });

      toast({ title: t.successTitle, description: t.successDesc });
      setFormData({ nombre: "", email: "", telefono: "", tratamiento: "", plazo: "" });
      setGdprConsent(false);
    } catch (error) {
      console.error("Financing form submission error:", error);
      toast({ title: t.errorTitle, description: t.errorDesc, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "bg-white border-border text-foreground placeholder:text-muted-foreground focus:border-champagne/50 h-12";

  return (
    <section id="form" ref={ref} className="section-padding bg-background">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl mx-auto"
        >
          <div className="text-center mb-10 md:mb-12">
            <p className="text-champagne text-sm uppercase tracking-[0.15em] font-medium mb-4">
              {t.tag}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-tight">
              {t.heading}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-border p-6 md:p-8 shadow-card">
            <div className="space-y-2">
              <Label htmlFor="fin-nombre" className="text-foreground text-sm font-medium">
                {t.nameLabel}
              </Label>
              <Input
                id="fin-nombre"
                type="text"
                placeholder={t.namePlaceholder}
                required
                maxLength={100}
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fin-email" className="text-foreground text-sm font-medium">
                  {t.emailLabel}
                </Label>
                <Input
                  id="fin-email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fin-telefono" className="text-foreground text-sm font-medium">
                  {t.phoneLabel}
                </Label>
                <Input
                  id="fin-telefono"
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  required
                  maxLength={20}
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">
                {t.treatmentLabel}
              </Label>
              <Select
                key={`treatment-${language}`}
                value={formData.tratamiento}
                onValueChange={(value) => setFormData({ ...formData, tratamiento: value })}
              >
                <SelectTrigger className="bg-white border-border text-foreground h-12 [&>span]:text-muted-foreground">
                  <SelectValue placeholder={t.treatmentPlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  {t.treatments.map((item) => (
                    <SelectItem key={item} value={item.toLowerCase().replace(/\s+/g, "-")} className="focus:bg-muted">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">
                {t.installmentsLabel}
              </Label>
              <Select
                key={`installments-${language}`}
                value={formData.plazo}
                onValueChange={(value) => setFormData({ ...formData, plazo: value })}
              >
                <SelectTrigger className="bg-white border-border text-foreground h-12 [&>span]:text-muted-foreground">
                  <SelectValue placeholder={t.installmentsPlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  {t.installments.map((item) => (
                    <SelectItem key={item} value={item} className="focus:bg-muted">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GDPR consent — required by Art. 9.2.a RGPD */}
            <div className={`rounded-lg border p-4 ${gdprError ? "border-red-500 bg-red-50/10" : "border-border bg-muted/30"}`}>
              <label className="flex cursor-pointer gap-3 items-start">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => {
                    setGdprConsent(e.target.checked);
                    if (e.target.checked) setGdprError(false);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-amber-600"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {language === "es"
                    ? "Acepto la Política de Privacidad de LÚMINA y el tratamiento de mis datos personales para gestionar esta solicitud (RGPD / LOPDGDD). *"
                    : "I accept LÚMINA's Privacy Policy and the processing of my personal data to manage this request (GDPR / LOPDGDD). *"}
                </span>
              </label>
              {gdprError && (
                <p className="mt-2 text-xs text-red-500">
                  {language === "es"
                    ? "Debe aceptar la política de privacidad para continuar."
                    : "You must accept the privacy policy to continue."}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full h-14 text-base font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300"
            >
              {isSubmitting ? t.submitting : t.submitButton}
            </Button>

            <p className="text-center text-muted-foreground text-sm">
              {t.disclaimer}
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default FinancingLeadForm;


