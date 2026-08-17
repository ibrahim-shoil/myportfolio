import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import RetroChrome from './RetroChrome'
import toolsData from '../../data/tools.json'
import './ToolPage.scss'

/**
 * Public landing page for a downloadable After Effects script.
 * Data-driven from data/tools.json — the searchable, indexable surface
 * for the tools that ship as .jsx download chips on the dev profile.
 */
export default function ToolPage() {
  const { slug } = useParams()
  const tool = toolsData.find(t => t.slug === slug)

  const [count, setCount] = useState(null)

  useEffect(() => {
    if (!tool) return
    document.title = `${tool.titleSeo} | ishoil`
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', tool.descriptionSeo)
    let alive = true
    fetch('/api/downloads')
      .then(r => r.json())
      .then(counts => { if (alive) setCount(counts[tool.file] || 0) })
      .catch(() => {})
    return () => { alive = false }
  }, [tool])

  if (!tool) {
    return (
      <RetroChrome profile="dev" active="projects">
        <section className="rc-card">
          <h1 className="rc-h1">Tool not found</h1>
          <p className="tp-lede">
            That tool does not exist. <Link to="/dev">Back to the developer profile</Link>.
          </p>
        </section>
      </RetroChrome>
    )
  }

  const other = toolsData.find(t => t.slug !== slug)

  const handleDownload = () => {
    // No optimistic +1: the server dedupes repeat downloads per visitor,
    // so the count only moves when it was genuinely counted.
    fetch(`/api/downloads/${encodeURIComponent(tool.file)}`, { method: 'POST' })
      .then(r => r.json())
      .then(data => { if (data.counts) setCount(data.counts[tool.file]) })
      .catch(() => {})
  }

  return (
    <RetroChrome profile="dev" active="projects">
      {/* Hidden Arabic index for Arabic search (UI stays English) */}
      {tool.ar && (
        <div className="sr-ar" lang="ar" dir="rtl" aria-hidden="true">
          <h2>{tool.ar.title}</h2>
          <p>{tool.ar.description}</p>
        </div>
      )}

      <section className="rc-card tp-head">
        <p className="tp-crumb"><Link to="/dev">developer profile</Link> / free tools</p>
        <h1 className="tp-h1">
          {tool.name} <span className="tp-ver">v{tool.version}</span>
        </h1>
        <p className="tp-lede">{tool.tagline}</p>
        <div className="tp-head-actions">
          <a className="tp-dl" href={`/downloads/${tool.file}`} download onClick={handleDownload}>
            <span className="tp-dl-label">Download</span>
            <span className="tp-dl-file" dir="ltr">{tool.file}</span>
            <span className="tp-dl-size">{tool.size} — free</span>
          </a>
          {count !== null && count > 0 && (
            <span className="tp-count">{count} download{count === 1 ? '' : 's'}</span>
          )}
        </div>
        <p className="tp-req">{tool.requirements}</p>
      </section>

      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">What it does</span></h2>
        {tool.summary.map((p, i) => <p key={i} className="tp-text">{p}</p>)}
      </section>

      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Features</span></h2>
        <dl className="tp-features">
          {tool.features.map(f => (
            <div key={f.title} className="tp-feature">
              <dt>{f.title}</dt>
              <dd>{f.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="tp-two">
        <section className="rc-card">
          <h2 className="rc-h2"><span className="rc-h2-gloss">Install</span></h2>
          <ol className="tp-steps">
            {tool.install.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>
        <section className="rc-card">
          <h2 className="rc-h2"><span className="rc-h2-gloss">How it works</span></h2>
          <ol className="tp-steps">
            {tool.usage.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>
      </div>

      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Questions</span></h2>
        <dl className="tp-faq">
          {tool.faq.map(f => (
            <div key={f.q} className="tp-faq-item">
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rc-card tp-cta">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Rather not script it yourself?</span></h2>
        <p className="tp-text">
          I build caption and kinetic-type animations for clients full time.
          <Link to="/editor/en"> See the editing portfolio</Link> or
          <Link to="/dev"> request a custom tool</Link> built around your workflow.
        </p>
        {other && (
          <p className="tp-other">
            Also free: <Link to={`/dev/tools/${other.slug}`}>{other.name}</Link> — {other.tagline}
          </p>
        )}
      </section>
    </RetroChrome>
  )
}
