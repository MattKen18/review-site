import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './slices/filterSlice'
import reviewsReducer from './slices/reviewsSlice'
import userReducer from './slices/userSlice'
import addOnReducer from './slices/addOnSlice'
import alertReducer from './slices/alertSlice'
import forumReducer from './slices/userForumsSlice'

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    reviews: reviewsReducer,
    user: userReducer,
    addOn: addOnReducer,
    alert: alertReducer,
    forum: forumReducer
  },
})