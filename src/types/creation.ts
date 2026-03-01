// === Mode de creation ===
export type CreationMode = 'petit-chef' | 'grand-patissier'

// === Etapes de creation ===
export type PetitChefStep = 'theme' | 'flavor' | 'message' | 'preview'
export type GrandPatissierStep = 'base' | 'flavor' | 'decoration' | 'colors' | 'message' | 'preview'
export type CreationStep = PetitChefStep | GrandPatissierStep

// === Options disponibles ===
export interface CakeBase {
  id: string
  label: string
  icon: string
  shapes: CakeShape[]
}

export interface CakeShape {
  id: string
  label: string
  icon: string
}

export interface CakeSize {
  id: string
  label: string
  portions: string
  priceMultiplier: number
}

export interface CakeFlavor {
  id: string
  label: string
  color: string
  icon: string
  category: 'classic' | 'fruit' | 'special'
}

export interface CakeDecoration {
  id: string
  label: string
  icon: string
  category: 'topping' | 'figurine' | 'sprinkle' | 'candle'
}

export interface CakeTheme {
  id: string
  label: string
  icon: string
  color: string
  suggestedFlavor: string
  suggestedDecorations: string[]
}

// === Etat de la creation en cours ===
export interface CreationState {
  mode: CreationMode | null
  currentStep: CreationStep
  steps: CreationStep[]

  // Selections de l'utilisateur
  selectedTheme: string | null
  selectedBase: string | null
  selectedShape: string | null
  selectedSize: string | null
  selectedFlavor: string | null
  selectedGarniture: string | null
  selectedDecorations: string[]
  selectedColors: string[]
  cakeMessage: string

  // Generation IA (3 slots)
  aiPrompt: string
  generatedImages: (string | null)[]
  generatingSlot: number | null
  generationErrors: (string | null)[]
  selectedImageIndex: number | null

  // Chat IA
  isChatOpen: boolean
  chatMessages: ChatMessage[]
}

// === Chat IA ===
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// === Service de generation d'images ===
export type ImageProvider = 'huggingface' | 'pollinations' | 'placeholder' | 'replicate' | 'stability'

export interface ImageGenerationRequest {
  prompt: string
  provider?: ImageProvider
  width?: number
  height?: number
}

export interface ImageGenerationResponse {
  imageUrl: string
  provider: ImageProvider
}

// === Service LLM ===
export type LLMProvider = 'claude' | 'openai' | 'ollama'

export interface LLMConfig {
  provider: LLMProvider
  apiKey?: string
  baseUrl?: string
  model?: string
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
