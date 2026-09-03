import { useState, useEffect, useLayoutEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom'
import './styles/global.scss'








const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))
const LandingRetro = lazy(() => import('./components/LandingRetro'))
const VideoSharePage = lazy(() => import('./components/VideoSharePage'))
const CollectionSharePage = lazy(() => import('./components/CollectionSharePage'))
const UpworkVideoPage = lazy(() => import('./components/UpworkVideoPage'))
const InquiryForm = lazy(() => import('./components/InquiryForm'))
const EditorRetro = lazy(() => import('./components/EditorRetro'))
const DevRetro = lazy(() => import('./components/DevRetro'))
const ToolPage = lazy(() => import('./components/ToolPage'))
const NotFound = lazy(() => import('./components/NotFound'))
const RetroPage = lazy(() => import('./components/RetroPage'))
const Retro2010Page = lazy(() => import('./components/Retro2010Page'))
const Retro2010V2Page = lazy(() => import('./components/Retro2010V2Page'))



import { LanguageProvider } from './i18n/LanguageContext'
import { InquiryProvider, useInquiry } from './hooks/useInquiry'
import { usePageVisitTracking } from './hooks/useAnalytics'
import MotionLayer from './components/MotionLayer'



function useScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return undefined
    }
    const id = hash.slice(1)

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


function EditorRetroProfile() {
  return <EditorRetro />
}

function InquiryModalMount() {
  const { isOpen } = useInquiry()
  return isOpen ? <InquiryForm /> : null
}





function EditorShell({ children }) {
  return (
    <LanguageProvider>
      <InquiryProvider>
        {children}
        <InquiryModalMount />
      </InquiryProvider>
    </LanguageProvider>
  )
}






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


  useLayoutEffect(() => { document.body.classList.add('retro') }, [])



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
      <Suspense fallback={null}>
        <Routes>
        <Route path="/rtl-toggle-privacy" element={<PrivacyPolicy />} />

        { }
        <Route path="/dev" element={<EditorShell><DevRetro /></EditorShell>} />
        <Route path="/dev/tools/:slug" element={<EditorShell><ToolPage /></EditorShell>} />
        <Route path="/dev/*" element={<EditorShell><DevRetro /></EditorShell>} />

        { }
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

        {
}
        <Route path="/editor/v/:slug" element={<LegacyEditorRedirect mode="v" />} />
        <Route path="/editor/c/:slug" element={<LegacyEditorRedirect mode="c" />} />
        <Route path="/editor" element={<LegacyEditorRedirect mode="root" />} />
        <Route path="/editor/" element={<LegacyEditorRedirect mode="root" />} />

        { }
        <Route path="/" element={<LandingRetro />} />
        { }
        <Route path="/retro" element={<RetroPage />} />
        { }
        <Route path="/retro2010" element={<Retro2010Page />} />
        { }
        <Route path="/v2" element={<Retro2010V2Page />} />
        { }
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}






function LegacyEditorRedirect({ mode }) {
  const { slug } = useParams() || {}
  if (mode === 'v') return <Navigate to={`/editor/en/v/${slug}`} replace />
  if (mode === 'c') return <Navigate to={`/editor/en/c/${slug}`} replace />
  return <Navigate to="/editor/en" replace />
}

export default App
