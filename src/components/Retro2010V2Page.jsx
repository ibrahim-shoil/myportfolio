import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Retro2010V2Page.scss'

/**
 * 2010, refined: the SAME hierarchy the owner likes (glossy header + tabs,
 * hero + terminal, main + sidebar cards, badges footer) and the same color
 * family — executed with better contrast, spacing, and detail. English only.
 * Scoped under .r2. Test at /v2.
 */
export default function Retro2010V2Page() {
  useEffect(() => {
    document.title = 'ishoil // full-stack developer & devops'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => {
      document.title = 'Ibrahim A. Soliman'
      document.head.removeChild(meta)
    }
  }, [])

  return (
    <div className="r2">
      {/* Glossy black top bar — kept from 2010 */}
      <header className="r2-header">
        <div className="r2-wrap r2-header-in">
          <span className="r2-logo">
            ishoil<span className="r2-logo-dot">.me</span>
            <span className="r2-beta">beta</span>
          </span>
          <nav className="r2-nav">
            <a className="r2-tab r2-tab-active" href="#terminal">home</a>
            <a className="r2-tab" href="#projects">projects</a>
            <a className="r2-tab" href="#blog">blog</a>
            <a className="r2-tab" href="#lifestream">lifestream</a>
            <a className="r2-tab" href="#hire">hire me</a>
          </nav>
        </div>
      </header>

      <div className="r2-wrap r2-main">
        <h1 className="r2-h1">
          Ibrahim Soliman <span className="r2-h1-sub">hacks code for a living</span>
        </h1>
        <p className="r2-tagline">
          Full-stack developer, DevOps guy, and part-time video editor.
          I ship Python, Node.js, React and Docker. This is my blog / portfolio /
          corner of the internet.
        </p>

        <div className="r2-columns">
          {/* Main column */}
          <div className="r2-content">
            {/* OS X terminal — kept, executed sharper */}
            <section className="r2-terminal" id="terminal">
              <div className="r2-term-bar">
                <span className="r2-light r2-light-red" />
                <span className="r2-light r2-light-yellow" />
                <span className="r2-light r2-light-green" />
                <span className="r2-term-title">ibrahim@macbook — bash — 80x24</span>
              </div>
              <pre className="r2-term-body">
                <span className="r2-dim">Last login: Sat Aug 15 05:42:00 on ttys001</span>{'\n'}
                <span className="r2-prompt">ibrahim@macbook ~ $</span> whoami{'\n'}
                full-stack engineer // devops // ae scripts{'\n'}
                <span className="r2-prompt">ibrahim@macbook ~ $</span> cat stack.txt{'\n'}
                python   node.js   react   docker   nginx{'\n'}
                <span className="r2-prompt">ibrahim@macbook ~ $</span> git push origin master{'\n'}
                Everything up-to-date. deployed in 4.2s{'\n'}
                <span className="r2-prompt">ibrahim@macbook ~ $</span> <span className="r2-cursor">&nbsp;</span>
              </pre>
            </section>

            {/* Projects */}
            <section className="r2-card" id="projects">
              <h2 className="r2-h2"><span className="r2-h2-gloss">Featured Projects</span></h2>
              <ul className="r2-posts">
                <li className="r2-post">
                  <div className="r2-post-meta">
                    <span className="r2-post-date">Aug 2010</span>
                    <span className="r2-post-comments">42 comments</span>
                  </div>
                  <h3 className="r2-post-title"><a href="#projects">This very portfolio, built with not much</a></h3>
                  <p>React app served by Nginx, download-counter sidecar in Express, deployed with PM2. Works on my machine AND on the server.</p>
                  <div className="r2-share">
                    <span className="r2-share-btn r2-share-digg">digg it</span>
                    <span className="r2-share-btn r2-share-tweet">tweet this</span>
                    <span className="r2-share-btn r2-share-hn">HN</span>
                  </div>
                </li>
                <li className="r2-post">
                  <div className="r2-post-meta">
                    <span className="r2-post-date">Jul 2010</span>
                    <span className="r2-post-comments">17 comments</span>
                  </div>
                  <h3 className="r2-post-title"><a href="#projects">After Effects scripts that do my repetitive work</a></h3>
                  <p>ExtendScript tools that automate the boring 80% of motion graphics. My render farm is a cron job and a dream.</p>
                  <div className="r2-share">
                    <span className="r2-share-btn r2-share-digg">digg it</span>
                    <span className="r2-share-btn r2-share-tweet">tweet this</span>
                    <span className="r2-share-btn r2-share-hn">HN</span>
                  </div>
                </li>
                <li className="r2-post">
                  <div className="r2-post-meta">
                    <span className="r2-post-date">Jun 2010</span>
                    <span className="r2-post-comments">9 comments</span>
                  </div>
                  <h3 className="r2-post-title"><a href="#projects">One server, zero excuses</a></h3>
                  <p>Docker, Nginx, HTTPS, monitoring, and a video pipeline with HTTP 206 range requests. The cloud is just someone else's Linux box.</p>
                  <div className="r2-share">
                    <span className="r2-share-btn r2-share-digg">digg it</span>
                    <span className="r2-share-btn r2-share-tweet">tweet this</span>
                    <span className="r2-share-btn r2-share-hn">HN</span>
                  </div>
                </li>
              </ul>
              <p className="r2-more">[ <a href="#projects">older posts</a> ]</p>
            </section>

            {/* Blog */}
            <section className="r2-card" id="blog">
              <h2 className="r2-h2"><span className="r2-h2-gloss">From the Blog</span></h2>
              <ul className="r2-blogroll-list">
                <li><a href="#blog">Why I still use Vim (and you should too)</a> <span className="r2-post-date">Aug 12</span></li>
                <li><a href="#blog">HTML5 is ready. Your excuses are not.</a> <span className="r2-post-date">Aug 3</span></li>
                <li><a href="#blog">The definitive guide to git rebase</a> <span className="r2-post-date">Jul 27</span></li>
                <li><a href="#blog">jQuery plugins I actually use in 2010</a> <span className="r2-post-date">Jul 19</span></li>
              </ul>
              <div className="r2-rss">
                <span className="r2-rss-icon">RSS</span>
                <span>Subscribe in Google Reader</span>
              </div>
            </section>
          </div>

          {/* Sidebar — kept, tidier */}
          <aside className="r2-sidebar">
            <section className="r2-card" id="hire">
              <h2 className="r2-h2"><span className="r2-h2-gloss">About me</span></h2>
              <div className="r2-avatar-row">
                <span className="r2-avatar">IS</span>
                <div>
                  <p className="r2-side-name">Ibrahim A. Soliman</p>
                  <p className="r2-side-loc">Cairo, Egypt</p>
                  <p className="r2-side-status"><span className="r2-status-dot" /> available for work</p>
                </div>
              </div>
              <a className="r2-btn-github" href="https://github.com/ibrahim-shoil">
                <span className="r2-github-mark" aria-hidden="true" />
                Follow me on GitHub
              </a>
              <a className="r2-btn-contact" href="mailto:ishoil@icloud.com">Get in touch</a>
            </section>

            <section className="r2-card">
              <h2 className="r2-h2"><span className="r2-h2-gloss">Tag Cloud</span></h2>
              <p className="r2-cloud">
                <span className="r2-cloud-5">python</span>{' '}
                <span className="r2-cloud-3">docker</span>{' '}
                <span className="r2-cloud-4">node.js</span>{' '}
                <span className="r2-cloud-2">nginx</span>{' '}
                <span className="r2-cloud-5">react</span>{' '}
                <span className="r2-cloud-1">vim</span>{' '}
                <span className="r2-cloud-3">devops</span>{' '}
                <span className="r2-cloud-4">after effects</span>{' '}
                <span className="r2-cloud-2">linux</span>{' '}
                <span className="r2-cloud-3">ffmpeg</span>{' '}
                <span className="r2-cloud-1">cron</span>{' '}
                <span className="r2-cloud-4">premiere</span>
              </p>
            </section>

            <section className="r2-card" id="lifestream">
              <h2 className="r2-h2"><span className="r2-h2-gloss">Lifestream</span></h2>
              <ul className="r2-stream">
                <li><span className="r2-stream-src">github</span> pushed to <b>master</b> <span className="r2-post-date">2h ago</span></li>
                <li><span className="r2-stream-src r2-stream-tw">twitter</span> Deploying on a Friday. What could go wrong. <span className="r2-post-date">5h ago</span></li>
                <li><span className="r2-stream-src">last.fm</span> Daft Punk - Harder Better Faster Stronger <span className="r2-post-date">now</span></li>
                <li><span className="r2-stream-src">github</span> starred <b>html5-boilerplate</b> <span className="r2-post-date">1d ago</span></li>
              </ul>
            </section>

            <section className="r2-card">
              <h2 className="r2-h2"><span className="r2-h2-gloss">Blogroll</span></h2>
              <ul className="r2-blogroll">
                <li><a href="#lifestream">HN</a></li>
                <li><a href="#lifestream">smashing magazine</a></li>
                <li><a href="#lifestream">a list apart</a></li>
                <li><a href="#lifestream">css-tricks</a></li>
                <li><a href="#lifestream">webkit blog</a></li>
              </ul>
            </section>
          </aside>
        </div>
      </div>

      <footer className="r2-footer">
        <div className="r2-wrap">
          <div className="r2-badges" aria-hidden="true">
            <span className="r2-badge">HTML5</span>
            <span className="r2-badge r2-badge-css">CSS3</span>
            <span className="r2-badge r2-badge-jq">jQuery powered</span>
            <span className="r2-badge r2-badge-vim">made in Vim</span>
            <span className="r2-badge r2-badge-noie">works without IE6</span>
          </div>
          <p className="r2-footer-text">
            (c) 2010-2026 Ibrahim A. Soliman // valid HTML5 + CSS3 // 960gs //
            <Link to="/"> back to the modern site</Link> //
            <Link to="/retro"> see the 2000 version</Link> //
            <Link to="/retro2010"> see the original 2010</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
