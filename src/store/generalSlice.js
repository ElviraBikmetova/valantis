import { createSlice } from "@reduxjs/toolkit"

const generalSlice = createSlice({
    name: 'general',
    initialState: {
        isFilter: false,
        isPending: true,
    },
    reducers: {
        toggleIsFilter(state, action) {
            state.isFilter = action.payload
        },
        toggleIsPending(state, action) {
            state.isPending = action.payload
        },
    }
})

export const { toggleIsFilter, toggleIsPending } = generalSlice.actions
export const general = state => state.general

export default generalSlice.reducer