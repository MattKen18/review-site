import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './slices/filterSlice'
import reviewsReducer from './slices/reviewsSlice'

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    reviews: reviewsReducer,
  },
})