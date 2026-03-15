const YT_BASE = 'https://www.googleapis.com/youtube/v3'
const OAUTH_SCOPE = 'https://www.googleapis.com/auth/youtube'

export async function searchVideos(query, apiKey, maxResults = 4) {
  const url = `${YT_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&videoDuration=medium&relevanceLanguage=en&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `YouTube API error: ${res.status}`)
  }
  const data = await res.json()
  if (!data.items) return []

  return data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
    publishedAt: item.snippet.publishedAt,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }))
}

export function initiateGoogleAuth(clientId) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: window.location.origin + window.location.pathname,
    response_type: 'token',
    scope: OAUTH_SCOPE,
    include_granted_scopes: 'true',
  })
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export function parseAccessTokenFromHash() {
  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(hash)
  const token = params.get('access_token')
  if (token) {
    // Clear hash
    history.replaceState(null, '', window.location.pathname)
    return token
  }
  return null
}

export async function createYouTubePlaylist(title, description, videoIds, accessToken) {
  // 1. Create playlist
  const plRes = await fetch(`${YT_BASE}/playlists?part=snippet,status`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      snippet: {
        title,
        description: description || 'Created by Loot — AI Learning Playlist',
        tags: ['loot', 'learning', 'education'],
      },
      status: { privacyStatus: 'public' },
    }),
  })

  if (!plRes.ok) throw new Error('Failed to create YouTube playlist')
  const pl = await plRes.json()
  const playlistId = pl.id

  // 2. Add videos sequentially
  for (let i = 0; i < videoIds.length; i++) {
    await fetch(`${YT_BASE}/playlistItems?part=snippet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        snippet: {
          playlistId,
          position: i,
          resourceId: { kind: 'youtube#video', videoId: videoIds[i] },
        },
      }),
    })
  }

  return {
    id: playlistId,
    url: `https://www.youtube.com/playlist?list=${playlistId}`,
    title,
  }
}
