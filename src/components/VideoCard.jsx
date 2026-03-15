import { useState } from 'react'
import { Play, Plus, Check, Clock, ExternalLink } from 'lucide-react'

const DIFFICULTY_COLORS = {
  beginner: { bg: 'rgba(110,255,160,0.1)', border: 'rgba(110,255,160,0.25)', text: '#6effa0' },
  intermediate: { bg: 'rgba(232,213,163,0.1)', border: 'rgba(232,213,163,0.25)', text: '#e8d5a3' },
  advanced: { bg: 'rgba(255,95,95,0.1)', border: 'rgba(255,95,95,0.25)', text: '#ff9f9f' },
}

const CATEGORY_COLORS = [
  'rgba(110,160,255,0.15)', 'rgba(255,160,110,0.15)',
  'rgba(160,110,255,0.15)', 'rgba(110,255,200,0.15)',
]

export function TermCard({ term, index, videos, loading, onAddToPlaylist, inPlaylist }) {
  const [expanded, setExpanded] = useState(false)
  const diff = DIFFICULTY_COLORS[term.difficulty] || DIFFICULTY_COLORS.beginner
  const catColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length]

  return (
    <div
      className="glass"
      style={{
        borderRadius: 20, overflow: 'hidden',
        transition: 'all 0.3s ease',
        animation: `fadeUp 0.4s ease ${index * 0.07}s both`,
      }}
    >
      {/* Term header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding: '20px 22px', cursor: 'pointer',
          background: expanded ? 'rgba(255,255,255,0.03)' : 'transparent',
          transition: 'background 0.2s ease',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 0 }}>
          <div style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: 10,
            background: catColor, border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'DM Mono, monospace', fontWeight: 500, fontSize: '0.8rem',
            color: 'rgba(245,245,245,0.7)',
          }}>{String(index + 1).padStart(2, '0')}</div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.02rem', marginBottom: 4, letterSpacing: '-0.01em' }}>{term.term}</h3>
            <p style={{ color: 'rgba(245,245,245,0.45)', fontSize: '0.82rem', lineHeight: 1.5 }}>{term.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              <span className="tag">{term.category}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: diff.bg, border: `1px solid ${diff.border}`,
                borderRadius: 7, padding: '3px 9px',
                fontSize: '0.68rem', fontFamily: 'DM Mono, monospace',
                color: diff.text, letterSpacing: '0.04em',
              }}>{term.difficulty}</span>
              {videos && <span className="tag"><Play size={9} />{videos.length} videos</span>}
            </div>
          </div>
        </div>
        <div style={{
          flexShrink: 0,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.3s ease',
          color: 'rgba(245,245,245,0.3)',
          fontSize: '1.2rem',
        }}>⌄</div>
      </div>

      {/* Videos */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0 22px 20px' }}>
          {loading ? (
            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              {[1,2,3].map(i => (
                <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12 }} />
              ))}
            </div>
          ) : videos?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              {videos.map((v, vi) => (
                <VideoRow key={v.id} video={v} vi={vi} onAdd={() => onAddToPlaylist(v, term)} added={inPlaylist?.(v.id)} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'rgba(245,245,245,0.3)', fontSize: '0.82rem', padding: '20px 0', textAlign: 'center', fontFamily: 'DM Mono, monospace' }}>
              No videos found
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function VideoRow({ video, vi, onAdd, added }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '10px 12px',
        transition: 'all 0.2s ease',
        animation: `fadeUp 0.3s ease ${vi * 0.05}s both`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.055)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', flexShrink: 0, width: 80, height: 52, borderRadius: 8, overflow: 'hidden', background: '#1a1a1a' }}>
        <img src={video.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.2s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}
        >
          <Play size={16} fill="white" color="white" />
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <a
          href={video.url} target="_blank" rel="noopener"
          style={{ color: '#f5f5f5', textDecoration: 'none', fontSize: '0.83rem', fontWeight: 500, display: 'block', lineHeight: 1.4 }}
        >
          <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.title}
          </span>
        </a>
        <p style={{ color: 'rgba(245,245,245,0.3)', fontSize: '0.72rem', marginTop: 3, fontFamily: 'DM Mono, monospace' }}>{video.channel}</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <a
          href={video.url} target="_blank" rel="noopener"
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 8, padding: '6px', color: 'rgba(245,245,245,0.5)',
            display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none',
          }}
        ><ExternalLink size={12} /></a>
        <button
          onClick={onAdd}
          style={{
            background: added ? 'rgba(110,255,160,0.12)' : 'rgba(232,213,163,0.08)',
            border: `1px solid ${added ? 'rgba(110,255,160,0.25)' : 'rgba(232,213,163,0.2)'}`,
            borderRadius: 8, padding: '6px',
            color: added ? '#6effa0' : 'rgba(232,213,163,0.8)',
            display: 'flex', alignItems: 'center', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >{added ? <Check size={12} /> : <Plus size={12} />}</button>
      </div>
    </div>
  )
}
