import React from 'react'
import { Palette, Check } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { selectCreation, toggleColor } from '../creationSlice'
import { cakeColors } from '../../../data/creationOptions'

const ColorsStep: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedColors } = useAppSelector(selectCreation)

  const maxColors = 3
  const isMaxReached = selectedColors.length >= maxColors

  return (
    <div className="px-4 py-6">
      {/* Section header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full px-5 py-2 mb-3">
          <Palette className="w-5 h-5 text-blue-500" />
          <span className="text-blue-700 font-bold text-lg">Choisis tes couleurs !</span>
        </div>
        <p className="text-gray-500 text-sm">
          Jusqu'a {maxColors} couleurs pour ton gateau
        </p>
      </div>

      {/* Selection counter */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          {Array.from({ length: maxColors }).map((_, i) => (
            <div
              key={i}
              className={`
                w-8 h-8 rounded-full border-2 transition-all duration-300
                flex items-center justify-center
                ${i < selectedColors.length
                  ? 'border-transparent shadow-md scale-110'
                  : 'border-dashed border-gray-300 bg-gray-50'
                }
              `}
              style={
                i < selectedColors.length
                  ? { backgroundColor: cakeColors.find(c => c.id === selectedColors[i])?.hex }
                  : undefined
              }
            >
              {i >= selectedColors.length && (
                <span className="text-gray-300 text-xs font-bold">{i + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Color palette grid */}
      <div className="flex flex-wrap justify-center gap-4">
        {cakeColors.map((color) => {
          const isSelected = selectedColors.includes(color.id)
          const isDisabled = isMaxReached && !isSelected

          return (
            <button
              key={color.id}
              onClick={() => dispatch(toggleColor(color.id))}
              disabled={isDisabled}
              className={`
                relative flex flex-col items-center gap-2
                transition-all duration-300 ease-out
                ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-90'}
              `}
            >
              {/* Color circle */}
              <div
                className={`
                  w-14 h-14 rounded-full transition-all duration-300
                  flex items-center justify-center
                  ${isSelected
                    ? 'ring-4 ring-offset-2 ring-blue-400 scale-110 shadow-lg'
                    : 'shadow-md hover:scale-105 hover:shadow-lg'
                  }
                  ${color.id === 'white' ? 'border border-gray-200' : ''}
                `}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-6 h-6 drop-shadow ${
                      color.id === 'white' || color.id === 'yellow'
                        ? 'text-gray-800'
                        : 'text-white'
                    }`}
                  />
                )}
              </div>

              {/* Color label */}
              <span
                className={`
                  text-xs font-semibold
                  ${isSelected ? 'text-blue-600' : 'text-gray-600'}
                `}
              >
                {color.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Max reached message */}
      {isMaxReached && (
        <div className="mt-6 text-center">
          <div className="inline-block bg-blue-50 rounded-full px-4 py-2">
            <p className="text-blue-600 text-sm font-semibold">
              {maxColors} couleurs selectionnees ! Touche une couleur pour la retirer.
            </p>
          </div>
        </div>
      )}

      {/* Preview of selected colors */}
      {selectedColors.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="bg-white rounded-2xl shadow-md px-6 py-3 flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Ton mix :</span>
            <div className="flex gap-1">
              {selectedColors.map((colorId) => {
                const color = cakeColors.find(c => c.id === colorId)
                return (
                  <div
                    key={colorId}
                    className="w-6 h-6 rounded-full shadow-sm"
                    style={{ backgroundColor: color?.hex }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorsStep
