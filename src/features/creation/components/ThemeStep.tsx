import React from 'react'
import { Sparkles } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { selectCreation, selectTheme } from '../creationSlice'
import { cakeThemes } from '../../../data/creationOptions'

const ThemeStep: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedTheme } = useAppSelector(selectCreation)

  return (
    <div className="px-4 py-6">
      {/* Section header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-5 py-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-purple-700 font-bold text-lg">Choisis ton theme !</span>
        </div>
        <p className="text-gray-500 text-sm">
          Quel univers pour ton gateau magique ?
        </p>
      </div>

      {/* Themes grid */}
      <div className="grid grid-cols-2 gap-4">
        {cakeThemes.map((theme) => {
          const isSelected = selectedTheme === theme.id

          return (
            <button
              key={theme.id}
              onClick={() => dispatch(selectTheme(theme.id))}
              className={`
                relative flex flex-col items-center justify-center
                min-h-[120px] rounded-2xl p-4
                transition-all duration-300 ease-out
                active:scale-95
                ${isSelected
                  ? 'ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-105'
                  : 'shadow-md hover:shadow-lg hover:scale-[1.02]'
                }
              `}
              style={{
                backgroundColor: theme.color + '30',
                borderColor: isSelected ? theme.color : 'transparent',
                borderWidth: '2px',
              }}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Theme icon */}
              <span className="text-5xl mb-2 drop-shadow-sm">{theme.icon}</span>

              {/* Theme label */}
              <span
                className={`
                  font-bold text-sm
                  ${isSelected ? 'text-gray-800' : 'text-gray-700'}
                `}
              >
                {theme.label}
              </span>

              {/* Subtle color bar at bottom */}
              <div
                className="absolute bottom-0 left-4 right-4 h-1 rounded-full"
                style={{ backgroundColor: theme.color }}
              />
            </button>
          )
        })}
      </div>

      {/* Selection feedback */}
      {selectedTheme && (
        <div className="mt-6 text-center animate-[bounce_0.5s_ease-in-out]">
          <p className="text-lg font-bold text-purple-600">
            {cakeThemes.find(t => t.id === selectedTheme)?.icon}{' '}
            Super choix ! Theme {cakeThemes.find(t => t.id === selectedTheme)?.label} !
          </p>
        </div>
      )}
    </div>
  )
}

export default ThemeStep
