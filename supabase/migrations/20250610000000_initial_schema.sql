-- ============================================================
-- Apex Minds Platform — Initial Schema
-- Project: vmkgscuafemwkucqpelu
-- ============================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_cron";

-- ────────────────────────────────────────────────────────────
-- PROFILES (linked to auth.users)
-- ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  full_name   text,
  avatar_url  text,
  role        text not null default 'student' check (role in ('student', 'parent', 'tutor', 'admin')),
  phone       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- STUDENTS
-- ────────────────────────────────────────────────────────────
create table if not exists public.students (
  id              uuid primary key default uuid_generate_v4(),
  profile_id      uuid references public.profiles(id) on delete set null,
  full_name       text not null,
  grade_level     text,
  school          text,
  goals           text[],
  created_at      timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- PARENTS
-- ────────────────────────────────────────────────────────────
create table if not exists public.parents (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid unique references public.profiles(id) on delete cascade,
  full_name   text,
  email       text unique not null,
  phone       text,
  google_id   text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Junction: one parent → many students
create table if not exists public.parent_students (
  id          uuid primary key default uuid_generate_v4(),
  parent_id   uuid not null references public.parents(id) on delete cascade,
  student_id  uuid not null references public.students(id) on delete cascade,
  created_at  timestamptz default now(),
  unique (parent_id, student_id)
);

-- ────────────────────────────────────────────────────────────
-- TUTORS
-- ────────────────────────────────────────────────────────────
create table if not exists public.tutors (
  id                  uuid primary key default uuid_generate_v4(),
  profile_id          uuid unique references public.profiles(id) on delete cascade,
  full_name           text not null,
  bio                 text,
  subjects            text[],
  hourly_rate         numeric(10,2) default 75.00,
  photo_url           text,
  stripe_connect_id   text,
  stripe_onboarded    boolean default false,
  rating              numeric(3,2) default 5.0,
  sessions_count      integer default 0,
  active              boolean default true,
  created_at          timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- TUTOR AVAILABILITY
-- ────────────────────────────────────────────────────────────
create table if not exists public.tutor_availability (
  id            uuid primary key default uuid_generate_v4(),
  tutor_id      uuid not null references public.tutors(id) on delete cascade,
  day_of_week   smallint not null check (day_of_week between 0 and 6), -- 0=Sun, 6=Sat
  start_hour    smallint not null check (start_hour between 7 and 20),
  end_hour      smallint not null check (end_hour between 8 and 21),
  available     boolean default true,
  recurring     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- PACKAGES
-- ────────────────────────────────────────────────────────────
create table if not exists public.packages (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  type            text not null check (type in ('Standard', 'AP', 'Test Prep', 'Admissions')),
  sessions_count  integer not null,
  price_cents     integer not null,
  description     text,
  active          boolean default true,
  created_at      timestamptz default now()
);

-- Seed default packages
insert into public.packages (name, type, sessions_count, price_cents, description) values
  ('Standard Starter',  'Standard',   4,  30000, '4 one-hour sessions — best for subject catch-up'),
  ('Standard Growth',   'Standard',   8,  56000, '8 sessions for sustained grade improvement'),
  ('AP Intensive',      'AP',         4,  40000, '4 sessions of advanced AP exam prep'),
  ('AP Full Prep',      'AP',         8,  76000, '8 sessions — cover every AP unit deeply'),
  ('SAT/ACT Sprint',    'Test Prep',  4,  40000, '4 sessions targeting weak score areas'),
  ('SAT/ACT Mastery',   'Test Prep',  8,  76000, '8 sessions — full-test strategy and drills'),
  ('Admissions Consult','Admissions', 1,  40000, 'Single deep-dive admissions strategy session'),
  ('Admissions Full',   'Admissions', 3, 120000, '3-session application coaching package')
on conflict do nothing;

-- ────────────────────────────────────────────────────────────
-- SESSIONS
-- ────────────────────────────────────────────────────────────
create table if not exists public.sessions (
  id                  uuid primary key default uuid_generate_v4(),
  student_id          uuid not null references public.students(id) on delete restrict,
  tutor_id            uuid not null references public.tutors(id) on delete restrict,
  package_id          uuid references public.packages(id),
  subject_type        text check (subject_type in ('Standard', 'AP', 'Test Prep', 'Admissions')),
  scheduled_at        timestamptz not null,
  duration_minutes    integer not null default 60,
  rate_cents          integer not null,
  status              text not null default 'pending'
                        check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  google_meet_link    text,
  notes               text,
  email_sent_at       timestamptz,
  completed_at        timestamptz,
  created_at          timestamptz default now()
);

-- Tutor bookings (for calendar display)
create table if not exists public.tutor_bookings (
  id          uuid primary key default uuid_generate_v4(),
  tutor_id    uuid not null references public.tutors(id) on delete cascade,
  session_id  uuid not null references public.sessions(id) on delete cascade,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  status      text default 'confirmed' check (status in ('confirmed','completed','cancelled')),
  created_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- INVOICES
-- ────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id                uuid primary key default uuid_generate_v4(),
  parent_id         uuid not null references public.parents(id) on delete restrict,
  student_id        uuid references public.students(id),
  package_id        uuid references public.packages(id),
  total_cents       integer not null,
  sessions_count    integer not null default 0,
  sessions_used     integer not null default 0,
  stripe_charge_id  text,
  stripe_session_id text,
  status            text default 'pending' check (status in ('pending','paid','refunded','failed')),
  created_at        timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- TUTOR PAYOUTS (70% platform, 30% tutor per spec)
-- ────────────────────────────────────────────────────────────
create table if not exists public.tutor_payouts (
  id                    uuid primary key default uuid_generate_v4(),
  tutor_id              uuid not null references public.tutors(id) on delete restrict,
  session_id            uuid not null references public.sessions(id) on delete restrict,
  session_rate_cents    integer not null,
  tutor_share_cents     integer not null, -- 30% of session rate
  platform_share_cents  integer not null, -- 70% of session rate
  status                text default 'pending' check (status in ('pending','processing','sent','failed')),
  stripe_transfer_id    text,
  created_at            timestamptz default now(),
  sent_at               timestamptz
);

-- Tutor bank accounts (Stripe Connect)
create table if not exists public.tutor_bank_accounts (
  id                  uuid primary key default uuid_generate_v4(),
  tutor_id            uuid unique not null references public.tutors(id) on delete cascade,
  stripe_connect_id   text unique,
  status              text default 'pending' check (status in ('pending','verified','rejected')),
  created_at          timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- SESSION EMAILS LOG
-- ────────────────────────────────────────────────────────────
create table if not exists public.session_emails (
  id          uuid primary key default uuid_generate_v4(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  sent_to     text not null,
  email_type  text not null check (email_type in ('confirmation','reminder_30min','reminder_1hr','completion')),
  status      text default 'pending' check (status in ('pending','sent','failed')),
  created_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────
alter table public.profiles          enable row level security;
alter table public.students          enable row level security;
alter table public.parents           enable row level security;
alter table public.parent_students   enable row level security;
alter table public.tutors            enable row level security;
alter table public.tutor_availability enable row level security;
alter table public.packages          enable row level security;
alter table public.sessions          enable row level security;
alter table public.tutor_bookings    enable row level security;
alter table public.invoices          enable row level security;
alter table public.tutor_payouts     enable row level security;
alter table public.tutor_bank_accounts enable row level security;
alter table public.session_emails    enable row level security;

-- Profiles: users see/edit their own
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);

-- Parents: own row only
create policy "parents_own" on public.parents
  for all using (profile_id = auth.uid());

-- Students: parent can see their linked students
create policy "students_parent" on public.students
  for select using (
    id in (
      select student_id from public.parent_students ps
      join public.parents p on p.id = ps.parent_id
      where p.profile_id = auth.uid()
    )
  );

-- Tutors: public read, own write
create policy "tutors_public_read" on public.tutors
  for select using (true);
create policy "tutors_own_write" on public.tutors
  for all using (profile_id = auth.uid());

-- Tutor availability: public read, tutor own write
create policy "avail_public_read" on public.tutor_availability
  for select using (true);
create policy "avail_tutor_write" on public.tutor_availability
  for all using (
    tutor_id in (select id from public.tutors where profile_id = auth.uid())
  );

-- Packages: public read only
create policy "packages_public_read" on public.packages
  for select using (true);

-- Sessions: tutor or parent can see
create policy "sessions_tutor" on public.sessions
  for all using (
    tutor_id in (select id from public.tutors where profile_id = auth.uid())
  );
create policy "sessions_parent" on public.sessions
  for select using (
    student_id in (
      select ps.student_id from public.parent_students ps
      join public.parents p on p.id = ps.parent_id
      where p.profile_id = auth.uid()
    )
  );

-- Invoices: parent own
create policy "invoices_parent" on public.invoices
  for all using (
    parent_id in (select id from public.parents where profile_id = auth.uid())
  );

-- Tutor payouts: tutor own
create policy "payouts_tutor" on public.tutor_payouts
  for select using (
    tutor_id in (select id from public.tutors where profile_id = auth.uid())
  );

-- ────────────────────────────────────────────────────────────
-- REALTIME
-- ────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.tutor_availability;
alter publication supabase_realtime add table public.tutor_bookings;
alter publication supabase_realtime add table public.sessions;

-- ────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger parents_updated_at before update on public.parents
  for each row execute function public.set_updated_at();
create trigger avail_updated_at before update on public.tutor_availability
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGNUP
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
