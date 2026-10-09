import { createSlice } from "@reduxjs/toolkit";
import { ActionCodeOperation } from "firebase/auth";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        city:null
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        setCity:(state,action)=>{
            state.city=action.payload
        }
    }
})

export const {setUserData,setCity} = userSlice.actions
export default userSlice.reducer