-- tectoncraft: profiles, quotes, newsletter. Run in the Supabase SQL editor or `supabase db push`.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  company text,
  country text,
  locale text check (locale in ('en', 'de', 'el')),
  created_at timestamptz not null default now()
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  kind text not null default 'quote' check (kind in ('quote', 'negotiate')),
  email text not null,
  name text,
  company text,
  country text,
  phone text,
  package_id text,
  addons jsonb not null default '{}'::jsonb,
  totals jsonb,
  budget_range text,
  message text,
  desired_launch date,
  preferred_contact text check (preferred_contact in ('email', 'phone', 'whatsapp')),
  locale text not null default 'en' check (locale in ('en', 'de', 'el')),
  status text not null default 'new'
    check (status in ('new', 'in_review', 'sent', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);
create index quotes_user_id_idx on public.quotes (user_id, created_at desc);

create table public.newsletter (
  email text primary key,
  locale text not null default 'en' check (locale in ('en', 'de', 'el')),
  confirm_token uuid not null default gen_random_uuid(),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Row-level security on all tables.
alter table public.profiles enable row level security;
alter table public.quotes enable row level security;
alter table public.newsletter enable row level security;

-- Profiles: a user reads and edits only their own row.
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Quotes: users read their own. All writes go through the server API (service role),
-- which validates input, checks Turnstile and rate-limits, so there is no client insert policy.
create policy "quotes_select_own" on public.quotes
  for select to authenticated using (user_id = (select auth.uid()));

-- Newsletter: no client policies at all; only the service role (server API) can touch it.

-- Create a profile row for every new user.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name, locale)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    case when new.raw_user_meta_data ->> 'locale' in ('en', 'de', 'el')
         then new.raw_user_meta_data ->> 'locale' else 'en' end
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
