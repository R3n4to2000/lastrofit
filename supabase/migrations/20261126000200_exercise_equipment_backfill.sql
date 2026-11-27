-- Keep legacy approved exercises visible through the new equipment-list filter.
update public.exercises
set equipment_list = array[equipment]
where equipment is not null and equipment_list = '{}'::text[];
