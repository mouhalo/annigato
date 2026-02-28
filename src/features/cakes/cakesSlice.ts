import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store/store'
import type { Cake, CakeCreation } from '../../types/cake'

interface CakesState {
  catalog: Cake[]
  filteredCatalog: Cake[]
  selectedCategory: string
  userCreations: CakeCreation[]
  currentCreation: CakeCreation | null
  isLoading: boolean
  isGenerating: boolean
  error: string | null
  likedCakes: string[]
}

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
    setCatalog: (state, action: PayloadAction<Cake[]>) => {
      state.catalog = action.payload
      state.filteredCatalog = action.payload
    },

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

    toggleLike: (state, action: PayloadAction<string>) => {
      const cakeId = action.payload
      const index = state.likedCakes.indexOf(cakeId)

      if (index > -1) {
        state.likedCakes.splice(index, 1)
      } else {
        state.likedCakes.push(cakeId)
      }

      const cake = state.catalog.find(c => c.id === cakeId)
      if (cake) {
        cake.likes = index > -1 ? cake.likes - 1 : cake.likes + 1
      }
    },

    startCreation: (state, action: PayloadAction<CakeCreation>) => {
      state.currentCreation = action.payload
      state.userCreations.push(action.payload)
    },

    updateCreation: (state, action: PayloadAction<Partial<CakeCreation>>) => {
      if (state.currentCreation && action.payload.id === state.currentCreation.id) {
        state.currentCreation = { ...state.currentCreation, ...action.payload }

        const index = state.userCreations.findIndex(c => c.id === action.payload.id)
        if (index > -1) {
          state.userCreations[index] = state.currentCreation
        }
      }
    },

    saveCreation: (state) => {
      if (state.currentCreation) {
        state.currentCreation.status = 'completed'
        const index = state.userCreations.findIndex(c => c.id === state.currentCreation!.id)
        if (index > -1) {
          state.userCreations[index] = state.currentCreation
        }
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

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

export const selectCatalog = (state: RootState) => state.cakes.catalog
export const selectFilteredCatalog = (state: RootState) => state.cakes.filteredCatalog
export const selectSelectedCategory = (state: RootState) => state.cakes.selectedCategory
export const selectUserCreations = (state: RootState) => state.cakes.userCreations
export const selectCurrentCreation = (state: RootState) => state.cakes.currentCreation
export const selectLikedCakes = (state: RootState) => state.cakes.likedCakes
export const selectIsGenerating = (state: RootState) => state.cakes.isGenerating

export default cakesSlice.reducer
