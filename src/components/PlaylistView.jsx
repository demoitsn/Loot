import { useState } from 'react'
import { Play, Trash2, GripVertical, Youtube, ExternalLink, List, Loader, LogIn, Copy, Check as CheckIcon } from 'lucide-react'
import { createYouTubePlaylist, initiateGoogleAuth } from '../utils/youtube'

export default function PlaylistView({ playlist, onRemove, onReorder, onClear, settings, accessToken, onAuthRequest, toast }) {
  const [creating, setCreating] = useState(false)
  const [ytPlaylist, setYtPlaylist] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [over, setOver] = useState(null)
  const [title, setTitle] = useState('My Loot Learning Playlist')

  const handleDragStart = (e, i) => { setDragging(i); e.dataTransfer.effectAllowed = 'move' }
  const handleDragOver = (e, i) => { e.preventDefault(); setOver(i) }
  const handleDrop = (e, i) => {
    e.preventDefault()
    if (dragging !== null && dragging !== i) onReorder(dragging, i)
    setDragging(null); setOver(null)
  }

  const [copied, setCopied] = useState(false)

  const copyAsText = () => {
    const text = playlist.map((item, i) =>
      `${i + 1}. [${item.term}] ${item.video.title}\n   ${item.video.channel}\n   ${item.video.url}`
    ).join('\n\n')
    navigator.clipboard.writeText(`${title}\n${'─'.repeat(title.length)}\n\n${text}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
    if (!accessToken) {
      if (settings.googleClientId) initiateGoogleAuth(settings.googleClientId)
      else { toast('Add your Google Client ID in settings to create YouTube playlists', 'error'); return }
      return
    }
    setCreating(true)
    try {
      const ids = playlist.map(p => p.video.id)
      const pl = await createYouTubePlaylist(title, `Learning path created by Loot`, ids, accessToken)
      setYtPlaylist(pl)
      toast('YouTube playlist created!', 'success')
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setCreating(false)
    }
  }

  if (!playlist.length) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <List size={24} color="rgba(245,245,245,0.2)" />
        </div>
        <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>Playlist is empty</h3>
        <p style={{ color: 'rgba(245,245,245,0.35)', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Analyze some text and add videos by clicking the <strong>+</strong> button on any video card.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>Your Playlist</h2>
            <p style={{ color: 'rgba(245,245,245,0.35)', fontSize: '0.78rem', fontFamily: 'DM Mono, monospace' }}>
              {playlist.length} videos · drag to reorder
            </p>
          </div>
          <button
            onClick={copyAsText}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: copied ? 'rgba(110,255,160,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${copied ? 'rgba(110,255,160,0.2)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10, padding: '7px 13px',
              color: copied ? '#6effa0' : 'rgba(245,245,245,0.5)',
              fontSize: '0.78rem', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', transition: 'all 0.2s ease',
            }}
          >{copied ? <><CheckIcon size={11} /> Copied!</> : <><Copy size={11} /> Copy as text</>}</button>
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,95,95,0.06)', border: '1px solid rgba(255,95,95,0.15)',
              borderRadius: 10, padding: '7px 13px',
              color: 'rgba(255,150,150,0.7)', fontSize: '0.78rem', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,95,95,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,95,95,0.06)' }}
          >
            <Trash2 size={11} /> Clear all
          </button>
        </div>

        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Playlist title..."
          style={{ borderRadius: 12, padding: '11px 16px', fontSize: '0.88rem' }}
        />
      </div>

      {/* YouTube Playlist Result */}
      {ytPlaylist && (
        <a
          href={ytPlaylist.url} target="_blank" rel="noopener"
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(110,255,160,0.07)', border: '1px solid rgba(110,255,160,0.2)',
            borderRadius: 14, padding: '14px 18px', marginBottom: 20, textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Youtube size={20} color="#6effa0" />
          <div style={{ flex: 1 }}>
            <p style={{ color: '#6effa0', fontWeight: 600, fontSize: '0.88rem' }}>Playlist created on YouTube!</p>
            <p style={{ color: 'rgba(110,255,160,0.6)', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>
              {ytPlaylist.url}
            </p>
          </div>
          <ExternalLink size={14} color="rgba(110,255,160,0.6)" />
        </a>
      )}

      {/* Video list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {playlist.map((item, i) => (
          <div
            key={item.video.id}
            draggable
            onDragStart={e => handleDragStart(e, i)}
            onDragOver={e => handleDragOver(e, i)}
            onDrop={e => handleDrop(e, i)}
            onDragEnd={() => { setDragging(null); setOver(null) }}
            className="glass"
            style={{
              borderRadius: 14, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: dragging === i ? 0.4 : 1,
              background: over === i ? 'rgba(232,213,163,0.06)' : undefined,
              borderColor: over === i ? 'rgba(232,213,163,0.2)' : undefined,
              transition: 'all 0.15s ease',
              cursor: 'grab',
              animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
            }}
          >
            <GripVertical size={14} color="rgba(245,245,245,0.2)" style={{ flexShrink: 0, cursor: 'grab' }} />
            <div style={{
              flexShrink: 0, fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
              color: 'rgba(245,245,245,0.3)', width: 20, textAlign: 'center',
            }}>{i + 1}</div>
            <img src={item.video.thumbnail} alt="" style={{ width: 68, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.83rem', fontWeight: 500, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.video.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                <span style={{ color: 'rgba(245,245,245,0.3)', fontSize: '0.7rem', fontFamily: 'DM Mono, monospace' }}>{item.video.channel}</span>
                <span className="tag" style={{ fontSize: '0.65rem', padding: '2px 7px' }}>{item.term}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <a
                href={item.video.url} target="_blank" rel="noopener"
                style={{
                  background: 'rgba(255,0,0,0.12)', border: '1px solid rgba(255,0,0,0.2)',
                  borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 4,
                  color: 'rgba(255,100,100,0.8)', fontSize: '0.72rem', textDecoration: 'none',
                  fontFamily: 'DM Mono, monospace',
                }}
              ><Play size={10} fill="currentColor" /></a>
              <button
                onClick={() => onRemove(item.video.id)}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8, padding: '6px', color: 'rgba(245,245,245,0.3)', cursor: 'pointer',
                }}
              ><Trash2 size={11} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Export to YouTube */}
      <div
        className="glass"
        style={{ borderRadius: 18, padding: '20px 22px', textAlign: 'center' }}
      >
        <Youtube size={20} color="rgba(255,100,100,0.7)" style={{ margin: '0 auto 8px' }} />
        <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>Export to YouTube</h4>
        <p style={{ color: 'rgba(245,245,245,0.35)', fontSize: '0.78rem', marginBottom: 16, lineHeight: 1.5 }}>
          {!settings.googleClientId
            ? 'Add a Google OAuth Client ID in settings to enable YouTube export.'
            : !accessToken
            ? 'Sign in with Google to create this playlist on your YouTube account.'
            : 'Create this playlist directly in your YouTube account.'}
        </p>
        <button
          className="btn-accent"
          disabled={creating}
          onClick={handleCreateYT}
          style={{ padding: '11px 32px' }}
        >
          {creating ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
              Creating...
            </span>
          ) : !accessToken ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LogIn size={14} /> Sign in & Create Playlist
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Youtube size={14} /> Create on YouTube
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
