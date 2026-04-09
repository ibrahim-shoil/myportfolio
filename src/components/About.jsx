import { useState } from 'react'
import './About.scss'

const SKILLS = [
  { title: 'Full Stack', desc: 'Python, Node.js, Go, Flask, FastAPI, NestJS, React, Next.js' },
  { title: 'Databases', desc: 'MySQL, PostgreSQL, MongoDB, Redis' },
  { title: 'DevOps', desc: 'Docker, Nginx, Linux, CI/CD, VPS deployment' },
  { title: 'Web Scraping', desc: 'Data extraction, ETL pipelines, Clean data ready for use' },
  { title: 'Mobile', desc: 'App Store & Google Play publishing' },
  { title: 'Adobe Creative Cloud', desc: 'Premiere Pro, After Effects, Audition, Illustrator, Photoshop, Media Encoder, InDesign, Lightroom' },
  { title: 'Video & Motion', desc: 'Cinematic storytelling, Short-form content, Subtitling, Motion graphics' },
]

const VISIBLE_COUNT = 3

export default function About() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? SKILLS : SKILLS.slice(0, VISIBLE_COUNT)

  return (
    <section id="about" className="about">
      <div className="about-container">
        <h2 className="section-title">About</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Full Stack Engineer and DevOps with experience in deploying production systems and publishing mobile applications to Apple App Store and Google Play Store.
            </p>
            <p>
              My engineering approach emphasizes building complete solutions from frontend to deployment, ensuring reliability, scalability, and great user experience.
            </p>

            <div className="about-education">
              <h3>Education</h3>
              <div className="education-card">
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
                {visible.map(skill => (
                  <div key={skill.title} className="skill-item">
                    <h4>{skill.title}</h4>
                    <p>{skill.desc}</p>
                  </div>
                ))}
              </div>
              {SKILLS.length > VISIBLE_COUNT && (
                <button className="skills-toggle" onClick={() => setShowAll(prev => !prev)}>
                  {showAll ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
