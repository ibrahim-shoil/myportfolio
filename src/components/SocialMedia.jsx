import './SocialMedia.scss'
import useScrollReveal from '../hooks/useScrollReveal'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'

const YouTubeIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)
const TikTokIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)
const FacebookIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

export default function SocialMedia() {
  const { lang } = useLang()
  const ref = useScrollReveal()

  const channels = [
    {
      name: 'storBamin',
      tagline: t(STRINGS.social.storBamin.tagline, lang),
      description: t(STRINGS.social.storBamin.description, lang),
      color: '#e53e3e',
      accent2: '#f6ad55',
      stats: [
        { label: t(STRINGS.social.youtube, lang), value: '—' },
        { label: t(STRINGS.social.niche, lang), value: t(STRINGS.social.documentary, lang) },
      ],
      featured: [
        { title: 'Featured video — swap with your real ID', videoId: null, thumb: 'storBamin' },
        { title: 'Featured video — swap with your real ID', videoId: null, thumb: 'storBamin-2' },
      ],
      links: [
        { platform: t(STRINGS.social.youtube, lang), url: 'https://www.youtube.com/@storbamin', icon: YouTubeIcon },
        { platform: lang === 'ar' ? 'تيك توك' : 'TikTok', url: 'https://www.tiktok.com/@storbamin', icon: TikTokIcon },
        { platform: lang === 'ar' ? 'فيسبوك' : 'Facebook', url: 'https://www.facebook.com/storbamin', icon: FacebookIcon },
      ],
    },
    {
      name: 'tecBamin',
      tagline: t(STRINGS.social.tecBamin.tagline, lang),
      description: t(STRINGS.social.tecBamin.description, lang),
      color: '#3b82f6',
      accent2: '#22d3ee',
      stats: [
        { label: t(STRINGS.social.youtube, lang), value: '—' },
        { label: t(STRINGS.social.format, lang), value: t(STRINGS.social.longForm, lang) },
      ],
      featured: [
        { title: 'Featured video — swap with your real ID', videoId: null, thumb: 'tecbamin' },
        { title: 'Featured video — swap with your real ID', videoId: null, thumb: 'tecbamin-2' },
      ],
      links: [
        { platform: t(STRINGS.social.youtube, lang), url: 'https://www.youtube.com/@tecbamin', icon: YouTubeIcon },
        { platform: lang === 'ar' ? 'تيك توك' : 'TikTok', url: 'https://www.tiktok.com/@tecbamin', icon: TikTokIcon },
        { platform: lang === 'ar' ? 'فيسبوك' : 'Facebook', url: 'https://www.facebook.com/tecBamin/', icon: FacebookIcon },
      ],
    },
  ]

  return (
    <section id="social" className="social">
      <div className="social-container" ref={ref}>
        <h2 className="section-title reveal-on-scroll">{t(STRINGS.social.title, lang)}</h2>
        <p className="social-intro reveal-on-scroll">
          {t(STRINGS.social.intro, lang)}
        </p>
        <div className="social-grid">
          {channels.map((channel, i) => (
            <article
              key={channel.name}
              className="social-card motion-surface reveal-on-scroll"
              style={{
                '--channel-color': channel.color,
                '--channel-color-2': channel.accent2,
                '--reveal-delay': `${i * 120}ms`,
              }}
            >
              <div className="social-card-header">
                <div className="social-card-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                </div>
                <div className="social-card-title">
                  <h3>{channel.name}</h3>
                  <span className="social-tagline">{channel.tagline}</span>
                </div>
              </div>

              <p className="social-description">{channel.description}</p>

              <div className="social-stats">
                {channel.stats.map(s => (
                  <div key={s.label} className="social-stat">
                    <span className="social-stat-value">{s.value}</span>
                    <span className="social-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="social-platforms">
                {channel.links.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-platform-link"
                  >
                    {link.icon}
                    <span>{link.platform}</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
