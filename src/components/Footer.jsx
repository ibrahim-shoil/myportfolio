import './Footer.scss'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Ibrahim A. Soliman. Full Stack Engineer & DevOps.</p>
        <div className="footer-links">
          <a href="mailto:ishoil@icloud.com">Email</a>
          <a href="https://wa.me/2001123994906" target="_blank" rel="noopener">WhatsApp</a>
          <a href="https://github.com/ibrahim-shoil" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.youtube.com/@storbamin" target="_blank" rel="noopener">storBamin</a>
          <a href="https://www.youtube.com/@tecbamin" target="_blank" rel="noopener">tecBamin</a>
          <a href="https://www.tiktok.com/@storbamin" target="_blank" rel="noopener">TikTok</a>
        </div>
      </div>
    </footer>
  )
}
