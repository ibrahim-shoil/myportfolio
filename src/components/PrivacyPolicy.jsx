import { useEffect } from 'react'
import './PrivacyPolicy.scss'

export default function PrivacyPolicy() {
  useEffect(() => {
    // Load theme from localStorage and apply to body
    const savedTheme = localStorage.getItem('theme') || 'dark'
    document.body.className = savedTheme
  }, [])

  return (
    <div className="privacy-policy">
      <div className="privacy-policy-container">
        <div className="privacy-policy-card">
          <h1 className="privacy-policy-title">RTL Toggle – Privacy Policy</h1>

          <div className="privacy-policy-content">
            <p className="privacy-policy-lead">
              RTL Toggle does not collect, store, transmit, or share any personal data or user information.
            </p>

            <div className="privacy-policy-section">
              <h2>Data Storage</h2>
              <p>
                The only data stored is your RTL/LTR preference per website, saved locally on your own device using Chrome's built-in storage API. This data never leaves your device and is not accessible to anyone.
              </p>
            </div>

            <div className="privacy-policy-section">
              <h2>No Analytics or Tracking</h2>
              <p>
                No analytics, no tracking, no third-party services are used.
              </p>
            </div>

            <div className="privacy-policy-section">
              <h2>Extension Details</h2>
              <ul>
                <li><strong>Extension:</strong> RTL Toggle</li>
                <li><strong>Developer:</strong> Ibrahim Shoil</li>
                <li><strong>Contact:</strong> ishoil@icloud.com</li>
                <li><strong>Last updated:</strong> March 2026</li>
              </ul>
            </div>

            <div className="privacy-policy-footer">
              <a href="/" className="back-link">← Back to Portfolio</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
