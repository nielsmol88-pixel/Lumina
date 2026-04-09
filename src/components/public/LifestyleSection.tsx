"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Feather, Eye, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const icons = [Feather, Eye, ShieldCheck];

const LifestyleSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section ref={ref} className="section-padding bg-muted/40">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <p className="text-champagne text-sm uppercase tracking-[0.15em] font-medium mb-4">
            {t.lifestyle.tag}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-tight mb-6">
            {t.lifestyle.heading}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.lifestyle.body}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {t.lifestyle.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.12 * i }}
                className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-champagne" />
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;


