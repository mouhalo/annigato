import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store/store'

// Types pour l'authentification
interface User {
  id: string
  phone: string
  role: 'parent' | 'child'
  childProfiles?: ChildProfile[]
}

interface ChildProfile {
  id: string
  name: string
  age: number
  uiMode: 'PETIT_CHEF' | 'GRAND_PATISSIER'
}

interface AuthState {
  user: User | null
  activeChild: ChildProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// État initial
const initialState: AuthState = {
  user: null,
  activeChild: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Connexion réussie
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    
    // Déconnexion
    logout: (state) => {
      state.user = null
      state.activeChild = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    
    // Sélectionner un profil enfant
    selectChild: (state, action: PayloadAction<ChildProfile>) => {
      state.activeChild = action.payload
    },
    
    // Gestion du chargement
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    // Gestion des erreurs
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    }
  }
})

// Actions exportées
export const { loginSuccess, logout, selectChild, setLoading, setError } = authSlice.actions

// Sélecteurs
export const selectUser = (state: RootState) => state.auth.user
export const selectActiveChild = (state: RootState) => state.auth.activeChild
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError = (state: RootState) => state.auth.error

// Helper pour obtenir le mode UI actuel
export const selectUIMode = (state: RootState) => {
  const activeChild = state.auth.activeChild
  if (!activeChild) return 'PARENT'
  return activeChild.uiMode
}

// Reducer par défaut
export default authSlice.reducer
