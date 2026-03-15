import { useState, useRef } from 'react'
import { FileText, AlignLeft, Upload, Wand2, X, AlertCircle } from 'lucide-react'

export default function InputPanel({ onAnalyze, loading, hasKeys }) {
  const [mode, setMode] = useState('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = async (f) => {
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setText(e.target.result)
    reader.readAsText(f)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) { setMode('file'); handleFile(f) }
  }

  const clear = () => { setText(''); setFile(null) }

  const canSubmit = hasKeys && text.trim().length > 10 && !loading

  const examples = [
    "Machine learning and neural networks",
    "Kids entertainment videos for a road trip",
    "Quantum computing fundamentals",
    "Personal finance and investing",
  ]

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 0' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(232,213,163,0.08)', border: '1px solid rgba(232,213,163,0.2)',
          borderRadius: 8, padding: '5px 12px', marginBottom: 20,
          fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
          color: 'rgba(232,213,163,0.8)', letterSpacing: '0.1em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6effa0', animation: 'pulse 2s infinite', display: 'inline-block' }} />
          AI LEARNING ENGINE
        </div>
        <h1 style={{
          fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16,
        }}>
          Paste anything.<br />
          <span style={{
            background: 'linear-gradient(135deg, #e8d5a3 0%, rgba(232,213,163,0.5) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Learn everything.</span>
        </h1>
        <p style={{ color: 'rgba(245,245,245,0.45)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
          Drop a topic, paste an article, or upload a document. Loot extracts every concept and builds you a curated video learning path.
        </p>
      </div>

      {!hasKeys && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          background: 'rgba(255,95,95,0.06)', border: '1px solid rgba(255,95,95,0.2)',
          borderRadius: 14, padding: '14px 18px', marginBottom: 24,
        }}>
          <AlertCircle size={15} color="#ff5f5f" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ color: 'rgba(255,150,150,0.9)', fontSize: '0.83rem', lineHeight: 1.5 }}>
            Add your API keys in settings (gear icon) to get started. You need a free <strong>Groq</strong> key and a free <strong>YouTube Data API</strong> key.
          </p>
        </div>
      )}

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'text', icon: AlignLeft, label: 'Paste Text' },
          { id: 'file', icon: FileText, label: 'Upload File' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => { setMode(id); clear() }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: mode === id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${mode === id ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 10, padding: '8px 16px',
              color: mode === id ? '#f5f5f5' : 'rgba(245,245,245,0.4)',
              fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'Syne, sans-serif',
            }}
          >
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      {/* Input area */}
      {mode === 'text' ? (
        <div style={{ position: 'relative' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your text, topic, article, or concept here..."
            rows={8}
            style={{ lineHeight: 1.7 }}
          />
          {text && (
            <button
              onClick={clear}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '4px', color: 'rgba(245,245,245,0.5)',
                cursor: 'pointer',
              }}
            ><X size={12} /></button>
          )}
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'rgba(232,213,163,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 20, padding: '60px 24px',
            textAlign: 'center', cursor: 'pointer',
            background: dragOver ? 'rgba(232,213,163,0.04)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s ease',
          }}
        >
          <Upload size={28} color="rgba(245,245,245,0.3)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'rgba(245,245,245,0.5)', fontSize: '0.9rem' }}>
            {file ? <span style={{ color: 'rgba(110,255,160,0.8)' }}>✓ {file.name}</span> : <>Drag & drop or <span style={{ color: 'rgba(232,213,163,0.8)' }}>browse</span></>}
          </p>
          <p style={{ color: 'rgba(245,245,245,0.2)', fontSize: '0.75rem', marginTop: 6, fontFamily: 'DM Mono, monospace' }}>TXT · MD · PDF text</p>
          <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.text" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        </div>
      )}

      {/* Word count */}
      {text && (
        <p style={{ color: 'rgba(245,245,245,0.25)', fontSize: '0.72rem', fontFamily: 'DM Mono, monospace', marginTop: 8, textAlign: 'right' }}>
          {text.trim().split(/\s+/).length} words
        </p>
      )}

      {/* Example chips */}
      {!text && mode === 'text' && (
        <div style={{ marginTop: 16 }}>
          <p style={{ color: 'rgba(245,245,245,0.25)', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace', marginBottom: 10, letterSpacing: '0.05em' }}>TRY AN EXAMPLE →</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {examples.map(ex => (
              <button
                key={ex}
                onClick={() => setText(ex)}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 9, padding: '6px 14px',
                  color: 'rgba(245,245,245,0.45)', fontSize: '0.8rem',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  fontFamily: 'Syne, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f5f5f5'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,245,245,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
              >{ex}</button>
            ))}
          </div>
        </div>
      )}

      {/* Analyze button */}
      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <button
          className="btn-accent"
          disabled={!canSubmit}
          onClick={() => onAnalyze(text)}
          style={{ padding: '14px 48px', fontSize: '1rem', borderRadius: 14, letterSpacing: '0.04em' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#080808', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              Analyzing...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wand2 size={16} />
              Analyze & Find Videos
            </span>
          )}
        </button>
        <p style={{ color: 'rgba(245,245,245,0.2)', fontSize: '0.75rem', marginTop: 10, fontFamily: 'DM Mono, monospace' }}>
          uses groq llama3 · youtube data api v3
        </p>
      </div>
    </div>
  )
}
