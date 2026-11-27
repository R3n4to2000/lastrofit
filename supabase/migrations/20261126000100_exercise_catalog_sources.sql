-- Add source provenance and a separate, reviewable media catalog.
alter table public.exercises
  add column source_name text,
  add column source_exercise_id text,
  add column original_name text,
  add column source_instructions text[] not null default '{}',
  add column primary_muscle text,
  add column secondary_muscles text[] not null default '{}',
  add column equipment_list text[] not null default '{}',
  add column category text,
  add column translation_status text not null default 'reviewed'
    check (translation_status in ('pending', 'translated', 'reviewed')),
  add constraint exercise_source_pair check
    ((source_name is null) = (source_exercise_id is null)),
  add constraint exercise_approval_translation check
    (approved_at is null or translation_status = 'reviewed');

create unique index exercises_source_identity_idx
  on public.exercises (source_name, source_exercise_id)
  where source_name is not null;

create extension if not exists pg_trgm with schema extensions;
alter table public.exercises add column search_text text not null default '';
create function private.refresh_exercise_search_text() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.search_text := new.name || ' ' || pg_catalog.array_to_string(new.alternate_names, ' ');
  return new;
end;
$$;
create trigger refresh_exercise_search_text
  before insert or update of name, alternate_names on public.exercises
  for each row execute function private.refresh_exercise_search_text();
update public.exercises set search_text = name || ' ' || array_to_string(alternate_names, ' ');
create index exercises_approved_search_idx
  on public.exercises using gin (search_text extensions.gin_trgm_ops)
  where approved_at is not null;
create index exercises_approved_category_idx
  on public.exercises (category, name) where approved_at is not null;

create table public.exercise_media (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  kind text not null check (kind in ('cover', 'video', 'animation')),
  provider text not null check (provider in ('local', 'supabase_storage', 'jsdelivr')),
  asset_path text not null check (char_length(asset_path) between 1 and 300),
  source_name text not null,
  source_media_id text not null,
  source_url text not null check (source_url ~ '^https://'),
  author text not null,
  license text not null,
  attribution text,
  alt_text text not null check (char_length(trim(alt_text)) between 1 and 200),
  validation_status text not null default 'pending'
    check (validation_status in ('pending', 'approved', 'rejected')),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_approval_consistent check
    ((validation_status = 'approved') = (approved_at is not null)),
  constraint media_source_identity unique (source_name, source_media_id)
);
create index exercise_media_exercise_status_idx
  on public.exercise_media (exercise_id, kind, validation_status);

revoke all on public.exercise_media from anon, authenticated;
grant select on public.exercise_media to authenticated;
alter table public.exercise_media enable row level security;
create policy exercise_media_read on public.exercise_media
  for select to authenticated using (
    (select private.is_admin()) or (
      validation_status = 'approved'
      and approved_at is not null
      and exists (select 1 from public.exercises e
        where e.id = exercise_id and e.approved_at is not null)
    )
  );

-- The four old illustrations are no longer valid exercise demonstrations.
update public.exercises set media_url = null, media_alt = null
where id in (
  '71000000-0000-4000-8000-000000000001',
  '71000000-0000-4000-8000-000000000002',
  '71000000-0000-4000-8000-000000000003',
  '71000000-0000-4000-8000-000000000004'
) and media_url like '/media/exercises/%.svg';
