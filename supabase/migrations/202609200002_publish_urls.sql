-- Registra las URLs definitivas obtenidas al publicar el proyecto.
update public.projects
set
  repository_url = 'https://github.com/nehuenparrondo/r4',
  demo_url = 'https://r4-theta.vercel.app',
  updated_at = now()
where name = 'Portfolio personal R4';

-- Este archivo actualiza: los enlaces públicos del proyecto R4 ya instalado.
-- Se usa en: Supabase CLI o el editor SQL de Supabase después de publicar.
-- Importa/usa: la tabla public.projects creada por la migración inicial.
