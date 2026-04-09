-- ============================================================
-- Migration 003: Telemedicine consent + payment fields
-- Required for launch compliance and Stripe integration
-- ============================================================

-- Telemedicine consent (required before any Tele_Audit Zoom call)
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS telemedicine_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS telemedicine_consent_at timestamptz;

-- Payment tracking (Stripe integration)
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS payment_status text,
  ADD COLUMN IF NOT EXISTS payment_amount numeric(8,2),
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

-- Source tracking (home page vs segunda-opinion vs referral)
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'home';
