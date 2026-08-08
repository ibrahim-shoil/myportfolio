import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom'
import './styles/global.scss'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import SocialMedia from './components/SocialMedia'
import Footer from './components/Footer'
import PrivacyPolicy from './components/PrivacyPolicy'

import Landing from './components/Landing'

import HeroEditor from './components/HeroEditor'
import AboutEditor from './components/AboutEditor'
import VideoShowcase from './components/VideoShowcase'
import Collections from './components/Collections'
import Gallery from './components/Gallery'
import VideoSharePage from './components/VideoSharePage'
import CollectionSharePage from './components/CollectionSharePage'
import UpworkVideoPage from './components/UpworkVideoPage'

import { LanguageProvider } from './i18n/LanguageContext'
import { InquiryProvider } from './hooks/useInquiry'
import { usePageVisitTracking } from './hooks/useAnalytics'
import InquiryForm from './components/InquiryForm'

// Scroll to top on route changes (except when there's a hash to scroll to)
function useScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])
}

function ScrollManager() {
  useScrollToTop()
  return null
}

function AnalyticsTracker() {
  usePageVisitTracking()
  return null
}

// --- Developer profile (current site, minus Terminal) ---
function DevProfile({ theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} profile="dev" />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact variant="dev" />
        <SocialMedia />
      </main>
      <Footer variant="dev" />
    </>
  )
}

// --- Video Editor profile (new freelancing site) ---
function EditorProfile({ theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} profile="editor" />
      <main>
        <HeroEditor />
        <AboutEditor />
        <VideoShowcase />
        <Collections />
        <Gallery />
        <Contact variant="editor" />
        <SocialMedia />
      </main>
      <Footer variant="editor" />
      <InquiryForm />
    </>
  )
}

/**
 * Wraps editor routes with the shared providers (language + inquiry form)
 * so every editor page can toggle language and open the hire modal.
 */
function EditorShell({ children }) {
  return (
    <LanguageProvider>
      <InquiryProvider>
        {children}
        <InquiryForm />
      </InquiryProvider>
    </LanguageProvider>
  )
}

/**
 * Upwork-safe portfolio pages deliberately omit InquiryProvider, InquiryForm,
 * navbar, footer, WhatsApp, social links, and links back to the normal site.
 * The same project data/video is reused; only the presentation shell differs.
 */
function UpworkShell({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>
}

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
    setTheme(savedTheme)
    document.body.className = savedTheme
    document.documentElement.className = savedTheme
    window.history.scrollRestoration = 'manual'
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.body.className = newTheme
    document.documentElement.className = newTheme
  }

  return (
    <BrowserRouter>
      <ScrollManager />
      <AnalyticsTracker />
      <Routes>
        <Route path="/rtl-toggle-privacy" element={<PrivacyPolicy />} />

        {/* Developer profile */}
        <Route path="/dev" element={<DevProfile theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/dev/*" element={<DevProfile theme={theme} toggleTheme={toggleTheme} />} />

        {/* Video editor profile — language-prefixed routes (canonical) */}
        <Route path="/editor/:lang" element={
          <EditorShell><EditorProfile theme={theme} toggleTheme={toggleTheme} /></EditorShell>
        } />
        <Route path="/editor/:lang/*" element={
          <EditorShell><EditorProfile theme={theme} toggleTheme={toggleTheme} /></EditorShell>
        } />
        <Route path="/editor/:lang/v/:slug" element={
          <EditorShell><VideoSharePage /></EditorShell>
        } />
        <Route path="/editor/:lang/c/:slug" element={
          <EditorShell><CollectionSharePage /></EditorShell>
        } />
        <Route path="/editor/:lang/upwork/:slug" element={
          <UpworkShell><UpworkVideoPage /></UpworkShell>
        } />

        {/* Backward-compat redirects: old unprefixed editor links → English (their original language).
            Mirrors the Nginx 301s so behavior is identical without the server. */}
        <Route path="/editor/v/:slug" element={<LegacyEditorRedirect mode="v" />} />
        <Route path="/editor/c/:slug" element={<LegacyEditorRedirect mode="c" />} />
        <Route path="/editor" element={<LegacyEditorRedirect mode="root" />} />
        <Route path="/editor/" element={<LegacyEditorRedirect mode="root" />} />

        {/* Landing at root */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}

/**
 * Redirect legacy /editor/v/:slug and /editor/c/:slug to the English
 * language-prefixed equivalents, and bare /editor to /editor/en.
 * The client-side redirect is a safety net; Nginx 301s are the primary mechanism.
 */
function LegacyEditorRedirect({ mode }) {
  const { slug } = useParams() || {}
  if (mode === 'v') return <Navigate to={`/editor/en/v/${slug}`} replace />
  if (mode === 'c') return <Navigate to={`/editor/en/c/${slug}`} replace />
  return <Navigate to="/editor/en" replace />
}

export default App
