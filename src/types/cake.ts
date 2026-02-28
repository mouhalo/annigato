export type CakeCategory = 'chocolate' | 'fruits' | 'magic' | 'special'

export interface Cake {
  id: string
  name: string
  description: string
  category: CakeCategory
  basePrice: number
  imageUrl: string
  color: string
  generatedByAI?: boolean
  likes: number
  stars: number
  ingredients?: string[]
  allergens?: string[]
  available: boolean
}

export interface CakeCreation {
  id: string
  cakeData: {
    base: string
    size: string
    flavor: string
    decorations: string[]
    colors: string[]
    message: string
    aiPrompt?: string
  }
  imageUrl?: string
  status: 'draft' | 'generating' | 'completed' | 'error'
  createdAt: string
}

export interface Category {
  id: string
  label: string
  icon: string
}
