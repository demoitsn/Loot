# LOOT — AI Learning Playlist Builder

> Paste anything. Learn everything.

Loot analyzes your text, article, or document using AI, extracts key concepts, finds the best YouTube tutorials for each one, and builds a structured learning playlist — all in one clean interface.

---

## Features

- **AI Analysis** — Paste any text; Groq (Llama 3) extracts 6–10 key concepts with learning order
- **YouTube Search** — Automatically finds the best tutorial videos per concept
- **Learning Path** — Concepts are ordered from foundational → advanced
- **In-App Playlist** — Build and reorder your video playlist via drag & drop
- **YouTube Export** — Create the playlist directly in your YouTube account (requires OAuth)
- **Document Upload** — Supports `.txt`, `.md`, and plain text `.pdf`

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and add your API keys
cp .env.example .env

# 3. Start dev server
npm run dev
```

Then open http://localhost:5173

---

## API Keys (all free)

### 1. Groq API Key (required)
- Sign up at https://console.groq.com
- Create an API key
- Free tier: very generous limits

### 2. YouTube Data API v3 Key (required)
- Go to https://console.cloud.google.com
- Create a project → Enable "YouTube Data API v3"
- Create API credentials → API key
- Free: 10,000 units/day

### 3. Google OAuth Client ID (optional — for YouTube playlist creation)
- In Google Cloud Console → Credentials → Create OAuth 2.0 Client ID
- Application type: **Web application**
- Authorized JavaScript origins: `http://localhost:5173` (and your production URL)
- Add the Client ID to your `.env`

---

## Tech Stack

- **React 18** + Vite
- **Groq API** (Llama 3 70B) — free AI analysis
- **YouTube Data API v3** — video search & playlist creation
- **Google OAuth 2.0** — YouTube authentication (implicit flow)

---

## Build for Production

```bash
npm run build
# Output in /dist
```

---

Made with Loot ✦
