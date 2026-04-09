"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/public/Navbar";
import LeadForm from "@/components/public/LeadForm";
import Footer from "@/components/public/Footer";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface LocationPageLayoutProps {
  schema: Record<string, unknown>;
  heroTag: string;
  heroTitle: ReactNode;
  heroDescription: string;
  ctaId: string;
  ctaTag?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonAction?: () => void;
  ctaVariant?: "navy" | "muted";
  footerTag?: string;
  customForm?: ReactNode;
  children: ReactNode;
}

const LocationPageLayout = ({
  schema,
  heroTag,
  heroTitle,
  heroDescription,
  ctaId,
  customForm,
  children,
}: LocationPageLayoutProps) => {
  const { language } = useLanguage();
  const scrollToContact = () => {
    document.getElementById(ctaId)?.scrollIntoView({ behavior: "smooth" });
  };

  const ctaLabel = language === "en" ? "Request Evaluation" : "Solicitar Evaluación";

  return (
    <main className="min-h-screen bg-background" key={language}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Navbar />

      {/* Hero — light with subtle muted background */}
      <section className="relative min-h-[85vh] flex items-center bg-muted/30 pt-20 border-b border-border">
        <div className="container-luxury relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="text-champagne text-sm uppercase tracking-[0.2em] font-medium mb-6">
              {heroTag}
            </p>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium leading-tight text-foreground text-balance">
              {heroTitle}
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {heroDescription}
            </p>
            <div className="mt-10">
              <Button
                onClick={scrollToContact}
                size="lg"
                className="text-base md:text-lg px-10 py-7 font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300"
              >
                {ctaLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Page-specific content */}
      {children}

      {/* Embedded Form */}
      <div id={ctaId}>
        {customForm || <LeadForm />}
      </div>

      {/* Full Footer with cross-navigation */}
      <Footer />
    </main>
  );
};

export default LocationPageLayout;


