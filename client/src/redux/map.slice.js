import { createSlice } from "@reduxjs/toolkit";
import { ActionCodeOperation } from "firebase/auth";

const mapSlice = createSlice({
	name: "map",
	initialState: {
		location: {
			lat:  26.4499,
            lon: 80.3319
		},
        address:null
	},
	reducers: {
		setLocation: (state, action) => {
			const { lat, lon } = action.payload;
			state.location.lat = lat;
			state.location.lon = lon;
		},
        setAddress:(state,action)=>{
            state.address=action.payload
        }
	},
});

export const {setLocation,setAddress} = mapSlice.actions;
export default mapSlice.reducer;
