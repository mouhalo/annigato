import React, { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Mic, MicOff, Loader2, Sparkles, Bot, User } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import {
  selectIsChatOpen,
  selectChatMessages,
  toggleChat,
  addChatMessage,
  applyAIChoices,
} from '../creationSlice'
import { selectSettings } from '../../settings/settingsSlice'
import { sendChatMessage, extractChoicesFromResponse } from '../../../services/llmService'
import type { LLMMessage, ChatMessage } from '../../../types/creation'

const AIChatAssistant: React.FC = () => {
  const dispatch = useAppDispatch()
  const isChatOpen = useAppSelector(selectIsChatOpen)
  const chatMessages = useAppSelector(selectChatMessages)
  const settings = useAppSelector(selectSettings)

  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Check Speech-to-Text support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setSpeechSupported(!!SpeechRecognition)
  }, [])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isChatOpen])

  const handleSend = useCallback(async () => {
    const text = inputText.trim()
    if (!text || isLoading) return

    setInputText('')

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    dispatch(addChatMessage(userMsg))

    // Build LLM messages array from chat history
    const llmMessages: LLMMessage[] = [
      ...chatMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: text },
    ]

    setIsLoading(true)
    try {
      const response = await sendChatMessage(llmMessages, {
        provider: settings.llmProvider,
        apiKey: settings.llmApiKey,
        model: settings.llmModel || undefined,
      })

      // Add assistant message
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }
      dispatch(addChatMessage(assistantMsg))

      // Check if AI returned choices
      const choices = extractChoicesFromResponse(response)
      if (choices) {
        dispatch(applyAIChoices(choices as Parameters<typeof applyAIChoices>[0]))
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: 'Oups, j\'ai un petit probleme. Peux-tu reessayer ?',
        timestamp: Date.now(),
      }
      dispatch(addChatMessage(errorMsg))
    } finally {
      setIsLoading(false)
    }
  }, [inputText, isLoading, chatMessages, dispatch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleSpeech = useCallback(() => {
    if (!speechSupported) return

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('')
      setInputText(transcript)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [speechSupported, isListening])

  // Format message content - hide JSON blocks
  const formatMessage = (content: string) => {
    return content.replace(/```choices\n[\s\S]*?\n```/g, '').trim()
  }

  return (
    <>
      {/* Floating button */}
      {!isChatOpen && (
        <button
          onClick={() => dispatch(toggleChat())}
          className="
            fixed bottom-6 right-6 z-50
            w-16 h-16 rounded-full
            bg-gradient-to-br from-violet-500 to-fuchsia-500
            text-white shadow-xl shadow-violet-300/50
            flex items-center justify-center
            hover:scale-110 active:scale-95
            transition-all duration-300
            animate-bounce
          "
          style={{ animationDuration: '2s' }}
          aria-label="Ouvrir l'assistant IA"
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7" />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300" />
          </div>
        </button>
      )}

      {/* Chat panel */}
      {isChatOpen && (
        <div
          className="
            fixed bottom-0 right-0 z-50
            w-full sm:w-96 sm:bottom-6 sm:right-6
            h-[80vh] sm:h-[500px] sm:max-h-[70vh]
            bg-white rounded-t-3xl sm:rounded-3xl
            shadow-2xl border border-gray-100
            flex flex-col overflow-hidden
            animate-[slideUp_0.3s_ease-out]
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Chef Patou</h3>
                <p className="text-white/70 text-xs">Ton assistant gateau !</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleChat())}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Fermer le chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Welcome message if empty */}
            {chatMessages.length === 0 && (
              <div className="flex gap-2.5 items-start">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-violet-500" />
                </div>
                <div className="bg-violet-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <p className="text-sm text-gray-700">
                    Salut ! Je suis <strong>Chef Patou</strong> !
                    Dis-moi quel gateau tu reves d'avoir et je t'aide a le creer !
                  </p>
                  <p className="text-xs text-violet-400 mt-2">
                    Tu peux ecrire ou utiliser le micro pour me parler !
                  </p>
                </div>
              </div>
            )}

            {/* Chat messages */}
            {chatMessages.map((msg) => {
              const displayContent = formatMessage(msg.content)
              if (!displayContent) return null

              return msg.role === 'assistant' ? (
                <div key={msg.id} className="flex gap-2.5 items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-violet-500" />
                  </div>
                  <div className="bg-violet-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{displayContent}</p>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex gap-2.5 items-start justify-end">
                  <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-white font-medium">{displayContent}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-violet-500" />
                </div>
                <div className="bg-violet-50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-violet-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-violet-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-violet-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2 flex-shrink-0 bg-gray-50/50">
            {/* Mic button */}
            {speechSupported && (
              <button
                onClick={toggleSpeech}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-300/50 animate-pulse'
                    : 'bg-gray-100 text-gray-500 hover:bg-violet-100 hover:text-violet-500'
                  }
                `}
                aria-label={isListening ? 'Arreter la dictee' : 'Dicter un message'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            {/* Text input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? 'Parle, je t\'ecoute...' : 'Ecris ton message...'}
                disabled={isLoading}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-white border border-gray-200
                  text-sm text-gray-700
                  placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300
                  disabled:opacity-50
                "
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-300
                ${inputText.trim() && !isLoading
                  ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                  : 'bg-gray-100 text-gray-300'
                }
              `}
              aria-label="Envoyer le message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatAssistant
