-- Habilita UUID seguros y hashes bcrypt administrados por PostgreSQL.
create extension if not exists pgcrypto;

-- Separa el secreto administrativo de las tablas expuestas por la API.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.admin_config (
  id boolean primary key default true check (id),
  password_hash text not null check (password_hash like '$2%')
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name varchar(80) not null check (char_length(trim(name)) between 2 and 80),
  category varchar(40) not null check (char_length(trim(category)) between 2 and 40),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  role varchar(90) not null check (char_length(trim(role)) between 2 and 90),
  company varchar(90) not null check (char_length(trim(company)) between 2 and 90),
  description varchar(600) not null check (char_length(trim(description)) between 10 and 600),
  period varchar(50) not null default '' check (char_length(period) <= 50),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name varchar(80) not null check (char_length(trim(name)) between 2 and 80),
  description varchar(600) not null check (char_length(trim(description)) between 10 and 600),
  repository_url text not null default '' check (repository_url = '' or repository_url ~ '^https?://'),
  demo_url text not null default '' check (demo_url = '' or demo_url ~ '^https?://'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  name varchar(80) not null unique check (char_length(trim(name)) between 1 and 80)
);

create table public.project_technologies (
  project_id uuid not null references public.projects(id) on delete cascade,
  technology_id uuid not null references public.technologies(id) on delete restrict,
  position smallint not null default 0 check (position >= 0),
  primary key (project_id, technology_id)
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title varchar(100) not null check (char_length(trim(title)) between 2 and 100),
  description varchar(600) not null check (char_length(trim(description)) between 10 and 600),
  date varchar(40) not null default '' check (char_length(date) <= 40),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact (
  id text primary key default 'main' check (id = 'main'),
  email varchar(254) not null check (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone varchar(24) not null check (phone ~ '^\+?[0-9 ()-]{8,24}$'),
  updated_at timestamptz not null default now()
);

-- La lectura es pública; las escrituras directas quedan bloqueadas por RLS.
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.technologies enable row level security;
alter table public.project_technologies enable row level security;
alter table public.achievements enable row level security;
alter table public.contact enable row level security;

create policy "Public read skills" on public.skills for select to anon, authenticated using (true);
create policy "Public read experiences" on public.experiences for select to anon, authenticated using (true);
create policy "Public read projects" on public.projects for select to anon, authenticated using (true);
create policy "Public read technologies" on public.technologies for select to anon, authenticated using (true);
create policy "Public read project technologies" on public.project_technologies for select to anon, authenticated using (true);
create policy "Public read achievements" on public.achievements for select to anon, authenticated using (true);
create policy "Public read contact" on public.contact for select to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select on public.skills, public.experiences, public.projects, public.technologies, public.project_technologies, public.achievements, public.contact to anon, authenticated;
revoke insert, update, delete on public.skills, public.experiences, public.projects, public.technologies, public.project_technologies, public.achievements, public.contact from anon, authenticated;

-- Comprueba el secreto únicamente contra el hash privado almacenado en PostgreSQL.
create or replace function public.verify_admin_access(access_secret text)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admin_config
    where id = true
      and crypt(access_secret, password_hash) = password_hash
  );
$$;

-- Ejecuta altas y modificaciones con una lista cerrada de entidades y consultas parametrizadas.
create or replace function public.admin_upsert_portfolio_item(
  access_secret text,
  entity_name text,
  item_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_item jsonb;
  requested_id uuid;
  raw_technology text;
  technology_id uuid;
  technology_position smallint;
begin
  if not public.verify_admin_access(access_secret) then
    raise exception 'Acceso administrativo denegado' using errcode = '42501';
  end if;

  requested_id := coalesce(nullif(item_payload ->> 'id', '')::uuid, gen_random_uuid());

  case entity_name
    when 'skills' then
      insert into public.skills (id, name, category, sort_order)
      values (requested_id, trim(item_payload ->> 'name'), trim(item_payload ->> 'category'), coalesce((item_payload ->> 'sort_order')::integer, 0))
      on conflict (id) do update set
        name = excluded.name,
        category = excluded.category,
        sort_order = excluded.sort_order,
        updated_at = now()
      returning to_jsonb(skills) into saved_item;

    when 'experiences' then
      insert into public.experiences (id, role, company, description, period, sort_order)
      values (
        requested_id,
        trim(item_payload ->> 'role'),
        trim(item_payload ->> 'company'),
        trim(item_payload ->> 'description'),
        trim(coalesce(item_payload ->> 'period', '')),
        coalesce((item_payload ->> 'sort_order')::integer, 0)
      )
      on conflict (id) do update set
        role = excluded.role,
        company = excluded.company,
        description = excluded.description,
        period = excluded.period,
        sort_order = excluded.sort_order,
        updated_at = now()
      returning to_jsonb(experiences) into saved_item;

    when 'projects' then
      insert into public.projects (id, name, description, repository_url, demo_url, sort_order)
      values (
        requested_id,
        trim(item_payload ->> 'name'),
        trim(item_payload ->> 'description'),
        trim(coalesce(item_payload ->> 'repository_url', '')),
        trim(coalesce(item_payload ->> 'demo_url', '')),
        coalesce((item_payload ->> 'sort_order')::integer, 0)
      )
      on conflict (id) do update set
        name = excluded.name,
        description = excluded.description,
        repository_url = excluded.repository_url,
        demo_url = excluded.demo_url,
        sort_order = excluded.sort_order,
        updated_at = now()
      returning to_jsonb(projects) into saved_item;

      delete from public.project_technologies where project_id = requested_id;
      technology_position := 0;
      for raw_technology in
        select trim(value)
        from jsonb_array_elements_text(coalesce(item_payload -> 'technologies', '[]'::jsonb)) as value
        where trim(value) <> ''
      loop
        insert into public.technologies (name)
        values (raw_technology)
        on conflict (name) do update set name = excluded.name
        returning id into technology_id;

        insert into public.project_technologies (project_id, technology_id, position)
        values (requested_id, technology_id, technology_position);
        technology_position := technology_position + 1;
      end loop;

      if technology_position = 0 then
        raise exception 'El proyecto requiere al menos una tecnología';
      end if;

      saved_item := saved_item || jsonb_build_object(
        'technologies',
        (
          select jsonb_agg(technology.name order by link.position)
          from public.project_technologies as link
          join public.technologies as technology on technology.id = link.technology_id
          where link.project_id = requested_id
        )
      );

    when 'achievements' then
      insert into public.achievements (id, title, description, date, sort_order)
      values (
        requested_id,
        trim(item_payload ->> 'title'),
        trim(item_payload ->> 'description'),
        trim(coalesce(item_payload ->> 'date', '')),
        coalesce((item_payload ->> 'sort_order')::integer, 0)
      )
      on conflict (id) do update set
        title = excluded.title,
        description = excluded.description,
        date = excluded.date,
        sort_order = excluded.sort_order,
        updated_at = now()
      returning to_jsonb(achievements) into saved_item;

    when 'contact' then
      insert into public.contact (id, email, phone)
      values ('main', lower(trim(item_payload ->> 'email')), trim(item_payload ->> 'phone'))
      on conflict (id) do update set
        email = excluded.email,
        phone = excluded.phone,
        updated_at = now()
      returning to_jsonb(contact) into saved_item;

    else
      raise exception 'Entidad no permitida';
  end case;

  return saved_item;
end;
$$;

-- Ejecuta bajas solo sobre colecciones; el contacto principal no se puede eliminar.
create or replace function public.admin_delete_portfolio_item(
  access_secret text,
  entity_name text,
  item_payload jsonb
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_id uuid;
  deleted_item boolean := false;
begin
  if not public.verify_admin_access(access_secret) then
    raise exception 'Acceso administrativo denegado' using errcode = '42501';
  end if;

  requested_id := (item_payload ->> 'id')::uuid;

  case entity_name
    when 'skills' then
      delete from public.skills where id = requested_id;
      deleted_item := found;
    when 'experiences' then
      delete from public.experiences where id = requested_id;
      deleted_item := found;
    when 'projects' then
      delete from public.projects where id = requested_id;
      deleted_item := found;
      delete from public.technologies as technology
      where not exists (
        select 1 from public.project_technologies as link where link.technology_id = technology.id
      );
    when 'achievements' then
      delete from public.achievements where id = requested_id;
      deleted_item := found;
    else raise exception 'Entidad no permitida';
  end case;

  return deleted_item;
end;
$$;

revoke all on function public.verify_admin_access(text) from public;
revoke all on function public.admin_upsert_portfolio_item(text, text, jsonb) from public;
revoke all on function public.admin_delete_portfolio_item(text, text, jsonb) from public;
grant execute on function public.verify_admin_access(text) to anon, authenticated;
grant execute on function public.admin_upsert_portfolio_item(text, text, jsonb) to anon, authenticated;
grant execute on function public.admin_delete_portfolio_item(text, text, jsonb) to anon, authenticated;

-- Carga únicamente información real proporcionada en la consigna.
insert into public.skills (name, category, sort_order) values
  ('C++', 'Lenguaje', 1),
  ('HTML', 'Web', 2),
  ('CSS', 'Web', 3),
  ('JV', 'Lenguaje', 4),
  ('JVSC', 'Web', 5),
  ('Node.js', 'Tecnología', 6);

insert into public.experiences (role, company, description, period, sort_order) values
  ('Cajero', 'Empresa de Fotografía', 'Gestión integral de caja, arqueos y resúmenes diarios. Control de inventario y atención personalizada al cliente.', '', 1),
  ('Operario de mantenimiento y atención al cliente', 'Balneario Perla Norte', 'Atención al público, gestión de consultas y reclamos, control de inventario y mantenimiento preventivo y correctivo del predio.', '', 2),
  ('Repositor y control de stock', 'Supermercado', 'Recepción, control y reposición de mercadería; organización de góndolas y orientación a clientes.', '', 3),
  ('Desarrollo de software', 'Proyectos escolares', 'Desarrollo de proyectos durante la carrera técnica, con interés principal en front-end y diseño de interfaces.', 'Actualidad', 4);

do $$
declare
  seeded_project_id uuid;
  seeded_technology_id uuid;
  seeded_technology text;
  seeded_position smallint := 0;
begin
  insert into public.projects (name, description, sort_order)
  values ('Portfolio personal R4', 'Portfolio académico single-page con contenido administrable, persistencia SQL, animaciones y modo claro u oscuro.', 1)
  returning id into seeded_project_id;

  foreach seeded_technology in array array['React', 'Vite', 'Framer Motion', 'Supabase']
  loop
    insert into public.technologies (name) values (seeded_technology)
    returning id into seeded_technology_id;
    insert into public.project_technologies (project_id, technology_id, position)
    values (seeded_project_id, seeded_technology_id, seeded_position);
    seeded_position := seeded_position + 1;
  end loop;
end;
$$;

insert into public.contact (id, email, phone) values
  ('main', 'parrondonehuen@gmail.com', '2236965171');

-- Este archivo crea: tablas en 3FN, RLS, funciones ABM seguras y datos iniciales.
-- Se usa en: Supabase CLI o el editor SQL de Supabase.
-- Importa/usa: PostgreSQL y la extensión pgcrypto.
