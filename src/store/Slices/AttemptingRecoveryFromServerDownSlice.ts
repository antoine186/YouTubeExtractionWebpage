import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AttemptingRecoveryFromServerDown {
  validated: boolean
}

const initialState: AttemptingRecoveryFromServerDown = {
  validated: false,
}

export const AttemptingRecoveryFromServerDownSlice = createSlice({
  name: 'attemptingRecoveryFromServerDown',
  initialState,
  reducers: {
    validateAttemptingRecoveryFromServerDown: (state) => {
      state.validated = true
    },
    invalidateAttemptingRecoveryFromServerDown: (state) => {
      state.validated = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { validateAttemptingRecoveryFromServerDown, invalidateAttemptingRecoveryFromServerDown } = AttemptingRecoveryFromServerDownSlice.actions

export default AttemptingRecoveryFromServerDownSlice.reducer
