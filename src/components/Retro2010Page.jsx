import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Retro2010Page.scss'

/**
 * 2010-era "coolest programmer" skin: Web 2.0 gloss, 960px grid, OS X
 * terminal, tag clouds, beta badges. Standalone test at /retro2010,
 * fully scoped under .r10 so nothing else is affected.
 */
export default function Retro2010Page() {
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
    <div className="r10">
      {/* Glossy black top bar, 2010 style */}
      <header className="r10-header">
        <div className="r10-wrap r10-header-in">
          <span className="r10-logo">
            ishoil<span className="r10-logo-dot">.me</span>
            <span className="r10-beta">beta</span>
          </span>
          <nav className="r10-nav">
            <a className="r10-tab r10-tab-active" href="#terminal">home</a>
            <a className="r10-tab" href="#projects">projects</a>
            <a className="r10-tab" href="#blog">blog</a>
            <a className="r10-tab" href="#lifestream">lifestream</a>
            <a className="r10-tab" href="#hire">hire me</a>
          </nav>
        </div>
      </header>

      <div className="r10-wrap r10-main">
        {/* Page title with the obligatory Web 2.0 gradient text */}
        <h1 className="r10-h1">
          Ibrahim Soliman <span className="r10-h1-sub">hacks code for a living</span>
        </h1>
        <p className="r10-tagline">
          Full-stack developer, DevOps guy, and part-time video editor.
          I ship Python, Node.js, React and Docker. This is my blog / portfolio /
          corner of the internet.
        </p>

        <div className="r10-columns">
          {/* Main column */}
          <div className="r10-content">
            {/* OS X terminal window */}
            <section className="r10-terminal" id="terminal">
              <div className="r10-term-bar">
                <span className="r10-light r10-light-red" />
                <span className="r10-light r10-light-yellow" />
                <span className="r10-light r10-light-green" />
                <span className="r10-term-title">ibrahim@macbook — bash — 80x24</span>
              </div>
              <pre className="r10-term-body">
                <span className="r10-dim">Last login: Sat Aug 15 05:42:00 on ttys001</span>
                {'\n'}
                <span className="r10-prompt">ibrahim@macbook ~ $</span> whoami{'\n'}
                full-stack engineer // devops // ae scripts{'\n'}
                <span className="r10-prompt">ibrahim@macbook ~ $</span> cat stack.txt{'\n'}
                python   node.js   react   docker   nginx{'\n'}
                <span className="r10-prompt">ibrahim@macbook ~ $</span> git push origin master{'\n'}
                Everything up-to-date. deployed in 4.2s{'\n'}
                <span className="r10-prompt">ibrahim@macbook ~ $</span> <span className="r10-cursor">&nbsp;</span>
              </pre>
            </section>

            {/* Projects */}
            <section className="r10-card" id="projects">
              <h2 className="r10-h2"><span className="r10-h2-gloss">Featured Projects</span></h2>
              <ul className="r10-posts">
                <li className="r10-post">
                  <div className="r10-post-meta">
                    <span className="r10-post-date">Aug 2010</span>
                    <span className="r10-post-comments">42 comments</span>
                  </div>
                  <h3 className="r10-post-title"><a href="#projects">This very portfolio, built with not much</a></h3>
                  <p>React app served by Nginx, download-counter sidecar in Express, deployed with PM2. Works on my machine AND on the server.</p>
                  <div className="r10-share">
                    <span className="r10-share-btn r10-share-digg">digg it</span>
                    <span className="r10-share-btn r10-share-tweet">tweet this</span>
                    <span className="r10-share-btn r10-share-hn">HN</span>
                  </div>
                </li>
                <li className="r10-post">
                  <div className="r10-post-meta">
                    <span className="r10-post-date">Jul 2010</span>
                    <span className="r10-post-comments">17 comments</span>
                  </div>
                  <h3 className="r10-post-title"><a href="#projects">After Effects scripts that do my repetitive work</a></h3>
                  <p>ExtendScript tools that automate the boring 80% of motion graphics. My render farm is a cron job and a dream.</p>
                  <div className="r10-share">
                    <span className="r10-share-btn r10-share-digg">digg it</span>
                    <span className="r10-share-btn r10-share-tweet">tweet this</span>
                    <span className="r10-share-btn r10-share-hn">HN</span>
                  </div>
                </li>
                <li className="r10-post">
                  <div className="r10-post-meta">
                    <span className="r10-post-date">Jun 2010</span>
                    <span className="r10-post-comments">9 comments</span>
                  </div>
                  <h3 className="r10-post-title"><a href="#projects">One server, zero excuses</a></h3>
                  <p>Docker, Nginx, HTTPS, monitoring, and a video pipeline with HTTP 206 range requests. The cloud is just someone else's Linux box.</p>
                  <div className="r10-share">
                    <span className="r10-share-btn r10-share-digg">digg it</span>
                    <span className="r10-share-btn r10-share-tweet">tweet this</span>
                    <span className="r10-share-btn r10-share-hn">HN</span>
                  </div>
                </li>
              </ul>
              <p className="r10-more">[ <a href="#projects">older posts</a> ]</p>
            </section>

            {/* Blog / subscribe */}
            <section className="r10-card" id="blog">
              <h2 className="r10-h2"><span className="r10-h2-gloss">From the Blog</span></h2>
              <ul className="r10-blogroll-list">
                <li><a href="#blog">Why I still use Vim (and you should too)</a> <span className="r10-post-date">Aug 12</span></li>
                <li><a href="#blog">HTML5 is ready. Your excuses are not.</a> <span className="r10-post-date">Aug 3</span></li>
                <li><a href="#blog">The definitive guide to git rebase</a> <span className="r10-post-date">Jul 27</span></li>
                <li><a href="#blog">jQuery plugins I actually use in 2010</a> <span className="r10-post-date">Jul 19</span></li>
              </ul>
              <div className="r10-rss">
                <span className="r10-rss-icon" aria-hidden="true">RSS</span>
                <span>Subscribe in Google Reader</span>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="r10-sidebar">
            <section className="r10-card" id="hire">
              <h2 className="r10-h2"><span className="r10-h2-gloss">About me</span></h2>
              <div className="r10-avatar-row">
                <span className="r10-avatar" aria-hidden="true">IS</span>
                <div>
                  <p className="r10-side-name">Ibrahim A. Soliman</p>
                  <p className="r10-side-loc">Cairo, Egypt</p>
                  <p className="r10-side-status"><span className="r10-status-dot" /> available for work</p>
                </div>
              </div>
              <a className="r10-btn-github" href="https://github.com/ibrahim-shoil">
                <span className="r10-github-mark" aria-hidden="true" />
                Follow me on GitHub
              </a>
              <a className="r10-btn-contact" href="#hire">Get in touch</a>
            </section>

            <section className="r10-card">
              <h2 className="r10-h2"><span className="r10-h2-gloss">Tag Cloud</span></h2>
              <p className="r10-cloud">
                <span className="r10-cloud-5">python</span>{' '}
                <span className="r10-cloud-3">docker</span>{' '}
                <span className="r10-cloud-4">node.js</span>{' '}
                <span className="r10-cloud-2">nginx</span>{' '}
                <span className="r10-cloud-5">react</span>{' '}
                <span className="r10-cloud-1">vim</span>{' '}
                <span className="r10-cloud-3">devops</span>{' '}
                <span className="r10-cloud-4">after effects</span>{' '}
                <span className="r10-cloud-2">linux</span>{' '}
                <span className="r10-cloud-3">ffmpeg</span>{' '}
                <span className="r10-cloud-1">cron</span>{' '}
                <span className="r10-cloud-4">premiere</span>
              </p>
            </section>

            <section className="r10-card" id="lifestream">
              <h2 className="r10-h2"><span className="r10-h2-gloss">Lifestream</span></h2>
              <ul className="r10-stream">
                <li><span className="r10-stream-src">github</span> pushed to <b>master</b> <span className="r10-post-date">2h ago</span></li>
                <li><span className="r10-stream-src r10-stream-tw">twitter</span> Deploying on a Friday. What could go wrong. <span className="r10-post-date">5h ago</span></li>
                <li><span className="r10-stream-src">last.fm</span> Daft Punk - Harder Better Faster Stronger <span className="r10-post-date">now</span></li>
                <li><span className="r10-stream-src">github</span> starred <b>html5-boilerplate</b> <span className="r10-post-date">1d ago</span></li>
              </ul>
            </section>

            <section className="r10-card">
              <h2 className="r10-h2"><span className="r10-h2-gloss">Blogroll</span></h2>
              <ul className="r10-blogroll">
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

      <footer className="r10-footer">
        <div className="r10-wrap">
          <div className="r10-badges" aria-hidden="true">
            <span className="r10-badge">HTML5</span>
            <span className="r10-badge r10-badge-css">CSS3</span>
            <span className="r10-badge r10-badge-jq">jQuery powered</span>
            <span className="r10-badge r10-badge-vim">made in Vim</span>
            <span className="r10-badge r10-badge-noie">works without IE6</span>
          </div>
          <p className="r10-footer-text">
            (c) 2010-2026 Ibrahim A. Soliman // valid HTML5 + CSS3 // 960gs //
            <Link to="/"> back to the modern site</Link> //
            <Link to="/retro"> see the 2000 version</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
