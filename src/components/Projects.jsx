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
    description: 'Cross-platform file transfer: iPhone/Android to Windows with 70MB/s speeds. Working on iOS support and screen mirroring.',
    longDescription: 'Cross-platform file transfer application enabling direct mobile-to-PC file sharing without cloud storage. Published on Windows Store with 70MB/s transfer speeds.',
    problem: 'File transfer from iPhone/Android to Windows for 4K video editing was slow and consumed internet. Needed a fast, free, and private solution.',
    solution: 'Built cross-platform app using P2P technology. Enable mobile hotspot, connect PC, transfer files directly at 70MB/s. No internet, no cloud, 100% private.',
    stack: ['Java', 'JavaFX', 'P2P', 'HTTP Server', 'Hotspot Transfer', 'Windows Store', 'Android', 'iOS'],
    architecture: 'Java desktop app using JavaFX for UI. HTTP server for file serving. Direct P2P connection via mobile hotspot to PC. Supports iPhone and Android to Windows. Currently developing Android to iOS transfers and screen mirroring features.',
    link: 'https://tecbamin.com/airbamin/en',
    featured: true
  },
  {
    slug: 'ishoil',
    name: 'ishoil.me',
    description: 'Personal portfolio with terminal interface and modern design.',
    longDescription: 'Professional portfolio website showcasing full-stack projects with both traditional navigation and interactive terminal interface.',
    problem: 'Portfolio site that demonstrates full-stack engineering capability without typical template aesthetics',
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
