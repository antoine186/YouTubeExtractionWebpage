import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AmendPaymentState {
  sessionLogoutState: boolean
}

const initialState: AmendPaymentState = {
  sessionLogoutState: false,
}

export const SessionLogoutSlice = createSlice({
  name: 'sessionLogoutState',
  initialState,
  reducers: {
    setSessionLogout: (state) => {
      state.sessionLogoutState = true
    },
    clearSessionLogout: (state) => {
      state.sessionLogoutState = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSessionLogout, clearSessionLogout } = SessionLogoutSlice.actions

export default SessionLogoutSlice.reducer