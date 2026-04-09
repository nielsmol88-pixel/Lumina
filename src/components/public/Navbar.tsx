"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const navLinks = [
  { to: "/segunda-opinion", key: "secondOpinion" as const },
  { to: "/financiacion", key: "financing" as const },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTratsOpen, setMobileTratsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const scrollToForm = () => {
    setMobileOpen(false);
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/40"
    >
      <div className="container-luxury flex items-center justify-between h-16 md:h-20">
        {/* Logo + tagline */}
        <Link href="/" className="flex flex-col items-start">
          <span className="font-serif font-semibold text-lg md:text-xl tracking-[0.2em] uppercase text-foreground">
            LÚMINA
          </span>
          <span className="text-[10px] md:text-xs text-champagne tracking-widest uppercase -mt-0.5 hidden sm:block">
            {language === "es" ? "CENTRO DE EXCELENCIA" : "CENTRE OF EXCELLENCE"}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {/* Tratamientos Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide outline-none">
              {t.nav.treatments}
              <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-white border-border shadow-lg"
            >
              {t.treatmentsList.map((item) => (
                <DropdownMenuItem
                  key={item}
                  className="text-sm cursor-pointer focus:bg-muted"
                  onSelect={() => {
                    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide"
            >
              {t.nav[link.key]}
            </Link>
          ))}

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide"
            aria-label="Change language"
          >
            <Globe className="w-4 h-4" />
            <span className={language === "es" ? "text-champagne font-semibold" : ""}>ES</span>
            <span className="text-muted-foreground/40">|</span>
            <span className={language === "en" ? "text-champagne font-semibold" : ""}>EN</span>
          </button>

          {/* Priority Phone */}
          <a
            href="tel:+34649071272"
            className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide"
          >
            <Phone className="w-3.5 h-3.5 text-champagne" />
            <span className="text-xs">+34 649 07 12 72</span>
          </a>

          <Button
            onClick={scrollToForm}
            className="text-sm font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300"
          >
            {t.nav.bookConsultation}
          </Button>
        </div>

        {/* Mobile: Language toggle + Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide p-2"
            aria-label="Change language"
          >
            <Globe className="w-4 h-4" />
            <span className={language === "es" ? "text-champagne font-semibold" : ""}>ES</span>
            <span className="text-muted-foreground/40">|</span>
            <span className={language === "en" ? "text-champagne font-semibold" : ""}>EN</span>
          </button>
          
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-foreground"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-b border-border/40"
          >
            <div className="container-luxury flex flex-col gap-1 py-4">
              {/* Mobile Tratamientos accordion */}
              <button
                onClick={() => setMobileTratsOpen(!mobileTratsOpen)}
                className="flex items-center justify-between py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide"
              >
                {t.nav.treatments}
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileTratsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileTratsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pl-4"
                  >
                    {t.treatmentsList.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setMobileOpen(false);
                          document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide"
                >
                  {t.nav[link.key]}
                </Link>
              ))}

              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide"
              >
                {t.nav.blog}
              </Link>

              <Button
                onClick={scrollToForm}
                className="mt-2 w-full text-sm font-medium tracking-wide bg-champagne text-foreground hover:bg-champagne-light transition-all duration-300"
              >
                {t.nav.bookConsultation}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;


