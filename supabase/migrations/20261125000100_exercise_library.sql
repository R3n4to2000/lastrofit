-- Catalog additions. Importers create drafts; approval remains an administrative act.
alter table public.exercises
  add column common_mistakes text[] not null default '{}';

create index exercises_approved_filters_idx
  on public.exercises (difficulty, equipment, name)
  where approved_at is not null;
create index exercises_approved_muscles_idx
  on public.exercises using gin (muscle_groups)
  where approved_at is not null;

create table public.exercise_substitutions (
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  substitute_exercise_id uuid not null references public.exercises(id) on delete cascade,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (exercise_id, substitute_exercise_id),
  constraint different_exercises check (exercise_id <> substitute_exercise_id)
);
create index exercise_substitutions_reverse_idx
  on public.exercise_substitutions (substitute_exercise_id);

revoke all on public.exercise_substitutions from anon, authenticated;
grant select on public.exercise_substitutions to authenticated;
alter table public.exercise_substitutions enable row level security;

create policy substitutions_read on public.exercise_substitutions
  for select to authenticated using (
    (select private.is_admin()) or (
      approved_at is not null
      and exists (select 1 from public.exercises source
        where source.id = exercise_id and source.approved_at is not null)
      and exists (select 1 from public.exercises replacement
        where replacement.id = substitute_exercise_id and replacement.approved_at is not null)
    )
  );
