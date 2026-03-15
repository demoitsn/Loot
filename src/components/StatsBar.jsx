import { Layers, Youtube, Brain, Video } from 'lucide-react'

export default function StatsBar({ termCount, videoCount, playlistCount }) {
  const stats = [
    { icon: Brain, label: 'Concepts', value: termCount },
    { icon: Video, label: 'Videos Found', value: videoCount },
    { icon: Layers, label: 'In Playlist', value: playlistCount },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 50,
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(8,8,8,0.9)',
      backdropFilter: 'blur(16px)',
      padding: '10px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40,
    }}>
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={12} color="rgba(232,213,163,0.5)" />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: 'rgba(245,245,245,0.35)', letterSpacing: '0.04em' }}>
            {label}
          </span>
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.8rem',
            fontWeight: 500, color: value > 0 ? '#f5f5f5' : 'rgba(245,245,245,0.2)',
          }}>{value}</span>
        </div>
      ))}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(110,255,160,0.7)', animation: 'pulse 3s infinite' }} />
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'rgba(245,245,245,0.2)', letterSpacing: '0.06em' }}>LOOT</span>
      </div>
    </div>
  )
}
