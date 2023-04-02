import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  genreFiltering: false,
  mossFiltering: false, // if a moss rating is one of the filters
  authFiltering: false,
  filters: {
    genres: [],
    rating: null,
    authenticated: null,
  }, // filters applied including genre, moss rating, verified, created-date
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    addFilter: (state, action) => {
      const filterTitle = action.payload.title.split('-')[0]
      const filterVal = action.payload.title.split('-')[1]

      switch(filterTitle) {
        case 'genre':
            state.filters.genres = [...state.filters.genres, filterVal]
            state.genreFiltering = true
          break

        case 'moss':
          state.filters.rating = Number(filterVal)
          state.mossFiltering = true
          break

        case 'authenticated':
          state.filters.authenticated = filterVal
          state.authFiltering = true  
      }
    },
    removeFilter: (state, action) => {
      const filterTitle = action.payload.title.split('-')[0]
      const filterVal = action.payload.title.split('-')[1]

      switch (filterTitle) {
        case 'genre':
          const indexToRemove = state.filters.genres.findIndex((genre) => genre === filterVal);//returns -1 if not found
          const newGenres = [...state.filters.genres]
          newGenres.splice(indexToRemove, 1)
          state.filters.genres = newGenres
          state.genreFiltering = !newGenres.length ? false : true
          break

        case 'moss':
          state.filters.rating = null
          state.mossFiltering = false
          break
        
        case 'authenticated':
          state.authFiltering = null
          state.authFiltering = false
    }
    },

    clearFilter: (state) => {
      state.filters = {
        genres: [], 
        rating: null,
        authenticated: true,
      }
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