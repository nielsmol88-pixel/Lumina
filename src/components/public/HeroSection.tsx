"use client";

import { motion } from "framer-motion";
import HeroContactCard from "@/components/public/HeroContactCard";
import heroEyeLight from "@/assets/hero-eye-light.jpg";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative flex items-center pt-24 pb-12 overflow-hidden bg-[#FAFAFA]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroEyeLight.src}
          alt="Bright macro close-up of a vibrant human iris"
          className="w-full h-full object-cover opacity-[0.12]"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
      </div>
      {/* Left-to-right gradient shield for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent/10" />

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-champagne text-sm uppercase tracking-[0.2em] font-medium mb-6"
            >
              {t.hero.tagline}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-[-0.01em] text-foreground text-balance"
            >
              {t.hero.headline}
              <span className="text-champagne inline-block">{t.hero.headlineHighlight}</span>
              {t.hero.headlineSuffix && <>{t.hero.headlineSuffix}{" "}</>}
              {t.hero.headlineHighlight2 && (
                <span className="text-champagne inline-block">{t.hero.headlineHighlight2}</span>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 font-sans tracking-wide"
              style={{ lineHeight: 1.7 }}
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-6 text-xs text-muted-foreground/70 italic tracking-wide"
            >
              {t.hero.ctaUrgency}
            </motion.p>
          </motion.div>

          <div className="flex justify-center lg:justify-end">
            <HeroContactCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


