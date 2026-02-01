import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
    name: "movies",
    initialSlice: [],
    reducers: {
        setMovies: (state, action) => {
            state.movies = action.payload
        }
    }
});

export const { setMovies } = moviesSlice.actions;

export default moviesSlice.reducer;