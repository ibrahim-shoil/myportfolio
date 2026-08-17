import { useState, useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom'
import './styles/global.scss'
import PrivacyPolicy from './components/PrivacyPolicy'

import LandingRetro from './components/LandingRetro'

import VideoSharePage from './components/VideoSharePage'
import CollectionSharePage from './components/CollectionSharePage'
import UpworkVideoPage from './components/UpworkVideoPage'

import { LanguageProvider } from './i18n/LanguageContext'
import { InquiryProvider } from './hooks/useInquiry'
import { usePageVisitTracking } from './hooks/useAnalytics'
import InquiryForm from './components/InquiryForm'
import EditorRetro from './components/EditorRetro'
import DevRetro from './components/DevRetro'
import ToolPage from './components/ToolPage'
import MotionLayer from './components/MotionLayer'
import NotFound from './components/NotFound'
import RetroPage from './components/RetroPage'
import Retro2010Page from './components/Retro2010Page'
import Retro2010V2Page from './components/Retro2010V2Page'

// Scroll management on route changes: hash links scroll to their section
// (React Router does not do native anchor jumps), everything else goes to top.
function useScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return undefined
    }
    const id = hash.slice(1)
    // Wait a tick so the target page/section has rendered.
    const timer = setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
      else window.scrollTo(0, 0)
    }, 80)
    return () => clearTimeout(timer)
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

// --- Video Editor profile: the 2010 retro site ---
function EditorRetroProfile() {
  return <EditorRetro />
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
  useLayoutEffect(() => {
    document.body.classList.remove('light')
    document.documentElement.classList.remove('light')
    document.body.classList.add('dark')
    document.documentElement.classList.add('dark')

    return () => {
      const restoredTheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
      document.body.classList.remove('light', 'dark')
      document.documentElement.classList.remove('light', 'dark')
      document.body.classList.add(restoredTheme)
      document.documentElement.classList.add(restoredTheme)
    }
  }, [])

  return <LanguageProvider>{children}</LanguageProvider>
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') === 'light' ? 'light' : 'dark')

  // Retro 2010 skin is the active identity; apply before first paint.
  useLayoutEffect(() => { document.body.classList.add('retro') }, [])

  // Set theme via classList so the retro class survives theme switches.
  // The retro 2010 skin is a dark identity — light mode maps onto it.
  const applyTheme = (next) => {
    const effective = document.body.classList.contains('retro') ? 'dark' : next
    document.body.classList.remove('dark', 'light')
    document.documentElement.classList.remove('dark', 'light')
    document.body.classList.add(effective)
    document.documentElement.classList.add(effective)
  }

  useEffect(() => {
    const activeTheme = /^\/editor\/(?:en|ar)\/upwork\//.test(window.location.pathname)
      ? 'dark'
      : (localStorage.getItem('theme') === 'light' ? 'light' : 'dark')
    applyTheme(activeTheme)
    window.history.scrollRestoration = 'manual'
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  return (
    <BrowserRouter>
      <MotionLayer />
      <ScrollManager />
      <AnalyticsTracker />
      <Routes>
        <Route path="/rtl-toggle-privacy" element={<PrivacyPolicy />} />

        {/* Developer profile */}
        <Route path="/dev" element={<EditorShell><DevRetro /></EditorShell>} />
        <Route path="/dev/tools/:slug" element={<EditorShell><ToolPage /></EditorShell>} />
        <Route path="/dev/*" element={<EditorShell><DevRetro /></EditorShell>} />

        {/* Video editor profile — language-prefixed routes (canonical) */}
        <Route path="/editor/:lang" element={
          <EditorShell><EditorRetroProfile /></EditorShell>
        } />
        <Route path="/editor/:lang/*" element={
          <EditorShell><EditorRetroProfile /></EditorShell>
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
        <Route path="/" element={<LandingRetro />} />
        {/* Y2K light-mode experiment */}
        <Route path="/retro" element={<RetroPage />} />
        {/* 2010 programmer Web 2.0 experiment */}
        <Route path="/retro2010" element={<Retro2010Page />} />
        {/* 2010 refined: same hierarchy, better execution */}
        <Route path="/v2" element={<Retro2010V2Page />} />
        {/* Everything else is a real 404 */}
        <Route path="*" element={<NotFound />} />
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
