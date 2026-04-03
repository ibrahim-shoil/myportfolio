import './About.scss'

export default function About() {
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
                <div className="skill-item">
                  <h4>Full Stack</h4>
                  <p>Python, Node.js, Go, Flask, FastAPI, NestJS, React, Next.js</p>
                </div>
                <div className="skill-item">
                  <h4>Databases</h4>
                  <p>MySQL, PostgreSQL, MongoDB, Redis</p>
                </div>
                <div className="skill-item">
                  <h4>DevOps</h4>
                  <p>Docker, Nginx, Linux, CI/CD, VPS deployment</p>
                </div>
                <div className="skill-item">
                  <h4>Web Scraping</h4>
                  <p>Data extraction, ETL pipelines, Clean data ready for use</p>
                </div>
                <div className="skill-item">
                  <h4>Mobile</h4>
                  <p>App Store & Google Play publishing</p>
                </div>
                <div className="skill-item">
                  <h4>Creative</h4>
                  <p>Premiere Pro, Photoshop, Storytelling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
