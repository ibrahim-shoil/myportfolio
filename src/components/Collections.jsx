import { useNavigate } from 'react-router-dom'
import './Collections.scss'
import useScrollReveal from '../hooks/useScrollReveal'
import collectionsData from '../../data/collections.json'
import videosData from '../../data/videos.json'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'
import { pick } from '../i18n/data'

export default function Collections() {
  const { lang } = useLang()
  const ref = useScrollReveal()
  const navigate = useNavigate()

  // Resolve each collection's video objects (skip missing slugs)
  const collections = collectionsData
    .map(c => ({
      ...c,
      resolvedVideos: c.videos
        .map(slug => videosData.find(v => v.slug === slug))
        .filter(Boolean),
    }))
    .filter(c => c.resolvedVideos.length > 0)

  if (collections.length === 0) return null

  return (
    <section id="series" className="series">
      <div className="series-container" ref={ref}>
        <span className="section-eyebrow reveal-on-scroll">{t(STRINGS.series.eyebrow, lang)}</span>
        <h2 className="section-title reveal-on-scroll">{t(STRINGS.series.title, lang)}</h2>
        <p className="series-intro reveal-on-scroll">
          {t(STRINGS.series.intro, lang)}
        </p>

        <div className="series-grid">
          {collections.map((collection, i) => (
            <button
              key={collection.slug}
              className="series-card motion-surface reveal-on-scroll"
              style={{ '--reveal-delay': `${i * 100}ms` }}
              onClick={() => navigate(`/editor/${lang}/c/${collection.slug}`)}
            >
              <div className="series-card-thumbs">
                {collection.resolvedVideos.slice(0, 4).map((v, idx) => (
                  <div key={v.slug} className={`series-card-thumb series-card-thumb-${idx}`}>
                    {v.poster ? (
                      <img src={v.poster} alt={pick(v.title, lang)} width={v.width} height={v.height} loading="lazy" />
                    ) : (
                      <div className="series-card-thumb-empty" />
                    )}
                  </div>
                ))}
                <div className="series-card-count">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  {collection.resolvedVideos.length} {t(STRINGS.series.videosCount, lang)}
                </div>
              </div>

              <div className="series-card-body">
                <h3>{pick(collection.title, lang)}</h3>
                <p>{pick(collection.description, lang)}</p>
                <span className="series-card-link">
                  {t(STRINGS.series.watchSeries, lang)}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
