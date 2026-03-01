import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Settings,
  Image,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  RotateCcw,
  Shield,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import {
  selectSettings,
  selectIsAdmin,
  adminLogin,
  adminLogout,
  setActiveImageProvider,
  updateImageProvider,
  setLLMProvider,
  setLLMApiKey,
  setLLMModel,
  resetSettings,
} from '../features/settings/settingsSlice'
import type { ImageProviderType } from '../types/settings'

const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectSettings)
  const isAdmin = useAppSelector(selectIsAdmin)

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [savedFeedback, setSavedFeedback] = useState('')

  const handleLogin = () => {
    dispatch(adminLogin(password))
    if (password !== settings.adminPassword) {
      setLoginError(true)
      setTimeout(() => setLoginError(false), 3000)
    }
    setPassword('')
  }

  const showSaved = (msg: string) => {
    setSavedFeedback(msg)
    setTimeout(() => setSavedFeedback(''), 2000)
  }

  // Login screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <div className="px-4 pt-6 pb-2 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Administration</h1>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Acces Admin</h2>
              <p className="text-sm text-gray-400 mt-1">Entrez le mot de passe administrateur</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Mot de passe"
                  className={`
                    w-full px-4 py-3 rounded-xl border text-sm
                    focus:outline-none focus:ring-2
                    ${loginError
                      ? 'border-red-300 focus:ring-red-300'
                      : 'border-gray-200 focus:ring-violet-300 focus:border-violet-300'
                    }
                  `}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Mot de passe incorrect
                </p>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Parametres Admin
          </h1>
        </div>
        <button
          onClick={() => dispatch(adminLogout())}
          className="text-sm text-red-500 font-medium hover:text-red-600"
        >
          Deconnexion
        </button>
      </div>

      {/* Save feedback */}
      {savedFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {savedFeedback}
        </div>
      )}

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">

        {/* === IMAGE PROVIDERS === */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Image className="w-5 h-5 text-amber-500" /> Generation d'images
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Choisis le fournisseur d'images IA pour la creation de gateaux
            </p>
          </div>

          <div className="p-5 space-y-4">
            {/* Provider selector */}
            {(Object.keys(settings.imageProviders) as ImageProviderType[]).map((providerId) => {
              const provider = settings.imageProviders[providerId]
              const isActive = settings.activeImageProvider === providerId

              return (
                <div
                  key={providerId}
                  className={`
                    rounded-xl border-2 p-4 transition-all cursor-pointer
                    ${isActive
                      ? 'border-amber-400 bg-amber-50/50 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200'
                    }
                  `}
                  onClick={() => {
                    dispatch(setActiveImageProvider(providerId))
                    showSaved('Provider sauvegarde !')
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                      ${isActive ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}
                    `}>
                      {isActive && <Check className="w-3 h-3 text-white" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-800">{provider.label}</span>
                        {provider.requiresApiKey && (
                          <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-medium">
                            API Key
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{provider.description}</p>

                      {/* API Key input for providers that need it */}
                      {isActive && provider.requiresApiKey && (
                        <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <label className="text-xs font-medium text-gray-600">Cle API</label>
                            <input
                              type="password"
                              value={provider.apiKey ?? ''}
                              onChange={(e) => {
                                dispatch(updateImageProvider({ id: providerId, config: { apiKey: e.target.value } }))
                                showSaved('Cle API sauvegardee !')
                              }}
                              placeholder={providerId === 'huggingface' ? 'hf_xxxxxxxxxxxxxxxx' : providerId === 'pollinations' ? 'sk_xxxxxxxxxxxxxxxx' : 'Cle API'}
                              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                          </div>

                          {providerId === 'huggingface' && (
                            <div>
                              <label className="text-xs font-medium text-gray-600">Modele</label>
                              <select
                                value={provider.model ?? 'black-forest-labs/FLUX.1-schnell'}
                                onChange={(e) => {
                                  dispatch(updateImageProvider({ id: providerId, config: { model: e.target.value } }))
                                  showSaved('Modele sauvegarde !')
                                }}
                                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                              >
                                <option value="black-forest-labs/FLUX.1-schnell">FLUX.1-schnell (rapide)</option>
                                <option value="black-forest-labs/FLUX.1-dev">FLUX.1-dev (qualite)</option>
                                <option value="stabilityai/stable-diffusion-xl-base-1.0">Stable Diffusion XL</option>
                                <option value="runwayml/stable-diffusion-v1-5">Stable Diffusion v1.5</option>
                              </select>
                            </div>
                          )}

                          {providerId === 'pollinations' && (
                            <div>
                              <label className="text-xs font-medium text-gray-600">Modele</label>
                              <select
                                value={provider.model ?? 'flux'}
                                onChange={(e) => {
                                  dispatch(updateImageProvider({ id: providerId, config: { model: e.target.value } }))
                                  showSaved('Modele sauvegarde !')
                                }}
                                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                              >
                                <option value="flux">FLUX (defaut)</option>
                                <option value="flux-pro">FLUX Pro</option>
                                <option value="gpt-image">GPT Image</option>
                                <option value="seedream">Seedream</option>
                                <option value="imagen-4">Imagen 4</option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* === LLM CONFIG === */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-500" /> Assistant IA (Chat)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Configure le LLM pour l'assistant Chef Patou (mode mock par defaut)
            </p>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600">Fournisseur LLM</label>
              <select
                value={settings.llmProvider}
                onChange={(e) => {
                  dispatch(setLLMProvider(e.target.value as 'claude' | 'openai' | 'ollama'))
                  showSaved('Provider LLM sauvegarde !')
                }}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <option value="claude">Claude (Anthropic)</option>
                <option value="openai">OpenAI (GPT)</option>
                <option value="ollama">Ollama (local)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Cle API (optionnel - sans cle = mode demo)</label>
              <input
                type="password"
                value={settings.llmApiKey ?? ''}
                onChange={(e) => {
                  dispatch(setLLMApiKey(e.target.value))
                  showSaved('Cle API LLM sauvegardee !')
                }}
                placeholder="sk-... ou anthropic-..."
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Modele (optionnel)</label>
              <input
                type="text"
                value={settings.llmModel ?? ''}
                onChange={(e) => {
                  dispatch(setLLMModel(e.target.value))
                  showSaved('Modele LLM sauvegarde !')
                }}
                placeholder="claude-sonnet-4-20250514, gpt-4o-mini..."
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
          </div>
        </section>

        {/* === SECURITY === */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-500" /> Securite
            </h2>
          </div>

          <div className="p-5 space-y-4">
            <button
              onClick={() => {
                if (window.confirm('Remettre tous les parametres par defaut ?')) {
                  dispatch(resetSettings())
                  showSaved('Parametres reinitialises !')
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reinitialiser les parametres
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminSettingsPage
