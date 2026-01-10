import './About.scss'

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <h2 className="section-title">About</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Backend engineer focused on distributed systems, data pipelines, and automation.
              I build systems that scale, minimize complexity, and solve real problems.
            </p>
            <p>
              My engineering approach emphasizes reliability over cleverness, measurement before optimization,
              and automated solutions for repetitive tasks.
            </p>
            <div className="about-skills">
              <h3>Skills</h3>
              <div className="skills-grid">
                <div className="skill-item">
                  <h4>Backend</h4>
                  <p>Python, Node.js, Go, Flask, FastAPI, NestJS</p>
                </div>
                <div className="skill-item">
                  <h4>Databases</h4>
                  <p>PostgreSQL, MongoDB, Redis</p>
                </div>
                <div className="skill-item">
                  <h4>Data</h4>
                  <p>ETL pipelines, Web scraping, Automation</p>
                </div>
                <div className="skill-item">
                  <h4>DevOps</h4>
                  <p>Docker, Nginx, Linux, CI/CD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
