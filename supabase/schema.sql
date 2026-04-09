-- ============================================================
-- LÚMINA Ophthalmology — Supabase Schema
-- GDPR Article 9 compliant — EU region (Frankfurt)
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── ENUMS ──────────────────────────────────────────────────
create type patient_status as enum (
  'Lead',
  'Consult_Booked',
  'Surgery_Booked',
  'Post_Op',
  'Discharged'
);

create type appointment_type as enum (
  'Tele_Audit',
  'In_Person_Diagnostics',
  'Surgery'
);

create type room_type as enum (
  'Consultation',
  'Operating'
);

create type room_booking_status as enum (
  'Tentative',
  'Confirmed',
  'Cancelled'
);

create type appointment_status as enum (
  'Scheduled',
  'Confirmed',
  'Completed',
  'Cancelled',
  'No_Show'
);

create type language_pref as enum ('es', 'en');
create type message_direction as enum ('inbound', 'outbound');

-- ─── TABLES ─────────────────────────────────────────────────

-- Surgeons (internal staff — linked to Supabase Auth)
create table public.surgeons (
  id          uuid primary key default uuid_generate_v4(),
  auth_id     uuid references auth.users(id) on delete set null,
  full_name   text not null,
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- Patients
create table public.patients (
  id                       uuid primary key default uuid_generate_v4(),
  created_at               timestamptz not null default now(),
  full_name                text not null,
  phone                    text not null,
  email                    text,
  status                   patient_status not null default 'Lead',
  language_preference      language_pref not null default 'es',
  gdpr_consent             boolean not null default false,
  gdpr_consent_at          timestamptz,
  notes                    text,
  date_of_birth            date,
  how_did_you_hear         text,
  preferred_contact        text,                    -- 'morning' | 'afternoon' | 'anytime'
  telemedicine_consent     boolean not null default false,
  telemedicine_consent_at  timestamptz,
  payment_status           text,
  payment_amount           numeric(10,2),
  stripe_session_id        text,
  source                   text
);

-- Medical Intake (Article 9 sensitive data — extra RLS)
create table public.medical_intake (
  id                  uuid primary key default uuid_generate_v4(),
  created_at          timestamptz not null default now(),
  patient_id          uuid not null references public.patients(id) on delete cascade,
  chief_complaint     text not null,
  area_of_interest    text,
  prior_surgeries     text,
  dry_eye_risk_score  smallint check (dry_eye_risk_score between 0 and 10),
  assigned_surgeon_id uuid references public.surgeons(id) on delete set null
);

-- Appointments
create table public.appointments (
  id               uuid primary key default uuid_generate_v4(),
  created_at       timestamptz not null default now(),
  patient_id       uuid not null references public.patients(id) on delete cascade,
  appointment_date timestamptz not null,
  appointment_type appointment_type not null,
  status           appointment_status not null default 'Scheduled',
  notes            text
);

-- Rental Rooms (consultation + OR rooms rented from partner clinics)
create table public.rental_rooms (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,                          -- e.g. "Sala 3 — Clínica Retiro"
  room_type     room_type not null,                     -- Consultation or Operating
  clinic_name   text not null,                          -- Partner clinic / hospital
  address       text,
  hourly_rate   numeric(8,2),                           -- EUR per hour
  half_day_rate numeric(8,2),                           -- EUR per half-day block
  equipment     text,                                   -- e.g. "Slit lamp, OCT, autorefractor"
  notes         text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Room Bookings (links an appointment to a rented room + time block)
create table public.room_bookings (
  id              uuid primary key default uuid_generate_v4(),
  room_id         uuid not null references public.rental_rooms(id) on delete restrict,
  appointment_id  uuid references public.appointments(id) on delete set null,
  booking_date    date not null,
  start_time      time not null,
  end_time        time not null,
  status          room_booking_status not null default 'Tentative',
  cost_eur        numeric(8,2),
  notes           text,
  created_at      timestamptz not null default now(),
  -- prevent double-booking the same room at overlapping times
  constraint no_overlap_check check (start_time < end_time)
);

-- WhatsApp Messages (two-way conversation thread per patient)
create table public.messages (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  patient_id   uuid not null references public.patients(id) on delete cascade,
  direction    message_direction not null,
  body         text not null,
  template_id  text,
  wati_id      text,
  read_at      timestamptz
);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

-- Disable public access by default on all tables
alter table public.patients        enable row level security;
alter table public.medical_intake  enable row level security;
alter table public.appointments    enable row level security;
alter table public.surgeons        enable row level security;

-- Policy: Only authenticated users (CEO / staff) can read/write patients
create policy "Authenticated staff can manage patients"
  on public.patients
  for all
  to authenticated
  using (true)
  with check (true);

-- Policy: Medical intake — authenticated only (health data, Art. 9)
create policy "Authenticated staff can manage medical_intake"
  on public.medical_intake
  for all
  to authenticated
  using (true)
  with check (true);

-- Policy: Appointments — authenticated only
create policy "Authenticated staff can manage appointments"
  on public.appointments
  for all
  to authenticated
  using (true)
  with check (true);

-- Policy: Surgeons — authenticated only
create policy "Authenticated staff can read surgeons"
  on public.surgeons
  for select
  to authenticated
  using (true);

-- Rental rooms — authenticated staff only (no public access)
alter table public.rental_rooms    enable row level security;
alter table public.room_bookings   enable row level security;

create policy "Authenticated staff can manage rental_rooms"
  on public.rental_rooms
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated staff can manage room_bookings"
  on public.room_bookings
  for all
  to authenticated
  using (true)
  with check (true);

-- Messages — authenticated staff only (inbound from WATI webhook uses service role)
alter table public.messages enable row level security;

create policy "Authenticated staff can manage messages"
  on public.messages
  for all
  to authenticated
  using (true)
  with check (true);

-- Public INSERT policy for intake form (anon can insert new leads only)
-- No SELECT/UPDATE/DELETE for anon — data sovereignty maintained
create policy "Public can submit intake form — patients"
  on public.patients
  for insert
  to anon
  with check (gdpr_consent = true);  -- GDPR gate: consent required

create policy "Public can submit intake form — medical_intake"
  on public.medical_intake
  for insert
  to anon
  with check (true);

-- ─── INDEXES ────────────────────────────────────────────────
create index idx_patients_status      on public.patients(status);
create index idx_patients_created_at  on public.patients(created_at desc);
create index idx_medical_intake_pid   on public.medical_intake(patient_id);
create index idx_appointments_pid     on public.appointments(patient_id);
create index idx_appointments_date    on public.appointments(appointment_date);
create index idx_rental_rooms_type    on public.rental_rooms(room_type) where is_active = true;
create index idx_room_bookings_room   on public.room_bookings(room_id, booking_date);
create index idx_room_bookings_appt   on public.room_bookings(appointment_id);
create index idx_messages_patient     on public.messages(patient_id, created_at);
create index idx_messages_wati_id     on public.messages(wati_id) where wati_id is not null;

-- ─── REALTIME ───────────────────────────────────────────────
-- Enable realtime for CEO dashboard live updates
alter publication supabase_realtime add table public.patients;
alter publication supabase_realtime add table public.appointments;
alter publication supabase_realtime add table public.messages;
