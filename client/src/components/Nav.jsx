import { useEffect, useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { TbReceipt2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setSearchItem, setUserData } from "../redux/user.slice";
import { useLocation, useNavigate } from "react-router-dom";

const Nav = () => {
	const { userData, cartItems, city } = useSelector((state) => state.user);
	const { myShopData } = useSelector((state) => state.owner);
	const [showPopUp, setShowPopUp] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [query, setQuery] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const handleSearchItems = async () => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/item/search-items?query=${query}&city=${city}`,
				{ withCredentials: true },
			);
			dispatch(setSearchItem(data.data));
		} catch (error) {
			console.log(error);
		}
	};

	const handleSignOut = async () => {
		try {
			await axios.get(`${serverUrl}/api/auth/signout`, {
				withCredentials: true,
			});
			dispatch(setUserData(null));
		} catch (error) {
			console.log("Signout error", error);
		}
	};

	useEffect(() => {
		if (query) {
			handleSearchItems();
		} else {
			dispatch(setSearchItem(null));
		}
	}, [query]);

	return (
		<header className="w-full h-20 fixed top-0 left-0 z-50 bg-[#0b0b0b]/90 backdrop-blur-xl border-b border-white/10">
			<div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
				{/* Brand */}
				<div
					onClick={() => navigate("/")}
					className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
				>
					<img
						src="/favicon.svg"
						alt="Foodie logo"
						className="w-10 h-10 object-contain drop-shadow-[0_4px_14px_rgba(255,94,0,0.4)] group-hover:scale-105 transition-transform"
					/>
					<h1 className="text-2xl font-bold tracking-tight text-white">
						Food<span className="text-orange-500">ie</span>
					</h1>
				</div>

				{/* Desktop Search Bar */}
				{userData?.role === "User" && (
					<div className="hidden md:flex flex-1 max-w-xl h-11 bg-[#161616] border border-white/10 focus-within:border-orange-500/60 focus-within:shadow-[0_0_20px_rgba(255,94,0,0.15)] rounded-full items-center px-3 gap-3 transition-all">
						<div className="flex items-center max-w-[35%] overflow-hidden gap-1.5 pr-3 border-r border-white/10">
							<FaLocationDot size={15} className="text-orange-500 shrink-0" />
							<span className="truncate text-xs font-medium text-zinc-300">
								{city || "Select City"}
							</span>
						</div>
						<div className="flex-1 flex items-center gap-2">
							<input
								type="text"
								placeholder="Search delicious food..."
								value={query}
								className="bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none w-full"
								onChange={(e) => setQuery(e.target.value)}
							/>
							<IoIosSearch size={20} className="text-zinc-400 shrink-0" />
						</div>
					</div>
				)}

				{/* Right Navigation Actions */}
				<div className="flex items-center gap-3 sm:gap-5 relative">
					{userData?.role === "User" && (
						<button
							type="button"
							aria-label="Toggle search"
							className="md:hidden p-2 rounded-full bg-[#181818] border border-white/10 text-orange-400 hover:border-orange-500/50 transition"
							onClick={() => setShowSearch((prev) => !prev)}
						>
							{showSearch ? <RxCross2 size={20} /> : <IoIosSearch size={20} />}
						</button>
					)}

					{userData?.role === "Owner" ? (
						<div className="flex items-center gap-2.5">
							{myShopData && (
								<>
									<button
										className="hidden md:flex items-center gap-1.5 px-4 py-2 cursor-pointer rounded-full bg-orange-500/15 border border-orange-500/35 text-orange-400 hover:bg-orange-500 hover:text-white text-sm font-medium transition-all"
										onClick={() => navigate("/add-item")}
									>
										<FaPlus size={14} />
										<span>Add Food Item</span>
									</button>
									<button
										className="md:hidden flex items-center p-2.5 cursor-pointer rounded-full bg-orange-500/15 border border-orange-500/35 text-orange-400"
										onClick={() => navigate("/add-item")}
									>
										<FaPlus size={16} />
									</button>
								</>
							)}
							<button
								className="hidden md:flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full bg-[#161616] border border-white/10 hover:border-orange-500/50 text-zinc-200 hover:text-orange-400 text-sm font-medium transition-all"
								onClick={() => navigate("/my-orders")}
							>
								<TbReceipt2 size={18} className="text-orange-500" />
								<span>My Orders</span>
							</button>
							<button
								className="md:hidden flex items-center p-2.5 cursor-pointer rounded-full bg-[#161616] border border-white/10 text-orange-400"
								onClick={() => navigate("/my-orders")}
							>
								<TbReceipt2 size={18} />
							</button>
						</div>
					) : (
						<div className="flex items-center gap-4 sm:gap-6">
							<button
								onClick={() => navigate("/")}
								className={`hidden lg:block text-sm font-medium cursor-pointer transition-colors ${
									location.pathname === "/"
										? "text-orange-500"
										: "text-zinc-300 hover:text-white"
								}`}
							>
								Home
							</button>
							<button
								onClick={() => navigate("/my-orders")}
								className={`hidden md:block text-sm font-medium cursor-pointer transition-colors ${
									location.pathname === "/my-orders"
										? "text-orange-500"
										: "text-zinc-300 hover:text-white"
								}`}
							>
								My Orders
							</button>
							{userData?.role === "User" && (
								<div
									className="relative cursor-pointer p-2 rounded-full hover:bg-white/5 transition"
									onClick={() => navigate("/cart")}
								>
									<FiShoppingCart size={22} className="text-zinc-100 hover:text-orange-400 transition-colors" />
									{cartItems.length > 0 && (
										<span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center shadow-[0_2px_10px_rgba(255,94,0,0.5)]">
											{cartItems.length}
										</span>
									)}
								</div>
							)}
						</div>
					)}

					{/* User Avatar & Dropdown */}
					<div
						className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold cursor-pointer ring-2 ring-orange-500/30 hover:ring-orange-400 transition-all shadow-[0_4px_15px_rgba(255,94,0,0.3)]"
						onClick={() => setShowPopUp((prev) => !prev)}
					>
						{userData?.fullName?.slice(0, 1)?.toUpperCase() || "U"}
					</div>

					{showPopUp && (
						<div className="absolute top-14 right-0 w-52 bg-[#141414] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl p-4 flex flex-col gap-3 z-50">
							<div className="pb-2.5 border-b border-white/10">
								<p className="text-sm font-semibold text-white truncate">
									{userData?.fullName}
								</p>
								<p className="text-xs text-orange-400/90 font-medium">
									{userData?.role}
								</p>
							</div>
							{userData?.role === "User" && (
								<button
									className="md:hidden text-left text-sm text-zinc-200 hover:text-orange-400 font-medium cursor-pointer transition-colors"
									onClick={() => {
										setShowPopUp(false);
										navigate("/my-orders");
									}}
								>
									My Orders
								</button>
							)}
							<button
								className="text-left text-sm text-orange-400 hover:text-orange-300 font-semibold cursor-pointer transition-colors"
								onClick={handleSignOut}
							>
								Log Out
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Mobile Search Bar */}
			{showSearch && userData?.role === "User" && (
				<div className="w-[92%] mx-auto mt-2 h-12 bg-[#161616] border border-orange-500/30 shadow-2xl flex rounded-full items-center px-3 gap-3 md:hidden">
					<div className="flex items-center max-w-[35%] overflow-hidden gap-1.5 pr-2.5 border-r border-white/10">
						<FaLocationDot size={15} className="text-orange-500 shrink-0" />
						<span className="truncate text-xs text-zinc-300">
							{city || "City"}
						</span>
					</div>
					<div className="flex-1 flex items-center gap-2">
						<input
							type="text"
							placeholder="Search delicious food..."
							value={query}
							className="bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none w-full"
							onChange={(e) => setQuery(e.target.value)}
						/>
						<IoIosSearch size={20} className="text-orange-400 shrink-0" />
					</div>
				</div>
			)}
		</header>
	);
};

export default Nav;
