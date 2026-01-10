import './Footer.scss'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Ibrahim A. Soliman. Backend Engineer.</p>
        <div className="footer-links">
          <a href="mailto:ishoil@icloud.com">Email</a>
          <a href="https://wa.me/2001123994906" target="_blank" rel="noopener">WhatsApp</a>
          <a href="https://github.com/ibrahim-shoil" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
