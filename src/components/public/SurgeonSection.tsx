"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, GraduationCap, Briefcase } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import draCarolinaImg from "@/assets/dra-carolina.jpg";

const credentialIcons = [Award, Briefcase, GraduationCap];

const SurgeonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <img
                alt="Dra. Carolina Franco Ruedas - Directora Médica de LÚMINA"
                className="w-full aspect-[3/4] object-cover rounded-xl shadow-2xl"
                src={draCarolinaImg.src}
                loading="lazy"
              />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-champagne/20 rounded-xl -z-10" />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-champagne/10 rounded-xl -z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p className="text-champagne text-sm uppercase tracking-[0.15em] font-medium mb-4">
              {t.surgeon.tag}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-tight mb-2">
              {t.surgeon.heading}
            </h2>
            <p className="text-champagne font-semibold text-lg mb-1">{t.surgeon.name}</p>
            <p className="text-muted-foreground text-sm uppercase tracking-wide mb-6">{t.surgeon.title}</p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t.surgeon.body} <span className="text-champagne font-medium">Madrid, Barcelona, Sevilla & Marbella</span>.
            </p>

            <blockquote className="border-l-2 border-champagne/40 pl-5 mb-8 italic text-muted-foreground leading-relaxed text-base">
              &ldquo;{t.surgeon.quote}&rdquo;
            </blockquote>

            <div className="space-y-4">
              {t.surgeon.credentials.map((text, index) => {
                const Icon = credentialIcons[index];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-champagne" strokeWidth={1.5} />
                    </div>
                    <span className="text-foreground font-medium">{text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SurgeonSection;


