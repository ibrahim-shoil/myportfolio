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

function IconSendUp() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
  )
}

function IconCheckMark() {
  return (
    <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.4 4.4L19.5 6.8"/></svg>
  )
}

function StepIcon({ index, complete }) {
  if (complete) return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  if (index === 0) return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
  if (index === 1) return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 2v4M16 2v4M3 9h18M8 13h3M13 13h3M8 17h3"/></svg>
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>
}

const CALLING_CODES = [
  ['EG', '+20', 'Egypt', 'مصر', [10]], ['SA', '+966', 'Saudi Arabia', 'السعودية', [9]], ['AE', '+971', 'United Arab Emirates', 'الإمارات', [9]],
  ['KW', '+965', 'Kuwait', 'الكويت', [8]], ['QA', '+974', 'Qatar', 'قطر', [8]], ['BH', '+973', 'Bahrain', 'البحرين', [8]],
  ['OM', '+968', 'Oman', 'عُمان', [8]], ['JO', '+962', 'Jordan', 'الأردن', [9]], ['IQ', '+964', 'Iraq', 'العراق', [10]],
  ['PS', '+970', 'Palestine', 'فلسطين', [9]], ['LB', '+961', 'Lebanon', 'لبنان', [7, 8]], ['SY', '+963', 'Syria', 'سوريا', [9]],
  ['YE', '+967', 'Yemen', 'اليمن', [9]], ['SD', '+249', 'Sudan', 'السودان', [9]], ['LY', '+218', 'Libya', 'ليبيا', [9]],
  ['TN', '+216', 'Tunisia', 'تونس', [8]], ['DZ', '+213', 'Algeria', 'الجزائر', [9]], ['MA', '+212', 'Morocco', 'المغرب', [9]],
  ['US', '+1', 'United States / Canada', 'الولايات المتحدة / كندا', [10]], ['GB', '+44', 'United Kingdom', 'المملكة المتحدة', [10]],
  ['FR', '+33', 'France', 'فرنسا', [9]], ['DE', '+49', 'Germany', 'ألمانيا', [10, 11]], ['TR', '+90', 'Turkey', 'تركيا', [10]],
]

function normalizeLocalPhone(value) {
  return String(value || '').replace(/\D/g, '').replace(/^0+/, '')
}

function isValidCountryPhone(countryCode, value) {
  const country = CALLING_CODES.find(item => item[0] === countryCode)
  const length = normalizeLocalPhone(value).length
  return Boolean(country && country[4].includes(length))
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
  const [selectedCountryCode, setSelectedCountryCode] = useState('EG')
  const [step, setStep] = useState(0)
  const [countryMenuOpen, setCountryMenuOpen] = useState(false)
  const [deliverableLength, setDeliverableLength] = useState('')
  const [services, setServices] = useState([])
  const [assetStatus, setAssetStatus] = useState('')
  const [timeline, setTimeline] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [timelineNote, setTimelineNote] = useState('')
  const [budget, setBudget] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — must stay empty

  // Challenge state
  const [challenge, setChallenge] = useState(null) // { question, nonce, sig }
  const [answer, setAnswer] = useState('')

  // Submission state
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [sendPhase, setSendPhase] = useState('idle') // idle | primed | launching | complete | revealing | cancelled
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({}) // { name: 'msg', contact: 'msg', ... }
  const countryMenuRef = useRef(null)

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
    const scrollY = window.scrollY
    const previous = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      width: document.body.style.width,
    }

    // iOS Safari can still pan a body with overflow:hidden when a native form
    // control has a wide intrinsic size. Fixing the page prevents that pan and
    // leaves the overlay as the only scroll container.
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow = previous.overflow
      document.body.style.position = previous.position
      document.body.style.top = previous.top
      document.body.style.left = previous.left
      document.body.style.width = previous.width
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  // Keyboard: Escape to close
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeInquiry() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeInquiry])

  useEffect(() => {
    if (!countryMenuOpen) return
    const closeOnOutsideClick = (event) => {
      if (!countryMenuRef.current?.contains(event.target)) setCountryMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [countryMenuOpen])

  const reset = useCallback(() => {
    setName(''); setContact(''); setContactType('email'); setCallingCode('+20'); setSelectedCountryCode('EG'); setStep(0); setCountryMenuOpen(false); setDeliverableLength(''); setServices([]); setAssetStatus(''); setTimeline(''); setDeadlineDate(''); setTimelineNote(''); setBudget(''); setReferenceUrl(''); setMessage(''); setWebsite(''); setAnswer('')
    setStatus('idle'); setSendPhase('idle'); setErrorMsg(''); setFieldErrors({})
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

  const setLiveError = (field, message) => {
    setFieldErrors(previous => {
      const next = { ...previous }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  const validateNameNow = (value = name) => setLiveError('name', isValidName(value) ? '' : t(STRINGS.inquiry.invalidName, lang))
  const validateContactNow = (rawValue = contact) => {
    const localPhone = contactType === 'phone' ? normalizeLocalPhone(rawValue) : ''
    if (contactType === 'phone' && localPhone !== contact) setContact(localPhone)
    const value = contactType === 'email' ? String(rawValue).trim() : makeInternationalPhone(callingCode, localPhone)
    const valid = contactType === 'email'
      ? isValidEmail(value)
      : isValidPhone(value) && isValidCountryPhone(selectedCountryCode, localPhone)
    setLiveError('contact', valid ? '' : t(STRINGS.inquiry.invalidContact, lang))
  }
  const validateReferenceNow = (value = referenceUrl) => {
    const trimmed = value.trim()
    setLiveError('referenceUrl', !trimmed || /^https?:\/\/[^\s]+$/i.test(trimmed) ? '' : t(STRINGS.inquiry.invalidReference, lang))
  }

  const validateStep = (targetStep, includeChallenge = false) => {
    const errs = {}
    if (targetStep === 0) {
      if (!isValidName(name)) errs.name = t(STRINGS.inquiry.invalidName, lang)
      const submittedContact = contactType === 'email'
        ? contact.trim()
        : makeInternationalPhone(callingCode, contact)
      if (contactType === 'email' ? !isValidEmail(submittedContact) : !isValidPhone(submittedContact) || !isValidCountryPhone(selectedCountryCode, contact)) {
        errs.contact = t(STRINGS.inquiry.invalidContact, lang)
      }
    }
    if (targetStep === 1) {
      if (!deliverableLength) errs.deliverableLength = t(STRINGS.inquiry.required, lang)
      if (services.length === 0) errs.services = t(STRINGS.inquiry.chooseOne, lang)
      if (!assetStatus) errs.assetStatus = t(STRINGS.inquiry.required, lang)
    }
    if (targetStep === 2) {
      if (!timeline) errs.timeline = t(STRINGS.inquiry.required, lang)
      if (!budget) errs.budget = t(STRINGS.inquiry.required, lang)
      if (referenceUrl.trim() && !/^https?:\/\/[^\s]+$/i.test(referenceUrl.trim())) {
        errs.referenceUrl = t(STRINGS.inquiry.invalidReference, lang)
      }
      if (includeChallenge && (!challenge || !answer.trim())) errs.verify = t(STRINGS.inquiry.errorVerify, lang)
    }
    return errs
  }

  const goNext = () => {
    const errs = validateStep(step)
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})
    setStep(current => Math.min(2, current + 1))
  }

  const toggleService = (service) => {
    setServices(current => current.includes(service)
      ? current.filter(item => item !== service)
      : [...current, service])
    clearFieldError('services')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation (mirrors server rules)
    const errs = {
      ...validateStep(0),
      ...validateStep(1),
      ...validateStep(2, true),
    }
    const submittedContact = contactType === 'email'
      ? contact.trim()
      : makeInternationalPhone(callingCode, contact)
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      setStatus('error')
      if (errs.name || errs.contact) setStep(0)
      else if (errs.deliverableLength || errs.services || errs.assetStatus) setStep(1)
      else setStep(2)
      return
    }

    setStatus('sending')
    setSendPhase('primed')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSendPhase('launching'))
    })
    setErrorMsg('')
    setFieldErrors({})
    const launchAnimation = new Promise(resolve => setTimeout(resolve, 1100))

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: submittedContact,
          callingCode: contactType === 'phone' ? normalizeCallingCode(callingCode) : '',
          countryCode: contactType === 'phone' ? selectedCountryCode : '',
          projectType: services[0] || '',
          deliverableLength,
          services,
          assetStatus,
          timeline,
          deadlineDate,
          timelineNote: timelineNote.trim(),
          budget,
          referenceUrl: referenceUrl.trim(),
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
        await launchAnimation
        setStatus('success')
        setSendPhase('complete')
        setTimeout(() => setSendPhase('revealing'), 1050)
        setTimeout(() => { handleClose() }, 1720)
      } else if (res.status === 429) {
        setSendPhase('cancelled')
        setTimeout(() => setSendPhase('idle'), 650)
        setErrorMsg(t(STRINGS.inquiry.errorRate, lang))
        setStatus('error')
      } else if (data.errors && Array.isArray(data.errors)) {
        setSendPhase('cancelled')
        setTimeout(() => setSendPhase('idle'), 650)
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
        setSendPhase('cancelled')
        setTimeout(() => setSendPhase('idle'), 650)
        setFieldErrors({ verify: t(STRINGS.inquiry.errorVerify, lang) })
        setStatus('error')
        fetch('/api/inquiry/challenge').then(r => r.json()).then(setChallenge).catch(() => {})
        setAnswer('')
      } else {
        setSendPhase('cancelled')
        setTimeout(() => setSendPhase('idle'), 650)
        setErrorMsg(t(STRINGS.inquiry.errorGeneric, lang))
        setStatus('error')
      }
    } catch {
      setSendPhase('cancelled')
      setTimeout(() => setSendPhase('idle'), 650)
      setErrorMsg(t(STRINGS.inquiry.errorGeneric, lang))
      setStatus('error')
    }
  }

  if (!isOpen) return null

  const s = STRINGS.inquiry

  return (
    <>
      {sendPhase !== 'idle' && (
        <div className={`iq-send-screen is-${sendPhase}`} aria-hidden="true">
          <span className="iq-send-wave" />
          <span className="iq-send-flight"><IconSendUp /></span>
          <div className="iq-send-confirm">
            <span className="iq-send-confirm-ring"><IconCheckMark /></span>
            <strong>{t(s.success, lang)}</strong>
          </div>
        </div>
      )}
      <div className="iq-overlay" onClick={handleClose}>
        <div className={`iq-modal${sendPhase !== 'idle' ? ' is-dispatched' : ''}`} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="iq-close" onClick={handleClose} aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}>
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

            <div className="iq-stepper" style={{ '--iq-step': step }}>
              <span className="iq-stepper-line"><i /></span>
              {[s.steps.contact, s.steps.scope, s.steps.plan].map((label, index) => (
                <button
                  key={index}
                  type="button"
                  className={index === step ? 'is-active' : index < step ? 'is-complete' : ''}
                  onClick={() => { if (index < step) { setFieldErrors({}); setStep(index) } }}
                >
                  <span><StepIcon index={index} complete={index < step} /></span>
                  <small>{t(label, lang)}</small>
                </button>
              ))}
            </div>

            <div className={`iq-step-panel iq-step-panel-${step}`} key={step}>
              {step === 0 && (
                <>
                  <div className="iq-field">
                    <label htmlFor="iq-name">{t(s.name, lang)}</label>
                    <input id="iq-name" type="text" value={name} onChange={e => { setName(e.target.value); if (fieldErrors.name) validateNameNow(e.target.value) }} onBlur={e => validateNameNow(e.target.value)} placeholder={t(s.namePlaceholder, lang)} maxLength={100} autoComplete="name" className={fieldErrors.name ? 'iq-input-error' : name && isValidName(name) ? 'iq-input-valid' : ''} />
                    {fieldErrors.name && <span className="iq-field-error">{fieldErrors.name}</span>}
                  </div>

                  <div className="iq-field">
                    <label htmlFor="iq-contact">{t(s.contact, lang)}</label>
                    <div className={`iq-contact-types is-${contactType}`} role="group" aria-label={t(s.contactMethod, lang)}>
                      <button type="button" className={contactType === 'email' ? 'is-active' : ''} onClick={() => { setContactType('email'); setContact(''); clearFieldError('contact') }}>{t(s.email, lang)}</button>
                      <button type="button" className={contactType === 'phone' ? 'is-active' : ''} onClick={() => { setContactType('phone'); setContact(''); clearFieldError('contact') }}>{t(s.whatsapp, lang)}</button>
                    </div>
                    {contactType === 'email' ? (
                      <input id="iq-contact" dir="ltr" type="email" value={contact} onChange={e => { setContact(e.target.value); if (fieldErrors.contact) setLiveError('contact', isValidEmail(e.target.value) ? '' : t(s.invalidContact, lang)) }} onBlur={validateContactNow} placeholder={t(s.emailPlaceholder, lang)} maxLength={254} autoComplete="email" className={fieldErrors.contact ? 'iq-input-error' : contact && isValidEmail(contact) ? 'iq-input-valid' : ''} />
                    ) : (
                      <div className="iq-phone-row">
                        <div className="iq-country-select" ref={countryMenuRef}>
                          <button type="button" className="iq-country-trigger" onClick={() => setCountryMenuOpen(open => !open)} aria-haspopup="listbox" aria-expanded={countryMenuOpen} aria-label={t(s.chooseCountry, lang)}>
                            <span dir="ltr">{CALLING_CODES.find(item => item[1] === callingCode)?.[0] || ''} {callingCode}</span><IconChevron />
                          </button>
                          {countryMenuOpen && (
                            <div className="iq-country-options" role="listbox">
                              {CALLING_CODES.map(([code, dial, enName, arName]) => (
                                <button key={`${code}-${dial}`} type="button" role="option" aria-selected={selectedCountryCode === code} className={selectedCountryCode === code ? 'is-selected' : ''} onClick={() => { setCallingCode(dial); setSelectedCountryCode(code); setCountryMenuOpen(false); clearFieldError('contact') }}>
                                  <span>{lang === 'ar' ? arName : enName}</span><strong dir="ltr">{code} {dial}</strong>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input id="iq-contact" dir="ltr" type="tel" value={contact} onChange={e => { setContact(e.target.value); if (fieldErrors.contact) setLiveError('contact', isValidCountryPhone(selectedCountryCode, e.target.value) ? '' : t(s.invalidContact, lang)) }} onBlur={e => validateContactNow(e.target.value)} placeholder={t(s.phonePlaceholder, lang)} maxLength={20} inputMode="tel" autoComplete="tel-national" className={fieldErrors.contact ? 'iq-input-error' : contact && isValidPhone(makeInternationalPhone(callingCode, contact)) && isValidCountryPhone(selectedCountryCode, contact) ? 'iq-input-valid' : ''} />
                      </div>
                    )}
                    {fieldErrors.contact && <span className="iq-field-error">{fieldErrors.contact}</span>}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="iq-field">
                    <label>{t(s.length, lang)}</label>
                    <div className="iq-choice-grid iq-choice-grid-2">
                      {s.lengthOptions[lang].map(option => <button key={option} type="button" className={deliverableLength === option ? 'iq-choice is-active' : 'iq-choice'} onClick={() => { setDeliverableLength(option); clearFieldError('deliverableLength') }}>{option}</button>)}
                    </div>
                    {fieldErrors.deliverableLength && <span className="iq-field-error">{fieldErrors.deliverableLength}</span>}
                  </div>

                  <div className="iq-field">
                    <label>{t(s.services, lang)} <small>{services.length} {t(s.selectedCount, lang)}</small></label>
                    <div className="iq-choice-grid iq-choice-grid-3">
                      {s.serviceOptions[lang].map(option => <button key={option} type="button" className={services.includes(option) ? 'iq-choice is-active' : 'iq-choice'} onClick={() => toggleService(option)}>{option}</button>)}
                    </div>
                    {fieldErrors.services && <span className="iq-field-error">{fieldErrors.services}</span>}
                  </div>

                  <div className="iq-field">
                    <label>{t(s.assets, lang)}</label>
                    <div className="iq-choice-grid iq-choice-grid-3">
                      {s.assetOptions[lang].map(option => <button key={option} type="button" className={assetStatus === option ? 'iq-choice is-active' : 'iq-choice'} onClick={() => { setAssetStatus(option); clearFieldError('assetStatus') }}>{option}</button>)}
                    </div>
                    {fieldErrors.assetStatus && <span className="iq-field-error">{fieldErrors.assetStatus}</span>}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="iq-brief-summary">
                    <span>{deliverableLength}</span><span>{services.length} {t(s.selectedCount, lang)}</span><span>{assetStatus}</span>
                  </div>
                  <div className="iq-field">
                    <label>{t(s.timeline, lang)}</label>
                    <div className="iq-choice-grid iq-choice-grid-2">
                      {s.timelineOptions[lang].map(option => <button key={option} type="button" className={timeline === option ? 'iq-choice is-active' : 'iq-choice'} onClick={() => { setTimeline(option); clearFieldError('timeline') }}>{option}</button>)}
                    </div>
                    {fieldErrors.timeline && <span className="iq-field-error">{fieldErrors.timeline}</span>}
                  </div>
                  <div className="iq-field iq-deadline-fields">
                    <div>
                      <label htmlFor="iq-deadline-date">{t(s.deadlineDate, lang)} <small>{t(s.optional, lang)}</small></label>
                      <input id="iq-deadline-date" dir="ltr" type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="iq-timeline-note">{t(s.timelineNote, lang)} <small>{t(s.optional, lang)}</small></label>
                      <input id="iq-timeline-note" type="text" value={timelineNote} onChange={e => setTimelineNote(e.target.value)} placeholder={t(s.timelineNotePlaceholder, lang)} maxLength={200} />
                    </div>
                  </div>
                  <div className="iq-field">
                    <label>{t(s.budget, lang)}</label>
                    <div className="iq-choice-grid iq-choice-grid-budget">
                      {s.budgetOptions[lang].map(option => <button key={option} type="button" className={budget === option ? 'iq-choice is-active' : 'iq-choice'} onClick={() => { setBudget(option); clearFieldError('budget') }}>{option}</button>)}
                    </div>
                    {fieldErrors.budget && <span className="iq-field-error">{fieldErrors.budget}</span>}
                  </div>
                  <div className="iq-field">
                    <label htmlFor="iq-reference">{t(s.reference, lang)} <small>{t(s.optional, lang)}</small></label>
                    <input id="iq-reference" dir="ltr" type="url" value={referenceUrl} onChange={e => { setReferenceUrl(e.target.value); if (fieldErrors.referenceUrl) validateReferenceNow(e.target.value) }} onBlur={e => validateReferenceNow(e.target.value)} placeholder={t(s.referencePlaceholder, lang)} maxLength={500} className={fieldErrors.referenceUrl ? 'iq-input-error' : referenceUrl ? 'iq-input-valid' : ''} />
                    {fieldErrors.referenceUrl && <span className="iq-field-error">{fieldErrors.referenceUrl}</span>}
                  </div>
                  <div className="iq-field">
                    <label htmlFor="iq-message">{t(s.message, lang)} <small>{t(s.optional, lang)}</small></label>
                    <p className="iq-field-hint">{t(s.briefHint, lang)}</p>
                    <textarea id="iq-message" value={message} onChange={e => { setMessage(e.target.value); clearFieldError('message') }} placeholder={t(s.messagePlaceholder, lang)} maxLength={2000} rows={5} className={fieldErrors.message ? 'iq-input-error' : ''} />
                  </div>
                  <div className="iq-field iq-verify">
                    <label htmlFor="iq-answer">{t(s.verifyQuestion, lang)} <strong>{challenge?.question}</strong>?</label>
                    <input id="iq-answer" type="number" value={answer} onChange={e => { setAnswer(e.target.value); clearFieldError('verify') }} placeholder={t(s.verifyPlaceholder, lang)} inputMode="numeric" className={fieldErrors.verify ? 'iq-input-error' : ''} />
                    {fieldErrors.verify && <span className="iq-field-error">{fieldErrors.verify}</span>}
                  </div>
                </>
              )}
            </div>

            {/* Honeypot — hidden from humans, bots fill it */}
            <div className="iq-hp" aria-hidden="true">
              <label>Website (leave empty)<input type="text" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></label>
            </div>

            {status === 'error' && errorMsg && (
              <p className="iq-error">{errorMsg}</p>
            )}

            <div className="iq-form-actions">
              {step > 0 && <button type="button" className="iq-back" onClick={() => { setFieldErrors({}); setStep(current => current - 1) }}>{t(s.back, lang)}</button>}
              {step < 2 ? (
                <button type="button" className="iq-submit" onClick={goNext}>{t(s.next, lang)}</button>
              ) : (
                <button type="submit" className={`iq-submit${status === 'sending' ? ' is-sending' : ''}`} disabled={status === 'sending'}>
                  {status === 'sending' && <span className="iq-submit-loader" aria-hidden="true"><i /><i /><i /></span>}
                  <span>{status === 'sending' ? t(s.sending, lang) : t(s.submit, lang)}</span>
                </button>
              )}
            </div>
          </form>
        )}
        </div>
      </div>
    </>
  )
}
