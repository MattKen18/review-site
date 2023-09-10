import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userForums: []
}

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    updateForums: (state, action) => {
        const forums = action.payload['forums']

        console.log(forums)
        state.userForums = forums
    },

    updateChatSnap: (state, action) => {
        const forumId = action.payload['forumId']
        const forums = [...state.userForums]

        for (let forumObj of forums) {
            if (Object.keys(forumObj).includes(forumId)) {
                try {
                    if (action.payload['body'] !== '') {
                        forumObj[forumId].body = action.payload['body']
                    }
                    break
                } catch (e) {
                    console.error("error updating chat snap, ", e)
                }
            }
        }
        console.log(forums)
        state.userForums = forums

    }
  },
})

// actions creators generated from reducers in the filterSlice
export const {updateForums, updateChatSnap} = forumSlice.actions

// selector functions
export const selectForums = state => state.forum.userForums

export default forumSlice.reducer