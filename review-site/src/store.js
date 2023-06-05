import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './slices/filterSlice'
import reviewsReducer from './slices/reviewsSlice'
import userReducer from './slices/userSlice'
import addOnReducer from './slices/addOnSlice'

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    reviews: reviewsReducer,
    user: userReducer,
    addOn: addOnReducer,
  },
})