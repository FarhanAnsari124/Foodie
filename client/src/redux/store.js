import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user.slice.js"

export const store = configureStore({
    reducer:{
        user:userSlice
    }
})