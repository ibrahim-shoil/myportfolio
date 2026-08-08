import { useState, useEffect, useCallback, useMemo } from 'react'
import './Gallery.scss'
import useScrollReveal from '../hooks/useScrollReveal'
import galleryData from '../../data/gallery.json'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'
import { pick } from '../i18n/data'

function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  )
}

export default function Gallery() {
  const { lang } = useLang()
  const ref = useScrollReveal()
  const categories = useMemo(
    () => ['All', ...new Set(galleryData.map(g => pick(g.category, lang)).filter(Boolean))],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  )
  const [filter, setFilter] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const items = useMemo(
    () => filter === 'All' ? galleryData : galleryData.filter(g => pick(g.category, lang) === filter),
    [filter, lang]
  )

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const showPrev = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i - 1 + items.length) % items.length))
  }, [items.length])

  const showNext = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i + 1) % items.length))
  }, [items.length])

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') showPrev()
      else if (e.key === 'ArrowRight') showNext()
    }
    document.addEventListener('keydown', onKey)
    // lock scroll while open
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, closeLightbox, showPrev, showNext])

  const hasItems = items.length > 0

  return (
    <section id="gallery" className="gallery">
      <div className="gallery-container" ref={ref}>
        <span className="section-eyebrow reveal-on-scroll">{t(STRINGS.gallery.eyebrow, lang)}</span>
        <h2 className="section-title reveal-on-scroll">{t(STRINGS.gallery.title, lang)}</h2>
        <p className="gallery-intro reveal-on-scroll">
          {t(STRINGS.gallery.intro, lang)}
        </p>

        {categories.length > 2 && (
          <div className="gallery-filters reveal-on-scroll">
            {categories.map(cat => (
              <button
                key={cat}
                className={`gallery-filter ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {hasItems ? (
          <div className="gallery-grid">
            {items.map((item, i) => (
              <button
                key={`${item.src}-${i}`}
                className="gallery-item reveal-on-scroll"
                style={{ '--reveal-delay': `${i * 60}ms` }}
                onClick={() => setLightboxIndex(i)}
                aria-label={`View ${pick(item.title, lang)}`}
              >
                <div className="gallery-thumb-wrap">
                  {item.src ? (
                    <img src={item.src} alt={pick(item.title, lang)} loading="lazy" />
                  ) : (
                    <div className="gallery-thumb-empty" />
                  )}
                </div>
                <div className="gallery-item-meta">
                  <span className="gallery-item-title">{pick(item.title, lang)}</span>
                  {item.category && <span className="gallery-item-cat">{pick(item.category, lang)}</span>}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="gallery-empty reveal-on-scroll">
            <p>{t(STRINGS.gallery.empty, lang)}</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button className="gallery-lb-close" onClick={closeLightbox} aria-label="Close">
            <IconClose />
          </button>

          {items.length > 1 && (
            <button
              className="gallery-lb-nav gallery-lb-prev"
              onClick={(e) => { e.stopPropagation(); showPrev() }}
              aria-label="Previous"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}

          <figure className="gallery-lb-figure" onClick={(e) => e.stopPropagation()}>
            {items[lightboxIndex].src ? (
              <img src={items[lightboxIndex].src} alt={pick(items[lightboxIndex].title, lang)} />
            ) : (
              <div className="gallery-thumb-empty gallery-lb-empty" />
            )}
            <figcaption>
              {pick(items[lightboxIndex].title, lang)}
              {items[lightboxIndex].category && (
                <span className="gallery-lb-cat"> · {pick(items[lightboxIndex].category, lang)}</span>
              )}
              {items.length > 1 && (
                <span className="gallery-lb-count">{lightboxIndex + 1} / {items.length}</span>
              )}
            </figcaption>
          </figure>

          {items.length > 1 && (
            <button
              className="gallery-lb-nav gallery-lb-next"
              onClick={(e) => { e.stopPropagation(); showNext() }}
              aria-label="Next"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}
        </div>
      )}
    </section>
  )
}
