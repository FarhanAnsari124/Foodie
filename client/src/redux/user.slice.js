import { createSlice } from "@reduxjs/toolkit";
import { ActionCodeOperation } from "firebase/auth";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        }
    }
})

export const {setUserData} = userSlice.actions
export default userSlice.reducer