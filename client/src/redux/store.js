import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user.slice.js";
import ownerSlice from "./owner.slice.js";

export const store = configureStore({
	reducer: {
		user: userSlice,
		owner: ownerSlice,
	},
});
