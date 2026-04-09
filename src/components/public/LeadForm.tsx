"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
import Link from "next/link";

const LeadForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [gdprError, setGdprError] = useState(false);
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    preocupacion: "",
    especialidad: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // GDPR gate — explicit consent required before any data is stored (Art. 9.2.a RGPD)
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
        chief_complaint: formData.preocupacion || "Consulta general",
        area_of_interest: formData.especialidad || undefined,
        language: language as "es" | "en",
        gdpr_consent: true,
        gdpr_consent_at: new Date().toISOString(),
        source: "home",
      });

      toast({ title: t.leadForm.successTitle, description: t.leadForm.successDesc });
      setFormData({ nombre: "", email: "", telefono: "", preocupacion: "", especialidad: "" });
      setGdprConsent(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({ title: t.leadForm.errorTitle, description: t.leadForm.errorDesc, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-champagne/50 h-12";

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
              {t.leadForm.tag}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-tight">
              {t.leadForm.heading}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              {t.leadForm.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-foreground text-sm font-medium">
                {t.leadForm.nameLabel}
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder={t.leadForm.namePlaceholder}
                required
                maxLength={100}
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-sm font-medium">
                  {t.leadForm.emailLabel}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.leadForm.emailPlaceholder}
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-foreground text-sm font-medium">
                  {t.leadForm.phoneLabel}
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder={t.leadForm.phonePlaceholder}
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
                {t.leadForm.specialtyLabel}
              </Label>
              <Select
                key={language}
                value={formData.especialidad}
                onValueChange={(value) => setFormData({ ...formData, especialidad: value })}
              >
                <SelectTrigger className="bg-muted border-border text-foreground h-12 [&>span]:text-muted-foreground">
                  <SelectValue placeholder={t.leadForm.specialtyPlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50 max-h-60">
                  {t.specialtiesList.map((esp) => (
                    <SelectItem
                      key={esp}
                      value={esp.toLowerCase().replace(/\s+/g, "-")}
                      className="focus:bg-muted"
                    >
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GDPR consent — required by Art. 9.2.a RGPD before storing health data */}
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
                  {t.leadForm.gdprLabel.replace(" *", "")}{" "}
                  <Link href="/legal" className="underline hover:text-foreground transition-colors">
                    {t.leadForm.gdprLinkText}
                  </Link>
                  {" *"}
                </span>
              </label>
              {gdprError && (
                <p className="mt-2 text-xs text-red-500">{t.leadForm.gdprConsentRequired}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full h-14 text-base font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300"
            >
              {isSubmitting ? t.leadForm.submitting : t.leadForm.submitButton}
            </Button>

            <p className="text-center text-muted-foreground text-sm">
              {t.leadForm.disclaimer}
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadForm;


