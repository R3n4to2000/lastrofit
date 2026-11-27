begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;
select plan(13);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data)
values
  ('83000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'source-user@example.test', 'test', now(), '{"full_name":"Source User","adult_confirmed":true}', '{}'),
  ('83000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'source-admin@example.test', 'test', now(), '{"full_name":"Source Admin","adult_confirmed":true}', '{}');
insert into public.admin_users (user_id) values ('83000000-0000-4000-8000-000000000002');

insert into public.exercises (id, name, alternate_names, difficulty, source_name, source_exercise_id, translation_status, approved_at)
values
  ('84000000-0000-4000-8000-000000000001', 'Supino com halteres', array['Dumbbell Bench Press'], 'beginner', 'free-exercise-db', 'Test_Dumbbell_Bench_Press', 'reviewed', now()),
  ('84000000-0000-4000-8000-000000000002', 'Rascunho', '{}', 'beginner', 'free-exercise-db', 'Draft_1', 'pending', null);

insert into public.exercise_media (exercise_id, kind, provider, asset_path, source_name, source_media_id, source_url, author, license, alt_text, validation_status, approved_at)
values
  ('84000000-0000-4000-8000-000000000001', 'video', 'jsdelivr', 'media/video/dumbbell-bench-press.mp4', 'workout-free-videos@v2.0.0', 'test-dumbbell-bench-press', 'https://github.com/namnq/workout-free-videos', 'namnq', 'CC0-1.0', 'Vídeo do supino', 'approved', now()),
  ('84000000-0000-4000-8000-000000000001', 'cover', 'local', '/media/exercises/cover.webp', 'test', 'cover-1', 'https://example.test/cover', 'Test', 'CC0-1.0', 'Capa', 'pending', null),
  ('84000000-0000-4000-8000-000000000002', 'video', 'jsdelivr', 'media/video/draft.mp4', 'test', 'draft-video', 'https://example.test/video', 'Test', 'CC0-1.0', 'Rascunho', 'approved', now());

select is((select count(*)::integer from public.exercises where id::text like '84000000-%' and source_name = 'free-exercise-db'), 2, 'source identity stored');
select is((select count(*)::integer from public.exercises where id::text like '71000000-%' and equipment_list = array[equipment]), 4, 'legacy approved equipment backfilled');
select throws_ok($$insert into public.exercises (name, difficulty, source_name, source_exercise_id) values ('Duplicado', 'beginner', 'free-exercise-db', 'Draft_1')$$, '23505');
select throws_ok($$insert into public.exercises (name, difficulty, translation_status, approved_at) values ('Sem tradução', 'beginner', 'pending', now())$$, '23514');
select throws_ok($$insert into public.exercise_media (exercise_id, kind, provider, asset_path, source_name, source_media_id, source_url, author, license, alt_text, validation_status) values ('84000000-0000-4000-8000-000000000001', 'video', 'local', '/media/exercises/other.mp4', 'test', 'bad-status', 'https://example.test', 'Test', 'CC0-1.0', 'Teste', 'approved')$$, '23514');

set local role authenticated;
select set_config('request.jwt.claim.sub', '83000000-0000-4000-8000-000000000001', true);
select is((select count(*)::integer from public.exercises where id::text like '84000000-%'), 1, 'student sees approved exercise only');
select is((select count(*)::integer from public.exercise_media where source_name = 'workout-free-videos@v2.0.0'), 1, 'student sees approved media on approved exercise');
select is((select count(*)::integer from public.exercise_media where source_name = 'test'), 0, 'student cannot see pending or draft media');
select throws_ok($$update public.exercise_media set validation_status = 'approved', approved_at = now() where source_media_id = 'cover-1'$$, '42501');
select throws_ok($$insert into public.exercise_media (exercise_id, kind, provider, asset_path, source_name, source_media_id, source_url, author, license, alt_text) values ('84000000-0000-4000-8000-000000000001', 'video', 'local', '/media/exercises/other.mp4', 'test', 'unauthorized', 'https://example.test', 'Test', 'CC0-1.0', 'Teste')$$, '42501');
select set_config('request.jwt.claim.sub', '83000000-0000-4000-8000-000000000002', true);
select is((select count(*)::integer from public.exercise_media where source_name = 'test'), 2, 'admin can inspect all media');
reset role;
set local role anon;
select throws_ok($$select * from public.exercise_media$$, '42501');
reset role;
select is((select count(*)::integer from public.exercises where id = '84000000-0000-4000-8000-000000000001' and search_text ilike '%Dumbbell Bench%'), 1, 'search includes original alias');
select * from finish();
rollback;
