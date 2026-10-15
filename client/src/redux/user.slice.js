import { createSlice } from "@reduxjs/toolkit";
import { ActionCodeOperation } from "firebase/auth";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        city:null,
        state:null,
        currentAddress:null
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        setCity:(state,action)=>{
            state.city=action.payload
        },
        setState:(state,action)=>{
            state.state=action.payload
        },
        setCurrentAddress:(state,action)=>{
            state.currentAddress=action.payload
        },
    }
})

export const {setUserData,setCity,setState,setCurrentAddress} = userSlice.actions
export default userSlice.reducer