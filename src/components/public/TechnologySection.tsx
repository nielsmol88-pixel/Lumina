"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const TechnologySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-champagne text-sm uppercase tracking-[0.15em] font-medium mb-4">
              {t.technology.tag}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-tight mb-6">
              {t.technology.heading}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t.technology.body} <span className="text-champagne font-medium">Madrid & Barcelona</span>.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-1 h-16 bg-champagne/40 rounded-full flex-shrink-0" />
                <div>
                  <h4 className="font-serif text-lg font-medium text-foreground mb-2">{t.technology.eliteTrainingTitle}</h4>
                  <p className="text-muted-foreground">{t.technology.eliteTrainingDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1 h-16 bg-champagne/40 rounded-full flex-shrink-0" />
                <div>
                  <h4 className="font-serif text-lg font-medium text-foreground mb-2">{t.technology.swissProtocolsTitle}</h4>
                  <p className="text-muted-foreground">{t.technology.swissProtocolsDesc}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80"
                alt="Ophthalmologist performing detailed eye examination with slit lamp"
                className="w-full aspect-[4/3] object-cover rounded-xl shadow-2xl"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 rounded-b-xl border-t border-border">
                <p className="text-foreground text-sm uppercase tracking-widest font-medium">
                  {t.technology.captionTitle}
                </p>
                <p className="text-champagne text-xs mt-1 tracking-wide">
                  {t.technology.captionSub}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-champagne/20 rounded-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;


