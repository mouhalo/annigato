import React from 'react'
import { Sparkles, Check } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { selectCreation, toggleDecoration } from '../creationSlice'
import { cakeDecorations } from '../../../data/creationOptions'

const categoryLabels: Record<string, { label: string; icon: string }> = {
  topping: { label: 'Toppings', icon: '🍓' },
  figurine: { label: 'Figurines', icon: '🧸' },
  sprinkle: { label: 'Saupoudrages', icon: '🌈' },
  candle: { label: 'Bougies', icon: '🕯' },
}

const categoryOrder = ['topping', 'sprinkle', 'figurine', 'candle']

const DecorationStep: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedDecorations } = useAppSelector(selectCreation)

  // Group decorations by category
  const grouped = cakeDecorations.reduce<Record<string, typeof cakeDecorations>>((acc, deco) => {
    if (!acc[deco.category]) acc[deco.category] = []
    acc[deco.category].push(deco)
    return acc
  }, {})

  return (
    <div className="px-4 py-6">
      {/* Section header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-5 py-2 mb-3">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <span className="text-pink-700 font-bold text-lg">Decore ton gateau !</span>
        </div>
        <p className="text-gray-500 text-sm">
          Choisis autant de decorations que tu veux !
        </p>
      </div>

      {/* Selected count badge */}
      {selectedDecorations.length > 0 && (
        <div className="flex justify-center mb-4">
          <div className="bg-pink-500 text-white rounded-full px-4 py-1.5 text-sm font-bold shadow-md">
            {selectedDecorations.length} decoration{selectedDecorations.length > 1 ? 's' : ''} choisie{selectedDecorations.length > 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Decorations grouped by category */}
      <div className="space-y-6">
        {categoryOrder.map((cat) => {
          const decos = grouped[cat]
          if (!decos) return null
          const catInfo = categoryLabels[cat]

          return (
            <div key={cat}>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 pl-1 flex items-center gap-2">
                <span>{catInfo.icon}</span>
                <span>{catInfo.label}</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {decos.map((deco) => {
                  const isSelected = selectedDecorations.includes(deco.id)

                  return (
                    <button
                      key={deco.id}
                      onClick={() => dispatch(toggleDecoration(deco.id))}
                      className={`
                        relative flex items-center gap-3
                        min-h-[60px] rounded-2xl px-4 py-3
                        border-2 transition-all duration-200 ease-out
                        active:scale-95
                        ${isSelected
                          ? 'border-pink-400 bg-pink-50 shadow-md shadow-pink-200/40'
                          : 'border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-pink-200'
                        }
                      `}
                    >
                      {/* Checkmark or icon */}
                      <div
                        className={`
                          w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                          transition-all duration-200
                          ${isSelected
                            ? 'bg-pink-400 text-white'
                            : 'bg-gray-100 text-gray-400'
                          }
                        `}
                      >
                        {isSelected ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="text-xl">{deco.icon}</span>
                        )}
                      </div>

                      {/* Label */}
                      <div className="flex-1 text-left">
                        <span className={`font-semibold text-sm ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                          {deco.label}
                        </span>
                      </div>

                      {/* Selected emoji badge */}
                      {isSelected && (
                        <span className="text-lg">{deco.icon}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DecorationStep
