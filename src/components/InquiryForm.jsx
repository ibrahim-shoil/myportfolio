import { useState, useEffect, useCallback, useRef } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'
import { useInquiry } from '../hooks/useInquiry'
import {
  isValidEmail,
  isValidName,
  isValidPhone,
  makeInternationalPhone,
  normalizeCallingCode,
} from '../utils/inquiryValidation'
import './InquiryForm.scss'

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  )
}
function IconCheck() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  )
}
function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
  )
}

/**
 * Hire / service-request modal form.
 * Submits to POST /api/inquiry which forwards the message to Telegram.
 * Anti-bot: honeypot field + server-validated math challenge + rate limiting.
 *
 * The "source" (video/series the user clicked from) is auto-attached.
 * Controlled by the shared useInquiry() context.
 */
export default function InquiryForm() {
  const { lang } = useLang()

  // Form state
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [contactType, setContactType] = useState('email')
  const [callingCode, setCallingCode] = useState('+20')
  const [projectType, setProjectType] = useState('')
  const [projectMenuOpen, setProjectMenuOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — must stay empty

  // Challenge state
  const [challenge, setChallenge] = useState(null) // { question, nonce, sig }
  const [answer, setAnswer] = useState('')

  // Submission state
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({}) // { name: 'msg', contact: 'msg', ... }
  const projectMenuRef = useRef(null)

  // Read the shared inquiry context (open/close + source attachment).
  const { isOpen, closeInquiry, source } = useInquiry()

  // Fetch a fresh challenge when the modal opens
  useEffect(() => {
    if (!isOpen) return
    fetch('/api/inquiry/challenge')
      .then(r => r.json())
      .then(data => setChallenge(data))
      .catch(() => {})
  }, [isOpen])

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Keyboard: Escape to close
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeInquiry() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeInquiry])

  useEffect(() => {
    if (!projectMenuOpen) return
    const closeOnOutsideClick = (event) => {
      if (!projectMenuRef.current?.contains(event.target)) setProjectMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [projectMenuOpen])

  const reset = useCallback(() => {
    setName(''); setContact(''); setContactType('email'); setCallingCode('+20'); setProjectType(''); setMessage(''); setWebsite(''); setAnswer('')
    setStatus('idle'); setErrorMsg(''); setFieldErrors({})
  }, [])

  const handleClose = () => {
    closeInquiry()
    // Delay reset so the close animation isn't janky
    setTimeout(reset, 300)
  }

  // Clear a field error when the user edits it
  const clearFieldError = (field) => {
    if (fieldErrors[field]) setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation (mirrors server rules)
    const errs = {}
    if (!isValidName(name)) errs.name = t(STRINGS.inquiry.invalidName, lang)
    const submittedContact = contactType === 'email'
      ? contact.trim()
      : makeInternationalPhone(callingCode, contact)
    if (contactType === 'email' ? !isValidEmail(submittedContact) : !isValidPhone(submittedContact)) {
      errs.contact = t(STRINGS.inquiry.invalidContact, lang)
    }
    if (!message.trim() || message.trim().length < 10) errs.message = t(STRINGS.inquiry.required, lang)
    if (!challenge || !answer.trim()) errs.verify = t(STRINGS.inquiry.errorVerify, lang)
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      setStatus('error')
      return
    }

    setStatus('sending')
    setErrorMsg('')
    setFieldErrors({})

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: submittedContact,
          callingCode: contactType === 'phone' ? normalizeCallingCode(callingCode) : '',
          projectType: projectType,
          message: message.trim(),
          sourceUrl: source?.url || '',
          sourceTitle: source?.title || '',
          website, // honeypot
          challengeQuestion: challenge.question,
          challengeAnswer: parseInt(answer, 10),
          challengeNonce: challenge.nonce,
          challengeSig: challenge.sig,
        }),
      })
      const data = await res.json()

      if (res.ok && data.ok) {
        setStatus('success')
        setTimeout(() => { handleClose() }, 2500)
      } else if (res.status === 429) {
        setErrorMsg(t(STRINGS.inquiry.errorRate, lang))
        setStatus('error')
      } else if (data.errors && Array.isArray(data.errors)) {
        // Field-level validation errors from server
        const fe = {}
        data.errors.forEach(e => { if (e.field) fe[e.field] = e.message })
        setFieldErrors(fe)
        setStatus('error')
        // If verify failed, refresh the challenge
        if (fe.verify) {
          fetch('/api/inquiry/challenge').then(r => r.json()).then(setChallenge).catch(() => {})
          setAnswer('')
        }
      } else if (data.error && data.error.toLowerCase().includes('verif')) {
        setFieldErrors({ verify: t(STRINGS.inquiry.errorVerify, lang) })
        setStatus('error')
        fetch('/api/inquiry/challenge').then(r => r.json()).then(setChallenge).catch(() => {})
        setAnswer('')
      } else {
        setErrorMsg(t(STRINGS.inquiry.errorGeneric, lang))
        setStatus('error')
      }
    } catch {
      setErrorMsg(t(STRINGS.inquiry.errorGeneric, lang))
      setStatus('error')
    }
  }

  if (!isOpen) return null

  const s = STRINGS.inquiry

  return (
    <div className="iq-overlay" onClick={handleClose}>
      <div className="iq-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="iq-close" onClick={handleClose} aria-label="Close">
          <IconClose />
        </button>

        {status === 'success' ? (
          <div className="iq-success">
            <IconCheck />
            <p>{t(s.success, lang)}</p>
          </div>
        ) : (
          <form className="iq-form" onSubmit={handleSubmit}>
            <h2 className="iq-title">{t(s.title, lang)}</h2>
            <p className="iq-subtitle">{t(s.subtitle, lang)}</p>

            {source?.title && (
              <div className="iq-source">
                <span className="iq-source-label">{t(s.sourceRef, lang)}:</span>
                <span className="iq-source-title">{source.title}</span>
              </div>
            )}

            <div className="iq-field">
              <label htmlFor="iq-name">{t(s.name, lang)}</label>
              <input
                id="iq-name"
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); clearFieldError('name') }}
                placeholder={t(s.namePlaceholder, lang)}
                maxLength={100}
                required
                autoComplete="name"
                className={fieldErrors.name ? 'iq-input-error' : ''}
              />
              {fieldErrors.name && <span className="iq-field-error">{fieldErrors.name}</span>}
            </div>

            <div className="iq-field">
              <label htmlFor="iq-contact">{t(s.contact, lang)}</label>
              <div className="iq-contact-types" role="group" aria-label={t(s.contactMethod, lang)}>
                <button
                  type="button"
                  className={contactType === 'email' ? 'is-active' : ''}
                  onClick={() => { setContactType('email'); setContact(''); clearFieldError('contact') }}
                >
                  {t(s.email, lang)}
                </button>
                <button
                  type="button"
                  className={contactType === 'phone' ? 'is-active' : ''}
                  onClick={() => { setContactType('phone'); setContact(''); clearFieldError('contact') }}
                >
                  {t(s.whatsapp, lang)}
                </button>
              </div>
              {contactType === 'email' ? (
                <input
                  id="iq-contact"
                  type="email"
                  value={contact}
                  onChange={e => { setContact(e.target.value); clearFieldError('contact') }}
                  placeholder={t(s.emailPlaceholder, lang)}
                  maxLength={254}
                  required
                  autoComplete="email"
                  className={fieldErrors.contact ? 'iq-input-error' : ''}
                />
              ) : (
                <div className="iq-phone-row">
                  <input
                    className={`iq-country-code${fieldErrors.contact ? ' iq-input-error' : ''}`}
                    type="tel"
                    value={callingCode}
                    onChange={e => { setCallingCode(normalizeCallingCode(e.target.value)); clearFieldError('contact') }}
                    aria-label={t(s.countryCode, lang)}
                    title={t(s.countryCode, lang)}
                    maxLength={5}
                    inputMode="tel"
                    autoComplete="tel-country-code"
                    required
                  />
                  <input
                    id="iq-contact"
                    type="tel"
                    value={contact}
                    onChange={e => { setContact(e.target.value); clearFieldError('contact') }}
                    placeholder={t(s.phonePlaceholder, lang)}
                    maxLength={20}
                    required
                    inputMode="tel"
                    autoComplete="tel-national"
                    className={fieldErrors.contact ? 'iq-input-error' : ''}
                  />
                </div>
              )}
              {fieldErrors.contact && <span className="iq-field-error">{fieldErrors.contact}</span>}
            </div>

            <div className="iq-field">
              <label htmlFor="iq-type">{t(s.projectType, lang)}</label>
              <div
                className="iq-project-select"
                ref={projectMenuRef}
                onKeyDown={event => {
                  if (event.key === 'Escape' && projectMenuOpen) {
                    event.preventDefault()
                    event.stopPropagation()
                    setProjectMenuOpen(false)
                  }
                }}
              >
                <button
                  id="iq-type"
                  type="button"
                  className="iq-project-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={projectMenuOpen}
                  onClick={() => setProjectMenuOpen(open => !open)}
                  onKeyDown={event => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault()
                      setProjectMenuOpen(true)
                    }
                  }}
                >
                  <span>{projectType || t(s.projectTypePlaceholder, lang)}</span>
                  <IconChevron />
                </button>
                {projectMenuOpen && (
                  <div className="iq-project-options" role="listbox" aria-labelledby="iq-type">
                    {(s.projectTypeOptions[lang] || s.projectTypeOptions.en).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        role="option"
                        aria-selected={projectType === opt}
                        className={projectType === opt ? 'is-selected' : ''}
                        onClick={() => { setProjectType(opt); setProjectMenuOpen(false) }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="iq-field">
              <label htmlFor="iq-message">{t(s.message, lang)}</label>
              <textarea
                id="iq-message"
                value={message}
                onChange={e => { setMessage(e.target.value); clearFieldError('message') }}
                placeholder={t(s.messagePlaceholder, lang)}
                maxLength={2000}
                rows={4}
                required
                className={fieldErrors.message ? 'iq-input-error' : ''}
              />
              {fieldErrors.message && <span className="iq-field-error">{fieldErrors.message}</span>}
            </div>

            {/* Math challenge (anti-bot) */}
            <div className="iq-field iq-verify">
              <label htmlFor="iq-answer">
                {t(s.verifyQuestion, lang)} <strong>{challenge?.question}</strong>?
              </label>
              <input
                id="iq-answer"
                type="number"
                value={answer}
                onChange={e => { setAnswer(e.target.value); clearFieldError('verify') }}
                placeholder={t(s.verifyPlaceholder, lang)}
                required
                inputMode="numeric"
                className={fieldErrors.verify ? 'iq-input-error' : ''}
              />
              {fieldErrors.verify && <span className="iq-field-error">{fieldErrors.verify}</span>}
            </div>

            {/* Honeypot — hidden from humans, bots fill it */}
            <div className="iq-hp" aria-hidden="true">
              <label>Website (leave empty)<input type="text" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></label>
            </div>

            {status === 'error' && errorMsg && (
              <p className="iq-error">{errorMsg}</p>
            )}

            <button type="submit" className="iq-submit" disabled={status === 'sending'}>
              {status === 'sending' ? t(s.sending, lang) : t(s.submit, lang)}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
