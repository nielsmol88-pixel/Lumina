/**
 * ============================================================================
 * LÚMINA — Central Content Configuration
 * ============================================================================
 *
 * Change doctor names, contact info, form endpoints, pricing, and analytics
 * IDs from this single file. No need to hunt through UI components.
 * ============================================================================
 */

export const siteConfig = {
  /** Brand name variants */
  brand: {
    es: "LÚMINA",
    en: "LUMINA",
    legal: "LÚMINA Oftalmología S.L.",
  },

  /** Primary contact details */
  contact: {
    phone: "+34 649 07 12 72",
    phoneRaw: "34649071272",
    whatsapp: "34649071272",
    email: "info@lumina.es",
  },

  /** Medical team */
  team: {
    leadSurgeon: "Dr. Alejandro Martínez",
    title: "Director Médico",
    credentials: "MD, PhD — Zürich · Paris",
  },

  /** Form submission (FormSubmit.co) */
  forms: {
    /** AJAX endpoint for fetch-based submissions */
    ajaxEndpoint: "https://formsubmit.co/ajax/nielsmol88@hotmail.com",
    /** Native form action URL (for file-upload fallback) */
    actionUrl: "https://formsubmit.co/nielsmol88@hotmail.com",
  },

  /** Analytics & tracking */
  analytics: {
    ga4MeasurementId: "G-0NRHXS8Y5S",
    gtmContainerId: "GTM-MDB9JJTZ",
  },

  /** Pricing variables (used in copy) */
  pricing: {
    secondOpinionCost: { es: "120€", en: "€120" },
  },

  /** Social / external links */
  links: {
    whatsappBase: "https://wa.me/",
  },
} as const;
