import { useState, useEffect, useRef } from 'react'
import './Hero.scss'

const ROLES = ['Full-Stack Engineer', 'Backend Engineer', 'DevOps Engineer', 'Mobile App Developer']

const STATS = [
  { value: 7, suffix: '+', label: 'Products Built' },
  { value: 2, suffix: '', label: 'Apps Published' },
  { value: 3, suffix: '', label: 'Delivery Platforms' },
  { value: 24, suffix: '/7', label: 'Production Mindset' },
]

const STACK = ['Python', 'Node.js', 'React', 'Next.js', 'Docker', 'Nginx', 'PostgreSQL', 'Redis']

function useTypewriter(words, { typeSpeed = 90, deleteSpeed = 40, pause = 1600 } = {}) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('typing') // 'typing' | 'pausing' | 'deleting'

  useEffect(() => {
    if (words.length === 0) return
    const current = words[wordIndex % words.length]

    let delay = typeSpeed

    if (phase === 'typing') {
      if (text.length < current.length) {
        delay = typeSpeed
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), delay)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('pausing'), pause)
      return () => clearTimeout(t)
    }

    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('deleting'), pause)
      return () => clearTimeout(t)
    }

    // deleting
    if (text.length > 0) {
      delay = deleteSpeed
      const t = setTimeout(() => setText(current.slice(0, text.length - 1)), delay)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setPhase('typing')
      setWordIndex(i => i + 1)
    }, 0)
    return () => clearTimeout(t)
  }, [text, phase, wordIndex, words, typeSpeed, deleteSpeed, pause])

  return text
}

function useCountUp(target, inView, duration = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, inView, duration])

  return value
}

export default function Hero() {
  const typed = useTypewriter(ROLES)
  const statsRef = useRef(null)
  const [statsInView, setStatsInView] = useState(false)

  useEffect(() => {
    document.title = 'Ibrahim A. Soliman | Full-Stack & DevOps Engineer'
    return () => { document.title = 'Ibrahim A. Soliman' }
  }, [])

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
        <div className="hero-grid" />
      </div>

      <div className="hero-container">
        <div className="hero-status">
          <span aria-hidden="true" />
          Building reliable products from interface to infrastructure
        </div>
        <div className="hero-avatar">
          <div className="hero-avatar-ring" />
          <img src="/is_logo.png" alt="Ibrahim A. Soliman logo" width="1089" height="2037" />
        </div>

        <h1 className="hero-title">
          Ibrahim A. Soliman
        </h1>

        <p className="hero-rotator">
          <span className="hero-rotator-label">I&apos;m a </span>
          <span className="hero-rotator-text" aria-live="polite">
            {typed}
            <span className="hero-cursor" />
          </span>
        </p>

        <p className="hero-description">
          I design and ship full-stack products from architecture and backend APIs to
          polished interfaces, production deployment, observability, and mobile publishing.
          My focus is simple: systems that are clear to maintain and dependable in use.
        </p>

        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            View Projects
          </a>
          <a href="#about" className="btn btn-secondary">
            How I Work
          </a>
        </div>

        <div className="hero-stack" aria-label="Core technology stack">
          <span className="hero-stack-label">Core stack</span>
          <div>{STACK.map(item => <span key={item}>{item}</span>)}</div>
        </div>

        <div className="hero-stats" ref={statsRef}>
          {STATS.map((s, i) => (
            <Stat key={s.label} stat={s} inView={statsInView} delay={i * 120} />
          ))}
        </div>

        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </div>
    </section>
  )
}

function Stat({ stat, inView, delay }) {
  // Delay "in view" per-stat to create a staggered count-up
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setActive(true), delay)
    return () => clearTimeout(t)
  }, [inView, delay])
  const value = useCountUp(stat.value, active)
  return (
    <div className="hero-stat">
      <span className="hero-stat-value">{value}{stat.suffix}</span>
      <span className="hero-stat-label">{stat.label}</span>
    </div>
  )
}
