// Export centralisé pour le store Redux

// Store et types
export { store } from './store'
export type { RootState, AppDispatch } from './store'

// Hooks typés
export { useAppDispatch, useAppSelector } from './hooks'

// Slices et actions
export {
  // Cart
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalItems,
  selectIsCartOpen
} from '../features/cart/cartSlice'

export {
  // Auth
  loginSuccess,
  logout,
  selectChild,
  setLoading as setAuthLoading,
  setError as setAuthError,
  selectUser,
  selectActiveChild,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUIMode
} from '../features/auth/authSlice'

export {
  // Cakes
  setCatalog,
  filterByCategory,
  toggleLike,
  startCreation,
  updateCreation,
  saveCreation,
  setLoading as setCakesLoading,
  setGenerating,
  setError as setCakesError,
  selectCatalog,
  selectFilteredCatalog,
  selectSelectedCategory,
  selectUserCreations,
  selectCurrentCreation,
  selectLikedCakes,
  selectIsGenerating
} from '../features/cakes/cakesSlice'
