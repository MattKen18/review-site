import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  genreFiltering: false,
  mossFiltering: false, // if a moss rating is one of the filters
  authFiltering: false,
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
            state.genreFiltering = true
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

        case 'authenticated':
          if (state.authFiltering) {
            for(let i=0; i<state.filters.length; i++) {
              if (state.filters[i].startsWith('authenticated')) {
                const newFilters = [...state.filters]
                newFilters[i] = action.payload.title
                state.filters = newFilters
              }
            }
          } else {
            state.filters = [...state.filters, action.payload.title]
            state.authFiltering = true
          }
      }
    },
    removeFilter: (state, action) => {
      const indexToRemove = state.filters.findIndex((filter) => filter === action.payload.title);//returns -1 if not found

      if (indexToRemove !== -1) {
        const newFilters = [...state.filters]
        newFilters.splice(indexToRemove, 1) //removes the filter from the list of filters
        state.filters = newFilters

        switch (action.payload.title.split('-')[0]) {
          case 'genre':
            state.genreFiltering = !state.filters.length ? false : true
            break
          case 'moss':
            state.mossFiltering = false
            break
          case 'authenticated':
            state.authFiltering = false
        }
        if (!state.filters.length) {
          state.mossFiltering = false
          state.genreFiltering = false
          state.authFiltering = false
        }
      } else {
        return state
      }
    },

    clearFilter: (state) => {
      state.filters = []
      state.mossFiltering = false
      state.genreFiltering = false
      state.authFiltering = false
    }
  },
})

// actions creators generated from reducers in the filterSlice
export const {addFilter, removeFilter, clearFilter} = filterSlice.actions

// selector functions
export const selectFilters = state => state.filter.filters
export const selectMossFiltering = state => state.filter.mossFiltering
export const selectGenreFiltering = state => state.filter.genreFiltering
export const selectAuthFiltering = state => state.filter.authFiltering

export default filterSlice.reducer