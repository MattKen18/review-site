import { createSlice } from "@reduxjs/toolkit";
import { chatAddOns } from "../parameters";

const initialState = {addOns: {...chatAddOns}}

{/*
chatAddOns = {
  images: [],
  videos: [],
  links: [],
  products: [],
}
*/}

export const chatAddOnSlice = createSlice({
  name: 'addOn',
  initialState,
  reducers: {
    updateAddOn: (state, action) => {
      console.log(state)
    },
  },
})

// actions creators generated from reducers in the filterSlice
export const {updateAddOn} = chatAddOnSlice.actions

// selector functions
export const selectAddOns = state => state.addOn

export default chatAddOnSlice.reducer