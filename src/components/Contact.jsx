import './Contact.scss'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'
import { useInquiry } from '../hooks/useInquiry'

const IconMail = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconWhatsApp = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function Contact({ variant = 'dev' }) {
  const { lang } = useLang()
  const { openInquiry } = useInquiry()

  const message = variant === 'editor'
    ? t(STRINGS.contact.editorMessage, lang)
    : t(STRINGS.contact.devMessage, lang)

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2 className="section-title">{t(STRINGS.contact.title, lang)}</h2>
        <div className="contact-content">
          <p className="contact-description">{message}</p>
          <div className="contact-methods">
            <a href="mailto:ishoil@icloud.com" className="contact-method">
              <span className="contact-icon" aria-hidden="true">{IconMail}</span>
              <div className="contact-details">
                <span className="contact-label">{t(STRINGS.contact.email, lang)}</span>
                <span className="contact-value">ishoil@icloud.com</span>
              </div>
              <span className="contact-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </span>
            </a>
            <a href="https://wa.me/2001123994906" className="contact-method" target="_blank" rel="noopener noreferrer">
              <span className="contact-icon" aria-hidden="true">{IconWhatsApp}</span>
              <div className="contact-details">
                <span className="contact-label">{t(STRINGS.contact.whatsapp, lang)}</span>
                <span className="contact-value">+20 011 2399 4906</span>
              </div>
              <span className="contact-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </span>
            </a>
          </div>
          {variant === 'editor' && (
            <button
              className="contact-hire-btn"
              onClick={() => openInquiry({ url: window.location.href, title: t(STRINGS.contact.title, lang) })}
            >
              {t(STRINGS.inquiry.title, lang)}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
