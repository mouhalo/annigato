import React, { useCallback, useState } from 'react'
import { Wand2, Loader2, RefreshCw, AlertTriangle, Sparkles, Check } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import {
  selectCreation,
  setGenerating,
  setGeneratedImage,
  setGenerationError,
  setAiPrompt,
} from '../creationSlice'
import { generateCakeImage, buildCakePrompt } from '../../../services/imageGeneration'
import { selectActiveProviderConfig } from '../../settings/settingsSlice'
import { cakeThemes, cakeBases, cakeSizes, cakeFlavors, cakeDecorations, cakeColors } from '../../../data/creationOptions'

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
    isGenerating,
    generatedImageUrl,
    generationError,
  } = creation

  // Resolve labels for display
  const themeObj = cakeThemes.find(t => t.id === selectedTheme)
  const baseObj = cakeBases.find(b => b.id === selectedBase)
  const shapeObj = baseObj?.shapes.find(s => s.id === selectedShape)
  const sizeObj = cakeSizes.find(s => s.id === selectedSize)
  const flavorObj = cakeFlavors.find(f => f.id === selectedFlavor)
  const decoObjs = cakeDecorations.filter(d => selectedDecorations.includes(d.id))
  const colorObjs = cakeColors.filter(c => selectedColors.includes(c.id))

  const handleGenerate = useCallback(async () => {
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
    dispatch(setGenerating(true))

    try {
      const result = await generateCakeImage({ prompt }, providerConfig)
      dispatch(setGeneratedImage(result.imageUrl))
    } catch (err) {
      dispatch(setGenerationError(
        err instanceof Error ? err.message : 'Une erreur est survenue lors de la generation'
      ))
    }
  }, [dispatch, themeObj, baseObj, shapeObj, flavorObj, decoObjs, colorObjs, cakeMessage])

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

      {/* Generate button / Loading / Result */}
      <GenerateSection
        generatedImageUrl={generatedImageUrl}
        isGenerating={isGenerating}
        generationError={generationError}
        onGenerate={handleGenerate}
        onImageError={() => dispatch(setGenerationError('L\'image n\'a pas pu etre chargee. Reessaie !'))}
      />
    </div>
  )
}

// Image generation section with loading and error states
const GenerateSection: React.FC<{
  generatedImageUrl: string | null
  isGenerating: boolean
  generationError: string | null
  onGenerate: () => void
  onImageError: () => void
}> = ({ generatedImageUrl, isGenerating, generationError, onGenerate, onImageError }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageLoadError, setImageLoadError] = useState(false)

  const showImage = generatedImageUrl && !isGenerating
  const showLoading = isGenerating || (showImage && !imageLoaded && !imageLoadError)

  return (
    <div className="flex flex-col items-center">
      {/* Generated image */}
      {showImage && (
        <div className={`mb-6 w-full max-w-sm transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src={generatedImageUrl}
              alt="Ton gateau genere par IA"
              className="w-full h-auto"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoadError(true)
                onImageError()
              }}
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          <p className="text-center mt-3 text-sm text-gray-500">
            Voila ton gateau ! Il est magnifique non ?
          </p>
        </div>
      )}

      {/* Loading state */}
      {showLoading && (
        <div className="mb-6 flex flex-col items-center gap-4 py-12">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-amber-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🎂</span>
            </div>
          </div>
          <p className="text-lg font-bold text-amber-600 animate-pulse">
            Creation en cours...
          </p>
          <p className="text-sm text-gray-400">
            {isGenerating
              ? 'Notre chef patissier IA prepare ton gateau !'
              : 'Chargement de l\'image... patience !'}
          </p>
        </div>
      )}

      {/* Error state */}
      {generationError && !isGenerating && (
        <div className="mb-6 bg-red-50 rounded-2xl p-4 flex items-start gap-3 max-w-sm w-full">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-semibold text-sm">Oups !</p>
            <p className="text-red-500 text-xs mt-1">{generationError}</p>
          </div>
        </div>
      )}

      {/* Generate / Regenerate button */}
      {!isGenerating && !(showImage && !imageLoaded && !imageLoadError) && (
        <button
          onClick={() => {
            setImageLoaded(false)
            setImageLoadError(false)
            onGenerate()
          }}
          className="
            flex items-center gap-3
            px-8 py-4 rounded-2xl
            bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500
            text-white font-bold text-lg
            shadow-lg shadow-orange-300/40
            hover:shadow-xl hover:shadow-orange-300/50
            hover:scale-105
            active:scale-95
            transition-all duration-300
            min-h-[56px]
          "
        >
          {generatedImageUrl && imageLoaded ? (
            <>
              <RefreshCw className="w-6 h-6" />
              <span>Regenerer mon gateau !</span>
            </>
          ) : (
            <>
              <Wand2 className="w-6 h-6" />
              <span>Generer mon gateau !</span>
            </>
          )}
        </button>
      )}
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
