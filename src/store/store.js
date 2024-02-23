import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './services'
import filter from './filterSlice'

export const store = configureStore({
  reducer: {
    filter,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})