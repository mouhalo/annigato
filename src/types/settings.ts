// === Providers d'images ===
export type ImageProviderType = 'huggingface' | 'pollinations' | 'placeholder'

export interface ImageProviderConfig {
  id: ImageProviderType
  label: string
  description: string
  requiresApiKey: boolean
  apiKey?: string
  model?: string
  baseUrl?: string
  enabled: boolean
}

// === Settings globaux ===
export interface AppSettings {
  // Provider d'images actif
  activeImageProvider: ImageProviderType

  // Configuration par provider
  imageProviders: Record<ImageProviderType, ImageProviderConfig>

  // LLM config
  llmProvider: 'claude' | 'openai' | 'ollama'
  llmApiKey?: string
  llmModel?: string

  // Admin
  adminPassword: string
  isAdminAuthenticated: boolean
}

// === Defaults ===
export const defaultImageProviders: Record<ImageProviderType, ImageProviderConfig> = {
  huggingface: {
    id: 'huggingface',
    label: 'HuggingFace',
    description: 'Utilise FLUX.1-schnell ou Stable Diffusion via HuggingFace Inference API',
    requiresApiKey: true,
    apiKey: '',
    model: 'black-forest-labs/FLUX.1-schnell',
    enabled: true,
  },
  pollinations: {
    id: 'pollinations',
    label: 'Pollinations.ai',
    description: 'Generation IA via Pollinations (FLUX, Seedream, etc.) - API key requise',
    requiresApiKey: true,
    apiKey: '',
    model: 'flux',
    enabled: true,
  },
  placeholder: {
    id: 'placeholder',
    label: 'Placeholder (Demo)',
    description: 'Image placeholder thematique - aucune API requise, fonctionne hors-ligne',
    requiresApiKey: false,
    enabled: true,
  },
}

export const defaultSettings: AppSettings = {
  activeImageProvider: 'pollinations',
  imageProviders: defaultImageProviders,
  llmProvider: 'claude',
  llmApiKey: '',
  llmModel: '',
  adminPassword: 'annigato2024',
  isAdminAuthenticated: false,
}
