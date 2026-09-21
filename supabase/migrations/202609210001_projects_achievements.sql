-- Incorpora los proyectos y logros confirmados por el propietario.
do $$
declare
  current_project_id uuid;
  current_technology_id uuid;
  current_technology text;
  current_position smallint := 0;
begin
  select id into current_project_id
  from public.projects
  where name = 'APIs — Fetch, Axios, BBDD — JS5'
  limit 1;

  if current_project_id is null then
    insert into public.projects (name, description, repository_url, demo_url, sort_order)
    values (
      'APIs — Fetch, Axios, BBDD — JS5',
      'Trabajo académico sobre consumo de APIs con Fetch y Axios, y conexión con bases de datos en JavaScript.',
      'https://github.com/nehuenparrondo/APIs---Fetch-Axios---BBDD---JS5',
      '',
      2
    )
    returning id into current_project_id;
  else
    update public.projects
    set
      description = 'Trabajo académico sobre consumo de APIs con Fetch y Axios, y conexión con bases de datos en JavaScript.',
      repository_url = 'https://github.com/nehuenparrondo/APIs---Fetch-Axios---BBDD---JS5',
      sort_order = 2,
      updated_at = now()
    where id = current_project_id;
  end if;

  foreach current_technology in array array['JavaScript', 'Fetch', 'Axios', 'Base de datos']
  loop
    insert into public.technologies (name)
    values (current_technology)
    on conflict (name) do update set name = excluded.name
    returning id into current_technology_id;

    insert into public.project_technologies (project_id, technology_id, position)
    values (current_project_id, current_technology_id, current_position)
    on conflict (project_id, technology_id) do update set position = excluded.position;

    current_position := current_position + 1;
  end loop;
end;
$$;

do $$
declare
  current_project_id uuid;
  current_technology_id uuid;
  current_technology text;
  current_position smallint := 0;
begin
  select id into current_project_id
  from public.projects
  where name = 'Express y DHTML — NJS3'
  limit 1;

  if current_project_id is null then
    insert into public.projects (name, description, repository_url, demo_url, sort_order)
    values (
      'Express y DHTML — NJS3',
      'Trabajo académico de Express y DHTML desarrollado en el entorno de Node.js.',
      'https://github.com/nehuenparrondo/-Express-y-DHTML---NJS3...',
      '',
      3
    )
    returning id into current_project_id;
  else
    update public.projects
    set
      description = 'Trabajo académico de Express y DHTML desarrollado en el entorno de Node.js.',
      repository_url = 'https://github.com/nehuenparrondo/-Express-y-DHTML---NJS3...',
      sort_order = 3,
      updated_at = now()
    where id = current_project_id;
  end if;

  foreach current_technology in array array['Node.js', 'Express', 'DHTML', 'JavaScript']
  loop
    insert into public.technologies (name)
    values (current_technology)
    on conflict (name) do update set name = excluded.name
    returning id into current_technology_id;

    insert into public.project_technologies (project_id, technology_id, position)
    values (current_project_id, current_technology_id, current_position)
    on conflict (project_id, technology_id) do update set position = excluded.position;

    current_position := current_position + 1;
  end loop;
end;
$$;

insert into public.achievements (title, description, date, sort_order)
select 'Proyectos finales Expo Tec', 'Presentación de proyectos finales en Expo Tec.', '', 1
where not exists (
  select 1 from public.achievements where title = 'Proyectos finales Expo Tec'
);

insert into public.achievements (title, description, date, sort_order)
select 'Diseño de videojuegos Snake y Pac-Man', 'Diseño de los videojuegos Snake y Pac-Man.', '', 2
where not exists (
  select 1 from public.achievements where title = 'Diseño de videojuegos Snake y Pac-Man'
);

insert into public.achievements (title, description, date, sort_order)
select 'Diseño de diarios virtuales con fines escolares', 'Diseño de diarios virtuales realizados con fines escolares.', '', 3
where not exists (
  select 1 from public.achievements where title = 'Diseño de diarios virtuales con fines escolares'
);

-- Este archivo crea: dos proyectos académicos, sus tecnologías y tres logros.
-- Se usa en: Supabase CLI o el editor SQL de Supabase.
-- Importa/usa: projects, technologies, project_technologies y achievements.
