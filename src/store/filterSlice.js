import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        isFilter: false,
    },
    reducers: {
        toggleIsFilter(state, action) {
            state.isFilter = action.payload
        },

    }
})

export const { toggleIsFilter } = filterSlice.actions
export const filter = state => state.filter

export default filterSlice.reducer