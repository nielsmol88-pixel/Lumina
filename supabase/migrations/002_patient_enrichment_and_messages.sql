-- ============================================================
-- Migration 002: Patient enrichment fields + WhatsApp messages
-- ============================================================

-- ─── Patient extra fields ───────────────────────────────────
alter table public.patients
  add column if not exists date_of_birth      date,
  add column if not exists how_did_you_hear   text,
  add column if not exists preferred_contact  text;   -- 'morning' | 'afternoon' | 'anytime'

-- ─── WhatsApp messages (two-way thread) ─────────────────────
create type message_direction as enum ('inbound', 'outbound');

create table public.messages (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  patient_id   uuid not null references public.patients(id) on delete cascade,
  direction    message_direction not null,
  body         text not null,
  template_id  text,                    -- set for outbound template messages
  wati_id      text,                    -- WATI message ID for dedup
  read_at      timestamptz              -- null = unread (inbound only)
);

-- RLS
alter table public.messages enable row level security;

create policy "Authenticated staff can manage messages"
  on public.messages for all to authenticated
  using (true) with check (true);

-- Indexes
create index idx_messages_patient   on public.messages(patient_id, created_at);
create index idx_messages_wati_id   on public.messages(wati_id) where wati_id is not null;

-- Realtime for live conversation thread
alter publication supabase_realtime add table public.messages;

-- ─── FK fix: allow anon insert without SELECT permission ────
-- Anon role can't SELECT from patients to verify the FK on insert,
-- so we mark it NOT VALID to skip the lookup check at insert time.
ALTER TABLE public.medical_intake
  DROP CONSTRAINT IF EXISTS medical_intake_patient_id_fkey,
  ADD CONSTRAINT medical_intake_patient_id_fkey
    FOREIGN KEY (patient_id)
    REFERENCES public.patients(id)
    ON DELETE CASCADE
    NOT VALID;
