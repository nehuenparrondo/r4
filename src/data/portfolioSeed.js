export const PERSON_NAME = 'PARRONDO Nehuen'

export const portfolioSeed = {
  skills: [
    { id: 'skill-cpp', name: 'C++', category: 'Lenguaje' },
    { id: 'skill-html', name: 'HTML', category: 'Web' },
    { id: 'skill-css', name: 'CSS', category: 'Web' },
    { id: 'skill-jv', name: 'JV', category: 'Lenguaje' },
    { id: 'skill-jvsc', name: 'JVSC', category: 'Web' },
    { id: 'skill-node', name: 'Node.js', category: 'Tecnología' },
  ],
  experiences: [
    {
      id: 'experience-photo',
      role: 'Cajero',
      company: 'Empresa de Fotografía',
      description: 'Gestión integral de caja, arqueos y resúmenes diarios. Control de inventario y atención personalizada al cliente.',
      period: '',
    },
    {
      id: 'experience-perla',
      role: 'Operario de mantenimiento y atención al cliente',
      company: 'Balneario Perla Norte',
      description: 'Atención al público, gestión de consultas y reclamos, control de inventario y mantenimiento preventivo y correctivo del predio.',
      period: '',
    },
    {
      id: 'experience-market',
      role: 'Repositor y control de stock',
      company: 'Supermercado',
      description: 'Recepción, control y reposición de mercadería; organización de góndolas y orientación a clientes.',
      period: '',
    },
    {
      id: 'experience-software',
      role: 'Desarrollo de software',
      company: 'Proyectos escolares',
      description: 'Desarrollo de proyectos durante la carrera técnica, con interés principal en front-end y diseño de interfaces.',
      period: 'Actualidad',
    },
  ],
  projects: [
    {
      id: 'project-r4',
      name: 'Portfolio personal R4',
      description: 'Portfolio académico single-page con contenido administrable, persistencia SQL, animaciones y modo claro u oscuro.',
      technologies: ['React', 'Vite', 'Framer Motion', 'Supabase'],
      repository_url: 'https://github.com/nehuenparrondo/r4',
      demo_url: 'https://r4-theta.vercel.app',
    },
    {
      id: 'project-js5',
      name: 'APIs — Fetch, Axios, BBDD — JS5',
      description: 'Trabajo académico sobre consumo de APIs con Fetch y Axios, y conexión con bases de datos en JavaScript.',
      technologies: ['JavaScript', 'Fetch', 'Axios', 'Base de datos'],
      repository_url: 'https://github.com/nehuenparrondo/APIs---Fetch-Axios---BBDD---JS5',
      demo_url: '',
    },
    {
      id: 'project-njs3',
      name: 'Express y DHTML — NJS3',
      description: 'Trabajo académico de Express y DHTML desarrollado en el entorno de Node.js.',
      technologies: ['Node.js', 'Express', 'DHTML', 'JavaScript'],
      repository_url: 'https://github.com/nehuenparrondo/-Express-y-DHTML---NJS3...',
      demo_url: '',
    },
  ],
  achievements: [
    {
      id: 'achievement-expo-tec',
      title: 'Proyectos finales Expo Tec',
      description: 'Presentación de proyectos finales en Expo Tec.',
      date: '',
    },
    {
      id: 'achievement-games',
      title: 'Diseño de videojuegos Snake y Pac-Man',
      description: 'Diseño de los videojuegos Snake y Pac-Man.',
      date: '',
    },
    {
      id: 'achievement-newspapers',
      title: 'Diseño de diarios virtuales con fines escolares',
      description: 'Diseño de diarios virtuales realizados con fines escolares.',
      date: '',
    },
  ],
  contact: {
    id: 'main',
    email: 'parrondonehuen@gmail.com',
    phone: '2236965171',
  },
}

// Este archivo exporta: el nombre protegido y los datos iniciales reales del portfolio.
// Se usa en: Hero, el servicio local y los contextos de datos.
// Importa de: ninguna carpeta externa.
