-- ============================================================
-- Migration 004: AI Scribe Consent + Information Barrier
-- Version: 4 (verified against live DB — safe to run)
-- ============================================================
--
-- PRE-FLIGHT CHECK (verified live via Supabase MCP on 2026-04-17):
--
-- LIVE POLICIES (exact names — all accounted for):
--   patients:       "Authenticated staff can manage patients"       ← we DROP this
--                   "Public can submit intake form — patients"      ← we KEEP this
--   medical_intake: "Authenticated staff can manage medical_intake" ← we DROP this
--                   "Public can submit intake form — medical_intake"← we KEEP this
--   surgeons:       "Authenticated staff can read surgeons"         ← we DROP this
--   appointments:   "Authenticated staff can manage appointments"   ← UNTOUCHED
--   messages:       "Authenticated staff can manage messages"       ← UNTOUCHED
--   rental_rooms:   "Authenticated staff can manage rental_rooms"   ← UNTOUCHED
--   room_bookings:  "Authenticated staff can manage room_bookings"  ← UNTOUCHED
--
-- LIVE COLUMNS NOT IN OUR SCHEMA FILES (must not be broken):
--   patients.consent_version       (text, nullable, default 'v1.0')
--   medical_intake.attachment_url  (text, nullable)
--
-- COLUMNS MISSING FROM LIVE DB (migration 003 was never run):
--   patients: telemedicine_consent, telemedicine_consent_at,
--             payment_status, payment_amount, stripe_session_id, source
--   This migration adds them here with IF NOT EXISTS so it's safe
--   whether 003 was run or not.
--
-- ENUMS: surgeon_role does NOT exist yet — safe to create.
-- ============================================================


-- ─── STEP 1: Catch-up columns from migration 003 (idempotent) ─
-- Migration 003 may not have been applied to this DB.
-- Adding here with IF NOT EXISTS so it's safe either way.

ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS telemedicine_consent    boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS telemedicine_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_status          text,
  ADD COLUMN IF NOT EXISTS payment_amount          numeric(10,2),
  ADD COLUMN IF NOT EXISTS stripe_session_id       text,
  ADD COLUMN IF NOT EXISTS source                  text DEFAULT 'home';


-- ─── STEP 2: New columns for this migration (idempotent) ────

-- AI Scribe consent — EU AI Act Reg.2024/1689, LUM-DOC-003 C-3
-- Optional. Patient can refuse without penalty.
-- Must be obtained BEFORE Nabla/Heidi is activated in consult.
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS ai_scribe_consent    boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_scribe_consent_at timestamptz;

-- surgeon_role enum — muralla china (LUM-DOC-001 Cl.2.2c)
DO $$ BEGIN
  CREATE TYPE surgeon_role AS ENUM ('admin', 'surgeon', 'advisory');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- role column on surgeons — default 'surgeon'
-- IMPORTANT: After running, set CEO row to 'admin' manually (see Step 7)
ALTER TABLE public.surgeons
  ADD COLUMN IF NOT EXISTS role surgeon_role NOT NULL DEFAULT 'surgeon';

-- diagnosis_locked — Poka-Yoke: only admin/surgeon can set TRUE
-- Blocks advisory/optometrist from writing a diagnosis (LUM-DOC-002 Cl.2)
ALTER TABLE public.medical_intake
  ADD COLUMN IF NOT EXISTS diagnosis_locked    boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS diagnosis_locked_at timestamptz,
  ADD COLUMN IF NOT EXISTS diagnosis_locked_by uuid REFERENCES public.surgeons(id) ON DELETE SET NULL;


-- ─── STEP 3: Surgeons RLS ────────────────────────────────────
-- Drop the original broad SELECT policy, replace with role-aware.
-- No write policy existed for authenticated users before — not adding one
-- (only service role writes to surgeons, which bypasses RLS).

DROP POLICY IF EXISTS "Authenticated staff can read surgeons"          ON public.surgeons;
-- Clean up any leftovers from previous migration 004 attempts
DROP POLICY IF EXISTS "Admin can manage surgeons"                      ON public.surgeons;
DROP POLICY IF EXISTS "Surgeon can read own record"                    ON public.surgeons;
DROP POLICY IF EXISTS "Authenticated user can read own surgeon record" ON public.surgeons;

-- Admin can read/write all surgeon rows
CREATE POLICY "Admin can manage surgeons"
  ON public.surgeons FOR ALL TO authenticated
  USING  (EXISTS (SELECT 1 FROM public.surgeons s WHERE s.auth_id = auth.uid() AND s.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.surgeons s WHERE s.auth_id = auth.uid() AND s.role = 'admin'));

-- Any authenticated user can read their own row
-- (dashboard needs this to determine the current user's role)
CREATE POLICY "Authenticated user can read own surgeon record"
  ON public.surgeons FOR SELECT TO authenticated
  USING (auth_id = auth.uid());


-- ─── STEP 4: Patients RLS ────────────────────────────────────
-- Drop the original broad ALL policy.
-- The anon INSERT policy has a different name — it is NOT dropped.

DROP POLICY IF EXISTS "Authenticated staff can manage patients"        ON public.patients;
-- Clean up any leftovers from previous migration 004 attempts
DROP POLICY IF EXISTS "Admin can manage all patients"                  ON public.patients;
DROP POLICY IF EXISTS "Surgeon can manage own patients"                ON public.patients;
DROP POLICY IF EXISTS "Advisory role blocked from patient PII"         ON public.patients;
DROP POLICY IF EXISTS "Admin and surgeon can manage all patients"      ON public.patients;
DROP POLICY IF EXISTS "Advisory role read-only on patients"            ON public.patients;

-- Admin + surgeon: full access to all patients
-- role IN ('admin','surgeon') means the CEO works correctly at MVP
-- regardless of whether their role is set to admin yet.
CREATE POLICY "Admin and surgeon can manage all patients"
  ON public.patients FOR ALL TO authenticated
  USING  (EXISTS (SELECT 1 FROM public.surgeons s WHERE s.auth_id = auth.uid() AND s.role IN ('admin','surgeon')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.surgeons s WHERE s.auth_id = auth.uid() AND s.role IN ('admin','surgeon')));

-- Advisory: read-only (needed for advisory_aggregate view to resolve)
CREATE POLICY "Advisory role read-only on patients"
  ON public.patients FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.surgeons s WHERE s.auth_id = auth.uid() AND s.role = 'advisory'));


-- ─── STEP 5: Medical intake RLS ─────────────────────────────
-- Same pattern. Anon INSERT policy is NOT dropped.

DROP POLICY IF EXISTS "Authenticated staff can manage medical_intake"   ON public.medical_intake;
-- Clean up any leftovers from previous migration 004 attempts
DROP POLICY IF EXISTS "Admin can manage all medical_intake"             ON public.medical_intake;
DROP POLICY IF EXISTS "Surgeon can manage own patients intake"          ON public.medical_intake;
DROP POLICY IF EXISTS "Admin and surgeon can manage all medical_intake" ON public.medical_intake;
DROP POLICY IF EXISTS "Advisory role read-only on medical_intake"       ON public.medical_intake;

CREATE POLICY "Admin and surgeon can manage all medical_intake"
  ON public.medical_intake FOR ALL TO authenticated
  USING  (EXISTS (SELECT 1 FROM public.surgeons s WHERE s.auth_id = auth.uid() AND s.role IN ('admin','surgeon')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.surgeons s WHERE s.auth_id = auth.uid() AND s.role IN ('admin','surgeon')));

CREATE POLICY "Advisory role read-only on medical_intake"
  ON public.medical_intake FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.surgeons s WHERE s.auth_id = auth.uid() AND s.role = 'advisory'));


-- ─── STEP 6: Advisory aggregate view (muralla china) ────────
-- No PII, no PHI. LUM-DOC-001 Cl.2.1(a).
-- Advisory role reaches this via a dedicated API route only.

CREATE OR REPLACE VIEW public.advisory_aggregate AS
  SELECT
    date_trunc('month', p.created_at) AS month,
    p.status,
    p.language_preference,
    p.how_did_you_hear                AS acquisition_channel,
    mi.area_of_interest,
    mi.dry_eye_risk_score,
    count(*)                          AS patient_count
  FROM public.patients p
  LEFT JOIN public.medical_intake mi ON mi.patient_id = p.id
  GROUP BY 1, 2, 3, 4, 5, 6;


-- ─── STEP 7: Indexes (idempotent) ───────────────────────────

CREATE INDEX IF NOT EXISTS idx_surgeons_role    ON public.surgeons(role);
CREATE INDEX IF NOT EXISTS idx_surgeons_auth_id ON public.surgeons(auth_id);
CREATE INDEX IF NOT EXISTS idx_medical_intake_locked
  ON public.medical_intake(diagnosis_locked)
  WHERE diagnosis_locked = false;


-- ─── STEP 8: MANUAL ACTION REQUIRED AFTER RUNNING ───────────
-- The surgeons table is currently empty (0 rows confirmed live).
-- You need to insert your CEO row and set role = 'admin'.
--
-- Replace the values below and run as a second query:
--
--   INSERT INTO public.surgeons (full_name, email, auth_id, role)
--   VALUES (
--     'Niels [Surname]',
--     'your-email@luminaplatform.es',
--     (SELECT id FROM auth.users WHERE email = 'your-email@luminaplatform.es'),
--     'admin'
--   );
--
-- If you already have an auth user, the SELECT subquery finds the UUID.
-- If not, create the user first via Supabase Auth > Users > Invite.
--
-- Verify:
--   SELECT id, full_name, email, role FROM public.surgeons;
