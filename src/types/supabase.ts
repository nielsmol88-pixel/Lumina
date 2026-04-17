export type PatientStatus =
  | "Lead"
  | "Consult_Booked"
  | "Surgery_Booked"
  | "Post_Op"
  | "Discharged";

export type AppointmentType =
  | "Tele_Audit"
  | "In_Person_Diagnostics"
  | "Surgery";

export type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "No_Show";

export type RoomType = "Consultation" | "Operating";
export type RoomBookingStatus = "Tentative" | "Confirmed" | "Cancelled";
export type SurgeonRole = "admin" | "surgeon" | "advisory";

export interface Surgeon {
  id: string;
  auth_id: string | null;
  full_name: string;
  email: string;
  role: SurgeonRole;
  created_at: string;
}
export type LanguagePref = "es" | "en";
export type MessageDirection = "inbound" | "outbound";
export type PreferredContact = "morning" | "afternoon" | "anytime";

export interface Patient {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string | null;
  status: PatientStatus;
  language_preference: LanguagePref;
  gdpr_consent: boolean;
  gdpr_consent_at: string | null;
  notes: string | null;
  date_of_birth: string | null;
  how_did_you_hear: string | null;
  preferred_contact: PreferredContact | null;
  consent_version: string | null;           // exists live — added outside migrations
  telemedicine_consent: boolean;
  telemedicine_consent_at: string | null;
  ai_scribe_consent: boolean;
  ai_scribe_consent_at: string | null;
  payment_status: string | null;
  payment_amount: number | null;
  stripe_session_id: string | null;
  source: string | null;
}

export interface MedicalIntake {
  id: string;
  created_at: string;
  patient_id: string;
  chief_complaint: string;
  area_of_interest: string | null;
  prior_surgeries: string | null;
  dry_eye_risk_score: number | null;
  assigned_surgeon_id: string | null;
  attachment_url: string | null;            // exists live — added outside migrations
  diagnosis_locked: boolean;
  diagnosis_locked_at: string | null;
  diagnosis_locked_by: string | null;
}

export interface Appointment {
  id: string;
  created_at: string;
  patient_id: string;
  appointment_date: string;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  notes: string | null;
}

export interface Message {
  id: string;
  created_at: string;
  patient_id: string;
  direction: MessageDirection;
  body: string;
  template_id: string | null;
  wati_id: string | null;
  read_at: string | null;
}

export interface PatientWithIntake extends Patient {
  medical_intake: MedicalIntake | null;
  appointments: Appointment[];
  messages: Message[];
}

export interface RentalRoom {
  id: string;
  name: string;
  room_type: RoomType;
  clinic_name: string;
  address: string | null;
  hourly_rate: number | null;
  half_day_rate: number | null;
  equipment: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export interface RoomBooking {
  id: string;
  room_id: string;
  appointment_id: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: RoomBookingStatus;
  cost_eur: number | null;
  notes: string | null;
  created_at: string;
}

export interface RoomBookingWithRoom extends RoomBooking {
  rental_room: RentalRoom;
}

// Supabase Database type map
export type Database = {
  public: {
    Tables: {
      surgeons: {
        Row: Surgeon;
        Insert: Omit<Surgeon, "id" | "created_at">;
        Update: Partial<Omit<Surgeon, "id" | "created_at">>;
        Relationships: [];
      };
      patients: {
        Row: Patient;
        Insert: Omit<Patient, "id" | "created_at">;
        Update: Partial<Omit<Patient, "id" | "created_at">>;
        Relationships: [];
      };
      medical_intake: {
        Row: MedicalIntake;
        Insert: Omit<MedicalIntake, "id" | "created_at">;
        Update: Partial<Omit<MedicalIntake, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "medical_intake_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, "id" | "created_at">;
        Update: Partial<Omit<Appointment, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at">;
        Update: Partial<Omit<Message, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "messages_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      rental_rooms: {
        Row: RentalRoom;
        Insert: Omit<RentalRoom, "id" | "created_at">;
        Update: Partial<Omit<RentalRoom, "id" | "created_at">>;
        Relationships: [];
      };
      room_bookings: {
        Row: RoomBooking;
        Insert: Omit<RoomBooking, "id" | "created_at">;
        Update: Partial<Omit<RoomBooking, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "room_bookings_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rental_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_bookings_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      patient_status: PatientStatus;
      appointment_type: AppointmentType;
      appointment_status: AppointmentStatus;
      language_pref: LanguagePref;
      room_type: RoomType;
      room_booking_status: RoomBookingStatus;
      message_direction: MessageDirection;
      surgeon_role: SurgeonRole;
    };
    CompositeTypes: Record<string, never>;
  };
};
