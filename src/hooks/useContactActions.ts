import { useCallback, useEffect, useState, type MouseEvent } from 'react'

/** Detecta dispositivos donde mailto y tel ofrecen una experiencia nativa útil. */
function isMobileDevice() {
  return typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/** Copia texto con Clipboard API y conserva un respaldo para navegadores antiguos. */
async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }
  const helper = document.createElement('textarea')
  helper.value = value
  helper.style.position = 'fixed'
  helper.style.opacity = '0'
  document.body.appendChild(helper)
  helper.select()
  document.execCommand('copy')
  helper.remove()
}

/** Mantiene enlaces nativos en móvil y ofrece una copia útil en computadoras. */
export function useContactActions() {
  const [feedback, setFeedback] = useState('')
  const mobileDevice = isMobileDevice()

  useEffect(() => {
    if (!feedback) return undefined
    const timeout = window.setTimeout(() => setFeedback(''), 3500)
    return () => window.clearTimeout(timeout)
  }, [feedback])

  /** Intercepta el enlace solamente en computadoras y comunica el resultado en pantalla. */
  const handleContact = useCallback(async (event: MouseEvent<HTMLAnchorElement>, value: string, label: string) => {
    if (mobileDevice) return
    event.preventDefault()
    try {
      await copyText(value)
      setFeedback(`${label} copiado. Ya podés pegarlo donde prefieras.`)
    } catch {
      setFeedback(`No se pudo copiar. Usá este dato: ${value}`)
    }
  }, [mobileDevice])

  return { feedback, handleContact }
}

// Este archivo exporta: useContactActions.
// Se usa en: Hero y Contact.
// Importa de: hooks nativos de React y APIs del navegador.
