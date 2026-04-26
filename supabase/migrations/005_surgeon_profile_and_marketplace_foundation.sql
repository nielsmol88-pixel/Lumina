-- ============================================================
-- Migration 005: Surgeon profile fields + marketplace foundation
-- ============================================================

ALTER TABLE public.surgeons
  ADD COLUMN IF NOT EXISTS specialty        text,
  ADD COLUMN IF NOT EXISTS phone            text,
  ADD COLUMN IF NOT EXISTS cities           text[],
  ADD COLUMN IF NOT EXISTS bio              text,
  ADD COLUMN IF NOT EXISTS doctoralia_url   text,
  ADD COLUMN IF NOT EXISTS commission_pct   numeric(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active        boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS colegiado_num    text;

UPDATE public.surgeons
SET
  specialty      = 'Oftalmología',
  colegiado_num  = '414118409',
  cities         = ARRAY['Madrid','Sevilla','Barcelona','Marbella'],
  doctoralia_url = 'https://www.doctoralia.es/carolina-franco-ruedas/oftalmologo/sevilla',
  commission_pct = 0,
  is_active      = true
WHERE email = 'nielsmol88@gmail.com';

CREATE TABLE IF NOT EXISTS public.patient_surgeon_assignments (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  surgeon_id      uuid NOT NULL REFERENCES public.surgeons(id) ON DELETE RESTRICT,
  assigned_at     timestamptz NOT NULL DEFAULT now(),
  assigned_by     uuid REFERENCES public.surgeons(id) ON DELETE SET NULL,
  commission_pct  numeric(5,2),
  commission_eur  numeric(10,2),
  notes           text,
  UNIQUE(patient_id)
);

ALTER TABLE public.patient_surgeon_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and surgeon can manage assignments"
  ON public.patient_surgeon_assignments FOR ALL TO authenticated
  USING  (public.get_my_surgeon_role() IN ('admin', 'surgeon'))
  WITH CHECK (public.get_my_surgeon_role() IN ('admin', 'surgeon'));

CREATE INDEX IF NOT EXISTS idx_assignments_patient  ON public.patient_surgeon_assignments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assignments_surgeon  ON public.patient_surgeon_assignments(surgeon_id);
CREATE INDEX IF NOT EXISTS idx_surgeons_active      ON public.surgeons(is_active) WHERE is_active = true;
