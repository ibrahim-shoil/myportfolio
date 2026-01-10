import './Projects.scss'

const PROJECTS = [
  {
    slug: 'tecbamin',
    name: 'Tecbamin',
    description: 'Arabic tech content platform with articles, phone database, and auto-scraping pipelines.',
    longDescription: 'Comprehensive Arabic tech platform featuring content aggregation, phone specifications database, automated article publishing, and SEO optimization.',
    problem: 'Managing Arabic tech content with real-time data from multiple sources',
    solution: 'Built Flask-based platform with automated scraping pipelines, MySQL database, and Redis caching',
    stack: ['Python', 'Flask', 'MySQL', 'Redis', 'SQLAlchemy', 'Gunicorn'],
    architecture: 'Flask backend with SQLAlchemy ORM. MySQL for database. Redis for caching and rate limiting. Automated scrapers for content ingestion. SEO optimization with structured data. Arabic content with RTL support.',
    link: 'https://tecbamin.com',
    featured: true
  },
  {
    slug: 'playcredits',
    name: 'PlayCredits',
    description: 'Game credits marketplace with bilingual support, payment integration, and admin panel.',
    longDescription: 'Modern marketplace for game credits with full Arabic/English support, Stripe integration, email notifications, and comprehensive admin dashboard.',
    problem: 'Secure digital credits distribution with fraud prevention and real-time tracking',
    solution: 'Developed full-stack marketplace with NestJS backend, Next.js frontend, and payment processing',
    stack: ['Next.js 14', 'NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'Stripe'],
    architecture: 'Next.js App Router with TypeScript frontend. NestJS backend with Prisma ORM. PostgreSQL for data persistence. Redis for caching. Stripe for payments. Resend for emails.',
    link: 'https://playcredits.com',
    featured: true
  },
  {
    slug: 'airbamin',
    name: 'Airbamin',
    description: 'Cross-platform file transfer app with P2P connections and licensing system.',
    longDescription: 'Desktop application enabling direct device-to-device file sharing without cloud dependencies. Features licensing system, gift codes, and automatic updates.',
    problem: 'File transfer without cloud storage with proper licensing and update management',
    solution: 'Built P2P file sharing with WebRTC, Flask licensing API, and desktop app deployment',
    stack: ['Go', 'WebRTC', 'Flask', 'SQLite', 'Python', 'STUN/TURN'],
    architecture: 'Go backend for signaling and connection management. WebRTC for peer-to-peer transfers. Flask API for licensing and updates. SQLite for local data storage. Cross-platform desktop app.',
    link: 'https://tecbamin.com/airbamin/en',
    featured: true
  },
  {
    slug: 'ishoil',
    name: 'ishoil.me',
    description: 'Personal portfolio with terminal interface and modern design.',
    longDescription: 'Professional portfolio website showcasing backend projects with both traditional navigation and interactive terminal interface.',
    problem: 'Portfolio site that demonstrates engineering capability without typical template aesthetics',
    solution: 'Built React portfolio with SCSS theming, dual navigation modes, and responsive design',
    stack: ['React', 'Vite', 'SCSS', 'Nginx'],
    architecture: 'React SPA with Vite build system. SCSS for styling with light/dark themes. Component-based architecture. Progressive enhancement for accessibility.',
    link: 'https://ishoil.me',
    featured: false
  }
]

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {PROJECTS.map(project => (
            <div
              key={project.slug}
              className={`project-card ${project.featured ? 'featured' : ''}`}
            >
              <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                {project.featured && <span className="project-badge">Featured</span>}
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-details">
                <div className="project-section">
                  <h4>Problem</h4>
                  <p>{project.problem}</p>
                </div>
                <div className="project-section">
                  <h4>Solution</h4>
                  <p>{project.solution}</p>
                </div>
                <div className="project-section">
                  <h4>Tech Stack</h4>
                  <div className="tech-stack">
                    {project.stack.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
              {project.link && (
                <a href={project.link} className="project-link" target="_blank" rel="noopener">
                  Visit {project.name} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
