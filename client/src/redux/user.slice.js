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
        cartItems:[],
        totalAmount:0,
        myOrders:null,
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
        setCartItems:(state,action)=>{
            state.cartItems=action.payload
        },
        addToCart:(state,action)=>{
            const cartItem=action.payload
            const existing = state.cartItems.find(i=> i.id==cartItem.id)
            if(existing){
                existing.quantity+=cartItem.quantity;
            }else{
                state.cartItems.push(cartItem)
            }
            state.totalAmount = state.cartItems.reduce((sum,i)=> sum+i.price*i.quantity,0)
        },
        updateQuantity:(state,action)=>{
            const{id,quantity} = action.payload
            const item = state.cartItems.find(i=>i.id==id)
            if(item){
                item.quantity=quantity
            }
            state.totalAmount = state.cartItems.reduce((sum,i)=> sum+i.price*i.quantity,0)
        },
        removeItem:(state,action)=>{
           state.cartItems = state.cartItems.filter(i=> i.id!=action.payload)
           state.totalAmount = state.cartItems.reduce((sum,i)=> sum+i.price*i.quantity,0)
        },
        setMyOrders:(state,action)=>{
            state.myOrders = action.payload
        }
    }
})

export const {setUserData,setCity,setState,setCurrentAddress,setShopsInMyCity,setitemsInMyCity,setCartItems,addToCart,updateQuantity,removeItem,setMyOrders} = userSlice.actions
export default userSlice.reducer