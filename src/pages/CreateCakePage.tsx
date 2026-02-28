import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChefHat,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Home,
  Check,
  RotateCcw,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import {
  selectCreation,
  selectCreationMode,
  selectCurrentStep,
  selectCreationSteps,
  setMode,
  nextStep,
  prevStep,
  goToStep,
  resetCreation,
} from '../features/creation/creationSlice'
import { stepLabels } from '../data/creationOptions'
import type { CreationMode, CreationStep } from '../types/creation'

// Step components
import ThemeStep from '../features/creation/components/ThemeStep'
import BaseStep from '../features/creation/components/BaseStep'
import FlavorStep from '../features/creation/components/FlavorStep'
import DecorationStep from '../features/creation/components/DecorationStep'
import ColorsStep from '../features/creation/components/ColorsStep'
import MessageStep from '../features/creation/components/MessageStep'
import PreviewStep from '../features/creation/components/PreviewStep'
import AIChatAssistant from '../features/creation/components/AIChatAssistant'

const stepComponents: Record<CreationStep, React.FC> = {
  theme: ThemeStep,
  base: BaseStep,
  flavor: FlavorStep,
  decoration: DecorationStep,
  colors: ColorsStep,
  message: MessageStep,
  preview: PreviewStep,
}

const CreateCakePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const mode = useAppSelector(selectCreationMode)
  const currentStep = useAppSelector(selectCurrentStep)
  const steps = useAppSelector(selectCreationSteps)
  const creation = useAppSelector(selectCreation)

  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll to top when step changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const currentStepIdx = steps.indexOf(currentStep)
  const isFirstStep = currentStepIdx === 0
  const isLastStep = currentStepIdx === steps.length - 1
  const progressPercent = steps.length > 0 ? ((currentStepIdx + 1) / steps.length) * 100 : 0

  // Check if current step selection is valid to enable "Next"
  const canProceed = (() => {
    switch (currentStep) {
      case 'theme': return !!creation.selectedTheme
      case 'base': return !!creation.selectedBase
      case 'flavor': return !!creation.selectedFlavor
      case 'decoration': return creation.selectedDecorations.length > 0
      case 'colors': return creation.selectedColors.length > 0
      case 'message': return true // message is optional
      case 'preview': return true
      default: return false
    }
  })()

  const handleBack = () => {
    if (isFirstStep) {
      dispatch(resetCreation())
    } else {
      dispatch(prevStep())
    }
  }

  const handleHome = () => {
    dispatch(resetCreation())
    navigate('/')
  }

  // Mode selection screen
  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-pink-50 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-6 pb-2 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Creer mon gateau</h1>
        </div>

        {/* Mode selector */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
          <div className="text-center">
            <span className="text-6xl mb-4 block">🎂</span>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              Comment veux-tu creer ?
            </h2>
            <p className="text-gray-500 text-sm">Choisis ton mode de creation</p>
          </div>

          <div className="flex flex-col gap-5 w-full max-w-sm">
            {/* Petit Chef */}
            <ModeCard
              mode="petit-chef"
              icon={<Sparkles className="w-8 h-8" />}
              title="Petit Chef"
              subtitle="6-9 ans"
              description="Choisis un theme magique et on s'occupe du reste !"
              gradient="from-pink-400 to-purple-500"
              emoji="🧁"
              onSelect={() => dispatch(setMode('petit-chef'))}
            />

            {/* Grand Patissier */}
            <ModeCard
              mode="grand-patissier"
              icon={<ChefHat className="w-8 h-8" />}
              title="Grand Patissier"
              subtitle="10-13 ans"
              description="Personnalise chaque detail de ton gateau comme un pro !"
              gradient="from-amber-400 to-orange-500"
              emoji="🎂"
              onSelect={() => dispatch(setMode('grand-patissier'))}
            />
          </div>
        </div>

        {/* Chat assistant available even before mode selection */}
        <AIChatAssistant />
      </div>
    )
  }

  // Step creation screen
  const StepComponent = stepComponents[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-pink-50 flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
          aria-label={isFirstStep ? 'Changer de mode' : 'Etape precedente'}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1 text-center">
          <p className="text-xs text-gray-400 font-medium">
            {mode === 'petit-chef' ? 'Petit Chef' : 'Grand Patissier'}
          </p>
          <p className="text-sm font-bold text-gray-700">
            {stepLabels[currentStep]?.icon} {stepLabels[currentStep]?.label}
          </p>
        </div>

        <button
          onClick={handleHome}
          className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Retour a l'accueil"
        >
          <Home className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIdx
            const isCurrent = idx === currentStepIdx

            return (
              <button
                key={step}
                onClick={() => idx <= currentStepIdx && dispatch(goToStep(step))}
                disabled={idx > currentStepIdx}
                className={`
                  flex-1 h-2 rounded-full transition-all duration-500
                  ${isDone ? 'bg-green-400' : ''}
                  ${isCurrent ? 'bg-amber-400' : ''}
                  ${!isDone && !isCurrent ? 'bg-gray-200' : ''}
                  ${idx <= currentStepIdx ? 'cursor-pointer' : 'cursor-default'}
                `}
                aria-label={`Etape ${idx + 1}: ${stepLabels[step]?.label}`}
              />
            )
          })}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">
            Etape {currentStepIdx + 1}/{steps.length}
          </span>
          <span className="text-[10px] text-gray-400">
            {Math.round(progressPercent)}%
          </span>
        </div>
      </div>

      {/* Step content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto pb-28">
        <StepComponent />
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-3 flex items-center gap-3 z-40">
        {/* Reset button */}
        <button
          onClick={() => dispatch(resetCreation())}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors"
          aria-label="Recommencer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        {/* Navigation buttons */}
        {!isLastStep ? (
          <button
            onClick={() => dispatch(nextStep())}
            disabled={!canProceed}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
              transition-all duration-300
              ${canProceed
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-orange-300/30 hover:shadow-xl hover:scale-105 active:scale-95'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }
            `}
          >
            <span>Suivant</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          // On the preview (last) step, show a "done" indicator
          creation.generatedImageUrl && (
            <button
              onClick={() => navigate('/')}
              className="
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
                bg-gradient-to-r from-green-400 to-emerald-500 text-white
                shadow-lg shadow-green-300/30 hover:shadow-xl hover:scale-105 active:scale-95
                transition-all duration-300
              "
            >
              <Check className="w-4 h-4" />
              <span>Terminer</span>
            </button>
          )
        )}
      </div>

      {/* AI Chat Assistant */}
      <AIChatAssistant />
    </div>
  )
}

// Mode selection card
const ModeCard: React.FC<{
  mode: CreationMode
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  gradient: string
  emoji: string
  onSelect: () => void
}> = ({ icon, title, subtitle, description, gradient, emoji, onSelect }) => (
  <button
    onClick={onSelect}
    className="
      relative w-full rounded-3xl p-6 text-left
      bg-white shadow-lg hover:shadow-xl
      hover:scale-[1.02] active:scale-[0.98]
      transition-all duration-300
      overflow-hidden group
    "
  >
    {/* Gradient accent */}
    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />

    <div className="flex items-start gap-4">
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-extrabold text-gray-800">{title}</h3>
          <span className="text-xs font-bold bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
            {subtitle}
          </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Emoji */}
      <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
        {emoji}
      </span>
    </div>
  </button>
)

export default CreateCakePage
