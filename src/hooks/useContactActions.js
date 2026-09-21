import { useCallback, useEffect, useState } from 'react'

function isMobileDevice() {
  return typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

async function copyText(value) {
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

  const handleContact = useCallback(async (event, value, label) => {
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
