import './Contact.scss'

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2 className="section-title">Contact</h2>
        <div className="contact-content">
          <p className="contact-description">
            Available for full-stack projects, DevOps, and mobile app publishing.
          </p>
          <div className="contact-methods">
            <a href="mailto:ishoil@icloud.com" className="contact-method">
              <span className="contact-icon">@</span>
              <div className="contact-details">
                <span className="contact-label">Email</span>
                <span className="contact-value">ishoil@icloud.com</span>
              </div>
            </a>
            <a href="https://wa.me/2001123994906" className="contact-method" target="_blank" rel="noopener">
              <span className="contact-icon">WA</span>
              <div className="contact-details">
                <span className="contact-label">WhatsApp</span>
                <span className="contact-value">+20 011 2399 4906</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
