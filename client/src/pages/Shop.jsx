import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { FaStore, FaUtensils, FaArrowLeft } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import FoodCard from "../components/FoodCard";
import Nav from "../components/Nav";

const Shop = () => {
	const { shopId } = useParams();
	const [items, setItems] = useState([]);
	const [shop, setShop] = useState([]);
	const navigate = useNavigate();

	const handleShop = async () => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/item/get-by-shop/${shopId}`,
				{
					withCredentials: true,
				},
			);
			setShop(data.shop);
			setItems(data.items);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		handleShop();
	}, [shopId]);

	return (
		<div className="min-h-screen bg-[#050505] text-zinc-100 pt-20">
			<Nav />

			{shop && (
				<div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden border-b border-white/10">
					<button
						className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/15 hover:border-orange-500/60 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition cursor-pointer"
						onClick={() => navigate("/")}
					>
						<FaArrowLeft className="text-orange-400" />
						<span>Back</span>
					</button>

					<img
						src={shop.image}
						alt={shop.name || "Restaurant"}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/65 to-black/40 flex flex-col justify-center items-center text-center px-4">
						<div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mb-3">
							<FaStore className="text-orange-400 text-2xl" />
						</div>
						<h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
							{shop.name}
						</h1>
						<div className="flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-black/60 border border-white/10">
							<FaLocationDot size={16} className="text-orange-500" />
							<p className="text-sm sm:text-base font-medium text-zinc-200">
								{shop.address}
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
				<div className="flex items-center justify-center gap-3 mb-10">
					<FaUtensils className="text-orange-500 text-2xl" />
					<h2 className="text-2xl sm:text-3xl font-bold text-white">
						Our <span className="text-orange-500">Menu</span>
					</h2>
				</div>

				{items.length > 0 ? (
					<div className="flex flex-wrap justify-center gap-6">
						{items.map((item, idx) => (
							<FoodCard data={item} key={item._id || idx} />
						))}
					</div>
				) : (
					<div className="foodie-card rounded-2xl p-10 text-center text-zinc-400">
						No Items Available
					</div>
				)}
			</div>
		</div>
	);
};

export default Shop;
