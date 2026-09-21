import { useEffect, useState } from 'react'
import { Database, LockKeyhole, LogOut, X } from 'lucide-react'
import { portfolioService } from '../../services/portfolioService'
import { EntityManager } from './EntityManager'
import { ContactForm } from './ContactForm'

const tabs = [
  ['skills', 'Habilidades'],
  ['experiences', 'Experiencias'],
  ['projects', 'Proyectos'],
  ['achievements', 'Logros'],
  ['contact', 'Contacto'],
]

/** Protege y agrupa todas las operaciones administrativas del portfolio. */
export function AdminPanel({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('skills')
  const [secret, setSecret] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [requiresSetup, setRequiresSetup] = useState(false)
  const [accessError, setAccessError] = useState('')

  useEffect(() => {
    if (open) portfolioService.getAdminState().then((state) => setRequiresSetup(state.requiresSetup))
  }, [open])

  useEffect(() => {
    document.body.classList.toggle('panel-open', open)
    return () => document.body.classList.remove('panel-open')
  }, [open])

  async function handleAccess(event) {
    event.preventDefault()
    setAccessError('')
    try {
      if (requiresSetup) {
        await portfolioService.configureLocalAdmin(secret)
        setRequiresSetup(false)
        setUnlocked(true)
        return
      }
      if (!(await portfolioService.verifyAdmin(secret))) {
        setAccessError('La clave ingresada no es correcta.')
        return
      }
      setUnlocked(true)
    } catch (error) {
      setAccessError(error.message || 'No se pudo validar el acceso.')
    }
  }

  function logout() {
    setUnlocked(false)
    setSecret('')
  }

  if (!open) return null

  return (
    <div className="admin-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="admin-panel" aria-label="Administración del portfolio">
        <div className="admin-header">
          <div><span>Panel privado</span><h2>Administración</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar panel"><X size={20} /></button>
        </div>

        {!unlocked ? (
          <form className="access-form" onSubmit={handleAccess}>
            <div className="access-icon"><LockKeyhole size={26} /></div>
            <h3>{requiresSetup ? 'Creá una clave local' : 'Acceso protegido'}</h3>
            <p>{requiresSetup ? 'Esta clave protege el modo de demostración en este dispositivo.' : 'Ingresá la clave administrativa para modificar el contenido.'}</p>
            <label><span>Clave de acceso</span><input type="password" value={secret} minLength="8" onChange={(event) => setSecret(event.target.value)} autoComplete="current-password" required /></label>
            {accessError && <p className="form-error" role="status">{accessError}</p>}
            <button className="button primary" type="submit">{requiresSetup ? 'Crear clave y entrar' : 'Ingresar'}</button>
          </form>
        ) : (
          <>
            <div className="admin-status">
              <span><Database size={16} /> {portfolioService.mode === 'supabase' ? 'Supabase PostgreSQL' : 'Demostración local'}</span>
              <button type="button" onClick={logout}><LogOut size={15} /> Salir</button>
            </div>
            <div className="admin-tabs" role="tablist" aria-label="Tipos de contenido">
              {tabs.map(([id, label]) => <button key={id} type="button" className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>{label}</button>)}
            </div>
            <div className="admin-content">
              {activeTab === 'contact' ? <ContactForm secret={secret} /> : <EntityManager entity={activeTab} secret={secret} />}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

// Este archivo exporta: AdminPanel.
// Se usa en: src/App.jsx.
// Importa de: React, Lucide, portfolioService y componentes administrativos.
