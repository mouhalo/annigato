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

// =========================================================
// ImageSlot — a single generation slot with 5 visual states
// =========================================================
const ImageSlot: React.FC<{
  index: number
  image: string | null
  isGenerating: boolean
  error: string | null
  isSelected: boolean
  allGenerated: boolean
  anyGenerating: boolean
  onGenerate: (index: number) => void
  onSelect: (index: number) => void
}> = ({ index, image, isGenerating, error, isSelected, allGenerated, anyGenerating, onGenerate, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const slotLabel = index + 1

  // Determine state
  const hasImage = image !== null && !error
  const showImage = hasImage && !isGenerating

  // --- Container ---
  let containerClasses = 'relative rounded-2xl overflow-hidden transition-all duration-300 aspect-square flex flex-col items-center justify-center '

  if (isSelected && showImage) {
    // Selected state
    containerClasses += 'border-4 border-amber-400 shadow-lg shadow-amber-200/50 bg-white'
  } else if (showImage) {
    // Generated state
    containerClasses += 'border-2 border-white shadow-xl bg-white'
  } else if (isGenerating) {
    // Generating state
    containerClasses += 'border-2 border-dashed border-amber-300 bg-amber-50/50'
  } else if (error) {
    // Error state
    containerClasses += 'border-2 border-dashed border-red-300 bg-red-50/50'
  } else {
    // Empty state
    containerClasses += 'border-2 border-dashed border-gray-300 bg-gray-50'
  }

  // --- Button ---
  const renderButton = () => {
    if (isGenerating) {
      // Generating — disabled grayed button with loader
      return (
        <button
          disabled
          className="
            mt-3 flex items-center justify-center gap-2
            px-4 py-2.5 rounded-xl
            bg-gray-200 text-gray-400
            font-bold text-sm
            cursor-not-allowed
            w-full
          "
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Creation...</span>
        </button>
      )
    }

    if (error) {
      // Error — retry button (same gradient as generate)
      return (
        <button
          onClick={() => onGenerate(index)}
          disabled={anyGenerating}
          className={`
            mt-3 flex items-center justify-center gap-2
            px-4 py-2.5 rounded-xl
            font-bold text-sm
            w-full transition-all duration-200
            ${anyGenerating
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95'}
          `}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reessayer {slotLabel}</span>
        </button>
      )
    }

    if (showImage) {
      // Generated / Selected — "Choix X" button
      const isDisabled = !allGenerated
      if (isSelected) {
        return (
          <button
            disabled
            className="
              mt-3 flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-amber-400 to-amber-500
              text-white font-bold text-sm
              w-full
              cursor-default
            "
          >
            <Check className="w-4 h-4" />
            <span>Choix {slotLabel}</span>
          </button>
        )
      }
      return (
        <button
          onClick={() => onSelect(index)}
          disabled={isDisabled}
          className={`
            mt-3 flex items-center justify-center gap-2
            px-4 py-2.5 rounded-xl
            font-bold text-sm
            w-full transition-all duration-200
            ${isDisabled
              ? 'border-2 border-gray-200 text-gray-300 bg-white cursor-not-allowed'
              : 'border-2 border-amber-300 text-amber-600 bg-white hover:bg-amber-50 hover:border-amber-400 hover:scale-[1.02] active:scale-95'}
          `}
        >
          <span>Choix {slotLabel}</span>
        </button>
      )
    }

    // Empty — "Generer X" button (orange/pink gradient)
    return (
      <button
        onClick={() => onGenerate(index)}
        disabled={anyGenerating}
        className={`
          mt-3 flex items-center justify-center gap-2
          px-4 py-2.5 rounded-xl
          font-bold text-sm
          w-full transition-all duration-200
          ${anyGenerating
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95'}
        `}
      >
        <Wand2 className="w-4 h-4" />
        <span>Generer {slotLabel}</span>
      </button>
    )
  }

  // --- Content ---
  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 p-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl">🎂</span>
            </div>
          </div>
          <p className="text-sm font-bold text-amber-600 animate-pulse">Creation...</p>
          <p className="text-xs text-gray-400 text-center">Notre chef patissier IA prepare ton gateau !</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <p className="text-sm font-semibold text-red-600">Oups !</p>
          <p className="text-xs text-red-400 text-center line-clamp-2">{error}</p>
        </div>
      )
    }

    if (showImage) {
      return (
        <div className="relative w-full h-full">
          {/* Image loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          )}
          <img
            src={image!}
            alt={`Gateau version ${slotLabel}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent" />
          {/* Selected badge */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-amber-400 text-white rounded-full p-1.5 shadow-lg">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
      )
    }

    // Empty state
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        <ImageIcon className="w-12 h-12 text-gray-300" />
        <p className="text-xs text-gray-400 font-medium">Version {slotLabel}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className={containerClasses}>
        {renderContent()}
      </div>
      {renderButton()}
    </div>
  )
}

// =========================================================
// SummaryRow — small helper for summary display
// =========================================================
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

// =========================================================
// PreviewStep — main component
// =========================================================
const PreviewStep: React.FC = () => {
  const dispatch = useAppDispatch()
  const creation = useAppSelector(selectCreation)
  const providerConfig = useAppSelector(selectActiveProviderConfig)

  const {
    mode,
    selectedTheme,
    selectedBase,
    selectedShape,
    selectedSize,
    selectedFlavor,
    selectedDecorations,
    selectedColors,
    cakeMessage,
    generatedImages,
    generatingSlot,
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

  // Derived state
  const anyGenerating = generatingSlot !== null
  const allGenerated = generatedImages.every(img => img !== null) && generationErrors.every(err => err === null)

  // Instruction text
  const getInstructionText = (): string => {
    if (selectedImageIndex !== null) {
      return 'Super choix ! Clique sur Terminer pour valider.'
    }
    if (allGenerated) {
      return 'Clique sur ton gateau prefere pour le selectionner !'
    }
    return 'Genere 3 versions de ton gateau, puis choisis ta preferee !'
  }

  // Generate handler — takes a slot index
  const handleGenerate = useCallback(async (slotIndex: number) => {
    // Build prompt from selections
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

  // Select handler
  const handleSelect = useCallback((index: number) => {
    dispatch(selectImage(index))
  }, [dispatch])

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
        {/* Theme (Petit Chef only) */}
        {mode === 'petit-chef' && themeObj && (
          <SummaryRow icon={themeObj.icon} label="Theme" value={themeObj.label} />
        )}

        {/* Base & Shape (Grand Patissier only) */}
        {mode === 'grand-patissier' && baseObj && (
          <SummaryRow
            icon={baseObj.icon}
            label="Forme"
            value={`${baseObj.label}${shapeObj ? ` - ${shapeObj.label}` : ''}`}
          />
        )}

        {/* Size (Grand Patissier only) */}
        {mode === 'grand-patissier' && sizeObj && (
          <SummaryRow icon="📐" label="Taille" value={`${sizeObj.label} (${sizeObj.portions})`} />
        )}

        {/* Flavor */}
        {flavorObj && (
          <SummaryRow icon={flavorObj.icon} label="Saveur" value={flavorObj.label} />
        )}

        {/* Decorations (Grand Patissier only) */}
        {mode === 'grand-patissier' && decoObjs.length > 0 && (
          <SummaryRow
            icon="✨"
            label="Decorations"
            value={decoObjs.map(d => d.label).join(', ')}
          />
        )}

        {/* Colors (Grand Patissier only) */}
        {mode === 'grand-patissier' && colorObjs.length > 0 && (
          <div className="flex items-center gap-3 py-2">
            <span className="text-xl">🎨</span>
            <div className="flex-1">
              <span className="text-xs text-gray-400 font-medium">Couleurs</span>
              <div className="flex items-center gap-2 mt-1">
                {colorObjs.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-1"
                  >
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

        {/* Message */}
        {cakeMessage && (
          <SummaryRow icon="💬" label="Message" value={`"${cakeMessage}"`} />
        )}
      </div>

      {/* Instruction text */}
      <div className="text-center mb-4">
        <p className="text-sm font-semibold text-gray-600 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl px-4 py-3 inline-block">
          {getInstructionText()}
        </p>
      </div>

      {/* 3 Image Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((slotIndex) => (
          <ImageSlot
            key={slotIndex}
            index={slotIndex}
            image={generatedImages[slotIndex]}
            isGenerating={generatingSlot === slotIndex}
            error={generationErrors[slotIndex]}
            isSelected={selectedImageIndex === slotIndex}
            allGenerated={allGenerated}
            anyGenerating={anyGenerating}
            onGenerate={handleGenerate}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default PreviewStep
