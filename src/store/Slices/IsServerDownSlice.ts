import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface IsServerDown {
  validated: boolean
}

const initialState: IsServerDown = {
  validated: false,
}

export const IsServerDownSlice = createSlice({
  name: 'isServerDown',
  initialState,
  reducers: {
    validateIsServerDown: (state) => {
      state.validated = true
    },
    invalidateIsServerDown: (state) => {
      state.validated = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { validateIsServerDown, invalidateIsServerDown } = IsServerDownSlice.actions

export default IsServerDownSlice.reducer
