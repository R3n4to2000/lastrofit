-- Execute apenas após importar os rascunhos e verificar os 14 arquivos no Storage hospedado.
-- A autorização de publicação foi dada pelo responsável em 2026-11-26.
begin;
create temporary table exercise_release (
  source_id text primary key, exercise_id uuid not null unique,
  name text not null, instructions text not null, video_slug text not null unique,
  source_url text not null, alt_text text not null
) on commit drop;
insert into exercise_release values
  ('Barbell_Hip_Thrust', 'd74e754a-a527-52d3-b700-75a12fc56c7e', 'Elevação pélvica com barra', 'Sente-se no chão com as escápulas apoiadas em um banco estável e a barra acolchoada sobre o quadril. Empurre o chão com os pés e eleve o quadril. Retorne devagar.', 'barbell-hip-thrust', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/barbell-hip-thrust.mp4', 'Demonstração em vídeo: Elevação pélvica com barra'),
  ('Barbell_Shrug', '569ce71a-01cf-5240-9075-97723348fdb3', 'Encolhimento de ombros com barra', 'Fique em pé com a barra à frente do corpo. Eleve os ombros de forma controlada, sem flexionar os cotovelos. Abaixe os ombros devagar.', 'barbell-shrug', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/barbell-shrug.mp4', 'Demonstração em vídeo: Encolhimento de ombros com barra'),
  ('Cable_Rear_Delt_Fly', 'e05dcd2c-e6ef-55aa-8bc0-77c33700a736', 'Crucifixo inverso na polia', 'Ajuste as polias acima da altura da cabeça e segure os cabos cruzados. Abra os braços para trás e para os lados, com controle. Retorne lentamente.', 'bent-over-low-pulley-rear-delt-fly', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/bent-over-low-pulley-rear-delt-fly.mp4', 'Demonstração em vídeo: Crucifixo inverso na polia'),
  ('Dumbbell_Bench_Press', 'edcd3699-95cc-5387-a722-7778583b81d3', 'Supino reto com halteres', 'Deite-se em um banco plano com um halter em cada mão, ao lado do peito. Empurre os halteres para cima de forma controlada. Desça devagar até a posição inicial.', 'dumbbell-bench-press', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/dumbbell-bench-press.mp4', 'Demonstração em vídeo: Supino reto com halteres'),
  ('Dumbbell_Shrug', 'a5814ee7-026b-57bd-bf74-9627e3faef8e', 'Encolhimento de ombros com halteres', 'Fique em pé com um halter em cada mão e os braços ao lado do corpo. Eleve os ombros sem usar os bíceps para puxar os pesos. Retorne devagar.', 'dumbbell-shrug', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/dumbbell-shrug.mp4', 'Demonstração em vídeo: Encolhimento de ombros com halteres'),
  ('EZ-Bar_Skullcrusher', '5ac30cbf-8f0c-571c-8041-1187cafa12f4', 'Tríceps testa com barra W', 'Deite-se no banco e segure a barra W acima do peito. Flexione os cotovelos para aproximar a barra da testa, mantendo os braços superiores estáveis. Estenda os cotovelos para voltar.', 'ez-bar-skullcrusher', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/ez-bar-skullcrusher.mp4', 'Demonstração em vídeo: Tríceps testa com barra W'),
  ('Hack_Squat', '48b33b7f-d364-58c3-98df-a11424e79940', 'Agachamento no hack', 'Apoie as costas no encosto da máquina e posicione os pés na plataforma. Flexione os joelhos dentro de uma amplitude confortável. Empurre a plataforma para retornar, sem perder o apoio das costas.', 'machine-hack-squat', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/machine-hack-squat.mp4', 'Demonstração em vídeo: Agachamento no hack'),
  ('Incline_Dumbbell_Curl', 'd7de6e3b-16da-58b6-aaf1-5caab1ac6cbd', 'Rosca inclinada com halteres', 'Sente-se em um banco inclinado, com um halter em cada mão. Flexione os cotovelos sem deslocar os braços superiores. Retorne lentamente à posição inicial.', 'incline-dumbbell-curl', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/incline-dumbbell-curl.mp4', 'Demonstração em vídeo: Rosca inclinada com halteres'),
  ('Leg_Press', '2cc1bfe2-f982-5a4f-bbd4-6c040f068f42', 'Leg press', 'Sente-se no aparelho com os pés apoiados na plataforma. Flexione os joelhos de forma controlada, mantendo o tronco apoiado. Empurre a plataforma para retornar e use as travas de segurança ao terminar.', 'leg-press', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/leg-press.mp4', 'Demonstração em vídeo: Leg press'),
  ('Seated_Calf_Raise', '12454625-7c50-5819-b45f-53533a59f802', 'Panturrilha sentada na máquina', 'Sente-se na máquina com a parte da frente dos pés apoiada na plataforma. Abaixe os calcanhares de forma controlada e depois eleve-os. Retorne devagar.', 'seated-calf-raise', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/seated-calf-raise.mp4', 'Demonstração em vídeo: Panturrilha sentada na máquina'),
  ('Seated_Leg_Curl', 'ccbc0e6b-f945-5659-b38f-bfea53118628', 'Cadeira flexora', 'Ajuste a cadeira flexora ao seu corpo e apoie as pernas nos rolos da máquina. Flexione os joelhos para puxar o rolo para baixo e para trás. Retorne lentamente.', 'seated-leg-curl', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/seated-leg-curl.mp4', 'Demonstração em vídeo: Cadeira flexora'),
  ('Sit-Up', 'e75219a5-d812-556a-832d-da39bb784da8', 'Abdominal completo', 'Deite-se de costas com os joelhos flexionados. Eleve o tronco em direção às coxas de forma controlada. Volte lentamente à posição inicial.', 'sit-up', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/sit-up.mp4', 'Demonstração em vídeo: Abdominal completo'),
  ('Straight-Arm_Pulldown', '94ae9c17-3cc7-54b0-81bb-cf5efdb8a801', 'Puxada de braços estendidos na polia', 'Segure a barra presa à polia alta e recue um pouco. Mantenha os braços quase estendidos e puxe a barra em direção às coxas. Retorne de forma controlada.', 'straight-arm-lat-pull-down', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/straight-arm-lat-pull-down.mp4', 'Demonstração em vídeo: Puxada de braços estendidos na polia'),
  ('Superman', '51928506-c6df-5e73-96a2-d39b46fa1547', 'Extensão de tronco no solo', 'Deite-se de barriga para baixo com os braços estendidos à frente. Eleve braços, peito e pernas de forma controlada. Faça uma breve pausa e retorne ao solo.', 'superman', 'https://github.com/namnq/workout-free-videos/blob/v2.0.0/media/video/superman.mp4', 'Demonstração em vídeo: Extensão de tronco no solo');

do $$
begin
  if (select count(*) from exercise_release) <> 14 then
    raise exception 'release count mismatch';
  end if;
  if (select count(*) from public.exercises e join exercise_release r
      on e.id = r.exercise_id and e.source_name = 'free-exercise-db'
      and e.source_exercise_id = r.source_id and e.name = r.name
      and e.instructions = r.instructions
      where e.translation_status in ('translated', 'reviewed')) <> 14 then
    raise exception 'reviewed exercise data mismatch';
  end if;
  if (select count(*) from public.exercise_media m join exercise_release r
      on m.exercise_id = r.exercise_id and m.source_name = 'workout-free-videos@v2.0.0'
      and m.source_media_id = r.video_slug and m.source_url = r.source_url
      and m.alt_text = r.alt_text and m.kind = 'video' and m.license = 'CC0-1.0'
      and (m.provider = 'jsdelivr' and m.asset_path = 'media/video/' || r.video_slug || '.mp4'
        or m.provider = 'supabase_storage' and m.asset_path = 'exercise-media/media/' || r.video_slug || '.mp4')) <> 14 then
    raise exception 'reviewed media data mismatch';
  end if;
  if not exists (select 1 from storage.buckets where id = 'exercise-media' and public) then
    raise exception 'public exercise-media bucket missing';
  end if;
  if (select count(*) from storage.objects o join exercise_release r
      on o.bucket_id = 'exercise-media' and o.name = 'media/' || r.video_slug || '.mp4') <> 14 then
    raise exception 'one or more approved videos are missing from Storage';
  end if;
end;
$$;

update public.exercises e
set translation_status = 'reviewed', approved_at = coalesce(e.approved_at, now()), updated_at = now()
from exercise_release r where e.id = r.exercise_id;

update public.exercise_media m
set provider = 'supabase_storage', asset_path = 'exercise-media/media/' || r.video_slug || '.mp4',
    validation_status = 'approved', approved_at = coalesce(m.approved_at, now()), updated_at = now()
from exercise_release r where m.exercise_id = r.exercise_id
  and m.source_name = 'workout-free-videos@v2.0.0' and m.source_media_id = r.video_slug;

do $$
begin
  if (select count(*) from public.exercises e join exercise_release r on e.id = r.exercise_id
      where e.approved_at is not null and e.translation_status = 'reviewed') <> 14
    or (select count(*) from public.exercise_media m join exercise_release r on m.exercise_id = r.exercise_id
      where m.validation_status = 'approved' and m.approved_at is not null
        and m.provider = 'supabase_storage') <> 14 then
    raise exception 'release approval count mismatch';
  end if;
end;
$$;
commit;
