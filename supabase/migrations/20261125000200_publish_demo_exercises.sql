-- Publication authorized after content review; IDs are stable and migration is transactional.
begin;
-- Abort rather than modify content that has already been approved.
do $$ begin if exists (select 1 from public.exercises where id in ('71000000-0000-4000-8000-000000000001', '71000000-0000-4000-8000-000000000002', '71000000-0000-4000-8000-000000000003', '71000000-0000-4000-8000-000000000004') and approved_at is not null) then raise exception 'approved exercise cannot be imported'; end if; end $$;
insert into public.exercises (id, name, alternate_names, muscle_groups, equipment, difficulty, instructions, common_mistakes, precautions, media_url, media_alt) values
  ('71000000-0000-4000-8000-000000000001', 'Sentar e levantar da cadeira', ARRAY['Levantar da cadeira']::text[], ARRAY['legs', 'glutes']::text[], 'chair', 'beginner', 'Sente-se em uma cadeira estável. Levante-se de forma controlada e volte a sentar sem pressa.', ARRAY['Usar uma cadeira instável', 'Fazer o movimento com pressa']::text[], 'Use uma cadeira estável. Interrompa a atividade se sentir dor ou tontura.', '/media/exercises/chair-rise.svg', 'Ilustração animada e simplificada de uma pessoa levantando de uma cadeira'),
  ('71000000-0000-4000-8000-000000000002', 'Agachamento com apoio', ARRAY['Agachamento apoiado']::text[], ARRAY['legs', 'glutes']::text[], 'chair', 'beginner', 'Fique próximo de um apoio estável. Flexione os joelhos dentro de uma amplitude confortável e retorne devagar.', ARRAY['Usar apoio que se move', 'Acelerar a descida']::text[], 'Use apenas um apoio estável e mantenha uma amplitude confortável.', '/media/exercises/supported-squat.svg', 'Ilustração animada e simplificada de um movimento de agachar com apoio'),
  ('71000000-0000-4000-8000-000000000003', 'Remada com elástico', ARRAY['Puxada com elástico']::text[], ARRAY['back', 'arms']::text[], 'band', 'beginner', 'Segure o elástico com fixação segura. Puxe em direção ao tronco de forma controlada e retorne lentamente.', ARRAY['Usar fixação insegura', 'Soltar o elástico de uma vez']::text[], 'Verifique o estado do elástico e a segurança da fixação antes de usar.', '/media/exercises/band-row.svg', 'Ilustração animada e simplificada de uma remada com elástico'),
  ('71000000-0000-4000-8000-000000000004', 'Elevação de panturrilhas', ARRAY['Panturrilha em pé']::text[], ARRAY['calves']::text[], 'bodyweight', 'beginner', 'Em pé, use um apoio estável se necessário. Eleve os calcanhares e volte ao chão de forma controlada.', ARRAY['Perder o equilíbrio', 'Fazer o movimento com impulso']::text[], 'Use um apoio estável se precisar de equilíbrio. Procure orientação profissional para adaptar o movimento.', '/media/exercises/calf-raise.svg', 'Ilustração animada e simplificada de uma elevação de calcanhares')
on conflict (id) do update set
  name = excluded.name,
  alternate_names = excluded.alternate_names,
  muscle_groups = excluded.muscle_groups,
  equipment = excluded.equipment,
  difficulty = excluded.difficulty,
  instructions = excluded.instructions,
  common_mistakes = excluded.common_mistakes,
  precautions = excluded.precautions,
  media_url = excluded.media_url,
  media_alt = excluded.media_alt
where public.exercises.approved_at is null;
insert into public.exercise_substitutions (exercise_id, substitute_exercise_id) values
  ('71000000-0000-4000-8000-000000000001', '71000000-0000-4000-8000-000000000002'),
  ('71000000-0000-4000-8000-000000000002', '71000000-0000-4000-8000-000000000001')
on conflict do nothing;
do $$
declare exercise_count integer; substitution_count integer;
begin
  update public.exercises set approved_at = now() where id in ('71000000-0000-4000-8000-000000000001', '71000000-0000-4000-8000-000000000002', '71000000-0000-4000-8000-000000000003', '71000000-0000-4000-8000-000000000004') and approved_at is null;
  get diagnostics exercise_count = row_count;
  if exercise_count <> 4 then raise exception 'unexpected exercise approval count'; end if;
  update public.exercise_substitutions set approved_at = now()
    where (exercise_id, substitute_exercise_id) in (('71000000-0000-4000-8000-000000000001', '71000000-0000-4000-8000-000000000002'), ('71000000-0000-4000-8000-000000000002', '71000000-0000-4000-8000-000000000001')) and approved_at is null;
  get diagnostics substitution_count = row_count;
  if substitution_count <> 2 then raise exception 'unexpected substitution approval count'; end if;
end $$;
commit;
