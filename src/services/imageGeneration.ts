import type { ImageGenerationRequest, ImageGenerationResponse } from '../types/creation'

const POLLINATIONS_BASE_URL = 'https://image.pollinations.ai/prompt/'

function buildPollinationsUrl(prompt: string, width = 512, height = 512): string {
  const encoded = encodeURIComponent(prompt)
  return `${POLLINATIONS_BASE_URL}${encoded}?width=${width}&height=${height}&nologo=true&seed=${Date.now()}`
}

export async function generateCakeImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const provider = request.provider ?? 'pollinations'
  const width = request.width ?? 512
  const height = request.height ?? 512

  switch (provider) {
    case 'pollinations': {
      const imageUrl = buildPollinationsUrl(request.prompt, width, height)
      // Pollinations renvoie l'image directement via l'URL, on pre-charge pour verifier
      await new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Erreur de generation d\'image'))
        img.src = imageUrl
      })
      return { imageUrl, provider: 'pollinations' }
    }

    default:
      throw new Error(`Provider "${provider}" non supporte pour le moment`)
  }
}

// Construit un prompt optimise a partir des choix de l'utilisateur
export function buildCakePrompt(choices: {
  theme?: string
  base?: string
  shape?: string
  flavor?: string
  decorations?: string[]
  colors?: string[]
  message?: string
}): string {
  const parts: string[] = [
    'A beautiful birthday cake, professional bakery photo, white background, studio lighting'
  ]

  if (choices.theme) parts.push(`${choices.theme} themed`)
  if (choices.base) parts.push(`${choices.base} shaped`)
  if (choices.flavor) parts.push(`${choices.flavor} flavored`)
  if (choices.colors && choices.colors.length > 0) {
    parts.push(`with ${choices.colors.join(' and ')} colors`)
  }
  if (choices.decorations && choices.decorations.length > 0) {
    parts.push(`decorated with ${choices.decorations.join(', ')}`)
  }
  if (choices.message) {
    parts.push(`with "${choices.message}" written on it`)
  }

  parts.push('kid-friendly, colorful, whimsical, cartoon style, 3D render')

  return parts.join(', ')
}
