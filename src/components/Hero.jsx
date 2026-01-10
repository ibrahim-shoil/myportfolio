import './Hero.scss'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <h1 className="hero-title">
          Ibrahim A. Soliman
        </h1>
        <p className="hero-subtitle">
          Full Stack Engineer & DevOps
        </p>
        <p className="hero-description">
          Building scalable full-stack applications, deploying production systems, and publishing apps to App Store and Google Play.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            View Projects
          </a>
          <a href="#contact" className="btn btn-secondary">
            Get in Touch
          </a>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </div>
    </section>
  )
}
