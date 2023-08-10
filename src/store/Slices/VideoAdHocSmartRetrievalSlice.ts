import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface VideoAdHocSmartRetrievalState {
  validated: boolean
}

const initialState: VideoAdHocSmartRetrievalState = {
  validated: false,
}

export const videoAdHocSmartRetrievalSlice = createSlice({
  name: 'videoAdHocSmartRetrieval',
  initialState,
  reducers: {
    activateVideoAdHocSmartRetrieval: (state) => {
      state.validated = true
    },
    deactivateVideoAdHocSmartRetrieval: (state) => {
      state.validated = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { activateVideoAdHocSmartRetrieval, deactivateVideoAdHocSmartRetrieval } = videoAdHocSmartRetrievalSlice.actions

export default videoAdHocSmartRetrievalSlice.reducer
