"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { submitLead } from "@/utils/submitLead";

const HeroContactCard = () => {
  const { language, t } = useLanguage();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [privacidad, setPrivacidad] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacidad) {
      toast({
        title: t.heroCard.privacyWarningTitle,
        description: t.heroCard.privacyWarningDesc,
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await submitLead({
        full_name: nombre,
        phone: telefono,
        email: email || undefined,
        chief_complaint: "Solicitar cita",
        language: language as "es" | "en",
        gdpr_consent: true,
        gdpr_consent_at: new Date().toISOString(),
        source: "hero",
      });

      toast({ title: t.heroCard.successTitle, description: t.heroCard.successDesc });
      setNombre("");
      setEmail("");
      setTelefono("");
      
      setPrivacidad(false);
    } catch (error) {
      console.error("Hero form submission error:", error);
      toast({ title: t.heroCard.errorTitle, description: t.heroCard.errorDesc, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className="relative bg-white border border-border/60 rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md mx-auto lg:mx-0"
    >
      <div className="relative z-10">
        <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground text-center mb-6">
          {t.heroCard.cardTitle}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t.heroCard.namePlaceholder}
            required
            maxLength={100}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full h-12 bg-transparent border-b border-border px-1 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-champagne/60 transition-colors"
          />
          <input
            type="email"
            placeholder={t.heroCard.emailPlaceholder}
            maxLength={100}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-transparent border-b border-border px-1 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-champagne/60 transition-colors"
          />
          <input
            type="tel"
            placeholder={t.heroCard.phonePlaceholder}
            required
            maxLength={20}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full h-12 bg-transparent border-b border-border px-1 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-champagne/60 transition-colors"
          />


          <div className="flex items-start gap-2.5 pt-1">
            <Checkbox
              id="privacidad-hero"
              checked={privacidad}
              onCheckedChange={(checked) => setPrivacidad(checked === true)}
              className="mt-0.5 border-border data-[state=checked]:bg-champagne data-[state=checked]:border-champagne"
            />
            <label htmlFor="privacidad-hero" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              {t.heroCard.privacyLabel}{" "}
              <span className="underline underline-offset-2 text-foreground/70">{t.heroCard.privacyLink}</span>.
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 text-sm font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300 rounded-lg"
          >
            {isSubmitting ? t.heroCard.submitting : t.heroCard.submitButton}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default HeroContactCard;


