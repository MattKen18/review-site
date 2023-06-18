import { createSlice } from "@reduxjs/toolkit";


// user that was manually created in firebase with more fields that the user created with firebase auth
const initialState = {
  currentUser: {
    uid: '',
    userName: '',
    email: '',
    photoURL: '',
    profileBgImageURL: '',
    followers: [],
    following: [],
    dateJoined: null,
    saves: [],
    helpfulReviews: [],
    unhelpfulReviews: [],
  },
  loggedIn: true,
}


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // console.log('payload: ', action.payload)
      for (let field in action.payload) {
        // console.log(field)
        state.currentUser[field] = action.payload[field]
      }
      state.loggedIn = true
    },
    updateUser: (state, action) => {
      try {
        for (let field in action.payload) {
          state.currentUser[field] = action.payload[field]
        }
      } catch (e) {
        console.log("error setting user in redux store: ", e)
      }
    },
    resetUser: (state) => { //when user logs out
      state.currentUser = {
        uid: '',
        userName: '',
        email: '',
        photoURL: '',
        profileBgImageURL: '',
        followers: [],
        following: [],
        dateJoined: null,
        saves: [],
        helpfulReviews: [],
        unhelpfulReviews: [],
      }
      state.loggedIn =  false
      // state.currentUser.uid = ''
      // state.userName = ''
      // state.email = ''
      // state.photoURL = ''
      // state.profileBgImageURL = ''
      // state.followers = []
      // state.following = []
      // state.dateJoined = null
      // state.saves = []
      // state.helpfulReviews = []
      // state.unhelpfulReviews = []
    }
  }
})


export const { setUser, updateUser, resetUser } = userSlice.actions

export const selectUser = state => state.user.currentUser
export const selectLoggedIn = state => state.user.loggedIn

export default userSlice.reducer