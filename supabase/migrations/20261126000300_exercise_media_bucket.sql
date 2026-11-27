-- CC0 demonstration videos are public assets; only trusted operators upload them.
-- No storage.objects write policy is granted to anon or authenticated users.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exercise-media', 'exercise-media', true, 10485760, array['video/mp4'])
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from storage.buckets
    where id = 'exercise-media' and name = 'exercise-media' and public
      and file_size_limit >= 10485760 and 'video/mp4' = any(allowed_mime_types)
  ) then
    raise exception 'exercise-media bucket exists with incompatible settings';
  end if;
end;
$$;
