import { useState, useEffect, useRef } from 'react'
import './Terminal.scss'

const PROJECTS = [
  {
    slug: 'tecbamin',
    name: 'Tecbamin',
    problem: 'Content management and data synchronization across multiple platforms',
    solution: 'Built a centralized content platform with real-time data pipelines',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    overview: 'Tecbamin is a comprehensive content and data platform that handles content aggregation, processing, and distribution. The system processes thousands of content items daily with automated pipelines.',
    architecture: 'FastAPI backend with PostgreSQL for persistent storage and Redis for caching. Worker processes handle async tasks. Dockerized deployment with automated scaling.'
  },
  {
    slug: 'playcredits',
    name: 'PlayCredits',
    problem: 'Digital rewards distribution needed fraud prevention and real-time tracking',
    solution: 'Developed a credits system with transaction monitoring and anti-fraud mechanisms',
    stack: ['Node.js', 'Express', 'MongoDB', 'WebSocket', 'Redis'],
    overview: 'A digital credits and rewards platform with real-time transaction processing. Built fraud detection systems and automated audit trails.',
    architecture: 'Microservices architecture with Express APIs. MongoDB for transaction logs. Redis for rate limiting and real-time balances. WebSocket for live updates.'
  },
  {
    slug: 'airbamin',
    name: 'Airbamin',
    problem: 'Cross-platform file transfer without cloud storage dependencies',
    solution: 'Created direct P2P file sharing system with WebRTC fallback',
    stack: ['Go', 'WebRTC', 'STUN/TURN', 'Vue.js', 'SQLite'],
    overview: 'Cross-platform file transfer solution enabling direct device-to-device sharing. Handles connection establishment and data transfer automatically.',
    architecture: 'Go backend for signaling and connection management. WebRTC for peer connections. SQLite for session tracking. Progressive web app for mobile access.'
  },
  {
    slug: 'ishoil',
    name: 'ishoil.me',
    problem: 'Portfolio site needed to showcase technical work without typical template aesthetics',
    solution: 'Built terminal-interface portfolio emphasizing engineering capability',
    stack: ['React', 'Vite', 'SCSS'],
    overview: 'Personal portfolio with terminal-style interface. Command-driven navigation with progressive enhancement for accessibility.',
    architecture: 'React SPA with Vite. Custom SCSS architecture for theming. Local storage for state persistence. Component-based command system.'
  }
]

const COMMANDS = {
  help: {
    output: `ishoil.me — Terminal Portfolio

Available commands:
  help          Show this help message
  projects      List all projects
  project <id>  View project details (e.g., project tecbamin)
  about         Professional background
  contact       Contact information
  theme         Toggle dark/light theme

Navigation:
  Type commands directly or use the suggestions below.
  Press <kbd>↑</kbd> <kbd>↓</kbd> for command history.
  Click any suggestion to execute.`
  },
  projects: {
    output: PROJECTS.map(p => `  ${p.slug.padEnd(12)} ${p.name.padEnd(15)} ${p.problem}`).join('\n'),
    projects: true
  },
  about: {
    output: `Ibrahim A. Soliman
Backend Engineer focused on distributed systems, data pipelines, and automation.

Engineering approach:
  Build systems that scale. Minimize complexity. Automate repetitive tasks.
  Prefer simple solutions over clever ones. Measure before optimizing.

Skills:
  Backend systems architecture
  ETL and data pipeline development
  Web scraping and data extraction
  API design and integration
  Task automation and tooling

Education:
  University graduate

This portfolio demonstrates engineering capability through functional systems,
not aesthetic flourishes.`
  },
  contact: {
    output: `Contact:

  Email:     ibrahim@ishoil.me
  WhatsApp:  wa.me/201000000000

  Reach out with project details or technical questions.

  Available for backend systems, data pipelines, and automation work.`
  },
  theme: {
    output: null
  }
}

export default function Terminal({ theme, toggleTheme, isFirstVisit, onVisitComplete }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [output, setOutput] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()

    if (isFirstVisit) {
      setOutput([{
        type: 'info',
        content: 'Welcome to ishoil.me\n\nType help or click a command to explore.'
      }])
      onVisitComplete()
    }
  }, [])

  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output])

  const processCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(/\s+/)
    const base = parts[0]
    const arg = parts[1]

    let result = null

    if (base === 'help') {
      result = { type: 'help', content: COMMANDS.help.output }
    } else if (base === 'projects') {
      result = {
        type: 'projects',
        content: 'Projects:\n' + COMMANDS.projects.output + '\n\nType: project <name>'
      }
    } else if (base === 'project') {
      if (!arg) {
        result = { type: 'error', content: 'Usage: project <slug>\n\nAvailable: ' + PROJECTS.map(p => p.slug).join(', ') }
      } else {
        const project = PROJECTS.find(p => p.slug === arg)
        if (project) {
          result = {
            type: 'project',
            project,
            content: `${project.name}

${project.overview}

Problem:
${project.problem}

Solution:
${project.solution}

Architecture:
${project.architecture}

Technologies:
${project.stack.map(s => `  ${s}`).join('\n')}`
          }
        } else {
          result = { type: 'error', content: `Project "${arg}" not found.\n\nAvailable: ` + PROJECTS.map(p => p.slug).join(', ') }
        }
      }
    } else if (base === 'about') {
      result = { type: 'info', content: COMMANDS.about.output }
    } else if (base === 'contact') {
      result = { type: 'contact', content: COMMANDS.contact.output }
    } else if (base === 'theme') {
      toggleTheme()
      result = { type: 'info', content: `Theme changed to ${theme === 'dark' ? 'light' : 'dark'}` }
    } else if (trimmed === '') {
      return
    } else {
      result = { type: 'error', content: `Command not found: ${base}\n\nType help for available commands.` }
    }

    setHistory([...history, cmd])
    setHistoryIndex(-1)
    setOutput(prev => [...prev, { type: 'command', content: cmd }, result])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand(input)
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

  const runCommand = (cmd) => {
    setInput(cmd)
    setTimeout(() => processCommand(cmd), 50)
  }

  return (
    <div className="terminal">
      <div className="terminal-output">
        {output.map((item, i) => (
          <div key={i} className={`output-item output-${item.type}`}>
            {item.type === 'command' && (
              <div className="output-command">
                <span className="prompt">$</span> {item.content}
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

      <div className="terminal-input-line">
        <span className="prompt">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          autoFocus
        />
        <span className="cursor" />
      </div>

      <div className="terminal-suggestions">
        <button
          className="suggestion"
          onClick={() => runCommand('help')}
        >
          help
        </button>
        <button
          className="suggestion"
          onClick={() => runCommand('projects')}
        >
          projects
        </button>
        <button
          className="suggestion"
          onClick={() => runCommand('about')}
        >
          about
        </button>
        <button
          className="suggestion"
          onClick={() => runCommand('contact')}
        >
          contact
        </button>
        <button
          className="suggestion"
          onClick={() => runCommand('theme')}
        >
          theme
        </button>
      </div>
    </div>
  )
}
