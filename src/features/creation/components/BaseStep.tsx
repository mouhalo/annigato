import React from 'react'
import { Box, Layers, Users, Check } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { selectCreation, selectBase, selectShape, selectSize } from '../creationSlice'
import { cakeBases, cakeSizes } from '../../../data/creationOptions'

const BaseStep: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedBase, selectedShape, selectedSize } = useAppSelector(selectCreation)

  const currentBase = cakeBases.find(b => b.id === selectedBase)

  return (
    <div className="px-4 py-6 space-y-8">
      {/* Section 1: Base shape */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
            <Box className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Quelle forme ?</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cakeBases.map((base) => {
            const isSelected = selectedBase === base.id

            return (
              <button
                key={base.id}
                onClick={() => {
                  dispatch(selectBase(base.id))
                  // Auto-select first shape when base changes
                  if (base.shapes.length > 0) {
                    dispatch(selectShape(base.shapes[0].id))
                  }
                }}
                className={`
                  relative flex flex-col items-center justify-center
                  min-h-[100px] rounded-2xl p-4
                  border-2 transition-all duration-300 ease-out
                  active:scale-95
                  ${isSelected
                    ? 'border-orange-400 bg-orange-50 shadow-lg shadow-orange-200/50 scale-105'
                    : 'border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-orange-200'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <span className="text-4xl mb-2">{base.icon}</span>
                <span className={`font-bold text-sm ${isSelected ? 'text-orange-600' : 'text-gray-700'}`}>
                  {base.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Section 2: Shape variations (shown when base is selected) */}
      {currentBase && currentBase.shapes.length > 1 && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Quel style ?</h3>
          </div>

          <div className="flex gap-3">
            {currentBase.shapes.map((shape) => {
              const isSelected = selectedShape === shape.id

              return (
                <button
                  key={shape.id}
                  onClick={() => dispatch(selectShape(shape.id))}
                  className={`
                    flex-1 flex flex-col items-center justify-center
                    min-h-[90px] rounded-xl p-3
                    border-2 transition-all duration-300
                    active:scale-95
                    ${isSelected
                      ? 'border-blue-400 bg-blue-50 shadow-md shadow-blue-200/50'
                      : 'border-gray-200 bg-white hover:border-blue-200'
                    }
                  `}
                >
                  <span className="text-3xl mb-1">{shape.icon}</span>
                  <span className={`font-semibold text-xs ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                    {shape.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Section 3: Size */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Quelle taille ?</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cakeSizes.map((size) => {
            const isSelected = selectedSize === size.id

            return (
              <button
                key={size.id}
                onClick={() => dispatch(selectSize(size.id))}
                className={`
                  relative flex flex-col items-center justify-center
                  min-h-[80px] rounded-xl p-3
                  border-2 transition-all duration-300
                  active:scale-95
                  ${isSelected
                    ? 'border-green-400 bg-green-50 shadow-md shadow-green-200/50'
                    : 'border-gray-200 bg-white hover:border-green-200'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <span className={`font-bold text-base ${isSelected ? 'text-green-700' : 'text-gray-800'}`}>
                  {size.label}
                </span>
                <span className={`text-xs mt-1 ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>
                  {size.portions}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BaseStep
