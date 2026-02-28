import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store/store'
import type { CreationMode, CreationStep, ChatMessage, CreationState } from '../../types/creation'
import { petitChefSteps, grandPatissierSteps } from '../../data/creationOptions'

const initialState: CreationState = {
  mode: null,
  currentStep: 'theme',
  steps: [],
  selectedTheme: null,
  selectedBase: null,
  selectedShape: null,
  selectedSize: null,
  selectedFlavor: null,
  selectedGarniture: null,
  selectedDecorations: [],
  selectedColors: [],
  cakeMessage: '',
  aiPrompt: '',
  generatedImages: [null, null, null],
  generatingSlot: null,
  generationErrors: [null, null, null],
  selectedImageIndex: null,
  isChatOpen: false,
  chatMessages: [],
}

export const creationSlice = createSlice({
  name: 'creation',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<CreationMode>) => {
      const mode = action.payload
      state.mode = mode
      state.steps = mode === 'petit-chef' ? [...petitChefSteps] : [...grandPatissierSteps]
      state.currentStep = state.steps[0]
    },

    goToStep: (state, action: PayloadAction<CreationStep>) => {
      state.currentStep = action.payload
    },

    nextStep: (state) => {
      const idx = state.steps.indexOf(state.currentStep)
      if (idx < state.steps.length - 1) {
        state.currentStep = state.steps[idx + 1]
      }
    },

    prevStep: (state) => {
      const idx = state.steps.indexOf(state.currentStep)
      if (idx > 0) {
        state.currentStep = state.steps[idx - 1]
      }
    },

    selectTheme: (state, action: PayloadAction<string>) => {
      state.selectedTheme = action.payload
    },

    selectBase: (state, action: PayloadAction<string>) => {
      state.selectedBase = action.payload
    },

    selectShape: (state, action: PayloadAction<string>) => {
      state.selectedShape = action.payload
    },

    selectSize: (state, action: PayloadAction<string>) => {
      state.selectedSize = action.payload
    },

    selectFlavor: (state, action: PayloadAction<string>) => {
      state.selectedFlavor = action.payload
    },

    selectGarniture: (state, action: PayloadAction<string>) => {
      state.selectedGarniture = action.payload
    },

    toggleDecoration: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const idx = state.selectedDecorations.indexOf(id)
      if (idx > -1) {
        state.selectedDecorations.splice(idx, 1)
      } else {
        state.selectedDecorations.push(id)
      }
    },

    toggleColor: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const idx = state.selectedColors.indexOf(id)
      if (idx > -1) {
        state.selectedColors.splice(idx, 1)
      } else if (state.selectedColors.length < 3) {
        state.selectedColors.push(id)
      }
    },

    setCakeMessage: (state, action: PayloadAction<string>) => {
      state.cakeMessage = action.payload
    },

    setAiPrompt: (state, action: PayloadAction<string>) => {
      state.aiPrompt = action.payload
    },

    setGeneratedImage: (state, action: PayloadAction<{ index: number; url: string }>) => {
      const { index, url } = action.payload
      state.generatedImages[index] = url
      state.generatingSlot = null
      state.generationErrors[index] = null
    },

    setGenerating: (state, action: PayloadAction<number | null>) => {
      state.generatingSlot = action.payload
      if (action.payload !== null) {
        state.generationErrors[action.payload] = null
      }
    },

    setGenerationError: (state, action: PayloadAction<{ index: number; error: string }>) => {
      const { index, error } = action.payload
      state.generationErrors[index] = error
      state.generatingSlot = null
    },

    selectImage: (state, action: PayloadAction<number>) => {
      state.selectedImageIndex = action.payload
    },

    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen
    },

    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload)
    },

    // Appliquer les choix extraits par l'IA depuis le chat
    applyAIChoices: (state, action: PayloadAction<Partial<{
      theme: string
      base: string
      shape: string
      size: string
      flavor: string
      decorations: string[]
      colors: string[]
      message: string
    }>>) => {
      const c = action.payload
      if (c.theme) state.selectedTheme = c.theme
      if (c.base) state.selectedBase = c.base
      if (c.shape) state.selectedShape = c.shape
      if (c.size) state.selectedSize = c.size
      if (c.flavor) state.selectedFlavor = c.flavor
      if (c.decorations) state.selectedDecorations = c.decorations
      if (c.colors) state.selectedColors = c.colors
      if (c.message) state.cakeMessage = c.message
    },

    resetCreation: () => initialState,
  }
})

export const {
  setMode,
  goToStep,
  nextStep,
  prevStep,
  selectTheme,
  selectBase,
  selectShape,
  selectSize,
  selectFlavor,
  selectGarniture,
  toggleDecoration,
  toggleColor,
  setCakeMessage,
  setAiPrompt,
  setGeneratedImage,
  setGenerating,
  setGenerationError,
  selectImage,
  toggleChat,
  addChatMessage,
  applyAIChoices,
  resetCreation,
} = creationSlice.actions

export const selectCreation = (state: RootState) => state.creation
export const selectCreationMode = (state: RootState) => state.creation.mode
export const selectCurrentStep = (state: RootState) => state.creation.currentStep
export const selectCreationSteps = (state: RootState) => state.creation.steps
export const selectIsChatOpen = (state: RootState) => state.creation.isChatOpen
export const selectChatMessages = (state: RootState) => state.creation.chatMessages
export const selectGeneratingSlot = (state: RootState) => state.creation.generatingSlot
export const selectGeneratedImages = (state: RootState) => state.creation.generatedImages
export const selectSelectedImageIndex = (state: RootState) => state.creation.selectedImageIndex

export default creationSlice.reducer
