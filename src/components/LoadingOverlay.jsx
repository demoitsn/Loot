import { useEffect, useState } from 'react'
import { Layers } from 'lucide-react'

const STEPS = [
  { label: 'Reading your content...', sub: 'parsing structure' },
  { label: 'Extracting key concepts...', sub: 'llama3 70b · groq' },
  { label: 'Ordering learning path...', sub: 'foundational → advanced' },
  { label: 'Preparing video search...', sub: 'youtube data api' },
]

export default function LoadingOverlay({ visible }) {
  const [step, setStep] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (!visible) { setStep(0); return }
    const s = setInterval(() => setStep(p => Math.min(p + 1, STEPS.length - 1)), 1100)
    const d = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 420)
    return () => { clearInterval(s); clearInterval(d) }
  }, [visible])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(8,8,8,0.96)',
      backdropFilter: 'blur(24px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* Animated rings */}
      <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 40 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            inset: i * 14,
            border: `1px solid rgba(232,213,163,${0.25 - i * 0.07})`,
            borderRadius: '50%',
            animation: `spin ${2.5 + i * 0.8}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, #e8d5a3 0%, #c8b483 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse 2s ease infinite',
          }}>
            <Layers size={18} color="#080808" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 0', opacity: i <= step ? 1 : 0.2,
            transition: 'opacity 0.5s ease',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0,
              background: i < step
                ? 'rgba(110,255,160,0.2)'
                : i === step
                ? 'rgba(232,213,163,0.15)'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i < step ? 'rgba(110,255,160,0.35)' : i === step ? 'rgba(232,213,163,0.3)' : 'rgba(255,255,255,0.07)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem',
              transition: 'all 0.4s ease',
            }}>
              {i < step ? '✓' : i === step ? (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8d5a3', animation: 'pulse 1s infinite', display: 'block' }} />
              ) : null}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{
                fontSize: '0.88rem', fontWeight: i === step ? 600 : 400,
                color: i === step ? '#f5f5f5' : 'rgba(245,245,245,0.45)',
              }}>
                {s.label}{i === step ? dots : ''}
              </p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(245,245,245,0.2)', fontFamily: 'DM Mono, monospace', marginTop: 1 }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
