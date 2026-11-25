import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { HiOutlineLogout, HiOutlineMenuAlt3 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setSearchItem, setUserData } from "../redux/user.slice";
import { useNavigate } from "react-router-dom";

const Nav = () => {
 const {userData,cartItems=[],city}=useSelector(state=>state.user);
 const {myShopData}=useSelector(state=>state.owner);
 const [showPopUp,setShowPopUp]=useState(false);
 const [showSearch,setShowSearch]=useState(false);
 const [query,setQuery]=useState("");
 const dispatch=useDispatch();
 const navigate=useNavigate();
 const handleSearchItems=async()=>{
  try{const {data}=await axios.get(`${serverUrl}/api/item/search-items?query=${encodeURIComponent(query)}&city=${city}`,{withCredentials:true});dispatch(setSearchItem(data.data));}
  catch(error){console.log(error);}
 };
 const handleSignOut=async()=>{
  try{await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials:true});dispatch(setUserData(null));}
  catch(error){console.log("Signout error",error);}
 };
 useEffect(()=>{if(query.trim())handleSearchItems();else dispatch(setSearchItem(null));},[query]);
 return <header className="foodie-nav fixed top-0 inset-x-0 z-[1000]">
  <div className="mx-auto max-w-[1400px] h-[76px] px-5 md:px-8 flex items-center justify-between gap-5">
   <button onClick={()=>navigate("/")} className="flex items-center gap-2 shrink-0">
    <span className="foodie-gradient w-10 h-10 rounded-2xl text-white grid place-items-center text-xl shadow-lg shadow-orange-200">✦</span>
    <span className="text-[25px] font-black tracking-tight text-[#26221e]">foodie<span className="text-[#ff6339]">.</span></span>
   </button>
   {userData?.role==="User"&&<div className="hidden md:flex items-center gap-3 bg-white foodie-outline rounded-2xl px-4 h-12 w-full max-w-[570px] shadow-sm">
    <FaLocationDot className="text-[#ff6339] shrink-0"/>
    <span className="max-w-[120px] truncate text-sm font-semibold text-[#5b554f]">{city||"Your location"}</span>
    <span className="h-6 w-px bg-[#eee5dc]"/>
    <IoIosSearch className="text-[#a49a90] text-xl shrink-0"/>
    <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search dishes, restaurants..." className="w-full outline-none text-sm bg-transparent"/>
    {query&&<button onClick={()=>setQuery("")}><RxCross2 className="text-gray-400"/></button>}
   </div>}
   <div className="flex items-center gap-2 sm:gap-4">
    {userData?.role==="User"&&<button onClick={()=>setShowSearch(!showSearch)} className="md:hidden w-10 h-10 rounded-xl bg-white foodie-outline grid place-items-center text-xl text-[#51483f]">{showSearch?<RxCross2/>:<IoIosSearch/>}</button>}
    {userData?.role==="Owner"?<>{myShopData&&<button onClick={()=>navigate("/add-item")} className="foodie-gradient text-white rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-200"><FaPlus/> <span className="hidden sm:inline">Add food</span></button>}<button onClick={()=>navigate("/my-orders")} className="w-10 h-10 rounded-xl bg-white foodie-outline grid place-items-center text-lg"><TbReceipt2/></button></>:userData?.role==="User"&&<>
     <button onClick={()=>navigate("/my-orders")} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#655c53] hover:text-[#ff6339]"><TbReceipt2 className="text-lg"/> Orders</button>
     <button onClick={()=>navigate("/cart")} className="relative w-11 h-11 rounded-2xl bg-[#fff0e8] text-[#f45c35] grid place-items-center text-xl hover:bg-[#ffe2d2] transition"><FiShoppingCart/><span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#28231f] text-white text-[10px] font-bold grid place-items-center">{cartItems.length}</span></button>
    </>}
    <div className="relative">
     <button onClick={()=>setShowPopUp(v=>!v)} className="w-10 h-10 rounded-2xl foodie-gradient text-white font-bold shadow-md shadow-orange-200">{userData?.fullName?.slice(0,1)?.toUpperCase()||"U"}</button>
     {showPopUp&&<div className="absolute right-0 top-14 w-56 bg-white rounded-2xl p-3 foodie-shadow foodie-outline animate-[foodieIn_.2s_ease]">
      <p className="font-bold px-3 py-2 truncate">{userData?.fullName}</p>
      <p className="text-xs text-gray-400 px-3 pb-2">{userData?.email}</p>
      <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"><HiOutlineLogout/> Log out</button>
     </div>}
    </div>
   </div>
  </div>
  {showSearch&&userData?.role==="User"&&<div className="md:hidden px-5 pb-4 foodie-in"><div className="flex items-center gap-2 bg-white rounded-xl px-3 h-12 foodie-outline"><FaLocationDot className="text-[#ff6339]"/><span className="text-xs text-gray-500 max-w-20 truncate">{city}</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search delicious food..." className="min-w-0 flex-1 outline-none text-sm"/></div></div>}
 </header>;
};
export default Nav;
