# Portfolio personal — PARRONDO Nehuen

Portfolio académico de una sola página desarrollado con React. Presenta el perfil, habilidades, logros, experiencia laboral, proyectos y datos de contacto de **PARRONDO Nehuen**. Incluye un panel protegido para administrar el contenido y persistencia en PostgreSQL mediante Supabase.

> Estado de publicación: el código está listo para Git y Vercel, pero todavía no existe una URL pública porque no se proporcionaron cuentas ni credenciales externas. Los datos exactos pendientes se detallan en [Pendientes externos](#pendientes-externos).

## Requisitos cumplidos

- Componentes funcionales y estructura modular.
- Hooks nativos: `useState`, `useEffect`, `useContext`, `useMemo` y `useCallback`.
- Hooks propios: `useTheme`, `usePortfolioData`, `usePortfolioController` y `useScrollSpy`.
- Eventos reales en navegación, tema, formularios y ABM.
- Animaciones consistentes con Framer Motion y respeto por `prefers-reduced-motion`.
- Tema claro/oscuro persistido en `localStorage`.
- Diseño responsive para escritorio, tablet y celular.
- Alta, baja y modificación de habilidades, experiencias, proyectos y logros.
- Modificación de contacto con nombre expresamente excluido.
- PostgreSQL, Row Level Security y funciones RPC parametrizadas para escrituras.
- Validaciones equivalentes en interfaz y base de datos.
- Sanitización de texto antes de guardar y renderizado seguro de React.
- Modo local persistente para demostración cuando Supabase todavía no está configurado.
- ESLint, pruebas de validación y configuración para Vercel.

## Corrección de la consigna

La consigna menciona una vez a “Martín Porcelli” como nombre protegido, pero todos los datos personales corresponden a **PARRONDO Nehuen**. Se tomó esa mención como un error de copiado. El nombre visible y protegido es `PARRONDO Nehuen`: está definido fuera del modelo editable y no aparece en ningún formulario ni función de ABM.

## Tecnologías

- **Vite + React:** configuración simple, rápida y apropiada para una SPA académica.
- **Framer Motion:** animaciones declarativas coherentes con componentes React.
- **Supabase + PostgreSQL:** base relacional, API HTTPS, funciones RPC y RLS sin mantener un servidor propio.
- **DOMPurify:** eliminación de HTML no permitido antes de persistir entradas.
- **Lucide React:** iconografía accesible y consistente.
- **Vitest + ESLint:** comprobación de validaciones y calidad estática.

## Uso local

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

La aplicación abre en la dirección informada por Vite. Sin variables de Supabase funciona en **modo demostración local**. La primera vez que se abre “Administrar”, solicita crear una clave de al menos ocho caracteres. Esa clave se guarda como SHA-256 en el navegador y los registros se persisten en `localStorage`. Este modo sirve para probar la interfaz, pero no reemplaza PostgreSQL en producción.

Comprobaciones disponibles:

```bash
npm run test
npm run lint
npm run build
```

## Configuración de Supabase

1. Crear un proyecto en Supabase.
2. Ejecutar `supabase/migrations/202609200001_initial_portfolio.sql` desde el editor SQL o con Supabase CLI.
3. Elegir una clave administrativa propia y guardar únicamente su hash ejecutando en el editor SQL:

```sql
insert into private.admin_config (id, password_hash)
values (true, extensions.crypt('ELEGIR_UNA_CLAVE_SEGURA', extensions.gen_salt('bf')))
on conflict (id) do update set password_hash = excluded.password_hash;
```

4. Copiar `.env.example` como `.env` y completar:

```dotenv
VITE_SUPABASE_URL=https://PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=CLAVE_PUBLICA_ANON
VITE_PUBLIC_SITE_URL=https://DOMINIO_FINAL
```

La clave administrativa **no** se agrega al archivo `.env`: se envía al intentar editar y PostgreSQL la compara con el hash privado. La clave pública `anon` puede usarse en el navegador porque RLS bloquea toda escritura directa. Las altas, modificaciones y bajas solo pasan por funciones con `SECURITY DEFINER`, validación de entidad y contraseña.

## Modelo relacional y 3FN

El esquema contiene cinco relaciones independientes:

- `skills`: nombre, categoría y orden.
- `experiences`: rol, organización, descripción, período y orden.
- `projects`: nombre, descripción, enlaces y orden.
- `technologies`: catálogo sin duplicados de tecnologías.
- `project_technologies`: relación muchos-a-muchos entre proyectos y tecnologías.
- `achievements`: título, descripción, fecha y orden.
- `contact`: único registro principal con email y teléfono.

Cumplimiento de normalización:

- **1FN:** cada columna contiene un único valor atómico. Las tecnologías no se guardan como lista dentro de `projects`, sino como filas independientes.
- **2FN:** las tablas con clave simple dependen por completo de su `id`; en `project_technologies`, `position` depende de la clave compuesta completa.
- **3FN:** los atributos dependen únicamente de la clave de su tabla. El catálogo de tecnologías evita duplicación y la tabla puente resuelve la relación muchos-a-muchos sin dependencias transitivas.

## Seguridad

- Credenciales y URLs se leen desde variables de entorno excluidas por Git.
- RLS permite lectura pública y niega escrituras directas.
- Las operaciones de escritura usan RPC con parámetros y una lista cerrada de entidades; no concatenan SQL.
- El hash bcrypt se guarda en un esquema privado no expuesto por la API.
- Las restricciones `CHECK` replican límites críticos del front-end.
- DOMPurify elimina etiquetas HTML y React escapa texto al renderizar.
- Las URLs solo admiten protocolos `http` y `https`.
- La clave administrativa permanece en memoria durante la sesión del panel.
- Vercel y Supabase sirven el proyecto mediante HTTPS.

La protección por clave única es adecuada para esta entrega personal, pero no reemplaza un sistema de identidad, auditoría y rotación de credenciales en una aplicación multiusuario.

## Estructura

```text
src/
├── components/          Secciones públicas reutilizables
│   └── admin/           Panel, formularios y gestores ABM
├── context/             Providers de tema y contenido
├── data/                Datos iniciales reales y nombre protegido
├── hooks/               Hooks propios
├── services/            Adaptadores local y Supabase
├── styles/              Tema y diseño responsive
└── utils/               Sanitización y validaciones
supabase/
└── migrations/          Esquema, RLS, RPC y datos iniciales
public/                  Favicon y archivos públicos
```

Cada módulo relevante documenta qué exporta, dónde se usa y qué dependencias internas consume al final del archivo.

## Despliegue en Vercel

1. Crear un repositorio vacío en GitHub y subir este proyecto.
2. Importar el repositorio desde Vercel como proyecto Vite.
3. Cargar las tres variables indicadas en `.env.example`.
4. Ejecutar el despliegue y copiar la URL resultante en `VITE_PUBLIC_SITE_URL`.
5. Verificar lectura y las tres operaciones del ABM contra Supabase.

`vercel.json` mantiene el fallback de la SPA. No se incluyeron URLs ficticias de repositorio o publicación.

## Pendientes externos

Para completar la publicación real faltan únicamente datos o accesos que deben pertenecer al propietario:

- URL del proyecto Supabase y clave pública `anon`.
- Clave administrativa elegida por PARRONDO Nehuen y su hash cargado en Supabase.
- Cuenta o repositorio GitHub y su URL definitiva.
- Cuenta/proyecto de Vercel y URL definitiva del despliegue.
- Links reales de repositorios o demos de los proyectos, si existen.
- Archivo de foto personal y CV en PDF, si se desea mostrarlos; no se inventaron ni se agregaron placeholders falsos.

## Datos usados

Solo se cargó información incluida en la consigna. Las abreviaturas `JV` y `JVSC` se conservaron literalmente porque no se confirmó si corresponden a Java y JavaScript. Fechas, enlaces, instituciones y proyectos no informados se dejaron vacíos.
