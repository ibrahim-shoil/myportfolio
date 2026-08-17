import './StatsBand.scss'
import { useLang } from '../i18n/LanguageContext'
import { pick } from '../i18n/data'
import statsData from '../../data/stats.json'

/**
 * Credibility numbers under the editor hero — a quiet spec-line strip,
 * not a dashboard. Values live in data/stats.json, edit them there.
 */
export default function StatsBand() {
  const { lang } = useLang()

  return (
    <section className="stats-band" aria-label={lang === 'ar' ? 'أرقام' : 'Numbers'}>
      <div className="stats-band-inner">
        {statsData.stats.map(stat => (
          <div key={stat.id} className="stat-item">
            <span className="stat-value" dir="ltr">{stat.value}{stat.suffix}</span>
            <span className="stat-label">{pick(stat.label, lang)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
