import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store/store'

// Types pour les gâteaux
interface Cake {
  id: string
  name: string
  description: string
  category: 'chocolate' | 'fruits' | 'magic' | 'special'
  basePrice: number
  imageUrl: string
  generatedByAI?: boolean
  likes: number
  stars: number
  ingredients?: string[]
  allergens?: string[]
  available: boolean
}

interface CakeCreation {
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

interface CakesState {
  // Catalogue de gâteaux
  catalog: Cake[]
  filteredCatalog: Cake[]
  selectedCategory: string
  
  // Créations de l'utilisateur
  userCreations: CakeCreation[]
  currentCreation: CakeCreation | null
  
  // États de chargement
  isLoading: boolean
  isGenerating: boolean
  error: string | null
  
  // Favoris
  likedCakes: string[]
}

// État initial
const initialState: CakesState = {
  catalog: [],
  filteredCatalog: [],
  selectedCategory: 'all',
  userCreations: [],
  currentCreation: null,
  isLoading: false,
  isGenerating: false,
  error: null,
  likedCakes: []
}

export const cakesSlice = createSlice({
  name: 'cakes',
  initialState,
  reducers: {
    // Charger le catalogue
    setCatalog: (state, action: PayloadAction<Cake[]>) => {
      state.catalog = action.payload
      state.filteredCatalog = action.payload
    },
    
    // Filtrer par catégorie
    filterByCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
      if (action.payload === 'all') {
        state.filteredCatalog = state.catalog
      } else {
        state.filteredCatalog = state.catalog.filter(
          cake => cake.category === action.payload
        )
      }
    },
    
    // Gérer les likes
    toggleLike: (state, action: PayloadAction<string>) => {
      const cakeId = action.payload
      const index = state.likedCakes.indexOf(cakeId)
      
      if (index > -1) {
        state.likedCakes.splice(index, 1)
      } else {
        state.likedCakes.push(cakeId)
      }
      
      // Mettre à jour le compteur de likes dans le catalogue
      const cake = state.catalog.find(c => c.id === cakeId)
      if (cake) {
        cake.likes = index > -1 ? cake.likes - 1 : cake.likes + 1
      }
    },
    
    // Commencer une nouvelle création
    startCreation: (state, action: PayloadAction<CakeCreation>) => {
      state.currentCreation = action.payload
      state.userCreations.push(action.payload)
    },
    
    // Mettre à jour la création en cours
    updateCreation: (state, action: PayloadAction<Partial<CakeCreation>>) => {
      if (state.currentCreation && action.payload.id === state.currentCreation.id) {
        state.currentCreation = { ...state.currentCreation, ...action.payload }
        
        // Mettre à jour aussi dans la liste des créations
        const index = state.userCreations.findIndex(c => c.id === action.payload.id)
        if (index > -1) {
          state.userCreations[index] = state.currentCreation
        }
      }
    },
    
    // Sauvegarder la création
    saveCreation: (state) => {
      if (state.currentCreation) {
        state.currentCreation.status = 'completed'
        const index = state.userCreations.findIndex(c => c.id === state.currentCreation!.id)
        if (index > -1) {
          state.userCreations[index] = state.currentCreation
        }
      }
    },
    
    // États de chargement
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload
    },
    
    // Gestion des erreurs
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

// Actions exportées
export const {
  setCatalog,
  filterByCategory,
  toggleLike,
  startCreation,
  updateCreation,
  saveCreation,
  setLoading,
  setGenerating,
  setError
} = cakesSlice.actions

// Sélecteurs
export const selectCatalog = (state: RootState) => state.cakes.catalog
export const selectFilteredCatalog = (state: RootState) => state.cakes.filteredCatalog
export const selectSelectedCategory = (state: RootState) => state.cakes.selectedCategory
export const selectUserCreations = (state: RootState) => state.cakes.userCreations
export const selectCurrentCreation = (state: RootState) => state.cakes.currentCreation
export const selectLikedCakes = (state: RootState) => state.cakes.likedCakes
export const selectIsGenerating = (state: RootState) => state.cakes.isGenerating

// Reducer par défaut
export default cakesSlice.reducer
