// import { createSlice } from "@reduxjs/toolkit";
// import { getShownReviews } from "../firebase";

// const initialState = {
//   shownReviews: []
// }

// export const reviewsSlice = createSlice({
//   name: 'reviews',
//   initialState,
//   reducers: {
//     setShownReviews: (state, action) => {
//       state.shownReviews = action.payload.reviews
//     },
//     updateShownReviews: (state, action) => {
//       return state
//     }
//   }
// })

// export const { setShownReviews } = reviewsSlice.actions
// export const selectShownReviews = state => state.reviews.shownReviews
// export default reviewsSlice.reducer 