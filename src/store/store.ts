import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice'
import authReducer from '../features/auth/authSlice'
import cakesReducer from '../features/cakes/cakesSlice'
import creationReducer from '../features/creation/creationSlice'
import settingsReducer from '../features/settings/settingsSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    cakes: cakesReducer,
    creation: creationReducer,
    settings: settingsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
