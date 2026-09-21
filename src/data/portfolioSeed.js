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
      repository_url: '',
      demo_url: '',
    },
  ],
  achievements: [],
  contact: {
    id: 'main',
    email: 'parrondonehuen@gmail.com',
    phone: '2236965171',
  },
}

// Este archivo exporta: el nombre protegido y los datos iniciales reales del portfolio.
// Se usa en: Hero, el servicio local y los contextos de datos.
// Importa de: ninguna carpeta externa.
