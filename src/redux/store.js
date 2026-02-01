import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./reducers/movies.js";
import userReducer from "./reducers/user.js";

export const store = configureStore({
    reducer: { movies: moviesReducer, user: userReducer }
});