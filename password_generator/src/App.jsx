import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [length, setLength] = useState(12)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [characterAllowed, setCharacterAllowed] = useState(false)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const passwordRef = useRef("")

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberAllowed) str += "0123456789"
    if (characterAllowed) str += "!@#$%^&*()_+"
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }
    setPassword(pass)
  }, [length, numberAllowed, characterAllowed])

  const copyPassword = useCallback(() => {
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [passwordGenerator])

  const getStrength = () => {
    if (length < 8) return { label: 'Weak', color: '#ef4444', width: '25%' }
    if (length < 12 && !numberAllowed && !characterAllowed) return { label: 'Fair', color: '#f59e0b', width: '45%' }
    if (length >= 16 && numberAllowed && characterAllowed) return { label: 'Very Strong', color: '#a78bfa', width: '100%' }
    if (length >= 12 && (numberAllowed || characterAllowed)) return { label: 'Strong', color: '#10b981', width: '75%' }
    return { label: 'Good', color: '#3b82f6', width: '60%' }
  }

  const strength = getStrength()

  return (
    <div className="app-bg">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="card">
        <div className="card-header">
          <div className="lock-icon">🔐</div>
          <h1 className="title">Password Generator</h1>
          <p className="subtitle">Create secure, unbreakable passwords</p>
        </div>

        <div className="password-box">
          <input
            type="text"
            value={password}
            className="password-input"
            placeholder="Your password will appear here"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPassword}
            className={`copy-btn ${copied ? 'copied' : ''}`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

        <div className="strength-section">
          <div className="strength-header">
            <span className="strength-label">Strength</span>
            <span className="strength-value" style={{ color: strength.color }}>{strength.label}</span>
          </div>
          <div className="strength-track">
            <div className="strength-fill" style={{ width: strength.width, background: strength.color }} />
          </div>
        </div>

        <div className="controls">
          <div className="control-group">
            <div className="control-header">
              <label className="control-label">Length</label>
              <span className="control-value">{length}</span>
            </div>
            <input
              type="range"
              min="6"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>6</span>
              <span>32</span>
            </div>
          </div>

          <div className="toggles">
            <label className={`toggle-card ${numberAllowed ? 'active' : ''}`}>
              <div className="toggle-info">
                <span className="toggle-icon">🔢</span>
                <div>
                  <div className="toggle-title">Numbers</div>
                  <div className="toggle-desc">0–9 digits</div>
                </div>
              </div>
              <div className={`switch ${numberAllowed ? 'on' : ''}`} onClick={() => setNumberAllowed(v => !v)}>
                <div className="switch-thumb" />
              </div>
            </label>

            <label className={`toggle-card ${characterAllowed ? 'active' : ''}`}>
              <div className="toggle-info">
                <span className="toggle-icon">✦</span>
                <div>
                  <div className="toggle-title">Symbols</div>
                  <div className="toggle-desc">!@#$%^&*</div>
                </div>
              </div>
              <div className={`switch ${characterAllowed ? 'on' : ''}`} onClick={() => setCharacterAllowed(v => !v)}>
                <div className="switch-thumb" />
              </div>
            </label>
          </div>
        </div>

        <button onClick={passwordGenerator} className="generate-btn">
          ↻ &nbsp;Generate New Password
        </button>
      </div>
    </div>
  )
}

export default App