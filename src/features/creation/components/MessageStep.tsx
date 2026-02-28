import React from 'react'
import { PenLine, MessageCircle } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { selectCreation, setCakeMessage } from '../creationSlice'

const MAX_CHARS = 50

const MessageStep: React.FC = () => {
  const dispatch = useAppDispatch()
  const { cakeMessage } = useAppSelector(selectCreation)

  const charCount = cakeMessage.length
  const charsRemaining = MAX_CHARS - charCount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= MAX_CHARS) {
      dispatch(setCakeMessage(value))
    }
  }

  return (
    <div className="px-4 py-6">
      {/* Section header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-full px-5 py-2 mb-3">
          <PenLine className="w-5 h-5 text-violet-500" />
          <span className="text-violet-700 font-bold text-lg">Ecris ton message !</span>
        </div>
        <p className="text-gray-500 text-sm">
          Qu'est-ce que tu veux ecrire sur ton gateau ?
        </p>
      </div>

      {/* Input field */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={cakeMessage}
            onChange={handleChange}
            placeholder="Ex: Joyeux anniversaire Lola !"
            maxLength={MAX_CHARS}
            className={`
              w-full px-5 py-4 rounded-2xl
              text-lg font-semibold text-center
              border-2 transition-all duration-300
              placeholder:text-gray-300 placeholder:font-normal placeholder:text-base
              focus:outline-none focus:ring-4
              ${charCount > 0
                ? 'border-violet-400 focus:ring-violet-200 bg-violet-50/50'
                : 'border-gray-200 focus:ring-violet-100 focus:border-violet-300 bg-white'
              }
            `}
          />

          {/* Character counter */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span
              className={`
                text-xs font-bold rounded-full px-2 py-1
                ${charsRemaining <= 10
                  ? charsRemaining <= 0
                    ? 'bg-red-100 text-red-500'
                    : 'bg-amber-100 text-amber-600'
                  : 'bg-gray-100 text-gray-400'
                }
              `}
            >
              {charsRemaining}
            </span>
          </div>
        </div>

        {/* Character bar */}
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all duration-300
              ${charCount / MAX_CHARS > 0.8
                ? 'bg-amber-400'
                : 'bg-violet-400'
              }
            `}
            style={{ width: `${(charCount / MAX_CHARS) * 100}%` }}
          />
        </div>
      </div>

      {/* Cake preview with message */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Simple cake illustration */}
          <div className="w-64 h-48 relative flex flex-col items-center justify-end">
            {/* Candles */}
            <div className="flex gap-3 mb-1">
              <div className="w-1.5 h-8 bg-pink-400 rounded-t-full relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              <div className="w-1.5 h-6 bg-blue-400 rounded-t-full relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
              <div className="w-1.5 h-8 bg-green-400 rounded-t-full relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>

            {/* Cake top (icing) */}
            <div className="w-52 h-6 bg-gradient-to-b from-pink-300 to-pink-400 rounded-t-3xl relative">
              {/* Dripping icing */}
              <div className="absolute bottom-0 left-6 w-3 h-4 bg-pink-300 rounded-b-full" />
              <div className="absolute bottom-0 left-16 w-4 h-5 bg-pink-300 rounded-b-full" />
              <div className="absolute bottom-0 right-10 w-3 h-3 bg-pink-300 rounded-b-full" />
            </div>

            {/* Cake body */}
            <div className="w-56 bg-gradient-to-b from-amber-100 to-amber-200 rounded-b-2xl flex items-center justify-center px-4 py-5 relative overflow-hidden">
              {/* Message on cake */}
              {cakeMessage ? (
                <p className="text-center font-bold text-pink-600 text-sm leading-tight break-words max-w-full">
                  {cakeMessage}
                </p>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-300">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-medium italic">Ton message ici...</span>
                </div>
              )}

              {/* Subtle cake texture lines */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-amber-300/30" />
            </div>

            {/* Cake plate */}
            <div className="w-64 h-3 bg-gradient-to-b from-gray-200 to-gray-300 rounded-b-xl" />
          </div>
        </div>
      </div>

      {/* Fun suggestion chips */}
      <div className="mt-6">
        <p className="text-center text-xs text-gray-400 mb-3">Besoin d'idees ?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            'Joyeux anniversaire !',
            'Bonne fete !',
            'Tu es genial(e) !',
            'Bravo champion !',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => dispatch(setCakeMessage(suggestion))}
              className="
                px-3 py-1.5 rounded-full text-xs font-medium
                bg-violet-50 text-violet-500 border border-violet-200
                hover:bg-violet-100 active:scale-95
                transition-all duration-200
              "
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MessageStep
