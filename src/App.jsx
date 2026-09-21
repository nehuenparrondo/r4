import { useState } from 'react'
import { CircleX, LoaderCircle } from 'lucide-react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { AdminPanel } from './components/admin/AdminPanel'
import { usePortfolioData } from './hooks/usePortfolioData'

/** Compone la única página y controla la apertura del panel administrativo. */
export default function App() {
  const [adminOpen, setAdminOpen] = useState(false)
  const { loading, error } = usePortfolioData()

  return (
    <>
      <Header onOpenAdmin={() => setAdminOpen(true)} />
      {loading && <div className="status-banner"><LoaderCircle className="spin" size={18} /> Actualizando contenido…</div>}
      {error && <div className="status-banner error" role="status"><CircleX size={18} /> {error}</div>}
      <main>
        <Hero />
        <div className="content-shell">
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </div>
      </main>
      <Footer />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  )
}

// Este archivo exporta: App.
// Se usa en: src/main.jsx.
// Importa de: componentes públicos, panel administrativo y usePortfolioData.
