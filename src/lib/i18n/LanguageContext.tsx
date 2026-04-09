"use client";

import { createContext, useContext } from "react";
import { es } from "./es";
import { en } from "./en";
import type { Translations } from "./types";

export type Language = "es" | "en";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

export const translations: Record<Language, Translations> = { es, en };

const fallbackLanguage: Language = "es";
const fallbackContext: LanguageContextType = {
  language: fallbackLanguage,
  setLanguage: () => {},
  t: translations[fallbackLanguage],
};

export const LanguageContext = createContext<LanguageContextType>(fallbackContext);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  return ctx ?? fallbackContext;
};
