-- Run this SQL in the Supabase SQL Editor to set up the moderated discussion tables.

-- Banned words list (admin-editable)
create table public.banned_words (
  id uuid primary key default gen_random_uuid(),
  word text not null unique,
  created_at timestamp with time zone default now()
);

-- Discussion comments on bills
comment on table public.comments is 'Visitor comments on bills, pending admin approval.';
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  bill_id text not null,
  state_abbr text not null,
  author_name text not null default 'Anonymous',
  author_email text,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  created_at timestamp with time zone default now(),
  moderated_at timestamp with time zone,
  moderated_by uuid references auth.users(id) on delete set null
);

-- Row Level Security
alter table public.banned_words enable row level security;
alter table public.comments enable row level security;

-- Grants
grant select on public.banned_words to anon, authenticated;
grant all on public.banned_words to service_role;

grant insert on public.comments to anon, authenticated;
grant select on public.comments to anon, authenticated;
grant update on public.comments to authenticated;
grant all on public.comments to service_role;

-- Policies
-- Anyone can read banned words (needed for client-side pre-check)
create policy "Banned words are readable by all"
  on public.banned_words
  for select
  to anon, authenticated
  using (true);

-- Only admins can manage banned words
create policy "Only admins manage banned words"
  on public.banned_words
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Visitors can insert pending comments
create policy "Visitors can submit pending comments"
  on public.comments
  for insert
  to anon, authenticated
  with check (status = 'pending');

-- Approved comments are publicly readable
create policy "Approved comments are public"
  on public.comments
  for select
  to anon, authenticated
  using (status = 'approved');

-- Admins can read all comments for moderation
create policy "Admins can read all comments"
  on public.comments
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Admins can update comment status
create policy "Admins can moderate comments"
  on public.comments
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Admin role helper (run this too if you have not created the user_roles system yet)
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can read own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Seed default banned words
delete from public.banned_words where true;
insert into public.banned_words (word) values
  ('murder'),
  ('suicide'),
  ('democrat'),
  ('republican'),
  ('hate speech'),
  ('kill yourself'),
  ('terrorist'),
  ('nazi'),
  ('racial slur');
