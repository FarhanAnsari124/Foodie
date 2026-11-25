import { useEffect, useRef, useState } from "react";
import { categories } from "../category.js";
import CategoryCard from "./CategoryCard";
import Nav from "./Nav";
import { FaCircleChevronLeft, FaCircleChevronRight, FaFire } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useGetShopByCity from "../hooks/useGetShopByCity.jsx";
import useGetItemsByCity from "../hooks/useGetItemsByCity.jsx";
import FoodCard from "./FoodCard.jsx";
import { useNavigate } from "react-router-dom";
import heroDish from "../assets/image5.jpg";

const UserDashboard = () => {
	const catScrollRef = useRef();
	const shopScrollRef = useRef();
	useGetShopByCity();
	useGetItemsByCity();
	const [showLeftCatButton, setShowLeftCatButton] = useState(false);
	const [showRightCatButton, setShowRightCatButton] = useState(false);
	const [showLeftShopButton, setShowLeftShopButton] = useState(false);
	const [showRightShopButton, setShowRightShopButton] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const navigate = useNavigate();
	const [updatedItemsList, setUpdatedItemsList] = useState([]);
	const { city, shopsInMyCity, itemsInMyCity, searchItems } = useSelector(
		(state) => state.user,
	);

	const handleFilterByCategory = (category) => {
		setSelectedCategory(category);
		if (category === "All") {
			setUpdatedItemsList(itemsInMyCity);
		} else {
			const filteredList = itemsInMyCity?.filter(
				(item) => item.category === category,
			);
			setUpdatedItemsList(filteredList);
		}
	};

	useEffect(() => {
		setUpdatedItemsList(itemsInMyCity);
		setSelectedCategory("All");
	}, [itemsInMyCity]);

	const updateButton = (ref, setLeftButton, setRightButton) => {
		const element = ref.current;
		if (element) {
			setLeftButton(element.scrollLeft > 0);
			setRightButton(
				element.scrollLeft + element.clientWidth < element.scrollWidth - 2,
			);
		}
	};

	useEffect(() => {
		const catElement = catScrollRef.current;
		const shopElement = shopScrollRef.current;
		const handleScroll = () => {
			updateButton(
				catScrollRef,
				setShowLeftCatButton,
				setShowRightCatButton,
			);
			updateButton(
				shopScrollRef,
				setShowLeftShopButton,
				setShowRightShopButton,
			);
		};
		handleScroll();
		catElement?.addEventListener("scroll", handleScroll);
		shopElement?.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", handleScroll);
		return () => {
			catElement?.removeEventListener("scroll", handleScroll);
			shopElement?.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, [shopsInMyCity]);

	const scrollhandler = (ref, direction) => {
		if (ref.current) {
			ref.current.scrollBy({
				left: direction === "left" ? -240 : 240,
				behavior: "smooth",
			});
		}
	};

	const scrollToSection = (id) => {
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center">
			<Nav />

			{/* Search Results */}
			{searchItems && searchItems.length > 0 && (
				<section className="w-full max-w-7xl px-4 sm:px-6 mt-6">
					<div className="foodie-card rounded-3xl p-6 border border-orange-500/30">
						<div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
							<h2 className="text-white text-xl sm:text-2xl font-bold">
								Search <span className="text-orange-500">Results</span>
							</h2>
							<span className="text-xs px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 font-medium">
								{searchItems.length} found
							</span>
						</div>
						<div className="flex flex-wrap gap-6 justify-center">
							{searchItems.map((item) => (
								<FoodCard data={item} key={item._id} />
							))}
						</div>
					</div>
				</section>
			)}

			{/* Hero Section (Inspired by Figma Home Page with Black + Orange Tints) */}
			<section className="w-full max-w-7xl px-4 sm:px-6 pt-8 pb-12 relative">
				{/* Warm Orange Ambient Glow Orbs */}
				<div className="absolute -top-10 right-10 w-72 h-72 rounded-full bg-orange-500/20 blur-[110px] pointer-events-none" />
				<div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
					<div className="lg:col-span-6 space-y-6">
						<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wide uppercase">
							<FaFire className="text-orange-500" />
							<span>Fast &amp; Fresh Doorstep Delivery</span>
						</div>
						<h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold leading-[1.12] tracking-tight text-white uppercase">
							Get Delicious Food{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
								At Your Doorsteps
							</span>
						</h1>
						<p className="text-zinc-400 text-sm sm:text-base max-w-lg leading-relaxed">
							Craving hot burgers, stone-baked pizza, or spicy local favorites?
							Explore top-rated kitchens in{" "}
							<span className="text-orange-400 font-medium">
								{city || "your city"}
							</span>{" "}
							and track your order live.
						</p>
						<div className="flex flex-wrap items-center gap-4 pt-1">
							<button
								onClick={() => scrollToSection("menu-section")}
								className="foodie-btn-primary px-7 py-3 rounded-full font-semibold text-sm sm:text-base cursor-pointer"
							>
								Order Now
							</button>
							<button
								onClick={() => scrollToSection("shops-section")}
								className="px-6 py-3 rounded-full font-semibold text-sm sm:text-base border border-white/15 bg-[#121212] hover:border-orange-500/50 hover:text-orange-400 text-zinc-200 transition cursor-pointer"
							>
								Explore Restaurants
							</button>
						</div>
					</div>

					<div className="lg:col-span-6 flex justify-center lg:justify-end">
						<div className="relative w-full max-w-md aspect-[4/3] rounded-3xl p-3 bg-gradient-to-br from-[#1f1f1f] via-[#121212] to-[#090909] border border-orange-500/25 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
							<div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 opacity-75 blur-2xl pointer-events-none" />
							<div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 opacity-60 blur-2xl pointer-events-none" />
							<img
								src={heroDish}
								alt="Featured Delicious Burger"
								className="w-full h-full object-cover rounded-2xl relative z-10"
							/>
							<div className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-orange-500/35 flex items-center gap-3">
								<span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
								<div>
									<p className="text-xs font-semibold text-white">
										Express Delivery
									</p>
									<p className="text-[11px] text-orange-400">
										25-30 mins avg
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="w-full max-w-7xl px-4 sm:px-6 py-6">
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-white text-xl sm:text-2xl font-bold">
						Choose from your{" "}
						<span className="text-orange-500">favourite category</span>
					</h2>
				</div>
				<div className="w-full relative">
					{showLeftCatButton && (
						<button
							className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#161616]/90 border border-orange-500/40 text-orange-400 p-2 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition z-20 cursor-pointer"
							onClick={() => scrollhandler(catScrollRef, "left")}
						>
							<FaCircleChevronLeft size={20} />
						</button>
					)}

					<div
						className="w-full flex overflow-x-auto gap-4 pb-2"
						ref={catScrollRef}
					>
						{categories.map((cat, index) => (
							<CategoryCard
								data={cat}
								key={index}
								isActive={selectedCategory === cat.category}
								onClick={() => handleFilterByCategory(cat.category)}
							/>
						))}
					</div>

					{showRightCatButton && (
						<button
							className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#161616]/90 border border-orange-500/40 text-orange-400 p-2 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition z-20 cursor-pointer"
							onClick={() => scrollhandler(catScrollRef, "right")}
						>
							<FaCircleChevronRight size={20} />
						</button>
					)}
				</div>
			</section>

			{/* Restaurants / Shops Near You */}
			<section id="shops-section" className="w-full max-w-7xl px-4 sm:px-6 py-6">
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-white text-xl sm:text-2xl font-bold">
						Restaurants Near{" "}
						<span className="text-orange-500">{city || "You"}</span>
					</h2>
				</div>
				<div className="w-full relative">
					{showLeftShopButton && (
						<button
							className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#161616]/90 border border-orange-500/40 text-orange-400 p-2 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition z-20 cursor-pointer"
							onClick={() => scrollhandler(shopScrollRef, "left")}
						>
							<FaCircleChevronLeft size={20} />
						</button>
					)}

					<div
						className="w-full flex overflow-x-auto gap-4 pb-2"
						ref={shopScrollRef}
					>
						{shopsInMyCity && shopsInMyCity.length > 0 ? (
							shopsInMyCity.map((shop, index) => (
								<CategoryCard
									data={shop}
									key={index}
									onClick={() => navigate(`/shop/${shop._id}`)}
								/>
							))
						) : (
							<p className="text-zinc-500 text-sm py-4">
								No restaurants available in {city || "this area"} yet.
							</p>
						)}
					</div>

					{showRightShopButton && (
						<button
							className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#161616]/90 border border-orange-500/40 text-orange-400 p-2 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition z-20 cursor-pointer"
							onClick={() => scrollhandler(shopScrollRef, "right")}
						>
							<FaCircleChevronRight size={20} />
						</button>
					)}
				</div>
			</section>

			{/* Suggested Food Items */}
			<section id="menu-section" className="w-full max-w-7xl px-4 sm:px-6 py-8 flex-1">
				<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
					<h2 className="text-white text-xl sm:text-2xl font-bold">
						Suggested{" "}
						<span className="text-orange-500">
							{selectedCategory === "All" ? "Food Items" : selectedCategory}
						</span>
					</h2>
					{selectedCategory !== "All" && (
						<button
							onClick={() => handleFilterByCategory("All")}
							className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white transition cursor-pointer"
						>
							Show All
						</button>
					)}
				</div>
				{updatedItemsList && updatedItemsList.length > 0 ? (
					<div className="w-full flex flex-wrap gap-6 justify-center sm:justify-start">
						{updatedItemsList.map((item, index) => (
							<FoodCard key={item._id || index} data={item} />
						))}
					</div>
				) : (
					<div className="foodie-card rounded-2xl p-10 text-center text-zinc-400">
						No food items found in this category.
					</div>
				)}
			</section>

			{/* Dark Footer matching Figma layout */}
			<footer className="w-full bg-[#0b0b0b] border-t border-white/10 mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
					<div className="space-y-3">
						<h3 className="text-xl font-bold text-white">
							Food<span className="text-orange-500">ie</span>
						</h3>
						<p className="text-zinc-500 text-xs leading-relaxed">
							Delivering hot, fresh meals from local kitchens straight to your doorstep.
						</p>
					</div>
					<div className="space-y-2">
						<h4 className="font-semibold text-white">Quick Links</h4>
						<ul className="space-y-1.5 text-zinc-400 text-xs">
							<li
								onClick={() => scrollToSection("menu-section")}
								className="hover:text-orange-400 cursor-pointer transition-colors"
							>
								Browse Menu
							</li>
							<li
								onClick={() => scrollToSection("shops-section")}
								className="hover:text-orange-400 cursor-pointer transition-colors"
							>
								Restaurants
							</li>
							<li
								onClick={() => navigate("/my-orders")}
								className="hover:text-orange-400 cursor-pointer transition-colors"
							>
								Order History
							</li>
						</ul>
					</div>
					<div className="space-y-2">
						<h4 className="font-semibold text-white">Account</h4>
						<ul className="space-y-1.5 text-zinc-400 text-xs">
							<li
								onClick={() => navigate("/cart")}
								className="hover:text-orange-400 cursor-pointer transition-colors"
							>
								Shopping Cart
							</li>
							<li
								onClick={() => navigate("/check-out")}
								className="hover:text-orange-400 cursor-pointer transition-colors"
							>
								Checkout
							</li>
						</ul>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default UserDashboard;
