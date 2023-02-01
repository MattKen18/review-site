import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './slices/filterSlice'
import reviewsReducer from './slices/reviewsSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    reviews: reviewsReducer,
    user: userReducer,
  },
})