import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store/store'
import type { AppSettings, ImageProviderType, ImageProviderConfig } from '../../types/settings'
import { defaultSettings } from '../../types/settings'

const STORAGE_KEY = 'annigato_settings'

// Charge les settings depuis localStorage
function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AppSettings>
      return { ...defaultSettings, ...parsed, isAdminAuthenticated: false }
    }
  } catch {
    console.warn('Failed to load settings from localStorage')
  }
  return { ...defaultSettings }
}

// Sauvegarde les settings dans localStorage (sans le flag admin)
function saveSettings(settings: AppSettings) {
  try {
    const toSave = { ...settings, isAdminAuthenticated: false }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    console.warn('Failed to save settings to localStorage')
  }
}

const initialState: AppSettings = loadSettings()

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Admin auth
    adminLogin: (state, action: PayloadAction<string>) => {
      if (action.payload === state.adminPassword) {
        state.isAdminAuthenticated = true
      }
    },

    adminLogout: (state) => {
      state.isAdminAuthenticated = false
    },

    changeAdminPassword: (state, action: PayloadAction<string>) => {
      state.adminPassword = action.payload
      saveSettings(state)
    },

    // Image provider
    setActiveImageProvider: (state, action: PayloadAction<ImageProviderType>) => {
      state.activeImageProvider = action.payload
      saveSettings(state)
    },

    updateImageProvider: (state, action: PayloadAction<{
      id: ImageProviderType
      config: Partial<ImageProviderConfig>
    }>) => {
      const { id, config } = action.payload
      state.imageProviders[id] = { ...state.imageProviders[id], ...config }
      saveSettings(state)
    },

    // LLM config
    setLLMProvider: (state, action: PayloadAction<'claude' | 'openai' | 'ollama'>) => {
      state.llmProvider = action.payload
      saveSettings(state)
    },

    setLLMApiKey: (state, action: PayloadAction<string>) => {
      state.llmApiKey = action.payload
      saveSettings(state)
    },

    setLLMModel: (state, action: PayloadAction<string>) => {
      state.llmModel = action.payload
      saveSettings(state)
    },

    // Reset
    resetSettings: () => {
      localStorage.removeItem(STORAGE_KEY)
      return { ...defaultSettings }
    },
  },
})

export const {
  adminLogin,
  adminLogout,
  changeAdminPassword,
  setActiveImageProvider,
  updateImageProvider,
  setLLMProvider,
  setLLMApiKey,
  setLLMModel,
  resetSettings,
} = settingsSlice.actions

// Selectors
export const selectSettings = (state: RootState) => state.settings
export const selectIsAdmin = (state: RootState) => state.settings.isAdminAuthenticated
export const selectActiveImageProvider = (state: RootState) => state.settings.activeImageProvider
export const selectImageProviders = (state: RootState) => state.settings.imageProviders
export const selectActiveProviderConfig = (state: RootState) =>
  state.settings.imageProviders[state.settings.activeImageProvider]

export default settingsSlice.reducer
