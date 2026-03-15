import { Settings, Layers } from 'lucide-react'

export default function Header({ onSettings, view, onNavigate }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 24px',
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(8,8,8,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div
        onClick={() => onNavigate('home')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, #e8d5a3 0%, #c8b483 100%)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Layers size={16} color="#080808" strokeWidth={2.5} />
        </div>
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800, fontSize: '1.3rem',
          letterSpacing: '0.08em',
          color: '#f5f5f5',
        }}>LOOT</span>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.65rem', color: 'rgba(245,245,245,0.3)',
          letterSpacing: '0.1em', marginTop: 2,
        }}>v1.0</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {['home', 'playlist'].map(v => (
          <button
            key={v}
            onClick={() => onNavigate(v)}
            style={{
              background: view === v ? 'rgba(255,255,255,0.07)' : 'transparent',
              color: view === v ? '#f5f5f5' : 'rgba(245,245,245,0.4)',
              border: view === v ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
              borderRadius: 10, padding: '6px 14px',
              fontSize: '0.82rem', fontWeight: 500,
              fontFamily: 'Syne, sans-serif',
              textTransform: 'capitalize', letterSpacing: '0.03em',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >{v === 'home' ? 'Analyze' : 'Playlist'}</button>
        ))}
        <button
          onClick={onSettings}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '7px 9px',
            color: 'rgba(245,245,245,0.5)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', marginLeft: 4,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f5f5f5'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,245,245,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        ><Settings size={15} /></button>
      </nav>
    </header>
  )
}
