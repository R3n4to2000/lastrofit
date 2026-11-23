-- Foundation only: catalog and workout content require professional review before publication.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

create function private.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admin_users where user_id = (select auth.uid())) $$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 1 and 80),
  adult_confirmed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function private.touch_updated_at() returns trigger
language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end $$;
revoke all on function private.touch_updated_at() from public, anon, authenticated;
create trigger profiles_updated_at before update on public.profiles
for each row execute function private.touch_updated_at();

create function private.create_profile() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.raw_user_meta_data->>'adult_confirmed' is distinct from 'true' then
    raise exception 'adult confirmation required';
  end if;
  insert into public.profiles (user_id, full_name, adult_confirmed_at)
  values (new.id, left(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), 80), now());
  return new;
end;
$$;
revoke all on function private.create_profile() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users
for each row execute function private.create_profile();

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  alternate_names text[] not null default '{}',
  muscle_groups text[] not null default '{}',
  equipment text,
  difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
  instructions text not null default '',
  precautions text,
  media_url text,
  media_alt text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_has_alt check (media_url is null or nullif(trim(media_alt), '') is not null)
);
create index exercises_approved_name_idx on public.exercises (name) where approved_at is not null;

create table public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  goal text not null,
  experience text not null check (experience in ('beginner','intermediate','advanced')),
  duration_minutes integer not null check (duration_minutes between 10 and 180),
  location text not null check (location in ('gym','home','both')),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index workout_templates_approved_idx on public.workout_templates (experience, duration_minutes) where approved_at is not null;

create table public.workout_template_exercises (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.workout_templates(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  position integer not null check (position > 0),
  sets integer not null check (sets between 1 and 20),
  reps_min integer not null check (reps_min between 1 and 100),
  reps_max integer not null check (reps_max between reps_min and 100),
  rest_seconds integer not null check (rest_seconds between 0 and 600),
  created_at timestamptz not null default now(),
  unique (template_id, position),
  unique (template_id, id)
);
create index workout_template_exercises_exercise_idx on public.workout_template_exercises (exercise_id);

create table public.user_workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  template_id uuid not null references public.workout_templates(id) on delete restrict,
  status text not null check (status in ('active','ended')),
  starts_on date not null,
  ends_on date check (ends_on is null or ends_on >= starts_on),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id)
);
create unique index user_workout_plans_one_active_idx on public.user_workout_plans (user_id) where status = 'active';
create index user_workout_plans_user_date_idx on public.user_workout_plans (user_id, starts_on desc);

create table public.scheduled_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  plan_id uuid not null,
  scheduled_on date not null,
  is_rest_day boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, id),
  unique (user_id, scheduled_on),
  foreign key (user_id, plan_id) references public.user_workout_plans(user_id, id) on delete restrict
);
create index scheduled_workouts_plan_idx on public.scheduled_workouts (plan_id);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  scheduled_workout_id uuid not null,
  status text not null default 'in_progress' check (status in ('in_progress','paused','completed')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id),
  unique (scheduled_workout_id),
  foreign key (user_id, scheduled_workout_id) references public.scheduled_workouts(user_id, id) on delete restrict,
  constraint completed_status_matches_time check ((status = 'completed') = (completed_at is not null)),
  constraint completed_after_start check (completed_at is null or completed_at >= started_at)
);
create index workout_sessions_user_start_idx on public.workout_sessions (user_id, started_at desc);

create table public.exercise_set_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  session_id uuid not null,
  template_exercise_id uuid not null references public.workout_template_exercises(id) on delete restrict,
  set_number integer not null check (set_number between 1 and 20),
  reps integer check (reps between 0 and 100),
  weight_kg numeric(7,2) check (weight_kg between 0 and 9999.99),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, template_exercise_id, set_number),
  foreign key (user_id, session_id) references public.workout_sessions(user_id, id) on delete restrict
);
create index exercise_set_logs_user_session_idx on public.exercise_set_logs (user_id, session_id);

create function private.validate_set_log() returns trigger
language plpgsql set search_path = ''
as $$
declare allowed_sets integer;
begin
  select e.sets into allowed_sets
  from public.workout_sessions s
  join public.scheduled_workouts sw on sw.id = s.scheduled_workout_id and sw.user_id = s.user_id
  join public.user_workout_plans p on p.id = sw.plan_id and p.user_id = sw.user_id
  join public.workout_template_exercises e on e.template_id = p.template_id
  where s.id = new.session_id and s.user_id = new.user_id and e.id = new.template_exercise_id;
  if allowed_sets is null or new.set_number > allowed_sets then
    raise exception 'set does not belong to the scheduled template';
  end if;
  return new;
end;
$$;
revoke all on function private.validate_set_log() from public, anon, authenticated;
create trigger validate_set_log before insert or update on public.exercise_set_logs
for each row execute function private.validate_set_log();

create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  question text not null check (char_length(question) between 1 and 2000),
  answer text not null check (char_length(answer) between 1 and 8000),
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  unique (user_id, id)
);
create index ai_conversations_user_created_idx on public.ai_conversations (user_id, created_at desc);
create index ai_conversations_expiry_idx on public.ai_conversations (expires_at);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  provider text not null check (provider in ('mercado_pago')),
  provider_subscription_id text not null,
  status text not null check (status in ('pending','active','past_due','cancelled','expired')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id),
  unique (user_id, id)
);
create index subscriptions_user_status_idx on public.subscriptions (user_id, status);

create trigger exercises_updated_at before update on public.exercises
for each row execute function private.touch_updated_at();
create trigger templates_updated_at before update on public.workout_templates
for each row execute function private.touch_updated_at();
create trigger plans_updated_at before update on public.user_workout_plans
for each row execute function private.touch_updated_at();
create trigger sessions_updated_at before update on public.workout_sessions
for each row execute function private.touch_updated_at();
create trigger set_logs_updated_at before update on public.exercise_set_logs
for each row execute function private.touch_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions
for each row execute function private.touch_updated_at();

-- Explicit grants supplement RLS. service_role/backend administration bypasses RLS.
revoke all on public.admin_users, public.profiles, public.exercises, public.workout_templates,
  public.workout_template_exercises, public.user_workout_plans, public.scheduled_workouts,
  public.workout_sessions, public.exercise_set_logs, public.ai_conversations,
  public.subscriptions from anon, authenticated;
grant select, update (full_name) on public.profiles to authenticated;
grant select on public.exercises, public.workout_templates, public.workout_template_exercises to authenticated;
grant select on public.user_workout_plans, public.scheduled_workouts, public.workout_sessions,
  public.exercise_set_logs, public.ai_conversations, public.subscriptions to authenticated;
grant insert, update (status, completed_at) on public.workout_sessions to authenticated;
grant insert, update (reps, weight_kg, completed_at) on public.exercise_set_logs to authenticated;

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_templates enable row level security;
alter table public.workout_template_exercises enable row level security;
alter table public.user_workout_plans enable row level security;
alter table public.scheduled_workouts enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercise_set_logs enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.subscriptions enable row level security;

create policy profiles_read on public.profiles for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy profiles_update on public.profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy exercises_read on public.exercises for select to authenticated
  using (approved_at is not null or (select private.is_admin()));
create policy templates_read on public.workout_templates for select to authenticated
  using (approved_at is not null or (select private.is_admin()));
create policy template_exercises_read on public.workout_template_exercises for select to authenticated
  using ((select private.is_admin()) or exists (
    select 1 from public.workout_templates t where t.id = template_id and t.approved_at is not null
  ) and exists (
    select 1 from public.exercises e where e.id = exercise_id and e.approved_at is not null
  ));
create policy plans_read on public.user_workout_plans for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy scheduled_read on public.scheduled_workouts for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy sessions_read on public.workout_sessions for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy sessions_insert on public.workout_sessions for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (
    select 1 from public.scheduled_workouts s where s.id = scheduled_workout_id
      and s.user_id = (select auth.uid()) and not s.is_rest_day
  ));
create policy sessions_update on public.workout_sessions for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy set_logs_read on public.exercise_set_logs for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy set_logs_insert on public.exercise_set_logs for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy set_logs_update on public.exercise_set_logs for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy conversations_read on public.ai_conversations for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy subscriptions_read on public.subscriptions for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
