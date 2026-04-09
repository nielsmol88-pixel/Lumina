"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Check, X, Upload, Globe, Clock, Shield, Droplets } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

import segundaOpinionHero from "@/assets/segunda-opinion-hero.jpg";

const SegundaOpinion = () => {
  const supabase = createClient() as any;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [consentimiento, setConsentimiento] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const s = t.segundaOpinion;
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    diagnostico: "",
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentimiento) {
      toast({ title: s.consentRequiredTitle, description: s.consentRequiredDesc, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .insert({
          full_name: formData.nombre,
          phone: formData.telefono,
          email: formData.email || null,
          status: "Lead",
          language_preference: language as "es" | "en",
          gdpr_consent: true,
          gdpr_consent_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (patientError) throw patientError;

      // Upload file if present
      let attachmentUrl: string | null = null;
      if (archivo) {
        const fileExt = archivo.name.split(".").pop();
        const filePath = `${patient.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("medical-documents")
          .upload(filePath, archivo);
        if (uploadError) {
          console.error("File upload error:", uploadError);
        } else {
          attachmentUrl = filePath;
        }
      }

      const chiefComplaint = formData.diagnostico
        ? `Segunda opinión – Diagnóstico actual: ${formData.diagnostico}`
        : "Segunda opinión";

      const { error: intakeError } = await supabase
        .from("medical_intake")
        .insert({
          patient_id: patient.id,
          chief_complaint: chiefComplaint,
          attachment_url: attachmentUrl,
        });

      if (intakeError) throw intakeError;

      toast({ title: s.successTitle, description: s.successDesc });
      setFormData({ nombre: "", email: "", telefono: "", diagnostico: "" });
      setArchivo(null);
      setConsentimiento(false);
    } catch (error) {
      console.error("Segunda Opinion form error:", error);
      toast({ title: s.errorTitle, description: s.errorDesc, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("segunda-opinion-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const trustItems = [
    { icon: Clock, label: t.hero.pill1 },
    { icon: Shield, label: t.hero.pill2 },
    { icon: Droplets, label: t.hero.pill3 },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuándo debo pedir una segunda opinión oftalmológica?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Siempre que sienta que su consulta ha sido demasiado rápida, cuando le propongan cirugía sin haberle explicado alternativas, o cuando tenga dudas sobre el diagnóstico recibido. En LÚMINA dedicamos todo el tiempo que necesite a cada consulta de segunda opinión.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuáles son los riesgos de operarse en una clínica de volumen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Las clínicas de alto volumen pueden tener consultas de 10 minutos, cambios de médico durante el proceso y explicaciones comerciales en lugar de médicas. En LÚMINA, un solo cirujano le acompaña de principio a fin con protocolos suizos de seguridad.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta una segunda opinión en LÚMINA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nuestra Consulta de Segunda Opinión tiene un coste habitual de 120€, pero actualmente la ofrecemos de forma completamente gratuita. Nuestro único objetivo es darle claridad y tranquilidad mental, sin compromiso.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué diferencia a LÚMINA de otras clínicas oftalmológicas en Madrid?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ofrecemos todo el tiempo que necesite en consulta, un solo cirujano de principio a fin, tecnología Zeiss/Leica/Alcon, y una Validación Ética donde decimos NO si no es seguro operar.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Navigation — glassmorphism sticky header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/40"
      >
        <div className="container-luxury flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex flex-col items-start">
            <span className="font-serif font-semibold text-lg md:text-xl tracking-[0.25em] uppercase text-foreground">
              LÚMINA
            </span>
            <span className="text-[10px] md:text-xs text-champagne tracking-widest uppercase -mt-0.5 hidden sm:block">
              {language === "es" ? "CENTRO DE EXCELENCIA" : "CENTRE OF EXCELLENCE"}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne rounded-md px-2 py-1"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4" />
              <span className={language === "es" ? "text-champagne font-semibold" : ""}>ES</span>
              <span className="text-muted-foreground/40">|</span>
              <span className={language === "en" ? "text-champagne font-semibold" : ""}>EN</span>
            </button>
            <Button
              onClick={scrollToForm}
              className="text-sm font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300 focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2"
            >
              {s.navCta}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero — Light clinical white with subtle background image */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 bg-[#FAFAFA]">
        {/* Background image at very low opacity as texture */}
        <div className="absolute inset-0 z-0">
          <img
            src={segundaOpinionHero.src}
            alt="Doctor revisando diagnóstico ocular con paciente en LÚMINA Madrid"
            className="w-full h-full object-cover opacity-[0.08]"
          />
        </div>

        <div className="container-luxury relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl mx-auto lg:mx-0 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-border/30"
          >
            <p className="text-champagne text-sm uppercase tracking-[0.2em] font-medium mb-6">
              {s.heroTag}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6">
              {s.heroHeadline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl" style={{ lineHeight: 1.6 }}>
              {s.heroBody}
            </p>
            <Button
              onClick={scrollToForm}
              size="lg"
              className="h-14 px-8 text-base font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300 focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2"
            >
              {s.heroCta}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-champagne/10 border-y border-champagne/20">
        <div className="container-luxury py-4 md:py-5">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12">
            {trustItems.map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-champagne flex-shrink-0" />
                <span className="text-sm font-medium text-foreground tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding bg-[#FAFAFA]">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-champagne text-sm uppercase tracking-[0.15em] font-medium mb-4">{s.comparisonTag}</p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground">
              {s.comparisonHeading}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
              <h3 className="font-serif text-xl md:text-2xl font-medium text-muted-foreground mb-6">
                {s.volumeClinicTitle}
              </h3>
              <ul className="space-y-4">
                {s.volumeClinicItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-[1.0625rem] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 border border-champagne/30 shadow-lg">
              <h3 className="font-serif text-xl md:text-2xl font-medium text-champagne mb-6">{s.luminaTitle}</h3>
              <ul className="space-y-4">
                {s.luminaItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-champagne mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-[1.0625rem] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-champagne text-sm uppercase tracking-[0.15em] font-medium mb-4">{s.valueTag}</p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6">
              {s.valueHeading}
            </h2>
            <div className="bg-[#FAFAFA] rounded-2xl p-8 md:p-10 border border-border">
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed" style={{ lineHeight: 1.6 }}>
                {s.valueBody}{" "}
                <span className="font-semibold text-champagne">{s.valueCost}</span>
                {language === "es"
                  ? ", pero actualmente la ofrecemos de forma completamente gratuita. Nuestro único objetivo es darle claridad y tranquilidad mental, sin compromiso."
                  : ", but we currently offer it completely free of charge. Our sole objective is to give you clarity and peace of mind, with no obligation."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section id="segunda-opinion-form" className="py-12 md:py-16 bg-[#FAFAFA]">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <p className="text-champagne text-sm uppercase tracking-[0.15em] font-medium mb-3">
                {s.formTag}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-tight">
                {s.formHeading}
              </h2>
              <p className="mt-3 text-muted-foreground text-base max-w-md mx-auto" style={{ lineHeight: 1.5 }}>
                {s.formSubtitle}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 bg-white rounded-2xl p-6 md:p-8 border border-border/60 shadow-xl"
            >

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-foreground text-sm font-medium">
                    {s.nameLabel}
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder={s.namePlaceholder}
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="bg-white border-slate-400 text-foreground placeholder:text-muted-foreground focus:border-champagne/50 focus-visible:ring-champagne h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground text-sm font-medium">
                    {s.emailLabel}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={s.emailPlaceholder}
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white border-slate-400 text-foreground placeholder:text-muted-foreground focus:border-champagne/50 focus-visible:ring-champagne h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-foreground text-sm font-medium">
                    {s.phoneLabel}
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder={s.phonePlaceholder}
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="bg-white border-slate-400 text-foreground placeholder:text-muted-foreground focus:border-champagne/50 focus-visible:ring-champagne h-12 text-base"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">{s.optionalInfo}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Textarea
                    id="diagnostico"
                    name="diagnostico_actual"
                    placeholder={s.diagnosisPlaceholder}
                    value={formData.diagnostico}
                    onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                    className="bg-white border-slate-400 text-foreground placeholder:text-muted-foreground focus:border-champagne/50 focus-visible:ring-champagne min-h-[70px] resize-none text-base"
                  />
                  <label
                    htmlFor="archivo"
                    className="flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-lg border border-dashed border-slate-400 bg-white px-4 py-3 transition-colors hover:border-champagne/40 hover:bg-muted/30 min-h-[70px] focus-within:ring-2 focus-within:ring-champagne"
                  >
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground text-center leading-tight">
                      {archivo ? archivo.name : s.fileUploadLabel}
                    </span>
                    <input
                      id="archivo"
                      name="attachment"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
                {archivo && (
                  <button
                    type="button"
                    onClick={() => setArchivo(null)}
                    className="mt-1 text-sm text-champagne hover:text-champagne-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne rounded"
                  >
                    {s.removeFile}
                  </button>
                )}
              </div>

              <div className="flex items-start gap-3 pt-1">
                <Checkbox
                  id="consentimiento"
                  checked={consentimiento}
                  onCheckedChange={(checked) => setConsentimiento(checked === true)}
                  className="mt-0.5 border-slate-400 data-[state=checked]:bg-champagne data-[state=checked]:border-champagne data-[state=checked]:text-foreground focus-visible:ring-champagne"
                />
                <Label
                  htmlFor="consentimiento"
                  className="text-muted-foreground text-sm leading-relaxed font-normal cursor-pointer"
                  style={{ lineHeight: 1.5 }}
                >
                  {s.gdprLabel}
                </Label>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-semibold tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300 shadow-lg shadow-champagne/20 focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2"
              >
                {isSubmitting ? s.submitting : s.submitButton}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 bg-white border-t border-border">
        <div className="container-luxury text-center">
          <p className="text-muted-foreground text-sm">
            {s.footerCopy}
          </p>
        </div>
      </footer>
    </main>
  );
};

export default SegundaOpinion;


