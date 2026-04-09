import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.scss'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import SocialMedia from './components/SocialMedia'
import Terminal from './components/Terminal'
import Footer from './components/Footer'
import PrivacyPolicy from './components/PrivacyPolicy'

function HomePage({ theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
        <SocialMedia />
        <Terminal theme={theme} toggleTheme={toggleTheme} />
      </main>
      <Footer />
    </>
  )
}

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.body.className = savedTheme
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.body.className = newTheme
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/rtl-toggle-privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
