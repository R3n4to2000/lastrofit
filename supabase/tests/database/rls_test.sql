begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;
select plan(24);

-- All fixtures are rolled back. Metadata mirrors the adult self-attestation in signup.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data)
values
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'one@example.test', 'test', now(), '{"full_name":"One","adult_confirmed":true}', '{}'),
  ('00000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'two@example.test', 'test', now(), '{"full_name":"Two","adult_confirmed":true}', '{}'),
  ('00000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@example.test', 'test', now(), '{"full_name":"Admin","adult_confirmed":true}', '{}');
insert into public.admin_users (user_id) values ('00000000-0000-4000-8000-000000000003');

insert into public.exercises (id, name, difficulty, approved_at) values
  ('10000000-0000-4000-8000-000000000001', 'Approved exercise', 'beginner', now()),
  ('10000000-0000-4000-8000-000000000002', 'Draft exercise', 'beginner', null);
insert into public.workout_templates (id, name, goal, experience, duration_minutes, location, approved_at) values
  ('20000000-0000-4000-8000-000000000001', 'Approved template', 'general', 'beginner', 30, 'gym', now()),
  ('20000000-0000-4000-8000-000000000002', 'Draft template', 'general', 'beginner', 30, 'gym', null);
insert into public.workout_template_exercises (id, template_id, exercise_id, position, sets, reps_min, reps_max, rest_seconds) values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 1, 3, 8, 12, 60),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 1, 3, 8, 12, 60);
insert into public.user_workout_plans (id, user_id, template_id, status, starts_on) values
  ('40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'active', current_date),
  ('40000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'active', current_date);
insert into public.scheduled_workouts (id, user_id, plan_id, scheduled_on) values
  ('50000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', current_date),
  ('50000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000002', current_date);
insert into public.workout_sessions (id, user_id, scheduled_workout_id) values
  ('60000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001'),
  ('60000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002');
insert into public.exercise_set_logs (user_id, session_id, template_exercise_id, set_number) values
  ('00000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 1),
  ('00000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 1);
insert into public.ai_conversations (user_id, question, answer) values
  ('00000000-0000-4000-8000-000000000001', 'Q1', 'A1'),
  ('00000000-0000-4000-8000-000000000002', 'Q2', 'A2');
insert into public.subscriptions (user_id, provider, provider_subscription_id, status) values
  ('00000000-0000-4000-8000-000000000001', 'mercado_pago', 'test-1', 'pending'),
  ('00000000-0000-4000-8000-000000000002', 'mercado_pago', 'test-2', 'pending');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select is((select count(*)::integer from public.profiles), 1, 'profile isolated');
select is((select count(*)::integer from public.exercises), 1, 'draft exercise hidden');
select is((select count(*)::integer from public.workout_templates), 1, 'draft template hidden');
select is((select count(*)::integer from public.workout_template_exercises), 1, 'draft template contents hidden');
select is((select count(*)::integer from public.user_workout_plans), 1, 'plans isolated');
select is((select count(*)::integer from public.scheduled_workouts), 1, 'schedule isolated');
select is((select count(*)::integer from public.workout_sessions), 1, 'sessions isolated');
select is((select count(*)::integer from public.exercise_set_logs), 1, 'sets isolated');
select is((select count(*)::integer from public.ai_conversations), 1, 'conversations isolated');
select is((select count(*)::integer from public.subscriptions), 1, 'subscriptions isolated');
select is((select private.is_admin()), false, 'regular user is not administrator');
update public.profiles set full_name = 'Changed' where user_id = '00000000-0000-4000-8000-000000000002';
reset role;
select is((select full_name from public.profiles where user_id = '00000000-0000-4000-8000-000000000002'), 'Two', 'cannot update another profile');
set local role authenticated;
select throws_ok($$insert into public.admin_users (user_id) values ('00000000-0000-4000-8000-000000000001')$$, '42501');
select throws_ok($$insert into public.exercises (name, difficulty) values ('Unreviewed', 'beginner')$$, '42501');
select throws_ok($$insert into public.user_workout_plans (user_id, template_id, status, starts_on) values ('00000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'ended', current_date)$$, '42501');
select throws_ok($$update public.subscriptions set status = 'active'$$, '42501');
select throws_ok($$insert into public.workout_sessions (user_id, scheduled_workout_id) values ('00000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002')$$, '42501');
-- The trigger checks the session/template link before INSERT RLS and rejects this forged owner.
select throws_ok($$insert into public.exercise_set_logs (user_id, session_id, template_exercise_id, set_number) values ('00000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 2)$$, 'P0001');
select throws_ok($$insert into public.exercise_set_logs (user_id, session_id, template_exercise_id, set_number) values ('00000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', 2)$$);
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000003', true);
select is((select private.is_admin()), true, 'admin comes from protected membership table');
select is((select count(*)::integer from public.profiles), 3, 'admin can read profiles');
select is((select count(*)::integer from public.exercises), 2, 'admin can inspect drafts');
reset role;
set local role anon;
select throws_ok($$select * from public.profiles$$, '42501');
reset role;
select throws_ok($$insert into public.scheduled_workouts (user_id, plan_id, scheduled_on) values ('00000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000002', current_date + 1)$$, '23503');
select * from finish();
rollback;
