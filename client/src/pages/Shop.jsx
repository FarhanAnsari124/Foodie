import axios from "axios";
import React,{useEffect,useState} from "react";
import {serverUrl} from "../App";
import {useNavigate,useParams} from "react-router-dom";
import {FaArrowLeft,FaLocationDot,FaUtensils} from "react-icons/fa";
import FoodCard from "../components/FoodCard";
const Shop=()=>{
 const {shopId}=useParams();const [items,setItems]=useState([]);const [shop,setShop]=useState(null);const [loading,setLoading]=useState(true);const navigate=useNavigate();
 const handleShop=async()=>{setLoading(true);try{const {data}=await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`,{withCredentials:true});setShop(data.shop);setItems(data.items);}catch(error){console.log(error);}finally{setLoading(false);}};
 useEffect(()=>{handleShop();},[shopId]);
 return <main className="foodie-shell min-h-screen pb-16">
  <div className="relative h-[300px] sm:h-[390px] bg-[#2a211b]">
   {shop?.image&&<img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover opacity-65"/>}
   <div className="absolute inset-0 bg-gradient-to-t from-[#211912]/90 via-[#211912]/25 to-black/30"/>
   <button onClick={()=>navigate("/")} className="absolute top-6 left-5 sm:left-8 z-10 flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur px-4 py-2.5 text-sm font-bold text-[#33291f]"><FaArrowLeft/> Back</button>
   {shop&&<div className="absolute bottom-8 sm:bottom-12 left-5 sm:left-10 right-5 text-white max-w-5xl mx-auto"><span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1.5 text-xs font-bold"><FaUtensils/> LOCAL KITCHEN</span><h1 className="text-4xl sm:text-6xl font-black mt-3 tracking-tight">{shop.name}</h1><p className="mt-3 flex items-center gap-2 text-sm sm:text-base text-white/80"><FaLocationDot/>{shop.address}</p></div>}
  </div>
  <section className="max-w-[1300px] mx-auto px-5 sm:px-8 pt-10">
   <div className="mb-7"><p className="text-xs font-extrabold tracking-[.18em] uppercase text-[#f2633b]">Made fresh for you</p><h2 className="text-3xl font-black mt-1">Explore the menu<span className="text-[#f2633b]">.</span></h2><p className="text-sm text-[#94877b] mt-2">{items.length} delicious choices</p></div>
   {loading?<p className="text-sm text-[#94877b] py-16 text-center">Loading the good stuff...</p>:items.length?<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center sm:justify-items-stretch">{items.map(item=><FoodCard data={item} key={item._id}/>)}</div>:<div className="bg-white rounded-3xl foodie-outline p-12 text-center text-[#94877b]">This kitchen is preparing its menu. Please check back soon.</div>}
  </section>
 </main>;
};
export default Shop;
