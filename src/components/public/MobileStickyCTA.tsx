"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const MobileStickyCTA = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const { t } = useLanguage();

  const scrollToForm = () => {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-md border-t border-border p-4"
    >
      <Button
        onClick={scrollToForm}
        size="lg"
        className="w-full h-12 text-base font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light"
      >
        {t.mobileCta}
      </Button>
    </motion.div>
  );
};

export default MobileStickyCTA;


