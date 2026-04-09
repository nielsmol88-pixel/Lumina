"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Sparkles, Glasses } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const icons = [Eye, Sparkles, Glasses];

const FrequentTreatments = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  const scrollToForm = () => {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-champagne text-sm uppercase tracking-[0.15em] font-medium mb-4">
            {t.treatments.tag}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-tight">
            {t.treatments.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {t.treatments.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="group relative rounded-2xl border border-slate-100 bg-white p-8 md:p-10 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-champagne" />
                </div>
                <h3 className="font-serif text-lg md:text-xl font-medium text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  {item.description}
                </p>
                <Button
                  onClick={scrollToForm}
                  className="mt-auto w-full rounded-full bg-champagne text-foreground hover:bg-champagne-light hover:shadow-md tracking-wide text-sm py-5 transition-all duration-300"
                >
                  {t.treatments.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FrequentTreatments;


