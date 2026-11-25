import Nav from "./Nav";
import { useSelector } from "react-redux";
import { FaUtensils, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OwnerItemCard from "./OwnerItemCard";
import useGetMyShop from "../hooks/useGetMyShop";

const OwnerDashboard = () => {
	const { loading } = useGetMyShop();
	const { userData } = useSelector((state) => state.user);
	const { myShopData } = useSelector((state) => state.owner);
	const navigate = useNavigate();

	if (userData?.role === "Owner" && loading) {
		return (
			<div className="w-full min-h-screen bg-[#050505] flex flex-col justify-center items-center gap-3">
				<div className="w-10 h-10 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
				<p className="text-xl font-semibold text-orange-400">Loading shop...</p>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center pb-14">
			<Nav />
			{myShopData ? (
				<div className="w-full max-w-4xl flex flex-col items-center gap-7 px-4 sm:px-6 pt-8">
					<div className="flex items-center gap-3 text-center">
						<div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/35 flex items-center justify-center">
							<FaUtensils className="text-orange-500 text-xl" />
						</div>
						<h1 className="text-2xl sm:text-3xl font-bold text-white">
							Welcome to{" "}
							<span className="text-orange-500">{myShopData.name}</span>
						</h1>
					</div>

					<div className="foodie-card foodie-card-hover rounded-3xl overflow-hidden w-full max-w-3xl relative">
						<button
							type="button"
							className="absolute top-4 right-4 z-10 bg-black/75 border border-orange-500/40 text-orange-400 p-2.5 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
							onClick={() => navigate("/create-edit-shop")}
							title="Edit shop"
						>
							<FaPen size={16} />
						</button>
						<div className="relative">
							<img
								src={myShopData.image}
								alt={myShopData.name}
								className="w-full h-52 sm:h-68 object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent pointer-events-none" />
						</div>
						<div className="p-5 sm:p-6">
							<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
								{myShopData.name}
							</h2>
							<p className="text-sm text-zinc-400">{myShopData.address}</p>
							<p className="text-xs text-orange-400 font-medium mt-1">
								{myShopData.city}, {myShopData.state}
							</p>
						</div>
					</div>

					{myShopData.item.length === 0 && (
						<div className="flex justify-center w-full">
							<div className="w-full max-w-md foodie-card rounded-3xl p-8 text-center border border-orange-500/25">
								<div className="flex flex-col items-center">
									<div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/35 flex items-center justify-center mb-4">
										<FaUtensils className="text-orange-500 text-2xl" />
									</div>
									<h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
										Add Your Food Item
									</h2>
									<p className="text-zinc-400 mb-6 text-sm">
										Share your delicious creations with our
										customers by adding them to the menu.
									</p>
									<button
										className="foodie-btn-primary px-7 py-2.5 rounded-full font-semibold text-sm cursor-pointer"
										onClick={() => navigate("/add-item")}
									>
										Add Food
									</button>
								</div>
							</div>
						</div>
					)}

					{myShopData.item.length > 0 && (
						<div className="flex flex-col items-center gap-4 w-full max-w-3xl">
							<div className="w-full flex items-center justify-between">
								<h3 className="text-lg font-bold text-white">
									Menu <span className="text-orange-500">Items</span>
								</h3>
								<span className="text-xs text-zinc-400">
									{myShopData.item.length} items
								</span>
							</div>
							{myShopData.item.map((item, index) => (
								<OwnerItemCard data={item} key={item._id || index} />
							))}
						</div>
					)}
				</div>
			) : (
				<div className="flex justify-center p-4 sm:p-6 pt-14 w-full">
					<div className="w-full max-w-md foodie-card rounded-3xl p-8 border border-orange-500/25">
						<div className="flex flex-col items-center text-center">
							<div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/35 flex items-center justify-center mb-4">
								<FaUtensils className="text-orange-500 text-2xl" />
							</div>
							<h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
								Add Your Restaurant
							</h2>
							<p className="text-zinc-400 mb-6 text-sm">
								Join our food delivery platform and reach
								thousands of hungry customers every day.
							</p>
							<button
								className="foodie-btn-primary px-7 py-2.5 rounded-full font-semibold text-sm cursor-pointer"
								onClick={() => navigate("/create-edit-shop")}
							>
								Get Started
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OwnerDashboard;
