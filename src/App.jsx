import { useState, useEffect } from 'react'
import './styles/global.scss'
import Terminal from './components/Terminal'

function App() {
  const [theme, setTheme] = useState('dark')
  const [visited, setVisited] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    const savedVisited = localStorage.getItem('visited') === 'true'

    setTheme(savedTheme)
    setVisited(savedVisited)

    document.body.className = savedTheme
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.body.className = newTheme
  }

  return (
    <Terminal
      theme={theme}
      toggleTheme={toggleTheme}
      isFirstVisit={!visited}
      onVisitComplete={() => localStorage.setItem('visited', 'true')}
    />
  )
}

export default App
