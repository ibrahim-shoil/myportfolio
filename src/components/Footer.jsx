import { Link } from 'react-router-dom'
import './Footer.scss'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'

const IconMail = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
)
const IconWhatsApp = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
)
const IconGitHub = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
)

export default function Footer({ variant = 'dev' }) {
  const { lang } = useLang()

  const tagline = variant === 'editor'
    ? t(STRINGS.footer.editorTagline, lang)
    : t(STRINGS.footer.devTagline, lang)

  const homeLink = variant === 'editor' ? `/editor/${lang}` : '/dev'
  const name = t(STRINGS.name, lang)
  const rights = t(STRINGS.footer.rights, lang)

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to={homeLink} className="footer-logo">
            <img src="/is_logo.png" alt="IS" />
          </Link>
          <div className="footer-text">
            <span className="footer-name">{name}</span>
            <span className="footer-tagline">{tagline}</span>
          </div>
        </div>

        <div className="footer-links">
          <a href="mailto:ishoil@icloud.com" aria-label={t(STRINGS.footer.email, lang)}>
            {IconMail}
            <span>{t(STRINGS.footer.email, lang)}</span>
          </a>
          <a href="https://wa.me/2001123994906" target="_blank" rel="noopener noreferrer" aria-label={t(STRINGS.footer.whatsapp, lang)}>
            {IconWhatsApp}
            <span>{t(STRINGS.footer.whatsapp, lang)}</span>
          </a>
          <a href="https://github.com/ibrahim-shoil" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            {IconGitHub}
            <span>GitHub</span>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {name}. {rights}</p>
      </div>
    </footer>
  )
}
