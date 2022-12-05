import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filtering: false,
  filters: [],
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    addFilter: (state, action) => {
      //action.payload would contain text of filtersed item i.e books, movies etc.
      //check if the filters is already applied
      // if (!state.filters.includes(action.payload.title)) {
      //   state.filters = [...state.filters, action.payload.title]
      // } else {
      //   return state
      // }

      // []

      switch(action.payload.title.split('-')[0]) {
        case 'genre':
          if (!state.filters.includes(action.payload.title)) { // runs if filter is not already applied
            state.filters = [...state.filters, action.payload.title]
          } else { // if filter is already applied
            return state
          }
          break
        case 'moss':
          if (state.filters.includes(action.payload.title)) {
            for (let i=0; i<state.filters.length; i++) {
              if (state.filters[i] === action.payload.title) {
                const newFilters = [...state.filters]
                newFilters.splice(i, 1)
                state.filters = newFilters
              }
            }
          }else{ // add to filters and replace previous moss if one exists
            for (let i=0; i<state.filters.length; i++) {
              if (state.filters[i].startsWith('moss')) {
                const newFilters = [...state.filters]
                newFilters[i] = action.payload.title
                state.filters = newFilters
                return
              } 
            }
            state.filters = [...state.filters, action.payload.title]
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
        state.filters = newFilters
      } else {
        return state
      }
    },
    setFiltering: (state) => {
      state.filtering = state.filters.length ? true : false
    },
    clearFilter: (state) => {
      state.filters = []
      state.filtering = false
    }
  },
})

// actions creators generated from reducers in the filterSlice
export const {addFilter, removeFilter, setFiltering, clearFilter} = filterSlice.actions

// selector functions
export const selectFilters = state => state.filter.filters
export const selectFiltering = state => state.filter.filtering

export default filterSlice.reducer