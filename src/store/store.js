import { configureStore } from '@reduxjs/toolkit'
import { productApi } from './services'
import general from './generalSlice'

export const store = configureStore({
  reducer: {
    general,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
})