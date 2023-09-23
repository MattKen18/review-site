import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alerting: false,
  alertBody: '',
  type: '',
}


export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action) => {
      state.alerting = true
      state.alertBody = action.payload.body
      state.type = action.payload.type
    },
    removeAlert: (state) => {
      state.alerting = false
      state.alertBody = ''
      state.type = ''
    }
  },
})


export const {addAlert, removeAlert} = alertSlice.actions

export const selectAlerting = state => state.alert.alerting
export const selectAlertBody = state => state.alert.alertBody
export const selectAlertType = state => state.alert.type

export default alertSlice.reducer
