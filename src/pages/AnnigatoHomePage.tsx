import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, Sparkles, Star, User, ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { toggleCart, selectIsCartOpen } from '../features/cart/cartSlice'
import {
  setCatalog,
  filterByCategory,
  toggleLike,
  selectFilteredCatalog,
  selectSelectedCategory,
  selectLikedCakes
} from '../features/cakes/cakesSlice'
import { initialCakes, categories } from '../data/initialCatalog'

interface CakeSVGProps {
  color: string
  cakeId: string
}

const Logo: React.FC = () => (
  <svg
    width="120"
    height="40"
    viewBox="0 0 180 60"
    className="w-24 h-8 sm:w-32 sm:h-10 md:w-44 md:h-14 cursor-pointer hover:scale-105 transition-transform"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#FF8E53" />
        <stop offset="100%" stopColor="#FFC947" />
      </linearGradient>
    </defs>
    <text x="10" y="40" fontSize="32" fontWeight="bold" fill="url(#logoGradient)" fontFamily="Comic Sans MS, cursive">
      Annigato
    </text>
    <circle cx="160" cy="20" r="3" fill="#FF6B6B" className="animate-pulse" />
    <circle cx="155" cy="30" r="2" fill="#FF8E53" className="animate-pulse" style={{animationDelay: '0.2s'}} />
    <circle cx="165" cy="35" r="2.5" fill="#FFC947" className="animate-pulse" style={{animationDelay: '0.4s'}} />
  </svg>
)

const CakeSVG: React.FC<CakeSVGProps> = ({ color, cakeId }) => (
  <svg
    viewBox="0 0 200 220"
    className="cake-svg w-32 h-36 sm:w-40 sm:h-44 md:w-48 md:h-52"
  >
    <defs>
      <pattern id={`sprinkles-${cakeId}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="2" fill="#FF69B4" />
        <circle cx="15" cy="15" r="2" fill="#00CED1" />
        <circle cx="10" cy="10" r="2" fill="#FFD700" />
      </pattern>
    </defs>
    <ellipse cx="100" cy="180" rx="80" ry="20" fill={color} opacity="0.8" />
    <rect x="20" y="100" width="160" height="80" fill={color} rx="5" />
    <path d="M 20 100 Q 20 80 40 85 T 70 80 T 100 85 T 130 80 T 160 85 T 180 100" fill="white" opacity="0.9" />
    <rect x="30" y="90" width="140" height="30" fill={`url(#sprinkles-${cakeId})`} opacity="0.7" />
    {[60, 100, 140].map((x, i) => (
      <g key={i}>
        <rect x={x-3} y="60" width="6" height="25" fill="#FFE4B5" />
        <ellipse cx={x} cy="55" rx="8" ry="12" fill="#FFA500" className="flame-animation" />
      </g>
    ))}
  </svg>
)

const AnimatedBackground: React.FC = () => {
  const confetti = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 5 + 5}s`,
    delay: `${Math.random() * -5}s`,
    size: `${Math.random() * 6 + 3}px`,
  }))

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 md:opacity-50">
      {confetti.map(c => (
        <div
          key={c.id}
          className="confetti-animation absolute bg-pink-300 rounded-full"
          style={{
            left: c.left,
            width: c.size,
            height: c.size,
            animationDuration: c.duration,
            animationDelay: c.delay,
            opacity: Math.random()
          }}
        />
      ))}
    </div>
  )
}

const AnnigatoHomepage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const filteredCakes = useAppSelector(selectFilteredCatalog)
  const selectedCategory = useAppSelector(selectSelectedCategory)
  const likedCakes = useAppSelector(selectLikedCakes)
  const isCartOpen = useAppSelector(selectIsCartOpen)

  useEffect(() => {
    dispatch(setCatalog(initialCakes))
  }, [dispatch])

  const handleCategoryChange = (categoryId: string) => {
    dispatch(filterByCategory(categoryId))
    setCurrentSlide(0)
  }

  const handleLike = (cakeId: string) => {
    dispatch(toggleLike(cakeId))
  }

  useEffect(() => {
    if (filteredCakes.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredCakes.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [filteredCakes.length])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-orange-100 font-sans relative overflow-hidden">
      <AnimatedBackground />

      {/* Header mobile-first */}
      <header className="p-3 sm:p-4 md:p-6 flex justify-between items-center">
        <Logo />

        {/* Navigation desktop uniquement */}
        <nav className="hidden lg:flex items-center gap-4 bg-white/50 px-4 py-2 rounded-full shadow-md">
          {categories.slice(1, 5).map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`text-base font-semibold transition-colors ${
                selectedCategory === cat.id ? 'text-pink-500' : 'text-gray-600 hover:text-pink-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Actions header */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/espace-parent"
            className="flex items-center gap-1 sm:gap-2 bg-white/60 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <User size={16} className="text-purple-500 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-xs sm:text-sm md:text-base font-semibold text-gray-700">
              Espace Parent
            </span>
          </Link>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 sm:p-2.5 md:p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors relative"
          >
            <ShoppingCart size={18} className="text-blue-500 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            {isCartOpen && (
              <span className="absolute top-0 right-0 block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>

      <main className="px-3 sm:px-4 md:px-6 py-4 sm:py-8 md:py-12">
        {/* Titre responsive */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
            Le Gateau de vos Reves
          </h1>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-600 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-2">
            Creez, personnalisez et commandez des gateaux uniques
          </p>
        </div>

        {/* Filtres categories - mobile et tablette */}
        <div className="lg:hidden flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 px-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-pink-400 to-orange-400 text-white scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-base sm:text-lg mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Carrousel responsive */}
        <div className="relative">
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
            <button
              onClick={() => setCurrentSlide(prev => (prev - 1 + filteredCakes.length) % filteredCakes.length)}
              className="p-1.5 sm:p-2 md:p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {filteredCakes.map((cake) => (
                  <div key={cake.id} className="w-full flex-shrink-0 flex justify-center items-center px-2">
                    <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl w-full">
                      <div className="relative mb-3 sm:mb-4 md:mb-6 flex justify-center">
                        <CakeSVG color={cake.color} cakeId={cake.id} />

                        <button
                          onClick={() => handleLike(cake.id)}
                          className={`absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 ${
                            likedCakes.includes(cake.id)
                              ? 'bg-red-500 animate-pulse'
                              : 'bg-gray-300/50 hover:bg-red-400'
                          }`}
                        >
                          <Heart size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" fill={likedCakes.includes(cake.id) ? 'white' : 'none'} />
                        </button>

                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 bg-yellow-400 text-yellow-900 px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-0.5 sm:gap-1">
                          <Star size={10} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" fill="currentColor" />
                          {cake.stars}
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center mb-3 sm:mb-4 text-gray-800">
                        {cake.name}
                      </h3>

                      <div className="flex gap-2 sm:gap-3 justify-center">
                        <button className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-full text-xs sm:text-sm md:text-base font-bold hover:scale-105 transition-transform shadow-lg">
                          Choisir
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-green-400 to-teal-400 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-full text-xs sm:text-sm md:text-base font-bold hover:scale-105 transition-transform shadow-lg">
                          Personnaliser
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentSlide(prev => (prev + 1) % filteredCakes.length)}
              className="p-1.5 sm:p-2 md:p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </div>

          <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 md:mt-6">
            {filteredCakes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 sm:h-2.5 md:h-3 rounded-full transition-all ${
                  currentSlide === index
                    ? 'w-6 sm:w-7 md:w-8 bg-gradient-to-r from-pink-400 to-orange-400'
                    : 'w-2 sm:w-2.5 md:w-3 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bouton CTA principal */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <button onClick={() => navigate('/creer')} className="group relative bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-white text-sm sm:text-base md:text-xl lg:text-2xl font-bold py-3 sm:py-4 md:py-5 lg:py-6 px-6 sm:px-8 md:px-10 lg:px-12 rounded-full shadow-2xl hover:scale-105 sm:hover:scale-110 transition-all duration-300">
            <span className="flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline">Creer mon propre gateau magique !</span>
              <span className="sm:hidden">Creer mon gateau !</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:-rotate-180 transition-transform duration-500" />
            </span>
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full animate-bounce">
              Nouveau !
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default AnnigatoHomepage
