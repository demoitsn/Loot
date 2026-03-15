import { useState } from 'react'
import { X, Key, Eye, EyeOff, ExternalLink, CheckCircle } from 'lucide-react'

export default function SettingsModal({ settings, onSave, onClose }) {
  const [vals, setVals] = useState({
    groqKey: settings.groqKey || '',
    ytKey: settings.ytKey || '',
    googleClientId: settings.googleClientId || '',
  })
  const [show, setShow] = useState({})

  const toggle = k => setShow(p => ({ ...p, [k]: !p[k] }))
  const set = (k, v) => setVals(p => ({ ...p, [k]: v }))

  const fields = [
    {
      key: 'groqKey', label: 'Groq API Key', required: true,
      hint: 'Free tier at console.groq.com',
      link: 'https://console.groq.com/keys',
    },
    {
      key: 'ytKey', label: 'YouTube Data API v3 Key', required: true,
      hint: 'Free quota 10k units/day',
      link: 'https://console.cloud.google.com/apis/credentials',
    },
    {
      key: 'googleClientId', label: 'Google OAuth Client ID', required: false,
      hint: 'Optional — needed to create YouTube playlists',
      link: 'https://console.cloud.google.com/apis/credentials',
    },
  ]

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        className="glass"
        style={{
          borderRadius: 24, padding: '32px',
          width: '100%', maxWidth: 480,
          animation: 'fadeUp 0.3s ease',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>API Keys</h2>
            <p style={{ color: 'rgba(245,245,245,0.4)', fontSize: '0.8rem', marginTop: 3, fontFamily: 'DM Mono, monospace' }}>stored locally · never sent elsewhere</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '7px', color: 'rgba(245,245,245,0.6)', cursor: 'pointer' }}
          ><X size={14} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {fields.map(({ key, label, required, hint, link }) => (
            <div key={key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <Key size={12} color={vals[key] ? '#6effa0' : 'rgba(245,245,245,0.35)'} />
                <label style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.02em' }}>
                  {label}
                  {!required && <span style={{ color: 'rgba(245,245,245,0.3)', fontWeight: 400, marginLeft: 6 }}>(optional)</span>}
                </label>
                {vals[key] && <CheckCircle size={12} color="#6effa0" />}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={show[key] ? 'text' : 'password'}
                  value={vals[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder={`Enter ${label}...`}
                  style={{ paddingRight: 44 }}
                />
                <button
                  onClick={() => toggle(key)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(245,245,245,0.4)', cursor: 'pointer', padding: 2,
                  }}
                >{show[key] ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                <p style={{ color: 'rgba(245,245,245,0.3)', fontSize: '0.72rem', fontFamily: 'DM Mono, monospace' }}>{hint}</p>
                <a href={link} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(232,213,163,0.7)', fontSize: '0.72rem', textDecoration: 'none' }}>
                  Get key <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() => { onSave(vals); onClose() }}
            style={{ flex: 2 }}
          >Save Keys</button>
        </div>
      </div>
    </div>
  )
}
