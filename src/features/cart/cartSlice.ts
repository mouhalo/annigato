import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store/store'

// Type pour un gâteau dans le panier
interface CartCake {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  quantity: number
  customizations?: {
    size?: string
    flavor?: string
    message?: string
    decorations?: string[]
  }
}

// Type pour l'état du panier
interface CartState {
  items: CartCake[]
  totalAmount: number
  totalItems: number
  isOpen: boolean
}

// État initial
const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isOpen: false
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Ajouter un gâteau au panier
    addToCart: (state, action: PayloadAction<CartCake>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      
      // Recalculer les totaux
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    
    // Retirer un gâteau du panier
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      
      // Recalculer les totaux
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    
    // Mettre à jour la quantité
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity
      } else if (item && action.payload.quantity === 0) {
        state.items = state.items.filter(item => item.id !== action.payload.id)
      }
      
      // Recalculer les totaux
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    
    // Vider le panier
    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
      state.totalItems = 0
    },
    
    // Toggle l'ouverture du panier
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    
    // Ouvrir le panier
    openCart: (state) => {
      state.isOpen = true
    },
    
    // Fermer le panier
    closeCart: (state) => {
      state.isOpen = false
    }
  }
})

// Actions exportées
export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions

// Sélecteurs
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartTotalAmount = (state: RootState) => state.cart.totalAmount
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen

// Reducer par défaut
export default cartSlice.reducer
