import { useState } from 'react'
import './About.scss'
import useScrollReveal from '../hooks/useScrollReveal'

// Minimal line icons (consistent stroke style with the rest of the site)
const Icon = {
  video: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  code: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  devops: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  database: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  scrape: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  mobile: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>,
  adobe: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
}

const SKILLS = [
  { title: 'Full-Stack Engineering', desc: 'Python, Node.js, Go, Flask, FastAPI, NestJS, React, and Next.js across complete product builds.', icon: 'code' },
  { title: 'DevOps & Delivery', desc: 'Docker, Nginx, Linux, CI/CD, VPS operations, reverse proxies, and production deployment.', icon: 'devops' },
  { title: 'Data Systems', desc: 'PostgreSQL, MySQL, MongoDB, Redis, schema design, caching, and dependable data flows.', icon: 'database' },
  { title: 'Automation & ETL', desc: 'Data extraction, scheduled pipelines, content automation, and clean operational datasets.', icon: 'scrape' },
  { title: 'Mobile Publishing', desc: 'Preparing, releasing, and maintaining applications for the App Store, Google Play, and Windows Store.', icon: 'mobile' },
  { title: 'Video & Motion', desc: 'A complementary creative practice in editorial video, motion graphics, and visual storytelling.', icon: 'video' },
  { title: 'Creative Tooling', desc: 'Custom After Effects automation alongside Premiere Pro, Photoshop, Illustrator, and Audition.', icon: 'adobe' },
]

const VISIBLE_COUNT = 4

const PULL_QUOTES = [
  'Good engineering makes complex systems feel simple to the people using them.',
]

export default function About() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? SKILLS : SKILLS.slice(0, VISIBLE_COUNT)
  const ref = useScrollReveal()

  return (
    <section id="about" className="about" ref={ref}>
      <div className="about-container">
        <h2 className="section-title reveal-on-scroll">About</h2>
        <div className="about-content">
          <div className="about-text reveal-on-scroll">
            <p>
              I&apos;m <strong>Ibrahim A. Soliman</strong>, also known online as <strong>ishoil</strong>.
              I&apos;m a full-stack engineer who works across product architecture, backend services,
              frontend systems, deployment, and day-to-day production operations.
            </p>
            <p>
              I care about the entire delivery path: understanding the problem, choosing a maintainable
              architecture, building the product, shipping it safely, and keeping it observable after launch.
              My creative work in video and motion design strengthens the same skills I value in software:
              structure, clarity, pacing, and attention to detail.
            </p>

            <div className="about-quotes">
              {PULL_QUOTES.map(q => (
                <blockquote key={q} className="about-quote">{q}</blockquote>
              ))}
            </div>

            <div className="about-education">
              <h3>Education</h3>
              <div className="education-card motion-surface">
                <div className="education-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/></svg>
                </div>
                <div className="education-details">
                  <h4>Bachelor of Science in Special Mathematics</h4>
                  <p className="education-school">Al-Azhar University, Cairo, Egypt</p>
                  <p className="education-meta">
                    <span>October 2021 – June 2025</span>
                    <span className="education-grade">Grade: Good (70%)</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="about-skills">
              <h3>Skills</h3>
              <div className="skills-grid">
                {visible.map((skill, i) => (
                  <div
                    key={skill.title}
                    className="skill-item motion-surface reveal-on-scroll"
                    style={{ '--reveal-delay': `${i * 70}ms` }}
                  >
                    <span className="skill-icon" aria-hidden="true">{Icon[skill.icon]}</span>
                    <div>
                      <h4>{skill.title}</h4>
                      <p>{skill.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              {SKILLS.length > VISIBLE_COUNT && (
                <button className="skills-toggle" onClick={() => setShowAll(prev => !prev)}>
                  {showAll ? 'Show less' : `Show ${SKILLS.length - VISIBLE_COUNT} more`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
