"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const copy = {
  es: {
    title: "El Compromiso LÚMINA",
    subtitle: "Hemos diseñado cada detalle de su experiencia clínica para garantizarle máxima seguridad, confort y confianza.",
    cards: [
      {
        title: "Su Cirujano Personal",
        body: "Su visión merece un trato humano e individualizado. Será evaluado, intervenido y guiado en su recuperación siempre por el mismo experto de principio a fin. Medicina con nombres y apellidos.",
      },
      {
        title: "Tranquilidad Transparente",
        body: "Diseñamos un plan de éxito visual para toda la vida. Sus honorarios incluyen una garantía de resultados totales, cubriendo íntegramente las revisiones y retoques clínicos necesarios. Claridad desde el primer día.",
      },
      {
        title: "Acompañamiento Constante",
        body: "Nuestra labor continúa tras la cirugía. Tendrá a su disposición una línea de comunicación directa 24/7 con su coordinador médico para que se sienta respaldado en cada minuto de su recuperación.",
      },
    ],
    cta: "Solicitar Valoración Personal",
  },
  en: {
    title: "The LUMINA Commitment",
    subtitle: "We have designed every detail of your clinical experience to guarantee maximum safety, comfort, and trust.",
    cards: [
      {
        title: "Your Personal Surgeon",
        body: "Your vision deserves a human, individualised approach. You will be evaluated, operated on, and guided through recovery by the same expert from start to finish. Medicine with a name and a face.",
      },
      {
        title: "Transparent Peace of Mind",
        body: "We design a lifetime visual success plan. Your fees include a total results guarantee, fully covering any necessary reviews and clinical enhancements. Clarity from day one.",
      },
      {
        title: "Constant Accompaniment",
        body: "Our work continues after surgery. You will have a direct 24/7 communication line with your medical coordinator so you feel supported through every moment of your recovery.",
      },
    ],
    cta: "Request Personal Assessment",
  },
};

const icons = [ShieldCheck, BadgeCheck, MessageCircleHeart];

const TrustGuarantees = () => {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section className="section-padding bg-muted/40">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-tight">
            {t.title}
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {t.cards.map((card, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="bg-background rounded-2xl p-8 border border-border shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-champagne/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-champagne" />
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link href="/segunda-opinion">
            <Button
              size="lg"
              className="text-base md:text-lg px-10 py-7 font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300"
            >
              {t.cta}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustGuarantees;

