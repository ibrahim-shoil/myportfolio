import { useState } from 'react'
import './Contact.scss'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        setStatus(data.error || 'error')
      }
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2 className="section-title">Contact</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>
              Available for full-stack projects, DevOps, and mobile app publishing.
              Reach out with project details or technical questions.
            </p>
            <div className="contact-methods">
              <a href="mailto:ishoil@icloud.com" className="contact-method">
                <span className="contact-icon">@</span>
                <div>
                  <span className="contact-label">Email</span>
                  <span>ishoil@icloud.com</span>
                </div>
              </a>
              <a href="https://wa.me/2001123994906" className="contact-method" target="_blank" rel="noopener">
                <span className="contact-icon">WhatsApp</span>
                <div>
                  <span className="contact-label">WhatsApp</span>
                  <span>+20 011 2399 4906</span>
                </div>
              </a>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+20 xxx xxx xxxx"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' && (
              <p className="form-message success">Message sent successfully!</p>
            )}
            {status === 'error' && (
              <p className="form-message error">Failed to send. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
