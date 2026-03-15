import { useState } from 'react'
import { Brain, ChevronDown, RefreshCw, ListVideo } from 'lucide-react'
import { TermCard } from './VideoCard'

export default function TermsGrid({ terms, videoMap, loadingVideos, onAddToPlaylist, playlistIds, onReset }) {
  const [filter, setFilter] = useState('all')

  const categories = ['all', ...new Set(terms.map(t => t.category))]
  const filtered = filter === 'all' ? terms : terms.filter(t => t.category === filter)
  const totalVideos = Object.values(videoMap).flat().length

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
      {/* Stats bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, marginBottom: 32,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Brain size={14} color="rgba(232,213,163,0.8)" />
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              {terms.length} Concepts Extracted
            </h2>
          </div>
          <p style={{ color: 'rgba(245,245,245,0.35)', fontSize: '0.78rem', fontFamily: 'DM Mono, monospace' }}>
            {loadingVideos ? 'Fetching videos...' : `${totalVideos} videos found · ${playlistIds.length} in playlist`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn-ghost"
            onClick={onReset}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <RefreshCw size={12} /> New Analysis
          </button>
          {playlistIds.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(110,255,160,0.08)', border: '1px solid rgba(110,255,160,0.2)',
              borderRadius: 10, padding: '8px 14px',
              color: '#6effa0', fontSize: '0.8rem', fontFamily: 'DM Mono, monospace',
            }}>
              <ListVideo size={12} />{playlistIds.length} saved
            </div>
          )}
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 2 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                background: filter === cat ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${filter === cat ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 9, padding: '5px 13px',
                color: filter === cat ? '#f5f5f5' : 'rgba(245,245,245,0.4)',
                fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s ease',
                fontFamily: 'Syne, sans-serif',
                textTransform: filter === cat ? 'none' : 'none',
              }}
            >
              {cat === 'all' ? `All (${terms.length})` : cat}
            </button>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {loadingVideos && (
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 2, marginBottom: 24, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(232,213,163,0.6), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            width: '60%',
          }} />
        </div>
      )}

      {/* Terms */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((term, i) => (
          <TermCard
            key={term.term}
            term={term}
            index={i}
            videos={videoMap[term.term]}
            loading={loadingVideos && !videoMap[term.term]}
            onAddToPlaylist={onAddToPlaylist}
            inPlaylist={id => playlistIds.includes(id)}
          />
        ))}
      </div>
    </div>
  )
}
