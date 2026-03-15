import { useState, useEffect, useCallback, useRef } from 'react'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import TermsGrid from './components/TermsGrid'
import PlaylistView from './components/PlaylistView'
import SettingsModal from './components/SettingsModal'
import LoadingOverlay from './components/LoadingOverlay'
import StatsBar from './components/StatsBar'
import { analyzeContent } from './utils/groq'
import { searchVideos, parseAccessTokenFromHash } from './utils/youtube'

const LS = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
}

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [onDone])
  return <div className={`toast ${type}`}>{msg}</div>
}

export default function App() {
  const [view, setView] = useState('home')
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(() => LS.get('loot_settings') || {})
  const [terms, setTerms] = useState([])
  const [videoMap, setVideoMap] = useState({})
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [playlist, setPlaylist] = useState(() => LS.get('loot_playlist') || [])
  const [accessToken, setAccessToken] = useState(null)
  const [toast, setToast] = useState(null)
  const abortRef = useRef(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type, id: Date.now() })

  // Handle Google OAuth redirect
  useEffect(() => {
    const token = parseAccessTokenFromHash()
    if (token) { setAccessToken(token); showToast('Signed in with Google!') }
  }, [])

  // Persist playlist
  useEffect(() => { LS.set('loot_playlist', playlist) }, [playlist])
  useEffect(() => { LS.set('loot_settings', settings) }, [settings])

  const handleAnalyze = async (text) => {
    if (!settings.groqKey) { showToast('Add your Groq API key in settings', 'error'); setShowSettings(true); return }
    if (!settings.ytKey) { showToast('Add your YouTube API key in settings', 'error'); setShowSettings(true); return }

    setLoadingAnalysis(true)
    setTerms([])
    setVideoMap({})

    try {
      const extracted = await analyzeContent(text, settings.groqKey)
      setTerms(extracted)
      setView('results')
      setLoadingAnalysis(false)
      fetchAllVideos(extracted)
    } catch (e) {
      showToast(e.message || 'Analysis failed', 'error')
      setLoadingAnalysis(false)
    }
  }
// Around line 84
// App.jsx - Updated fetchAllVideos function
  const fetchAllVideos = async (termsArr) => {
    setLoadingVideos(true)
    let errorShown = false // Flag to track if we've already shown an error

    for (const term of termsArr) {
      try {
        const vids = await searchVideos(term.searchQuery, settings.ytKey, 4)
        setVideoMap(prev => ({ ...prev, [term.term]: vids }))
      } catch (e) {
        // Set the term to an empty list so the UI doesn't spin forever
        setVideoMap(prev => ({ ...prev, [term.term]: [] }))

        // Only show the toast for the VERY FIRST error in this batch
        if (!errorShown) {
          showToast(`YouTube Error: ${e.message}`, 'error')
          errorShown = true
        }

        // CRITICAL: If the error is about "quota", stop the loop. 
        // There's no point in trying the other 19 topics if the key is empty.
        if (e.message.toLowerCase().includes('quota')) {
          console.error("Quota exceeded, stopping further searches.")
          break 
        }
      }
    }
    setLoadingVideos(false)
  }
  const handleAddToPlaylist = (video, term) => {
    setPlaylist(prev => {
      if (prev.find(p => p.video.id === video.id)) {
        showToast('Already in playlist')
        return prev
      }
      showToast(`Added "${video.title.substring(0, 40)}..."`)
      return [...prev, { video, term: term.term, order: term.order }]
    })
  }

  const handleRemoveFromPlaylist = (videoId) => {
    setPlaylist(prev => prev.filter(p => p.video.id !== videoId))
  }

  const handleReorder = (from, to) => {
    setPlaylist(prev => {
      const arr = [...prev]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return arr
    })
  }

  const hasKeys = !!(settings.groqKey && settings.ytKey)
  const playlistIds = playlist.map(p => p.video.id)

  const handleNavigate = (v) => {
    if (v === 'home' && terms.length > 0) {
      setView('results')
    } else if (v === 'home') {
      setView('home')
    } else {
      setView(v)
    }
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Header
        onSettings={() => setShowSettings(true)}
        view={view === 'results' ? 'home' : view}
        onNavigate={handleNavigate}
      />

      <main style={{ paddingBottom: 60 }}>
        {(view === 'home') && (
          <InputPanel
            onAnalyze={handleAnalyze}
            loading={loadingAnalysis}
            hasKeys={hasKeys}
          />
        )}

        {view === 'results' && (
          <TermsGrid
            terms={terms}
            videoMap={videoMap}
            loadingVideos={loadingVideos}
            onAddToPlaylist={handleAddToPlaylist}
            playlistIds={playlistIds}
            onReset={() => { setTerms([]); setVideoMap({}); setView('home') }}
          />
        )}

        {view === 'playlist' && (
          <PlaylistView
            playlist={playlist}
            onRemove={handleRemoveFromPlaylist}
            onReorder={handleReorder}
            onClear={() => { setPlaylist([]); showToast('Playlist cleared') }}
            settings={settings}
            accessToken={accessToken}
            onAuthRequest={() => {}}
            toast={showToast}
          />
        )}
      </main>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={s => { setSettings(s); showToast('Settings saved') }}
          onClose={() => setShowSettings(false)}
        />
      )}

      <LoadingOverlay visible={loadingAnalysis} />

      <StatsBar
        termCount={terms.length}
        videoCount={Object.values(videoMap).flat().length}
        playlistCount={playlist.length}
      />

      {toast && (
        <Toast
          key={toast.id}
          msg={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {/* Background gradient accent */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(232,213,163,0.06) 0%, transparent 70%)',
      }} />
    </div>
  )
}
