import {useEffect,useRef,useState} from "react";
import {categories} from "../category.js";
import CategoryCard from "./CategoryCard";
import Nav from "./Nav";
import {FaArrowRight,FaChevronLeft,FaChevronRight,FaMotorcycle,FaUtensils} from "react-icons/fa";
import heroImage from "../assets/hero.png";
import {useSelector} from "react-redux";
import useGetShopByCity from "../hooks/useGetShopByCity.jsx";
import useGetItemsByCity from "../hooks/useGetItemsByCity.jsx";
import FoodCard from "./FoodCard.jsx";
import {useNavigate} from "react-router-dom";

const UserDashboard=()=>{
 const catScrollRef=useRef(null);
 useGetShopByCity();useGetItemsByCity();
 const [activeCategory,setActiveCategory]=useState("All");
 const [updatedItemsList,setUpdatedItemsList]=useState([]);
 const {city,shopsInMyCity,itemsInMyCity,searchItems}=useSelector(state=>state.user);
 const navigate=useNavigate();
 useEffect(()=>{setUpdatedItemsList(itemsInMyCity||[]);},[itemsInMyCity]);
 const handleFilterByCategory=category=>{setActiveCategory(category);setUpdatedItemsList(category==="All"?itemsInMyCity||[]:(itemsInMyCity||[]).filter(item=>item.category===category));};
 const scroll=(ref,dir)=>ref.current?.scrollBy({left:dir*520,behavior:"smooth"});
 const visibleItems=searchItems?.length?searchItems:updatedItemsList;
 return <div className="foodie-shell min-h-screen w-full overflow-x-hidden">
  <Nav/>
  <main className="pt-[100px] sm:pt-[112px] pb-20 max-w-[1400px] mx-auto px-5 md:px-8">
   {!searchItems?.length&&<section className="relative overflow-hidden rounded-[32px] sm:rounded-[42px] foodie-gradient min-h-[360px] md:min-h-[410px] flex items-center foodie-in">
    <div className="absolute -right-16 -top-28 w-[390px] h-[390px] rounded-full border border-white/15"/><div className="absolute right-20 -bottom-40 w-[360px] h-[360px] rounded-full border border-white/15"/>
    <div className="relative z-10 px-7 py-12 sm:px-12 md:px-16 max-w-[650px] text-white">
     <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-xs font-bold tracking-wide"><span className="w-2 h-2 rounded-full bg-[#ffe1a8] animate-pulse"/> GOOD FOOD. GOOD MOOD.</span>
     <h1 className="mt-6 text-[42px] sm:text-6xl md:text-[68px] leading-[1.02] font-black tracking-[-.055em]">Cravings?<br/><span className="text-[#ffe2b7]">We've got you.</span></h1>
     <p className="mt-5 text-sm sm:text-base text-white/85 max-w-md leading-relaxed">Your favourite meals, local kitchens and little treats — delivered fresh to your door.</p>
     <button onClick={()=>document.getElementById("discover-food")?.scrollIntoView({behavior:"smooth"})} className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white text-[#e9512f] px-6 py-3.5 font-extrabold text-sm shadow-xl hover:-translate-y-1 transition">Explore menu <FaArrowRight/></button>
    </div>
    <div className="hidden md:block absolute right-[7%] top-1/2 -translate-y-1/2 w-[330px] h-[330px] foodie-float">
     <div className="absolute inset-0 rounded-full border-[18px] border-white/15"/>
     <img src={heroImage} alt="Delicious meal" className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] object-contain drop-shadow-2xl"/>
     <div className="absolute -left-8 bottom-7 bg-white text-[#29241f] rounded-2xl px-4 py-3 shadow-xl"><div className="font-black text-lg">Freshly made</div><div className="text-xs text-gray-500">Just for your cravings</div></div>
    </div>
    <div className="md:hidden absolute right-[-28px] bottom-[-40px] text-[145px] opacity-15 rotate-[-15deg]">🍔</div>
   </section>}
   {!searchItems?.length&&<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 foodie-in foodie-delay-1">
    <div className="rounded-2xl bg-white foodie-outline p-4 flex items-center gap-3"><span className="w-11 h-11 rounded-xl bg-[#fff0e7] text-[#f2633b] grid place-items-center text-xl"><FaMotorcycle/></span><div><p className="font-extrabold text-sm">Fast delivery</p><p className="text-xs text-[#94877b] mt-0.5">From local favourites</p></div></div>
    <div className="rounded-2xl bg-white foodie-outline p-4 flex items-center gap-3"><span className="w-11 h-11 rounded-xl bg-[#f1f6e9] text-[#63934b] grid place-items-center text-xl"><FaUtensils/></span><div><p className="font-extrabold text-sm">Made with care</p><p className="text-xs text-[#94877b] mt-0.5">Fresh food, happy you</p></div></div>
    <div className="rounded-2xl bg-white foodie-outline p-4 flex items-center gap-3"><span className="w-11 h-11 rounded-xl bg-[#fff5df] text-[#d99b2b] grid place-items-center text-xl"><span className="text-xl">✦</span></span><div><p className="font-extrabold text-sm">Local gems</p><p className="text-xs text-[#94877b] mt-0.5">Discover your neighbourhood</p></div></div>
   </div>}
   {searchItems&&<section className="mt-8 foodie-in"><div className="flex items-end justify-between mb-5"><div><p className="text-xs font-extrabold tracking-[.18em] text-[#f2633b] uppercase">Search</p><h2 className="text-2xl sm:text-3xl font-black mt-1">Results for you</h2></div><span className="text-sm text-[#92877d]">{searchItems.length} items</span></div></section>}
   {!searchItems?.length&&<section className="mt-12 foodie-in foodie-delay-1">
    <div className="flex items-end justify-between mb-6"><div><p className="text-xs font-extrabold tracking-[.18em] text-[#f2633b] uppercase">Explore by taste</p><h2 className="text-2xl sm:text-3xl font-black text-[#28231f] mt-1">What are you craving?</h2></div><span className="hidden sm:block text-sm text-[#9a8f84]">A little something for every mood</span></div>
    <div className="relative"><button onClick={()=>scroll(catScrollRef,-1)} className="hidden md:grid absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white foodie-shadow place-items-center"><FaChevronLeft/></button><div ref={catScrollRef} className="flex gap-4 overflow-x-auto pb-3">{categories.map((cat,i)=><CategoryCard key={i} data={cat} active={activeCategory===cat.category} onClick={()=>handleFilterByCategory(cat.category)}/>)}</div><button onClick={()=>scroll(catScrollRef,1)} className="hidden md:grid absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white foodie-shadow place-items-center"><FaChevronRight/></button></div>
   </section>}
   {!searchItems?.length&&<section className="mt-12 foodie-in foodie-delay-2">
    <div className="flex items-end justify-between mb-5"><div><p className="text-xs font-extrabold tracking-[.18em] text-[#f2633b] uppercase">Around you</p><h2 className="text-2xl sm:text-3xl font-black mt-1">Local favourites <span className="text-[#f2633b]">{city? `in ${city}`:"near you"}</span></h2></div><span className="text-xs sm:text-sm text-[#9a8f84]">{shopsInMyCity?.length||0} kitchens</span></div>
    {shopsInMyCity?.length?<div className="flex gap-4 overflow-x-auto pb-4">{shopsInMyCity.map(shop=><button key={shop._id} onClick={()=>navigate(`/shop/${shop._id}`)} className="foodie-card text-left shrink-0 w-[260px] sm:w-[300px] bg-white rounded-[24px] overflow-hidden foodie-outline"><div className="h-[150px] overflow-hidden bg-[#fff0e7]"><img src={shop.image} alt={shop.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/></div><div className="p-4"><h3 className="font-extrabold text-lg">{shop.name}</h3><p className="text-xs text-[#94877b] mt-1 truncate">{shop.address||shop.city||"Local restaurant"}</p><span className="inline-flex items-center gap-2 text-xs font-bold text-[#f2633b] mt-3">Explore menu <FaArrowRight/></span></div></button>)}</div>:<p className="text-sm text-[#94877b] bg-white rounded-2xl p-6 foodie-outline">No kitchens found in this area yet. Check back soon!</p>}
   </section>}
   <section id="discover-food" className="mt-12 foodie-in foodie-delay-3">
    {!searchItems?.length&&<div className="flex items-end justify-between mb-6"><div><p className="text-xs font-extrabold tracking-[.18em] text-[#f2633b] uppercase">Handpicked for you</p><h2 className="text-2xl sm:text-3xl font-black mt-1">{activeCategory==="All"?"Popular near you":activeCategory+" favourites"}</h2></div><span className="text-xs sm:text-sm text-[#9a8f84]">{visibleItems?.length||0} delicious picks</span></div>}
    {visibleItems?.length?<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center sm:justify-items-stretch">{visibleItems.map(item=><FoodCard key={item._id} data={item}/>)}</div>:<div className="bg-white foodie-outline rounded-3xl py-16 text-center"><div className="text-5xl mb-4">🍽️</div><h3 className="text-xl font-black">Nothing on the menu just yet</h3><p className="text-sm text-[#94877b] mt-2">Try another category or search for something tasty.</p></div>}
   </section>
   <footer className="mt-16 pt-7 border-t border-[#eee4d9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9a8f84]"><span className="font-black text-lg text-[#29241f]">foodie<span className="text-[#ff6339]">.</span></span><span>Good food, good mood. Made for your cravings.</span><span>© {new Date().getFullYear()} Foodie</span></footer>
  </main>
 </div>;
};
export default UserDashboard;
