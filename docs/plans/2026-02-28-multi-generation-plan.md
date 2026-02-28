# Multi-Generation Preview (3 slots) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the single cake image generation with 3 generation slots, letting the user generate 3 variants and pick their favorite.

**Architecture:** Extend the Redux creation slice with arrays for 3 image slots (generatedImages, generationErrors, generatingSlot) and a selectedImageIndex. Rewrite PreviewStep UI to show 3 containers with generate/choose buttons, respecting the state machine (empty → generating → generated → selected).

**Tech Stack:** React 18, TypeScript, Redux Toolkit, TailwindCSS v4, Lucide icons

---

### Task 1: Update CreationState type

**Files:**
- Modify: `src/types/creation.ts:71-75`

**Step 1: Replace single-image fields with multi-slot fields**

Replace lines 71-75 in `src/types/creation.ts`:

```typescript
  // Generation IA (3 slots)
  aiPrompt: string
  generatedImages: (string | null)[]
  generatingSlot: number | null
  generationErrors: (string | null)[]
  selectedImageIndex: number | null
```

Old code to replace:
```typescript
  // Generation IA
  aiPrompt: string
  generatedImageUrl: string | null
  isGenerating: boolean
  generationError: string | null
```

**Step 2: Verify TypeScript compiles (expect errors in slice/components - that's normal)**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: Errors in `creationSlice.ts` and `PreviewStep.tsx` (they still reference old fields)

**Step 3: Commit**

```bash
git add src/types/creation.ts
git commit -m "feat: update CreationState type for 3 generation slots"
```

---

### Task 2: Update creationSlice Redux state and actions

**Files:**
- Modify: `src/features/creation/creationSlice.ts`

**Step 1: Update initialState (lines 6-25)**

Replace the generation-related fields in `initialState`:

```typescript
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
```

**Step 2: Replace generation-related reducers (lines 108-124)**

Remove `setGeneratedImage`, `setGenerating`, `setGenerationError` and replace with:

```typescript
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
```

**Step 3: Add `selectImage` to the exports (line 160-182)**

Add `selectImage` to the destructured exports:

```typescript
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
```

**Step 4: Update selectors (lines 184-191)**

Replace the old selectors:

```typescript
export const selectCreation = (state: RootState) => state.creation
export const selectCreationMode = (state: RootState) => state.creation.mode
export const selectCurrentStep = (state: RootState) => state.creation.currentStep
export const selectCreationSteps = (state: RootState) => state.creation.steps
export const selectIsChatOpen = (state: RootState) => state.creation.isChatOpen
export const selectChatMessages = (state: RootState) => state.creation.chatMessages
export const selectGeneratingSlot = (state: RootState) => state.creation.generatingSlot
export const selectGeneratedImages = (state: RootState) => state.creation.generatedImages
export const selectSelectedImageIndex = (state: RootState) => state.creation.selectedImageIndex
```

**Step 5: Commit**

```bash
git add src/features/creation/creationSlice.ts
git commit -m "feat: update creationSlice for 3-slot generation with selectImage action"
```

---

### Task 3: Update CreateCakePage "Terminer" button

**Files:**
- Modify: `src/pages/CreateCakePage.tsx:256`

**Step 1: Replace the condition for showing Terminer button**

Replace `creation.generatedImageUrl &&` (line 256) with:

```typescript
          creation.selectedImageIndex !== null && (
```

This ensures "Terminer" only shows when the user has selected one of their 3 generated images.

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: Errors only in `PreviewStep.tsx` (not yet updated)

**Step 3: Commit**

```bash
git add src/pages/CreateCakePage.tsx
git commit -m "feat: Terminer button requires selectedImageIndex instead of single image"
```

---

### Task 4: Rewrite PreviewStep component

**Files:**
- Modify: `src/features/creation/components/PreviewStep.tsx` (full rewrite)

**Step 1: Rewrite the entire PreviewStep.tsx**

Replace the full content of `PreviewStep.tsx` with the implementation below.

Key architecture:
- `PreviewStep` (main) — renders summary + 3 `ImageSlot` components + Terminer button
- `ImageSlot` — renders one slot (empty/loading/generated/selected/error states)
- `SummaryRow` — unchanged helper

```typescript
import React, { useCallback, useState } from 'react'
import { Wand2, Loader2, RefreshCw, AlertTriangle, Sparkles, Check, ImageIcon } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import {
  selectCreation,
  setGenerating,
  setGeneratedImage,
  setGenerationError,
  setAiPrompt,
  selectImage,
} from '../creationSlice'
import { generateCakeImage, buildCakePrompt } from '../../../services/imageGeneration'
import { selectActiveProviderConfig } from '../../settings/settingsSlice'
import { cakeThemes, cakeBases, cakeSizes, cakeFlavors, cakeDecorations, cakeColors } from '../../../data/creationOptions'

const MAX_SLOTS = 3

const PreviewStep: React.FC = () => {
  const dispatch = useAppDispatch()
  const creation = useAppSelector(selectCreation)
  const providerConfig = useAppSelector(selectActiveProviderConfig)

  const {
    mode,
    selectedTheme,
    selectedBase,
    selectedShape,
    selectedFlavor,
    selectedDecorations,
    selectedColors,
    cakeMessage,
    generatingSlot,
    generatedImages,
    generationErrors,
    selectedImageIndex,
  } = creation

  // Resolve labels for display
  const themeObj = cakeThemes.find(t => t.id === selectedTheme)
  const baseObj = cakeBases.find(b => b.id === selectedBase)
  const shapeObj = baseObj?.shapes.find(s => s.id === selectedShape)
  const sizeObj = cakeSizes.find(s => s.id === selectedSize)
  const flavorObj = cakeFlavors.find(f => f.id === selectedFlavor)
  const decoObjs = cakeDecorations.filter(d => selectedDecorations.includes(d.id))
  const colorObjs = cakeColors.filter(c => selectedColors.includes(c.id))

  const allGenerated = generatedImages.every(img => img !== null)
  const isAnyGenerating = generatingSlot !== null

  const handleGenerate = useCallback(async (slotIndex: number) => {
    const prompt = buildCakePrompt({
      theme: themeObj?.label,
      base: baseObj?.label,
      shape: shapeObj?.label,
      flavor: flavorObj?.label,
      decorations: decoObjs.map(d => d.label),
      colors: colorObjs.map(c => c.label),
      message: cakeMessage || undefined,
    })

    dispatch(setAiPrompt(prompt))
    dispatch(setGenerating(slotIndex))

    try {
      const result = await generateCakeImage({ prompt }, providerConfig)
      dispatch(setGeneratedImage({ index: slotIndex, url: result.imageUrl }))
    } catch (err) {
      dispatch(setGenerationError({
        index: slotIndex,
        error: err instanceof Error ? err.message : 'Une erreur est survenue lors de la generation',
      }))
    }
  }, [dispatch, themeObj, baseObj, shapeObj, flavorObj, decoObjs, colorObjs, cakeMessage, providerConfig])

  const handleSelect = useCallback((slotIndex: number) => {
    if (allGenerated) {
      dispatch(selectImage(slotIndex))
    }
  }, [dispatch, allGenerated])

  return (
    <div className="px-4 py-6">
      {/* Section header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full px-5 py-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-amber-700 font-bold text-lg">Ton gateau !</span>
        </div>
        <p className="text-gray-500 text-sm">
          Voici un resume de tes choix
        </p>
      </div>

      {/* Selections summary */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-6 space-y-3">
        {mode === 'petit-chef' && themeObj && (
          <SummaryRow icon={themeObj.icon} label="Theme" value={themeObj.label} />
        )}
        {mode === 'grand-patissier' && baseObj && (
          <SummaryRow
            icon={baseObj.icon}
            label="Forme"
            value={`${baseObj.label}${shapeObj ? ` - ${shapeObj.label}` : ''}`}
          />
        )}
        {mode === 'grand-patissier' && sizeObj && (
          <SummaryRow icon="📐" label="Taille" value={`${sizeObj.label} (${sizeObj.portions})`} />
        )}
        {flavorObj && (
          <SummaryRow icon={flavorObj.icon} label="Saveur" value={flavorObj.label} />
        )}
        {mode === 'grand-patissier' && decoObjs.length > 0 && (
          <SummaryRow
            icon="✨"
            label="Decorations"
            value={decoObjs.map(d => d.label).join(', ')}
          />
        )}
        {mode === 'grand-patissier' && colorObjs.length > 0 && (
          <div className="flex items-center gap-3 py-2">
            <span className="text-xl">🎨</span>
            <div className="flex-1">
              <span className="text-xs text-gray-400 font-medium">Couleurs</span>
              <div className="flex items-center gap-2 mt-1">
                {colorObjs.map((c) => (
                  <div key={c.id} className="flex items-center gap-1">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm border border-gray-200"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-sm text-gray-700">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <Check className="w-4 h-4 text-green-400" />
          </div>
        )}
        {cakeMessage && (
          <SummaryRow icon="💬" label="Message" value={`"${cakeMessage}"`} />
        )}
      </div>

      {/* Instruction */}
      <p className="text-center text-sm text-gray-400 mb-4">
        {!allGenerated
          ? 'Genere 3 versions de ton gateau, puis choisis ta preferee !'
          : selectedImageIndex === null
            ? 'Clique sur ton gateau prefere pour le selectionner !'
            : 'Super choix ! Clique sur "Terminer" pour valider.'}
      </p>

      {/* 3 Generation Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: MAX_SLOTS }, (_, i) => (
          <ImageSlot
            key={i}
            index={i}
            imageUrl={generatedImages[i]}
            isGenerating={generatingSlot === i}
            isAnyGenerating={isAnyGenerating}
            error={generationErrors[i]}
            isSelected={selectedImageIndex === i}
            allGenerated={allGenerated}
            onGenerate={() => handleGenerate(i)}
            onSelect={() => handleSelect(i)}
          />
        ))}
      </div>
    </div>
  )
}

// === Image Slot Component ===
const ImageSlot: React.FC<{
  index: number
  imageUrl: string | null
  isGenerating: boolean
  isAnyGenerating: boolean
  error: string | null
  isSelected: boolean
  allGenerated: boolean
  onGenerate: () => void
  onSelect: () => void
}> = ({ index, imageUrl, isGenerating, isAnyGenerating, error, isSelected, allGenerated, onGenerate, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const slotNum = index + 1
  const hasImage = imageUrl !== null

  // Container border style
  const containerClass = isSelected
    ? 'border-3 border-amber-400 shadow-lg shadow-amber-200/50 ring-2 ring-amber-300'
    : hasImage
      ? 'border-2 border-gray-200 shadow-md'
      : 'border-2 border-dashed border-gray-300'

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-white transition-all duration-300 ${containerClass}`}>
      {/* Selected badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 bg-amber-400 text-white rounded-full p-1.5 shadow-md">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Image area */}
      <div
        className="aspect-square flex items-center justify-center cursor-pointer"
        onClick={hasImage && allGenerated ? onSelect : undefined}
      >
        {/* Empty state */}
        {!hasImage && !isGenerating && !error && (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <ImageIcon className="w-12 h-12" />
            <span className="text-xs font-medium">Gateau {slotNum}</span>
          </div>
        )}

        {/* Loading state */}
        {isGenerating && (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg">🎂</span>
              </div>
            </div>
            <p className="text-xs text-amber-600 font-bold animate-pulse">Creation...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isGenerating && (
          <div className="flex flex-col items-center gap-2 p-3 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-xs text-red-500 line-clamp-2">{error}</p>
          </div>
        )}

        {/* Generated image */}
        {hasImage && !isGenerating && (
          <img
            src={imageUrl}
            alt={`Gateau genere ${slotNum}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        )}
      </div>

      {/* Action button */}
      <div className="p-2">
        {!hasImage || error ? (
          // Generate / Retry button
          <button
            onClick={onGenerate}
            disabled={isAnyGenerating}
            className={`
              w-full flex items-center justify-center gap-2
              px-3 py-2.5 rounded-xl
              font-bold text-sm
              transition-all duration-300
              ${isAnyGenerating
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-white shadow-md shadow-orange-300/30 hover:shadow-lg hover:scale-[1.02] active:scale-95'
              }
            `}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : error ? (
              <RefreshCw className="w-4 h-4" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>
              {isGenerating ? 'Creation...' : error ? `Reessayer ${slotNum}` : `Generer ${slotNum}`}
            </span>
          </button>
        ) : (
          // Choice button
          <button
            onClick={onSelect}
            disabled={!allGenerated}
            className={`
              w-full flex items-center justify-center gap-2
              px-3 py-2.5 rounded-xl
              font-bold text-sm
              transition-all duration-300
              ${!allGenerated
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : isSelected
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-white shadow-md shadow-amber-300/30'
                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600 hover:shadow-md'
              }
            `}
          >
            {isSelected && <Check className="w-4 h-4" />}
            <span>Choix {slotNum}</span>
          </button>
        )}
      </div>
    </div>
  )
}

// Small helper component for summary rows
const SummaryRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-b-0">
    <span className="text-xl">{icon}</span>
    <div className="flex-1">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <p className="text-sm text-gray-700 font-semibold">{value}</p>
    </div>
    <Check className="w-4 h-4 text-green-400" />
  </div>
)

export default PreviewStep
```

NOTE: There is a reference to `selectedSize` that needs to be destructured from `creation` — add it in the destructuring block.

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/features/creation/components/PreviewStep.tsx
git commit -m "feat: rewrite PreviewStep with 3 generation slots and selection UI"
```

---

### Task 5: Visual verification in browser

**Step 1: Start dev server if not running**

Run: `npm run dev`

**Step 2: Test the full flow**

1. Navigate to http://localhost:3000/creer
2. Select Petit Chef > Licorne > Fraise > type message > Suivant
3. Verify: 3 empty slots with "Generer 1/2/3" buttons
4. Click "Generer 1" — verify loading state, then image appears
5. Verify "Generer 2/3" were disabled during generation
6. Click "Generer 2" then "Generer 3"
7. Verify: all 3 "Choix 1/2/3" buttons become active
8. Click "Choix 2" — verify golden border highlight
9. Click "Choix 3" — verify selection switches
10. Verify "Terminer" button appears in bottom bar
11. Click "Terminer" — verify navigation to home

**Step 3: Test error handling**

1. Temporarily set invalid API key in admin settings
2. Click "Generer 1" — verify error display with "Reessayer 1" button
3. Fix API key, click "Reessayer 1" — verify it regenerates

**Step 4: Test responsive**

1. Resize browser to mobile width (~375px)
2. Verify slots stack vertically
3. Verify buttons remain usable

**Step 5: Final commit if any adjustments were needed**

```bash
git add -A
git commit -m "fix: visual adjustments for multi-generation preview"
```
