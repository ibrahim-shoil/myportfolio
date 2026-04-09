import { useState, useEffect, useRef, useCallback } from 'react'
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
    problem: 'File transfer from iPhone/Android to Windows for 4K video editing was slow and consumed internet. Needed a fast, free, and private solution.',
    solution: 'Built cross-platform app. Enable mobile hotspot, connect PC, transfer files directly at 70MB/s. No internet, no cloud, 100% private.',
    stack: ['Java', 'JavaFX', 'P2P', 'HTTP Server', 'Windows Store', 'Android', 'iOS'],
    overview: 'Cross-platform file transfer app: iPhone/Android to Windows. Working on Android to iOS transfers. Also developing screen mirroring for both platforms.',
    architecture: 'Java desktop app using JavaFX for UI. HTTP server for file serving. Direct P2P connection via mobile hotspot to PC. No intermediary servers. Currently adding iOS support and screen mirroring features.',
    link: 'https://tecbamin.com/airbamin'
  },
  {
    slug: 'rtl-toggle',
    name: 'RTL Toggle',
    problem: 'Many websites with hardcoded dir attributes make it difficult for users who need RTL text direction. No easy way to toggle direction on popular sites like ChatGPT and Gemini.',
    solution: 'Built Chrome extension using Manifest V3 with MutationObserver to override hardcoded dir attributes. Stores preference per website using chrome.storage API.',
    stack: ['JavaScript', 'CSS', 'Chrome Extension Manifest V3', 'chrome.storage API', 'MutationObserver'],
    overview: 'Chrome extension that adds a floating button to toggle text direction between RTL/LTR on any website with one click. Remembers preference per site using local storage.',
    architecture: 'Chrome Extension Manifest V3 architecture. Content script injected into all pages. Floating button UI with CSS. MutationObserver watches for DOM changes and overrides dir attributes. chrome.storage.local saves preferences per domain.',
    link: 'https://chromewebstore.google.com/detail/fekmelecjjbpkifkecoeffilfnaljlkj?utm_source=item-share-cb'
  },
  {
    slug: 'captionflow',
    name: 'CaptionFlow',
    problem: 'Manually placing subtitle text layers in After Effects is tedious and error-prone, especially for long videos with dozens of caption blocks.',
    solution: 'CaptionFlow reads any standard SRT file and places every caption as a properly timed text layer. Supports sentence mode and word-by-word mode with proportional timing. Includes a built-in Caption Editor.',
    stack: ['After Effects', 'ExtendScript', 'ScriptUI', 'SRT'],
    overview: 'An After Effects ScriptUI panel that imports SRT subtitle files and creates text layers automatically — one per sentence or one per word.',
    architecture: 'ExtendScript-based ScriptUI panel. Parses standard SRT files. Creates timed text layers in active composition. Sentence mode and word-by-word mode. Built-in Caption Editor for browsing and editing.',
    download: 'https://ishoil.me/downloads/AutoCaptions.jsx'
  },
  {
    slug: 'textburst',
    name: 'Text Burst',
    problem: 'Animating individual words or characters in After Effects requires manually duplicating and trimming text layers, which is repetitive and slow — especially with Arabic or mixed-direction text.',
    solution: 'Text Burst automates the split in one click. Expressions mode preserves full sentence shape and position. No-Expressions mode gives tight bounds per word. Both handle RTL text correctly.',
    stack: ['After Effects', 'ExtendScript', 'ScriptUI', 'RTL'],
    overview: 'An After Effects ScriptUI panel that splits a single text layer into separate layers — one per character, word, or line — while preserving position and supporting Arabic RTL text.',
    architecture: 'ExtendScript-based ScriptUI panel. Two split modes: Expressions and No-Expressions. RTL/Arabic text support. Bilingual panel (English/Arabic) with live toggle.',
    download: 'https://ishoil.me/downloads/TextBurst.jsx'
  }
]

const COMMANDS = ['help', 'projects', 'project', 'about', 'contact', 'social', 'clear']
const TYPING_SPEED = 15

export default function Terminal({ theme, toggleTheme }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [output, setOutput] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [inSuggestionMode, setInSuggestionMode] = useState(false)
  const [outputLength, setOutputLength] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const isTypingRef = useRef(false)
  const currentOutputIndexRef = useRef(null)
  const userScrolledRef = useRef(false)
  const terminalOutputRef = useRef(null)
  const terminalRef = useRef(null)

  useEffect(() => {
    if (output.length === 0) {
      setOutput([{
        type: 'info',
        content: `Available commands:
  help          Show this help message
  projects      List all projects
  project <id>  View project details (e.g., project tecbamin)
  about         Professional background
  contact       Contact information
  social        YouTube & TikTok channels
  clear         Clear terminal
  ctrl+c        Stop command`,
        displayedContent: ''
      }])
      setTimeout(() => {
        startTyping(`Available commands:
  help          Show this help message
  projects      List all projects
  project <id>  View project details (e.g., project tecbamin)
  about         Professional background
  contact       Contact information
  social        YouTube & TikTok channels
  clear         Clear terminal
  ctrl+c        Stop command`, 0)
      }, 500)
    }
  }, [])

  useEffect(() => {
    if (output.length !== outputLength && !isTypingRef.current) {
      setTimeout(() => {
        if (terminalOutputRef.current) {
          terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight
        }
      }, 100)
    }
    setOutputLength(outputLength)
  }, [output.length, outputLength])


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
      if (!inSuggestionMode) {
        setSuggestionIndex(0)
      }
    } else {
      setSuggestions([])
      setInSuggestionMode(false)
      setSuggestionIndex(0)
    }
  }, [input])

  const startTyping = (fullContent, outputIndex) => {
    isTypingRef.current = true
    currentOutputIndexRef.current = outputIndex
    let charIndex = 0

    const typeNext = () => {
      if (!isTypingRef.current || currentOutputIndexRef.current !== outputIndex) {
        return
      }

      if (charIndex < fullContent.length) {
        const displayed = fullContent.substring(0, charIndex + 1)
        setOutput(prev => {
          const updated = [...prev]
          if (updated[outputIndex]) {
            updated[outputIndex].displayedContent = displayed
          }
          return updated
        })
        charIndex++
        typingTimeoutRef.current = setTimeout(typeNext, TYPING_SPEED + Math.random() * 10)
      } else {
        isTypingRef.current = false
        currentOutputIndexRef.current = null
      }
    }

    typeNext()
  }

  const stopTyping = () => {
    isTypingRef.current = false
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
    const currentIndex = currentOutputIndexRef.current
    if (currentIndex !== null) {
      setOutput(prev => {
        const updated = [...prev]
        if (updated[currentIndex] && updated[currentIndex].content) {
          updated[currentIndex].displayedContent = updated[currentIndex].content
        }
        return updated
      })
      currentOutputIndexRef.current = null
    }
  }

  const processCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(/\s+/)
    const base = parts[0]
    const arg = parts[1]

    let result = null

    if (base === 'help') {
      result = {
        type: 'help',
        content: `Available commands:
  help          Show this help message
  projects      List all projects
  project <id>  View project details (e.g., project tecbamin)
  about         Professional background
  contact       Contact information
  social        YouTube & TikTok channels
  clear         Clear terminal
  ctrl+c        Stop command`
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
          if (project.download) {
            fullContent += `\n\nDownload: ${project.download}`
          }
          result = { type: 'project', content: fullContent }
        } else {
          result = { type: 'error', content: `Project "${arg}" not found.\n\nAvailable: ` + PROJECTS.map(p => p.slug).join(', ') }
        }
      }
    } else if (base === 'about') {
      result = {
        type: 'info',
        content: 'Ibrahim A. Soliman\nFull Stack Engineer and DevOps\n\nEngineering approach:\n  Build complete solutions from frontend to deployment.\n  Ensure reliability, scalability, and great UX.\n  Automate repetitive tasks.\n\nSkills:\n  Full Stack: Python, Node.js, Go, React, Next.js\n  DevOps: Docker, Nginx, Linux, CI/CD\n  Data: Web scraping, ETL pipelines, Clean data extraction\n  Mobile: App Store & Google Play publishing\n  Adobe CC: Premiere Pro, After Effects, Audition, Illustrator,\n            Photoshop, Media Encoder, InDesign, Lightroom\n  Video: Cinematic storytelling, Short-form content, Motion graphics'
      }
    } else if (base === 'contact') {
      result = {
        type: 'info',
        content: 'Contact:\n\n  Email:     ishoil@icloud.com\n  WhatsApp:  +20 011 2399 4906\n\n  Available for full-stack projects, DevOps, and mobile app publishing.'
      }
    } else if (base === 'social') {
      result = {
        type: 'info',
        content: 'Content Creation:\n\n  storBamin - Islamic Biography & History\n    YouTube:   youtube.com/@storbamin\n    TikTok:    tiktok.com/@storbamin\n    Facebook:  facebook.com/storbmain\n\n    Arabic documentary-style history channel focused on Islamic biography\n    and early Islamic history, presenting major battles, companions, and\n    pivotal moments through concise, cinematic storytelling.\n\n  tecBamin - Tech, Long-Form\n    YouTube:   youtube.com/@tecbamin\n    TikTok:    tiktok.com/@tecbamin\n    Facebook:  facebook.com/tecBamin\n\n    Arabic tech channel producing in-depth long-form videos on consumer\n    technology, AI, digital trends, and gaming with clear and engaging\n    video storytelling.'
      }
    } else if (base === 'clear') {
      setOutput([])
      setHistory([...history, cmd])
      setHistoryIndex(-1)
      setInput('')
      userScrolledRef.current = false
      return
    } else if (trimmed === '') {
      return
    } else {
      result = { type: 'error', content: `Command not found: ${base}\n\nType help for available commands.` }
    }

    setHistory([...history, cmd])
    setHistoryIndex(-1)
    setSuggestions([])
    setInSuggestionMode(false)
    setInput('')
    userScrolledRef.current = false

    const newOutput = [...output, { type: 'command', content: cmd }, { ...result, displayedContent: '' }]
    setOutput(newOutput)

    setTimeout(() => {
      startTyping(result.content, newOutput.length - 1)
    }, 100)
  }

  const handleCtrlC = () => {
    if (isTypingRef.current) {
      stopTyping()
      const currentIndex = currentOutputIndexRef.current
      if (currentIndex !== null) {
        setOutput(prev => {
          const updated = [...prev]
          if (updated[currentIndex]) {
            updated[currentIndex].displayedContent = updated[currentIndex].content || ''
          }
          return updated
        })
      }
      currentOutputIndexRef.current = null
    }
    setOutput(prev => [...prev, { type: 'interrupt', content: '^C' }])
    setInput('')
    setTimeout(() => {
      inputRef.current?.focus()
      if (terminalOutputRef.current) {
        terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight
      }
    }, 0)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isTypingRef.current) {
        handleCtrlC()
        return
      }
      if (suggestions.length > 0) {
        applySuggestion(suggestions[suggestionIndex])
        return
      }
      processCommand(input)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestions.length > 0) {
        applySuggestion(suggestions[suggestionIndex])
      }
    } else if (e.key === 'ArrowUp') {
      if (suggestions.length > 0) {
        e.preventDefault()
        setInSuggestionMode(true)
        setSuggestionIndex(prev => Math.max(0, prev - 1))
      } else if (history.length > 0) {
        e.preventDefault()
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      if (suggestions.length > 0) {
        e.preventDefault()
        setInSuggestionMode(true)
        setSuggestionIndex(prev => Math.min(suggestions.length - 1, prev + 1))
      } else if (historyIndex !== -1) {
        e.preventDefault()
        const newIndex = Math.min(history.length - 1, historyIndex + 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
        if (newIndex === history.length - 1) {
          setHistoryIndex(-1)
          setInput('')
        }
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      handleCtrlC()
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setInSuggestionMode(false)
      setSuggestionIndex(0)
    }
  }

  const applySuggestion = (suggestion) => {
    const parts = input.split(' ')
    if (parts.length === 1) {
      setInput(suggestion)
    } else {
      parts[parts.length - 1] = suggestion
      setInput(parts.join(' '))
    }
    setSuggestions([])
    setInSuggestionMode(false)
    setSuggestionIndex(0)
    inputRef.current?.focus()
  }

  const handleTerminalScroll = () => {
    const container = terminalOutputRef.current
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      if (isAtBottom) {
        userScrolledRef.current = false
      }
    }
  }

  const toggleFullscreen = () => {
    if (!terminalRef.current) return

    if (!isFullscreen) {
      if (terminalRef.current.requestFullscreen) {
        terminalRef.current.requestFullscreen()
      } else if (terminalRef.current.webkitRequestFullscreen) {
        terminalRef.current.webkitRequestFullscreen()
      } else if (terminalRef.current.webkitRequestFullScreen) {
        terminalRef.current.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
      } else if (terminalRef.current.msRequestFullscreen) {
        terminalRef.current.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const handleTerminalClick = (e) => {
    const isInputArea = e.target.closest('.terminal-input-wrapper') || e.target.closest('.terminal-suggestions')
    if (!isInputArea) {
      inputRef.current?.focus()
    }
  }

  return (
    <section id="terminal" className={`terminal-section ${theme}`}>
      <div className="terminal-container">
        <div className="terminal-header">
          <h2 className="terminal-title">Terminal Interface</h2>
          <button
            className="fullscreen-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
        </div>
        <p className="terminal-subtitle">Interact with this portfolio using commands. Use arrows to navigate suggestions.</p>
        <div className={`terminal ${theme} ${isFullscreen ? 'fullscreen' : ''}`} ref={terminalRef} onClick={handleTerminalClick}>
          <div className="terminal-output" ref={terminalOutputRef} onScroll={handleTerminalScroll}>
            {output.map((item, i) => (
              <div key={i} className={`output-item output-${item.type}`}>
                {item.type === 'command' && (
                  <div className="output-command">
                    <span className="prompt">ishoil-me $</span> {item.content}
                  </div>
                )}
                {item.type === 'interrupt' && (
                  <div className="output-interrupt">
                    {item.content}
                  </div>
                )}
                {item.type !== 'command' && item.type !== 'interrupt' && (
                  <div className="output-content whitespace">
                    {item.displayedContent || item.content || ''}
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
                onChange={(e) => {
                  setInput(e.target.value)
                  setInSuggestionMode(false)
                  setSuggestionIndex(0)
                  if (e.target.value.length > 0) {
                    userScrolledRef.current = false
                  }
                }}
                onKeyDown={handleKeyDown}
                className="terminal-input"
                autoComplete="off"
              />
            </div>

            {suggestions.length > 0 && (
              <div className="terminal-suggestions">
                {suggestions.map((suggestion, i) => (
                  <div
                    key={suggestion}
                    className={`suggestion-item ${i === suggestionIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      applySuggestion(suggestion)
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
