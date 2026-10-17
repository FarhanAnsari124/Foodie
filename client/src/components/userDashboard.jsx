import { useEffect, useRef, useState } from "react";
import { categories } from "../category.js";
import CategoryCard from "./CategoryCard";
import Nav from "./Nav";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import useGetShopByCity from "../hooks/useGetShopByCity.jsx";
import useGetItemsByCity from "../hooks/useGetItemsByCity.jsx";
import FoodCard from "./FoodCard.jsx";

const userDashboard = () => {
	const catScrollRef = useRef();
	const shopScrollRef = useRef();
	useGetShopByCity();
	useGetItemsByCity();
	const [showLeftCatButton, setShowLeftCatButton] = useState(false);
	const [showRightCatButton, setShowRightCatButton] = useState(false);
	const [showLeftShopButton, setShowLeftShopButton] = useState(false);
	const [showRightShopButton, setShowRightShopButton] = useState(false);
	const { city,shopsInMyCity,itemsInMyCity } = useSelector((state) => state.user);
	const updateButton = (ref, setLeftButton, setRightButton) => {
		const element = ref.current;
		if (element) {
			setLeftButton(element.scrollLeft > 0);
			setRightButton(
				element.scrollLeft + element.clientWidth < element.scrollWidth,
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
	}, []);
	const scrollhandler = (ref, direction) => {
		if (ref.current) {
			ref.current.scrollBy({
				left: direction == "left" ? -200 : 200,
				behavior: "smooth",
			});
		}
	};
	return (
		<div className="w-screen min-h-screen bg-[#fff9f6] flex flex-col items-center overflow-y-auto">
			<Nav />
			<div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
				<h1 className="text-gray-800 text-2xl sm:text-3xl">
					Inspiration for your first Order
				</h1>
				<div className="w-full relative">
					{showLeftCatButton && (
						<button
							className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
							onClick={() => scrollhandler(catScrollRef, "left")}
						>
							<FaCircleChevronLeft />
						</button>
					)}

					<div
						className="w-full flex overflow-x-auto gap-4 pb-2"
						ref={catScrollRef}
					>
						{categories.map((cat, index) => (
							<CategoryCard data={cat} key={index} />
						))}
					</div>
					{showRightCatButton && (
						<button
							className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
							onClick={() => scrollhandler(catScrollRef, "right")}
						>
							<FaCircleChevronRight />
						</button>
					)}
				</div>
			</div>
			<div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
				<h1 className="text-gray-800 text-2xl sm:text-3xl">
					Best Shops in {city}
				</h1>
				<div className="w-full relative">
					{showLeftShopButton && (
						<button
							className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
							onClick={() => scrollhandler(shopScrollRef, "left")}
						>
							<FaCircleChevronLeft />
						</button>
					)}

					<div
						className="w-full flex overflow-x-auto gap-4 pb-2"
						ref={shopScrollRef}
					>
						{shopsInMyCity?.map((cat, index) => (
							<CategoryCard data={cat} key={index} />
						))}
					</div>
					{showRightShopButton && (
						<button
							className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
							onClick={() => scrollhandler(shopScrollRef, "right")}
						>
							<FaCircleChevronRight />
						</button>
					)}
				</div>
			</div>
			<div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
				<h1 className="text-gray-800 text-2xl sm:text-3xl">
					Suggested Food items
				</h1>
				<div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
					{itemsInMyCity?.map((item,index)=>(
						<FoodCard key={index} data={item}/>
					))}

				</div>
			</div>

		</div>
	);
};

export default userDashboard;
