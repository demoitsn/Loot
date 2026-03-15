const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function analyzeContent(text, apiKey) {
  const prompt = `You are a learning path expert. Analyze the following text and extract 6-10 key concepts/terms that someone should learn to understand it fully.

For each term:
- Write a short description (1 sentence)
- Create an effective YouTube search query to find the best tutorial
- Assign a logical learning order (1 = most foundational)
- Assign a category (e.g., "Fundamentals", "Concepts", "Advanced", "Tools", "Practice")

Return ONLY a valid JSON array. No markdown, no explanation, just the JSON:
[
  {
    "term": "concept name",
    "description": "one sentence description",
    "searchQuery": "optimized youtube search query",
    "order": 1,
    "category": "Fundamentals",
    "difficulty": "beginner"
  }
]

difficulty must be: "beginner", "intermediate", or "advanced"

Text to analyze:
${text.substring(0, 3000)}`

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    // ... existing code
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', // UPDATED MODEL ID
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 3500,
    }),
// ... existing code
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq API error: ${res.status}`)
  }

  const data = await res.json()
  const content = data.choices[0].message.content.trim()

  // Extract JSON array from response
  const match = content.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Failed to parse AI response')

  const terms = JSON.parse(match[0])
  return terms.sort((a, b) => a.order - b.order)
}
