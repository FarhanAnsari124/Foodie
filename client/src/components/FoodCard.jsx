import React,{useState} from "react";
import {FaLeaf,FaDrumstickBite,FaStar,FaMinus,FaPlus,FaShoppingBag} from "react-icons/fa";
import {useDispatch,useSelector} from "react-redux";
import {addToCart} from "../redux/user.slice";
const FoodCard=({data})=>{
 const [quantity,setQuantity]=useState(1);
 const dispatch=useDispatch();
 const {cartItems=[]}=useSelector(state=>state.user);
 const inCart=cartItems.some(i=>i.id===data._id);
 const rating=data.rating?.average||0;
 const add=()=>{if(quantity>0)dispatch(addToCart({id:data._id,name:data.name,price:data.price,image:data.image,shop:data.shop,quantity,foodType:data.foodType}));};
 return <article className="foodie-card bg-white rounded-[25px] overflow-hidden foodie-outline flex flex-col w-full max-w-[285px] min-w-0">
  <div className="relative h-[185px] overflow-hidden bg-[#fff1e7]">
   <img src={data.image} alt={data.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"/>
   <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] font-bold text-[#5a5149] shadow-sm">{data.category||"Fresh pick"}</span>
   <span className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/95 grid place-items-center shadow-sm">{data.foodType==="veg"?<FaLeaf className="text-green-600"/>:<FaDrumstickBite className="text-red-500"/>}</span>
  </div>
  <div className="p-4 flex-1 flex flex-col">
   <div className="flex items-start justify-between gap-2"><h3 className="font-extrabold text-[16px] text-[#29241f] leading-snug line-clamp-2">{data.name}</h3><span className="font-black text-[#f05b35] whitespace-nowrap">₹{data.price}</span></div>
   <div className="flex items-center gap-1.5 mt-2 text-xs text-[#8b8177]"><FaStar className="text-amber-400"/><b className="text-[#51483f]">{rating?rating.toFixed(1):"New"}</b><span>({data.rating?.count||0} reviews)</span></div>
   <div className="mt-4 flex items-center justify-between gap-2">
    <div className="flex items-center gap-3 bg-[#fff7f0] rounded-xl p-1"><button aria-label="Decrease quantity" onClick={()=>setQuantity(q=>Math.max(1,q-1))} className="w-7 h-7 grid place-items-center rounded-lg hover:bg-white"><FaMinus size={10}/></button><span className="text-sm font-bold min-w-3 text-center">{quantity}</span><button aria-label="Increase quantity" onClick={()=>setQuantity(q=>q+1)} className="w-7 h-7 grid place-items-center rounded-lg hover:bg-white"><FaPlus size={10}/></button></div>
    <button onClick={add} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 ${inCart?"bg-[#29241f]":"foodie-gradient shadow-md shadow-orange-100"}`}><FaShoppingBag/>{inCart?"Add more":"Add"}</button>
   </div>
  </div>
 </article>;
};
export default FoodCard;
