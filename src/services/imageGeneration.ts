import type { ImageGenerationRequest, ImageGenerationResponse } from '../types/creation'
import type { ImageProviderConfig } from '../types/settings'

// =========================================================
// MULTI-PROVIDER IMAGE GENERATION SERVICE
// Providers: HuggingFace, Pollinations, Placeholder
// =========================================================

export async function generateCakeImage(
  request: ImageGenerationRequest,
  providerConfig?: ImageProviderConfig
): Promise<ImageGenerationResponse> {
  const provider = providerConfig?.id ?? request.provider ?? 'placeholder'
  const width = request.width ?? 512
  const height = request.height ?? 512

  switch (provider) {
    case 'huggingface':
      return generateWithHuggingFace(request.prompt, width, height, providerConfig)

    case 'pollinations':
      return generateWithPollinations(request.prompt, width, height, providerConfig)

    case 'placeholder':
    default:
      return generatePlaceholder(request.prompt)
  }
}

// =========================================================
// HUGGINGFACE INFERENCE API
// =========================================================
async function generateWithHuggingFace(
  prompt: string,
  width: number,
  height: number,
  config?: ImageProviderConfig
): Promise<ImageGenerationResponse> {
  const apiKey = config?.apiKey
  if (!apiKey) {
    throw new Error('Cle API HuggingFace requise. Configure-la dans les parametres admin.')
  }

  const model = config?.model ?? 'black-forest-labs/FLUX.1-schnell'
  const baseUrl = config?.baseUrl ?? 'https://api-inference.huggingface.co'

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000) // 2min timeout

  try {
    const response = await fetch(`${baseUrl}/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: Math.min(width, 1024),
          height: Math.min(height, 1024),
        },
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      const message = typeof error.error === 'string'
        ? error.error
        : error.error?.message ?? `Erreur HuggingFace (${response.status})`

      if (response.status === 503) {
        throw new Error('Le modele est en cours de chargement. Reessaie dans quelques secondes !')
      }

      throw new Error(message)
    }

    // La reponse est une image binaire - on cree un blob URL
    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob)

    return { imageUrl, provider: 'huggingface' }
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('La generation a pris trop de temps. Reessaie !')
    }
    throw err
  }
}

// =========================================================
// POLLINATIONS.AI (API gen.pollinations.ai)
// Auth: query parameter ?key= (Bearer header causes CORS in browsers)
// Endpoint: GET https://gen.pollinations.ai/image/{prompt}
// =========================================================
async function generateWithPollinations(
  prompt: string,
  width: number,
  height: number,
  config?: ImageProviderConfig
): Promise<ImageGenerationResponse> {
  const apiKey = config?.apiKey
  if (!apiKey) {
    throw new Error('Cle API Pollinations requise. Configure-la dans les parametres admin.')
  }

  const model = config?.model ?? 'flux'
  const encoded = encodeURIComponent(prompt)
  const params = new URLSearchParams({
    key: apiKey,
    width: String(Math.min(width, 1024)),
    height: String(Math.min(height, 1024)),
    model,
    nologo: 'true',
    private: 'true',
    seed: String(Date.now() % 2147483647),
  })
  const url = `https://gen.pollinations.ai/image/${encoded}?${params.toString()}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 90000) // 90s timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const msg = errorData?.error?.message ?? `Erreur Pollinations (${response.status})`
      throw new Error(msg)
    }

    // La reponse est une image binaire - on cree un blob URL
    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob)

    return { imageUrl, provider: 'pollinations' }
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('La generation a pris trop de temps (90s). Reessaie !')
    }
    throw err
  }
}

// =========================================================
// PLACEHOLDER (demo, fonctionne hors-ligne)
// =========================================================
async function generatePlaceholder(prompt: string): Promise<ImageGenerationResponse> {
  await new Promise(r => setTimeout(r, 1500))

  const lowerPrompt = prompt.toLowerCase()
  const theme = detectTheme(lowerPrompt)
  const svg = generateCakeSVG(theme)
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const imageUrl = URL.createObjectURL(blob)

  return { imageUrl, provider: 'placeholder' }
}

interface CakeThemeVisual {
  bg1: string; bg2: string; cakeColor: string; frostingColor: string
  decoColor: string; emoji: string; label: string
}

function detectTheme(prompt: string): CakeThemeVisual {
  const themes: Record<string, CakeThemeVisual> = {
    unicorn:   { bg1: '#FFE4F0', bg2: '#E8D5F5', cakeColor: '#F9A8D4', frostingColor: '#E879F9', decoColor: '#FBBF24', emoji: '🦄', label: 'Licorne' },
    superhero: { bg1: '#DBEAFE', bg2: '#E0E7FF', cakeColor: '#60A5FA', frostingColor: '#3B82F6', decoColor: '#EF4444', emoji: '🦸', label: 'Super-Heros' },
    princess:  { bg1: '#FCE7F3', bg2: '#F3E8FF', cakeColor: '#F9A8D4', frostingColor: '#D946EF', decoColor: '#FDE68A', emoji: '👑', label: 'Princesse' },
    pirate:    { bg1: '#FEF3C7', bg2: '#FDE68A', cakeColor: '#92400E', frostingColor: '#B45309', decoColor: '#1F2937', emoji: '🏴‍☠️', label: 'Pirate' },
    space:     { bg1: '#1E1B4B', bg2: '#312E81', cakeColor: '#6366F1', frostingColor: '#818CF8', decoColor: '#FBBF24', emoji: '🚀', label: 'Espace' },
    jungle:    { bg1: '#D1FAE5', bg2: '#A7F3D0', cakeColor: '#34D399', frostingColor: '#10B981', decoColor: '#F59E0B', emoji: '🌿', label: 'Jungle' },
    ocean:     { bg1: '#CFFAFE', bg2: '#A5F3FC', cakeColor: '#22D3EE', frostingColor: '#06B6D4', decoColor: '#F472B6', emoji: '🌊', label: 'Ocean' },
    rainbow:   { bg1: '#FDE68A', bg2: '#FBCFE8', cakeColor: '#FB923C', frostingColor: '#F472B6', decoColor: '#A78BFA', emoji: '🌈', label: 'Arc-en-ciel' },
  }

  for (const [key, t] of Object.entries(themes)) {
    if (prompt.includes(key)) return t
  }
  return themes.rainbow
}

function generateCakeSVG(t: CakeThemeVisual): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg1}"/>
      <stop offset="100%" style="stop-color:${t.bg2}"/>
    </linearGradient>
    <linearGradient id="cake" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${t.frostingColor}"/>
      <stop offset="100%" style="stop-color:${t.cakeColor}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)" rx="32"/>
  <ellipse cx="256" cy="380" rx="180" ry="30" fill="#E5E7EB" opacity="0.6"/>
  <rect x="136" y="260" width="240" height="120" rx="16" fill="url(#cake)"/>
  <rect x="156" y="200" width="200" height="80" rx="12" fill="${t.frostingColor}"/>
  <circle cx="176" cy="260" r="12" fill="${t.frostingColor}"/>
  <circle cx="216" cy="265" r="15" fill="${t.frostingColor}"/>
  <circle cx="256" cy="262" r="13" fill="${t.frostingColor}"/>
  <circle cx="296" cy="266" r="14" fill="${t.frostingColor}"/>
  <circle cx="336" cy="261" r="12" fill="${t.frostingColor}"/>
  <circle cx="196" cy="220" r="8" fill="${t.decoColor}"/>
  <circle cx="236" cy="215" r="6" fill="${t.decoColor}" opacity="0.8"/>
  <circle cx="276" cy="218" r="8" fill="${t.decoColor}"/>
  <circle cx="316" cy="215" r="6" fill="${t.decoColor}" opacity="0.8"/>
  <rect x="230" y="155" width="8" height="50" rx="4" fill="#FBBF24"/>
  <rect x="258" y="145" width="8" height="60" rx="4" fill="#FB923C"/>
  <rect x="286" y="152" width="8" height="53" rx="4" fill="#F472B6"/>
  <ellipse cx="234" cy="148" rx="6" ry="10" fill="#FDE68A"/>
  <ellipse cx="262" cy="138" rx="6" ry="10" fill="#FDE68A"/>
  <ellipse cx="290" cy="145" rx="6" ry="10" fill="#FDE68A"/>
  <text x="100" y="130" font-size="32" text-anchor="middle">✨</text>
  <text x="412" y="150" font-size="28" text-anchor="middle">✨</text>
  <text x="256" y="110" font-size="48" text-anchor="middle">${t.emoji}</text>
  <text x="256" y="440" font-size="18" font-family="Arial,sans-serif" font-weight="bold" fill="#6B7280" text-anchor="middle">Gateau ${t.label}</text>
  <text x="256" y="462" font-size="11" font-family="Arial,sans-serif" fill="#9CA3AF" text-anchor="middle">Apercu demo - Active un provider IA dans les parametres</text>
</svg>`
}

// =========================================================
// PROMPT BUILDER
// =========================================================
export function buildCakePrompt(choices: {
  theme?: string; base?: string; shape?: string; flavor?: string
  decorations?: string[]; colors?: string[]; message?: string
}): string {
  const parts: string[] = [
    'A beautiful birthday cake, professional bakery photo, white background, studio lighting'
  ]

  if (choices.theme) parts.push(`${choices.theme} themed`)
  if (choices.base) parts.push(`${choices.base} shaped`)
  if (choices.flavor) parts.push(`${choices.flavor} flavored`)
  if (choices.colors?.length) parts.push(`with ${choices.colors.join(' and ')} colors`)
  if (choices.decorations?.length) parts.push(`decorated with ${choices.decorations.join(', ')}`)
  if (choices.message) parts.push(`with "${choices.message}" written on it`)

  parts.push('kid-friendly, colorful, whimsical, cartoon style, 3D render')
  return parts.join(', ')
}
