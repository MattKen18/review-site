import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filtering: false, // if the entire app is filtering
  mossFiltering: false, // if a moss rating is one of the filters
  filters: [], // filters applied including genre, moss rating, verified, created-date
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    addFilter: (state, action) => {
      switch(action.payload.title.split('-')[0]) {
        case 'genre':
          if (!state.filters.includes(action.payload.title)) { // runs if filter is not already applied
            state.filters = [...state.filters, action.payload.title]
          } else { // if filter is already applied
            return state
          }
          break
        case 'moss':
          if (state.mossFiltering) {
            // replace existing moss rating
            for (let i=0; i<state.filters.length; i++) {
              if (state.filters[i].startsWith("moss")) {
                const newFilters = [...state.filters]
                newFilters[i] = action.payload.title
                state.filters = newFilters
              }
            }
          } else {
            // add new moss rating to filters
            state.filters = [...state.filters, action.payload.title]
            state.mossFiltering = true
          }
          break
        default:
          return state
      }
    },
    removeFilter: (state, action) => {
      const indexToRemove = state.filters.findIndex((filter) => filter === action.payload.title);//returns -1 if not found

      if (indexToRemove !== -1) {
        const newFilters = [...state.filters]
        newFilters.splice(indexToRemove, 1) //removes the filter from the list of filters
        if (action.payload.title.startsWith('moss')) {
          state.mossFiltering = false
        }
        state.filters = newFilters
      } else {
        return state
      }
    },
    setFiltering: (state) => {
      state.filtering = state.filters.length ? true : false
      if (!state.filtering) {
        state.mossFiltering = false
      }
    },
    clearFilter: (state) => {
      state.filters = []
      state.filtering = false
      state.mossFiltering = false
    }
  },
})

// actions creators generated from reducers in the filterSlice
export const {addFilter, removeFilter, setFiltering, clearFilter} = filterSlice.actions

// selector functions
export const selectFilters = state => state.filter.filters
export const selectFiltering = state => state.filter.filtering
export const selectMossFiltering = state => state.filter.mossFiltering

export default filterSlice.reducer