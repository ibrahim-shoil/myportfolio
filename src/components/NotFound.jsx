import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './NotFound.scss'

/**
 * Branded 404 — unknown routes land here instead of masquerading
 * as the landing picker. Bilingual (static, outside LanguageProvider).
 */
export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — Ibrahim A. Soliman'
    // Unknown URLs must not be indexed (they serve the SPA shell with a 200).
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => {
      document.title = 'Ibrahim A. Soliman'
      document.head.removeChild(meta)
    }
  }, [])

  return (
    <div className="notfound">
      <div className="notfound-bg" aria-hidden="true">
        <div className="notfound-grid" />
      </div>

      <div className="notfound-inner">
        <span className="notfound-kicker">404</span>
        <h1 className="notfound-title">This page does not exist</h1>
        <p className="notfound-title-ar" lang="ar" dir="rtl">هذه الصفحة غير موجودة</p>
        <p className="notfound-sub">
          The link may be broken or the page may have moved.
          <span lang="ar" dir="rtl"> قد يكون الرابط قديمًا أو أن الصفحة انتقلت إلى عنوان آخر.</span>
        </p>

        <div className="notfound-actions">
          <Link to="/" className="notfound-btn notfound-btn-primary">Home</Link>
          <Link to="/dev" className="notfound-btn">Developer</Link>
          <Link to="/editor/en" className="notfound-btn">Video Editor</Link>
        </div>
      </div>
    </div>
  )
}
