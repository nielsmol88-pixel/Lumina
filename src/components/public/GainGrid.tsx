"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const images = [
  { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80", alt: "Doctor having warm conversation with patient" },
  { src: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80", alt: "Femtosecond laser precision medical equipment" },
  { src: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80", alt: "Doctor gently holding patient's hand" },
];

const GainGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground">
            {t.gainGrid.heading}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {t.gainGrid.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {t.gainGrid.cards.map((card, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="group h-full border border-border/60 bg-card hover:shadow-card transition-all duration-500 hover:border-champagne/30 overflow-hidden">
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={images[index].src}
                    alt={images[index].alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                </div>
                <CardContent className="p-6 md:p-8">
                  <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground mb-4">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GainGrid;


