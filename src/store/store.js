import { configureStore } from '@reduxjs/toolkit'
import { productApi } from './services'
import filter from './filterSlice'

export const store = configureStore({
  reducer: {
    filter,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
})