import React from "react";
const CategoryCard=({data,onClick,active=false})=><button onClick={onClick} className={`group shrink-0 w-[112px] sm:w-[132px] text-center ${active?"opacity-100":"opacity-90"}`}>
 <span className={`block rounded-[26px] p-1.5 transition-all duration-300 ${active?"bg-[#ff6b3d] shadow-lg shadow-orange-200":"bg-white foodie-outline group-hover:-translate-y-1 group-hover:shadow-lg"}`}>
  <span className="block h-[94px] sm:h-[112px] rounded-[21px] overflow-hidden bg-[#fff1e7]"><img src={data.image} alt={data.name||data.category||"Food"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/></span>
 </span>
 <span className={`mt-3 block text-sm font-bold ${active?"text-[#f05a35]":"text-[#62594f]"}`}>{data.name||data.category}</span>
</button>;
export default CategoryCard;
