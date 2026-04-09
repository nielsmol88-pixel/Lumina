"use client";

import { Clock, Shield, Droplets } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const TrustBar = () => {
  const { t } = useLanguage();

  const items = [
    { icon: Clock, label: t.hero.pill1 },
    { icon: Shield, label: t.hero.pill2 },
    { icon: Droplets, label: t.hero.pill3 },
  ];

  return (
    <section className="bg-champagne/10 border-y border-champagne/20">
      <div className="container-luxury py-4 md:py-5">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12">
          {items.map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-champagne flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium text-foreground tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;


