"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const footerLinks = [
  { to: "/segunda-opinion", key: "secondOpinion" as const },
  { to: "/retina", label: "Retina" },
  { to: "/financiacion", key: "financing" as const },
  { to: "/blog", key: "blog" as const },
];

const locationLinks = [
  { to: "#", label: "Madrid" },
  { to: "#", label: "Barcelona" },
  { to: "#", label: "Sevilla" },
  { to: "#", label: "Marbella" },
];

const Footer = () => {
  const { language, t } = useLanguage();

  const getLabel = (link: typeof footerLinks[number]) => {
    if ("label" in link && link.label) return link.label;
    if ("key" in link && link.key) return t.nav[link.key as keyof typeof t.nav];
    return "";
  };

  return (
    <footer className="py-12 md:py-16 bg-muted/40 border-t border-border">
      <div className="container-luxury">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-12">
          <div>
            <Link href="/" className="font-serif font-semibold text-lg tracking-[0.25em] uppercase text-foreground">
              {language === "es" ? "LÚMINA" : "LUMINA"}
            </Link>
            <p className="text-champagne text-xs uppercase tracking-[0.15em] font-medium mt-1">
              {language === "es" ? "Maestría Española. Precisión Suiza." : "Spanish Mastery. Swiss Precision."}
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-champagne mb-4">
              {t.footer.servicesHeading}
            </h4>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {getLabel(link)}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-champagne mb-4">
              {t.footer.locationsHeading}
            </h4>
            <nav className="flex flex-col gap-2.5">
              {locationLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-serif text-xs text-muted-foreground">
            {t.footer.copyright}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/legal" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              {t.footer.legalLabel}
            </Link>
            <Link href="/legal#privacidad" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              {t.footer.privacyLabel}
            </Link>
            <p className="text-xs text-muted-foreground/60">
              {t.footer.tagline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


