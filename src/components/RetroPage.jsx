import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './RetroPage.scss'
import videosData from '../../data/videos.json'

/**
 * Y2K-era (year 2000) light-mode skin of the editor portfolio.
 * A standalone experiment at /retro — deliberately outside the modern
 * design system (Cairo, tokens, dark mode). Everything is scoped under
 * .retro so nothing else on the site is affected.
 */
export default function RetroPage() {
  useEffect(() => {
    document.title = 'Ibrahim A. Soliman :: Video Editor - MY HOMEPAGE!!1'
    // Experiment page — keep it out of search results.
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => {
      document.title = 'Ibrahim A. Soliman'
      document.head.removeChild(meta)
    }
  }, [])

  const visitor = '0031642'.split('')

  return (
    <div className="retro2000">
      <div className="retro-page">
        {/* Browser chrome title bar, Windows 2000 style */}
        <div className="retro-titlebar">
          <span className="retro-titlebar-text">
            Ibrahim A. Soliman - Video Editor &amp; Motion Designer - Microsoft Internet Explorer
          </span>
          <span className="retro-titlebar-buttons" aria-hidden="true">
            <i /> <i /> <i className="retro-titlebar-close" />
          </span>
        </div>

        {/* Real address bar, because 2000 */}
        <div className="retro-addressbar">
          <span className="retro-address-label">Address</span>
          <span className="retro-address-field">http://www.ishoil.me/retro/index.htm</span>
        </div>

        <div className="retro-body">
          <marquee className="retro-marquee" scrollAmount="4">
            *** WELCOME TO MY HOMEPAGE !!! *** Best viewed at 800x600 *** Sign my guestbook before you leave *** NEW videos updated 15/08/2026 ***
          </marquee>

          {/* Under construction, as required by law in 2000 */}
          <div className="retro-construction" role="presentation">
            <span className="retro-construction-stripes" aria-hidden="true" />
            <span>THIS PAGE IS UNDER CONSTRUCTION !! PLEASE COME BACK LATER</span>
            <span className="retro-construction-stripes" aria-hidden="true" />
          </div>

          <table className="retro-table" cellSpacing={0}>
            <tbody>
              <tr>
                {/* Left nav cell */}
                <td className="retro-nav">
                  <p className="retro-nav-heading">:: MENU ::</p>
                  <ul className="retro-menu">
                    <li><a href="#top">Home</a></li>
                    <li><a href="#videos">My Videos</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#awards">My Awards</a></li>
                    <li><a href="#guestbook">Guestbook</a></li>
                    <li><Link to="/editor/en">Modern Site</Link></li>
                  </ul>
                  <hr />

                  <p className="retro-nav-heading">:: VISITORS ::</p>
                  <p className="retro-counter" aria-label="You are visitor number 31642">
                    {visitor.map((d, i) => <span key={i}>{d}</span>)}
                  </p>
                  <p className="retro-small">You are visitor no. 31642<br />since 01/01/2000!</p>
                  <hr />

                  <p className="retro-nav-heading">:: STATUS ::</p>
                  <p className="retro-small">
                    <span className="retro-led retro-led-on" aria-hidden="true" /> ONLINE on ICQ: 20491337<br />
                    <span className="retro-led" aria-hidden="true" /> MIDI music: OFF<br />
                    <span className="retro-led retro-led-on" aria-hidden="true" /> Accepting work: YES
                  </p>
                  <hr />

                  <p className="retro-nav-heading">:: LINKS ::</p>
                  <div className="retro-buttons" aria-hidden="true">
                    <span className="retro-8831">ISHOIL.ME</span>
                    <span className="retro-8831 retro-8831-html">HTML 4.01!</span>
                    <span className="retro-8831 retro-8831-any">ANY BROWSER</span>
                    <span className="retro-8831 retro-8831-flash">NO FLASH</span>
                  </div>
                  <p className="retro-small">Best viewed with<br />Internet Explorer 5.0<br />at 800 x 600</p>
                </td>

                {/* Main content cell */}
                <td className="retro-content" id="top">
                  <h1 className="retro-h1">~ Ibrahim A. Soliman ~</h1>
                  <p className="retro-arabic" dir="rtl" lang="ar">إبراهيم شعيل — مونتير فيديو ومصمم موشن جرافيك</p>
                  <p className="retro-intro">
                    Hi and welcome 2 my personal homepage!!! I am a <b>VIDEO EDITOR</b> and{' '}
                    <b>MOTION DESIGNER</b> from Egypt. I make edits, motion graphics, infographics
                    and animated maps 4 the web. I have been editing videos since forever and I use
                    Premiere + After Effects + Photoshop.
                  </p>
                  <p className="retro-intro">
                    If U like my work plz <a href="#guestbook">sign the guestbook</a> or{' '}
                    <a href="mailto:ishoil@icloud.com">email me</a>!! No spam plz.
                  </p>
                  <hr className="retro-hr" />

                  <h2 className="retro-h2" id="videos">:: MY LATEST VIDEOZ ::</h2>
                  <p className="retro-small">
                    Click a link 2 watch. (Tip: right click and &quot;Save Target As...&quot; 2 keep
                    the file on your computer!)
                  </p>
                  <table className="retro-filelist" cellSpacing={0}>
                    <thead>
                      <tr>
                        <th className="retro-fl-name">Name</th>
                        <th>Size</th>
                        <th>Date</th>
                        <th>Format</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videosData.slice().reverse().map((v, i) => (
                        <tr key={v.slug} className={i % 2 ? 'retro-fl-altrow' : ''}>
                          <td className="retro-fl-name">
                            <Link to={`/editor/en/v/${v.slug}`}>{v.title.en}</Link>
                            {v.featured && <b className="retro-new"> NEW!!</b>}
                          </td>
                          <td>{v.width && v.height ? `${Math.round(v.width / 3)}x${Math.round(v.height / 3)}` : 'n/a'}</td>
                          <td>15/08/06</td>
                          <td>MPG</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <hr className="retro-hr" />

                  <h2 className="retro-h2" id="services">:: SERVICES ::</h2>
                  <ul className="retro-list">
                    <li>Video editing &amp; montage (long &amp; short form)</li>
                    <li>Motion graphics + kinetic typography</li>
                    <li>Infographics &amp; animated maps</li>
                    <li>Thumbnails &amp; visual design</li>
                    <li>Scriptwriting &amp; research</li>
                  </ul>
                  <p className="retro-small">
                    Prices r negotiable!! Students get a discount LOL. Serious inquiries only plz.
                  </p>
                  <hr className="retro-hr" />

                  <h2 className="retro-h2" id="awards">:: MY AWARDS ::</h2>
                  <table className="retro-filelist" cellSpacing={0}>
                    <tbody>
                      <tr><td className="retro-fl-name">Editor of the Month</td><td>Web Ring of Editors</td><td>2001</td></tr>
                      <tr className="retro-fl-altrow"><td className="retro-fl-name">Cool Site of the Day</td><td>Geocities Picks</td><td>2000</td></tr>
                      <tr><td className="retro-fl-name">100% Handmade HTML</td><td>Notepad Only</td><td>forever</td></tr>
                    </tbody>
                  </table>
                  <hr className="retro-hr" />

                  <h2 className="retro-h2" id="guestbook">:: GUESTBOOK ::</h2>
                  <div className="retro-guestbook">
                    <p><b>Da7y7:</b> gr8 work bro!!1 where can i download the videos?? <span className="retro-small">(12/03/2001)</span></p>
                    <p><b>webmaster_2000:</b> cool page. plz add more GIFs. <span className="retro-small">(28/02/2001)</span></p>
                    <p><b>Mona:</b> nice editing!! greetz from Cairo <span className="retro-small">(14/01/2001)</span></p>
                  </div>
                  <p className="retro-small">
                    [<a href="#guestbook">Sign my guestbook</a>] &nbsp; [<a href="#guestbook">View old entries</a>]
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Webring + footer */}
          <div className="retro-webring">
            <b>The Video Editors Web Ring</b>
            <span>[ <a href="#top">&lt;&lt; Prev</a> ] [ <a href="#top">Random</a> ] [ <a href="#top">Next &gt;&gt;</a> ] [ <a href="#top">List Sites</a> ]</span>
          </div>

          <p className="retro-footer">
            This page hosted at ishoil.me &nbsp;|&nbsp; Last updated: 15 August 2026 &nbsp;|&nbsp;{' '}
            Copyright 2000-2026 Ibrahim A. Soliman &nbsp;|&nbsp; Made with Notepad
          </p>
          <p className="retro-footer retro-footer-back">
            [<Link to="/">Back 2 the modern site</Link>]
          </p>
        </div>
      </div>
    </div>
  )
}
