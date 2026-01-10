import './Hero.scss'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <h1 className="hero-title">
          Ibrahim A. Soliman
        </h1>
        <p className="hero-subtitle">
          Backend Engineer
        </p>
        <p className="hero-description">
          Building scalable systems, data pipelines, and automation tools.
          Focused on performance, reliability, and clean architecture.
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
