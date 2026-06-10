export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// ── Row types (extracted to avoid circular Omit references) ──

type ProfileRow = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'student' | 'parent' | 'tutor' | 'admin'
  phone: string | null
  created_at: string
  updated_at: string
}

type ParentRow = {
  id: string
  profile_id: string
  full_name: string | null
  email: string
  phone: string | null
  google_id: string | null
  created_at: string
  updated_at: string
}

type StudentRow = {
  id: string
  profile_id: string | null
  full_name: string
  grade_level: string | null
  school: string | null
  goals: string[] | null
  created_at: string
}

type ParentStudentRow = {
  id: string
  parent_id: string
  student_id: string
  created_at: string
}

type TutorRow = {
  id: string
  profile_id: string | null
  full_name: string
  bio: string | null
  subjects: string[] | null
  hourly_rate: number
  photo_url: string | null
  stripe_connect_id: string | null
  stripe_onboarded: boolean
  rating: number
  sessions_count: number
  active: boolean
  created_at: string
}

type TutorAvailabilityRow = {
  id: string
  tutor_id: string
  day_of_week: number
  start_hour: number
  end_hour: number
  available: boolean
  recurring: boolean
  created_at: string
  updated_at: string
}

type PackageRow = {
  id: string
  name: string
  type: 'Standard' | 'AP' | 'Test Prep' | 'Admissions'
  sessions_count: number
  price_cents: number
  description: string | null
  active: boolean
  created_at: string
}

type SessionRow = {
  id: string
  student_id: string
  tutor_id: string
  package_id: string | null
  subject_type: 'Standard' | 'AP' | 'Test Prep' | 'Admissions' | null
  scheduled_at: string
  duration_minutes: number
  rate_cents: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  google_meet_link: string | null
  notes: string | null
  email_sent_at: string | null
  completed_at: string | null
  created_at: string
}

type InvoiceRow = {
  id: string
  parent_id: string
  student_id: string | null
  package_id: string | null
  total_cents: number
  sessions_count: number
  sessions_used: number
  stripe_charge_id: string | null
  stripe_session_id: string | null
  status: 'pending' | 'paid' | 'refunded' | 'failed'
  created_at: string
}

type TutorPayoutRow = {
  id: string
  tutor_id: string
  session_id: string
  session_rate_cents: number
  tutor_share_cents: number
  platform_share_cents: number
  status: 'pending' | 'processing' | 'sent' | 'failed'
  stripe_transfer_id: string | null
  created_at: string
  sent_at: string | null
}

// ── Database type ──

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Omit<ProfileRow, 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProfileRow, 'created_at' | 'updated_at'>>
        Relationships: []
      }
      parents: {
        Row: ParentRow
        Insert: Omit<ParentRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ParentRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      students: {
        Row: StudentRow
        Insert: Omit<StudentRow, 'id' | 'created_at'>
        Update: Partial<Omit<StudentRow, 'id' | 'created_at'>>
        Relationships: []
      }
      parent_students: {
        Row: ParentStudentRow
        Insert: Omit<ParentStudentRow, 'id' | 'created_at'>
        Update: Partial<Omit<ParentStudentRow, 'id' | 'created_at'>>
        Relationships: []
      }
      tutors: {
        Row: TutorRow
        Insert: Omit<TutorRow, 'id' | 'created_at'>
        Update: Partial<Omit<TutorRow, 'id' | 'created_at'>>
        Relationships: []
      }
      tutor_availability: {
        Row: TutorAvailabilityRow
        Insert: Omit<TutorAvailabilityRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TutorAvailabilityRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      packages: {
        Row: PackageRow
        Insert: Omit<PackageRow, 'id' | 'created_at'>
        Update: Partial<Omit<PackageRow, 'id' | 'created_at'>>
        Relationships: []
      }
      sessions: {
        Row: SessionRow
        Insert: Omit<SessionRow, 'id' | 'created_at'>
        Update: Partial<Omit<SessionRow, 'id' | 'created_at'>>
        Relationships: []
      }
      invoices: {
        Row: InvoiceRow
        Insert: Omit<InvoiceRow, 'id' | 'created_at'>
        Update: Partial<Omit<InvoiceRow, 'id' | 'created_at'>>
        Relationships: []
      }
      tutor_payouts: {
        Row: TutorPayoutRow
        Insert: Omit<TutorPayoutRow, 'id' | 'created_at'>
        Update: Partial<Omit<TutorPayoutRow, 'id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ── Convenience aliases ──

export type Profile = ProfileRow
export type Parent = ParentRow
export type Student = StudentRow
export type Tutor = TutorRow
export type Session = SessionRow
export type Invoice = InvoiceRow
export type Package = PackageRow
export type TutorAvailability = TutorAvailabilityRow
export type TutorPayout = TutorPayoutRow
