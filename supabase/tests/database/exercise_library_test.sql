begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;
select plan(11);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data)
values
  ('81000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'catalog-user@example.test', 'test', now(), '{"full_name":"Catalog user","adult_confirmed":true}', '{}'),
  ('81000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'catalog-admin@example.test', 'test', now(), '{"full_name":"Catalog admin","adult_confirmed":true}', '{}');
insert into public.admin_users (user_id) values ('81000000-0000-4000-8000-000000000002');

insert into public.exercises (id, name, difficulty, common_mistakes, approved_at) values
  ('82000000-0000-4000-8000-000000000001', 'Approved A', 'beginner', array['Mistake A'], now()),
  ('82000000-0000-4000-8000-000000000002', 'Approved B', 'beginner', array['Mistake B'], now()),
  ('82000000-0000-4000-8000-000000000003', 'Draft C', 'beginner', array['Mistake C'], null);
insert into public.exercise_substitutions (exercise_id, substitute_exercise_id, approved_at) values
  ('82000000-0000-4000-8000-000000000001', '82000000-0000-4000-8000-000000000002', now()),
  ('82000000-0000-4000-8000-000000000002', '82000000-0000-4000-8000-000000000001', null),
  ('82000000-0000-4000-8000-000000000001', '82000000-0000-4000-8000-000000000003', now());

set local role authenticated;
select set_config('request.jwt.claim.sub', '81000000-0000-4000-8000-000000000001', true);
select is((select count(*)::integer from public.exercises where name like 'Approved%'), 2, 'approved exercises visible');
select is((select count(*)::integer from public.exercises where name = 'Draft C'), 0, 'draft exercise hidden');
select is((select common_mistakes[1] from public.exercises where name = 'Approved A'), 'Mistake A', 'common mistakes readable');
select is((select count(*)::integer from public.exercise_substitutions where exercise_id = '82000000-0000-4000-8000-000000000001'), 1, 'only approved substitute with approved target visible');
select is((select count(*)::integer from public.exercises where id::text like '71000000-%'), 4, 'published catalog exercises visible');
select is((select count(*)::integer from public.exercise_substitutions where exercise_id::text like '71000000-%'), 2, 'published substitutions visible');
select throws_ok($$insert into public.exercise_substitutions (exercise_id, substitute_exercise_id) values ('82000000-0000-4000-8000-000000000003', '82000000-0000-4000-8000-000000000001')$$, '42501');
select throws_ok($$update public.exercises set approved_at = now() where id = '82000000-0000-4000-8000-000000000003'$$, '42501');
select set_config('request.jwt.claim.sub', '81000000-0000-4000-8000-000000000002', true);
select is((select count(*)::integer from public.exercise_substitutions where exercise_id::text like '82000000-%'), 3, 'admin can inspect substitution drafts');
reset role;
set local role anon;
select throws_ok($$select * from public.exercise_substitutions$$, '42501');
reset role;
select throws_ok($$insert into public.exercise_substitutions (exercise_id, substitute_exercise_id) values ('82000000-0000-4000-8000-000000000001', '82000000-0000-4000-8000-000000000001')$$, '23514');
select * from finish();
rollback;
