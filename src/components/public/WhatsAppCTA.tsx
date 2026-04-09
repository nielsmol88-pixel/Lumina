"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const WHATSAPP_NUMBER = "34649071272";

const WhatsAppCTA = () => {
  const { t } = useLanguage();
  const encodedMessage = encodeURIComponent(t.whatsapp.message);

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact via WhatsApp"
      className="fixed bottom-20 right-4 z-50 group lg:bottom-8 lg:right-8"
    >
      <span className="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none shadow-elevated border border-border">
        {t.whatsapp.tooltip}
      </span>
      <div className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-elevated transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden md:inline text-xs font-medium tracking-wide">WhatsApp</span>
      </div>
    </a>
  );
};

export default WhatsAppCTA;


