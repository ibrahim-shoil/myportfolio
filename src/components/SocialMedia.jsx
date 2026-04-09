import './SocialMedia.scss'

const channels = [
  {
    name: 'storBamin',
    tagline: 'Islamic Biography & History',
    description: 'Arabic documentary-style history channel focused on Islamic biography and early Islamic history, presenting major battles, companions, and pivotal moments through concise, cinematic storytelling.',
    color: '#e53e3e',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
      </svg>
    ),
    links: [
      {
        platform: 'YouTube',
        url: 'https://www.youtube.com/@storbamin',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        )
      },
      {
        platform: 'TikTok',
        url: 'https://www.tiktok.com/@storbamin',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        )
      }
    ]
  },
  {
    name: 'tecBamin',
    tagline: 'Tech Explained Simply',
    description: 'Arabic short-form tech channel that turns fast-moving topics like consumer technology, AI, digital trends, and gaming into clear, engaging, and accessible video storytelling.',
    color: '#3b82f6',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
      </svg>
    ),
    links: [
      {
        platform: 'YouTube',
        url: 'https://www.youtube.com/@tecbamin',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        )
      },
      {
        platform: 'TikTok',
        url: 'https://www.tiktok.com/@tecbamin',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        )
      }
    ]
  }
]

export default function SocialMedia() {
  return (
    <section id="social" className="social">
      <div className="social-container">
        <h2 className="section-title">Content Creation</h2>
        <div className="social-grid">
          {channels.map((channel) => (
            <a
              key={channel.name}
              href={channel.links[0].url}
              target="_blank"
              rel="noopener"
              className="social-card"
              style={{ '--channel-color': channel.color }}
            >
              <div className="social-card-header">
                <div className="social-card-icon">
                  {channel.icon}
                </div>
                <div className="social-card-title">
                  <h3>{channel.name}</h3>
                  <span className="social-tagline">{channel.tagline}</span>
                </div>
              </div>
              <p className="social-description">{channel.description}</p>
              <div className="social-platforms">
                {channel.links.map((link) => (
                  <span
                    key={link.platform}
                    className="social-platform-link"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      window.open(link.url, '_blank', 'noopener')
                    }}
                  >
                    {link.icon}
                    {link.platform}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
