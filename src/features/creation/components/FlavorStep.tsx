import React from 'react'
import { IceCreamCone, Check } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { selectCreation, selectFlavor } from '../creationSlice'
import { cakeFlavors } from '../../../data/creationOptions'

const categoryLabels: Record<string, string> = {
  classic: 'Classiques',
  fruit: 'Fruites',
  special: 'Speciales',
}

const FlavorStep: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedFlavor } = useAppSelector(selectCreation)

  // Group flavors by category
  const grouped = cakeFlavors.reduce<Record<string, typeof cakeFlavors>>((acc, flavor) => {
    if (!acc[flavor.category]) acc[flavor.category] = []
    acc[flavor.category].push(flavor)
    return acc
  }, {})

  return (
    <div className="px-4 py-6">
      {/* Section header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full px-5 py-2 mb-3">
          <IceCreamCone className="w-5 h-5 text-orange-500" />
          <span className="text-orange-700 font-bold text-lg">Quelle saveur ?</span>
        </div>
        <p className="text-gray-500 text-sm">
          Mmmh... laquelle te fait le plus envie ?
        </p>
      </div>

      {/* Flavors grouped by category */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, flavors]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 pl-1">
              {categoryLabels[category] || category}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {flavors.map((flavor) => {
                const isSelected = selectedFlavor === flavor.id

                return (
                  <button
                    key={flavor.id}
                    onClick={() => dispatch(selectFlavor(flavor.id))}
                    className={`
                      relative flex items-center gap-3
                      min-h-[64px] rounded-2xl px-4 py-3
                      border-2 transition-all duration-300 ease-out
                      active:scale-95
                      ${isSelected
                        ? 'border-transparent shadow-lg scale-105 animate-[bounceOnce_0.4s_ease-out]'
                        : 'border-gray-100 bg-white shadow-sm hover:shadow-md'
                      }
                    `}
                    style={{
                      backgroundColor: isSelected ? flavor.color + '35' : undefined,
                      borderColor: isSelected ? flavor.color : undefined,
                    }}
                  >
                    {/* Color circle */}
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        flex-shrink-0 transition-transform duration-300
                        ${isSelected ? 'scale-110' : ''}
                      `}
                      style={{ backgroundColor: flavor.color }}
                    >
                      {isSelected ? (
                        <Check className="w-5 h-5 text-white drop-shadow" />
                      ) : (
                        <span className="text-xl">{flavor.icon}</span>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`
                        font-bold text-sm text-left
                        ${isSelected ? 'text-gray-800' : 'text-gray-700'}
                      `}
                    >
                      {flavor.label}
                    </span>

                    {/* Sparkle indicator for selected */}
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 text-lg animate-spin" style={{ animationDuration: '3s' }}>
                        ✨
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selection feedback */}
      {selectedFlavor && (
        <div className="mt-6 text-center">
          <div className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 rounded-full px-5 py-2">
            <p className="text-orange-700 font-bold">
              {cakeFlavors.find(f => f.id === selectedFlavor)?.icon}{' '}
              Miam ! {cakeFlavors.find(f => f.id === selectedFlavor)?.label} !
            </p>
          </div>
        </div>
      )}

      {/* Custom bounce keyframe via inline style */}
      <style>{`
        @keyframes bounceOnce {
          0% { transform: scale(1); }
          30% { transform: scale(1.08); }
          50% { transform: scale(0.97); }
          70% { transform: scale(1.03); }
          100% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

export default FlavorStep
