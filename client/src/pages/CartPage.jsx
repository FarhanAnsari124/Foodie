import React from "react";
import {IoIosArrowRoundBack} from "react-icons/io";
import {FaArrowRight,FaShoppingBag} from "react-icons/fa";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CartItemCard from "../components/CartItemCard";
const CartPage=()=>{
 const navigate=useNavigate();const {cartItems,totalAmount}=useSelector(state=>state.user);
 return <main className="foodie-shell min-h-screen px-4 sm:px-6 py-8 sm:py-12">
  <div className="max-w-4xl mx-auto">
   <button onClick={()=>navigate("/")} className="flex items-center gap-2 text-sm font-bold text-[#f2633b] hover:gap-3 transition-all"><IoIosArrowRoundBack size={27}/> Continue shopping</button>
   <div className="mt-7 mb-8"><p className="text-xs font-extrabold tracking-[.18em] uppercase text-[#f2633b]">Almost there</p><h1 className="text-3xl sm:text-4xl font-black mt-1">Your basket<span className="text-[#f2633b]">.</span></h1><p className="text-sm text-[#94877b] mt-2">{cartItems?.length||0} items selected for your next happy meal</p></div>
   {cartItems?.length===0?<div className="bg-white rounded-[28px] foodie-outline p-10 sm:p-16 text-center foodie-shadow"><div className="mx-auto w-16 h-16 rounded-2xl bg-[#fff0e7] text-[#f2633b] grid place-items-center text-2xl"><FaShoppingBag/></div><h2 className="text-xl font-black mt-5">Your basket is waiting</h2><p className="text-sm text-[#94877b] mt-2">Add something delicious and it will show up here.</p><button onClick={()=>navigate("/")} className="foodie-gradient text-white rounded-xl px-6 py-3 mt-6 text-sm font-bold">Explore food</button></div>:<>
    <div className="space-y-3">{cartItems.map((item,index)=><CartItemCard data={item} key={item.id||index}/>)}</div>
    <div className="mt-6 bg-white foodie-outline rounded-[25px] p-5 sm:p-7 foodie-shadow">
     <div className="flex justify-between text-sm text-[#82776d]"><span>Subtotal</span><span>₹{totalAmount}</span></div>
     <div className="flex justify-between text-sm text-[#82776d] mt-3"><span>Delivery fee</span><span>Calculated at checkout</span></div>
     <div className="border-t border-dashed border-[#e9ded3] my-5"/>
     <div className="flex justify-between items-center"><span className="font-extrabold text-lg">Total</span><span className="text-2xl font-black text-[#f2633b]">₹{totalAmount}</span></div>
     <button onClick={()=>navigate("/check-out")} className="foodie-gradient mt-6 w-full text-white rounded-2xl py-4 font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-orange-100 hover:-translate-y-0.5 transition">Proceed to checkout <FaArrowRight/></button>
    </div>
   </>}
  </div>
 </main>;
};
export default CartPage;
