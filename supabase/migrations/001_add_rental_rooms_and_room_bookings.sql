-- Migration: Add rental rooms and room bookings
-- Lúmina facility model: Zoom for triage, rented consultation rooms for diagnostics, rented ORs for surgery
-- Run in: Supabase Dashboard > SQL Editor

-- ─── ENUMS ──────────────────────────────────────────────────

create type room_type as enum (
  'Consultation',
  'Operating'
);

create type room_booking_status as enum (
  'Tentative',
  'Confirmed',
  'Cancelled'
);

-- ─── TABLES ─────────────────────────────────────────────────

create table public.rental_rooms (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  room_type     room_type not null,
  clinic_name   text not null,
  address       text,
  hourly_rate   numeric(8,2),
  half_day_rate numeric(8,2),
  equipment     text,
  notes         text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

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
  constraint no_overlap_check check (start_time < end_time)
);

-- ─── RLS ────────────────────────────────────────────────────

alter table public.rental_rooms  enable row level security;
alter table public.room_bookings enable row level security;

create policy "Authenticated staff can manage rental_rooms"
  on public.rental_rooms for all to authenticated
  using (true) with check (true);

create policy "Authenticated staff can manage room_bookings"
  on public.room_bookings for all to authenticated
  using (true) with check (true);

-- ─── INDEXES ────────────────────────────────────────────────

create index idx_rental_rooms_type  on public.rental_rooms(room_type) where is_active = true;
create index idx_room_bookings_room on public.room_bookings(room_id, booking_date);
create index idx_room_bookings_appt on public.room_bookings(appointment_id);
