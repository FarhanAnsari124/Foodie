import { createSlice } from "@reduxjs/toolkit";
import { ActionCodeOperation } from "firebase/auth";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        city:null,
        state:null,
        currentAddress:null,
        shopsInMyCity:null,
        itemsInMyCity:null,
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
        setShopsInMyCity:(state,action)=>{
            state.shopsInMyCity=action.payload
        },
        setitemsInMyCity:(state,action)=>{
            state.itemsInMyCity=action.payload
        },
    }
})

export const {setUserData,setCity,setState,setCurrentAddress,setShopsInMyCity,setitemsInMyCity} = userSlice.actions
export default userSlice.reducer