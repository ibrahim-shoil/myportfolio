import { useState, useEffect, useRef } from 'react'
import './Terminal.scss'

const PROJECTS = [
  {
    slug: 'tecbamin',
    name: 'Tecbamin',
    problem: 'Managing Arabic tech content with real-time data from multiple sources',
    solution: 'Built Flask-based platform with automated scraping pipelines, MySQL database, and Redis caching',
    stack: ['Python', 'Flask', 'MySQL', 'Redis', 'SQLAlchemy'],
    overview: 'Arabic tech content platform featuring articles, phone database, and automated content publishing with SEO optimization.',
    architecture: 'Flask backend with SQLAlchemy ORM. MySQL for database. Redis for caching and rate limiting. Automated scrapers for content ingestion. SEO optimization with structured data.'
  },
  {
    slug: 'playcredits',
    name: 'PlayCredits',
    problem: 'Secure digital credits distribution with fraud prevention and real-time tracking',
    solution: 'Developed full-stack marketplace with NestJS backend, Next.js frontend, and payment processing',
    stack: ['Next.js 14', 'NestJS', 'TypeScript', 'PostgreSQL', 'Prisma'],
    overview: 'Game credits marketplace with bilingual support, payment integration, and comprehensive admin panel.',
    architecture: 'Next.js App Router with TypeScript. NestJS backend with Prisma ORM. PostgreSQL for persistence. Redis for caching. Stripe for payments.'
  },
  {
    slug: 'airbamin',
    name: 'Airbamin',
    problem: 'File transfer from iPhone to Windows for 4K video editing was slow and consumed internet. Needed a fast, free, and private solution.',
    solution: 'Built Java desktop app. Enable iPhone hotspot, connect PC, transfer files directly at 70MB/s. No internet, no cloud, 100% private.',
    stack: ['Java', 'JavaFX', 'P2P', 'HTTP Server', 'Windows Store'],
    overview: 'Java desktop application for direct iPhone-to-Windows file transfer via hotspot. Published on Windows Store with 70MB/s transfer speeds.',
    architecture: 'Java desktop app using JavaFX for UI. HTTP server for file serving. Direct P2P connection via iPhone hotspot to PC. No intermediary servers. Published on Microsoft Store.',
    link: 'https://tecbamin.com/airbamin/en'
  }
]

const COMMANDS = ['help', 'projects', 'project', 'about', 'contact', 'clear']
const TYPING_SPEED = 25

export default function Terminal({ theme, toggleTheme }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [output, setOutput] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  useEffect(() => {
    if (output.length === 0) {
      setOutput([{
        type: 'info',
        content: 'ishoil.me Terminal\n\nType "help" for available commands.'
      }])
    }
  }, [])

  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output])

  useEffect(() => {
    const trimmed = input.toLowerCase()
    const parts = trimmed.split(/\s+/)

    if (trimmed) {
      let matches = []

      if (parts.length === 1) {
        matches = COMMANDS.filter(cmd => cmd.startsWith(trimmed) && cmd !== trimmed)
      } else if (parts[0] === 'project' && parts.length === 2) {
        const lastPart = parts[1]
        matches = PROJECTS.map(p => p.slug).filter(slug => slug.startsWith(lastPart) && slug !== lastPart)
      }

      setSuggestions(matches)
      setSuggestionIndex(0)
    } else {
      setSuggestions([])
    }
  }, [input])

  const typeWriterContent = (content, callback) => {
    let index = 0
    const lines = content.split('\n')
    let currentLine = 0
    let charIndex = 0
    let displayedContent = ''

    const typeNext = () => {
      if (currentLine < lines.length) {
        if (charIndex === 0) {
          displayedContent += (currentLine > 0 ? '\n' : '') + lines[currentLine].charAt(0)
          charIndex = 1
        } else {
          displayedContent += lines[currentLine].charAt(charIndex)
          charIndex++
        }

        if (charIndex >= lines[currentLine].length) {
          currentLine++
          charIndex = 0
        }

        callback(displayedContent)
        setTimeout(typeNext, TYPING_SPEED + Math.random() * 10)
      }
    }

    typeNext()
  }

  const processCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(/\s+/)
    const base = parts[0]
    const arg = parts[1]

    let result = null
    let shouldType = false

    if (base === 'help') {
      result = {
        type: 'help',
        content: `Available commands:
  help          Show this help message
  projects      List all projects
  project <id>  View project details (e.g., project tecbamin)
  about         Professional background
  contact       Contact information
  clear         Clear terminal`
      }
    } else if (base === 'projects') {
      result = {
        type: 'projects',
        content: 'Projects:\n' + PROJECTS.map(p => `  ${p.slug.padEnd(12)} ${p.name}`).join('\n') + '\n\nType: project <name>'
      }
    } else if (base === 'project') {
      if (!arg) {
        result = { type: 'error', content: 'Usage: project <slug>\n\nAvailable: ' + PROJECTS.map(p => p.slug).join(', ') }
      } else {
        const project = PROJECTS.find(p => p.slug === arg)
        if (project) {
          let fullContent = `${project.name}\n\n${project.overview}\n\nProblem:\n${project.problem}\n\nSolution:\n${project.solution}\n\nArchitecture:\n${project.architecture}\n\nTechnologies:\n${project.stack.map(s => `  ${s}`).join('\n')}`
          if (project.link) {
            fullContent += `\n\nVisit: ${project.link}`
          }
          result = {
            type: 'project',
            content: fullContent,
            typing: true,
            displayedContent: ''
          }
          shouldType = true
        } else {
          result = { type: 'error', content: `Project "${arg}" not found.\n\nAvailable: ` + PROJECTS.map(p => p.slug).join(', ') }
        }
      }
    } else if (base === 'about') {
      result = {
        type: 'info',
        content: 'Ibrahim A. Soliman\nFull Stack Engineer and DevOps\n\nEngineering approach:\n  Build complete solutions from frontend to deployment.\n  Ensure reliability, scalability, and great UX.\n  Automate repetitive tasks.\n\nSkills:\n  Full Stack: Python, Node.js, Go, React, Next.js\n  DevOps: Docker, Nginx, Linux, CI/CD\n  Mobile: App Store & Google Play publishing\n  Creative: Premiere Pro, Photoshop, Storytelling'
      }
    } else if (base === 'contact') {
      result = {
        type: 'info',
        content: 'Contact:\n\n  Email:     ishoil@icloud.com\n  WhatsApp:  +20 011 2399 4906\n\n  Available for full-stack projects, DevOps, and mobile app publishing.'
      }
    } else if (base === 'clear') {
      setOutput([])
      setHistory([...history, cmd])
      setHistoryIndex(-1)
      setInput('')
      return
    } else if (trimmed === '') {
      return
    } else {
      result = { type: 'error', content: `Command not found: ${base}\n\nType help for available commands.` }
    }

    setHistory([...history, cmd])
    setHistoryIndex(-1)
    setSuggestions([])

    if (shouldType) {
      setOutput(prev => [...prev, { type: 'command', content: cmd }, result])
      typeWriterContent(result.content, (displayed) => {
        setOutput(prev => {
          const newOutput = [...prev]
          const lastItem = newOutput[newOutput.length - 1]
          if (lastItem && lastItem.typing) {
            lastItem.displayedContent = displayed
            lastItem.content = displayed
          }
          return newOutput
        })
      })
    } else {
      setOutput(prev => [...prev, { type: 'command', content: cmd }, result])
    }
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand(input)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestions.length > 0) {
        const suggestion = suggestions[suggestionIndex]
        const parts = input.split(' ')
        if (parts.length === 1) {
          setInput(suggestion)
        } else {
          parts[parts.length - 1] = suggestion
          setInput(parts.join(' '))
        }
        setSuggestions([])
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
        if (newIndex === history.length - 1) {
          setHistoryIndex(-1)
          setInput('')
        }
      }
    }
  }

  return (
    <section id="terminal" className={`terminal-section ${theme}`}>
      <div className="terminal-container">
        <h2 className="terminal-title">Terminal Interface</h2>
        <p className="terminal-subtitle">Interact with this portfolio using commands. Press Tab to autocomplete.</p>
        <div className={`terminal ${theme}`}>
          <div className="terminal-output">
            {output.map((item, i) => (
              <div key={i} className={`output-item output-${item.type}`}>
                {item.type === 'command' && (
                  <div className="output-command">
                    <span className="prompt">ishoil-me $</span> {item.content}
                  </div>
                )}
                {item.type !== 'command' && (
                  <div className="output-content whitespace">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={outputRef} />
          </div>

          <div className="terminal-input-wrapper">
            <div className="terminal-input-line">
              <span className="prompt">ishoil-me $</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminal-input"
              />
            </div>

            {suggestions.length > 0 && (
              <div className="terminal-suggestions">
                {suggestions.map((suggestion, i) => (
                  <div
                    key={suggestion}
                    className={`suggestion-item ${i === suggestionIndex ? 'active' : ''}`}
                    onClick={() => {
                      const parts = input.split(' ')
                      if (parts.length === 1) {
                        setInput(suggestion)
                      } else {
                        parts[parts.length - 1] = suggestion
                        setInput(parts.join(' '))
                      }
                      setSuggestions([])
                      inputRef.current?.focus()
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
