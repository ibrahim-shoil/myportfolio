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
  { title: 'Video & Motion', desc: 'Cinematic storytelling, short-form content, subtitling, motion graphics — full creative pipeline.', icon: 'video' },
  { title: 'Full Stack', desc: 'Python, Node.js, Go, Flask, FastAPI, NestJS, React, Next.js', icon: 'code' },
  { title: 'DevOps', desc: 'Docker, Nginx, Linux, CI/CD, VPS deployment', icon: 'devops' },
  { title: 'Databases', desc: 'MySQL, PostgreSQL, MongoDB, Redis', icon: 'database' },
  { title: 'Web Scraping', desc: 'Data extraction, ETL pipelines, clean data ready for use', icon: 'scrape' },
  { title: 'Mobile', desc: 'App Store & Google Play publishing', icon: 'mobile' },
  { title: 'Adobe Creative Cloud', desc: 'Premiere Pro, After Effects, Audition, Illustrator, Photoshop, Media Encoder, InDesign, Lightroom', icon: 'adobe' },
]

const VISIBLE_COUNT = 4

const PULL_QUOTES = [
  'Engineer by trade, storyteller by craft.',
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
              I&apos;m <strong>Ibrahim</strong> — a full-stack engineer, DevOps practitioner,
              and <strong>video editor who loves storytelling</strong>. I build scalable
              applications end-to-end, deploy production systems, and publish mobile apps to
              the App Store and Google Play.
            </p>
            <p>
              Beyond the code, I run two Arabic YouTube channels where I write, edit, and produce
              documentary-style content. The same engineering mindset — structure, precision,
              shipping — drives my editing. Whether it&apos;s a production backend or a 10-minute
              cinematic video, I treat both as systems worth perfecting.
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
