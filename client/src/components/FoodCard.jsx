import { useState } from "react";
import {
	FaLeaf,
	FaDrumstickBite,
	FaStar,
	FaMinus,
	FaPlus,
	FaShoppingCart,
} from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/user.slice";

const FoodCard = ({ data }) => {
	const [quantity, setQuantity] = useState(1);
	const dispatch = useDispatch();
	const { cartItems } = useSelector((state) => state.user);
	const isInCart = cartItems.some((i) => i.id == data._id);

	const renderStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				i <= rating ? (
					<FaStar key={i} className="text-orange-400 text-sm" />
				) : (
					<FaRegStar key={i} className="text-zinc-600 text-sm" />
				),
			);
		}
		return stars;
	};

	const handleIncrease = () => {
		setQuantity((prev) => prev + 1);
	};

	const handleDecrease = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	return (
		<div className="w-[260px] rounded-2xl foodie-card foodie-card-hover overflow-hidden flex flex-col group">
			<div className="relative w-full h-[175px] flex justify-center items-center bg-[#0c0c0c] overflow-hidden">
				<div className="absolute top-3 right-3 z-10 bg-black/75 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-lg">
					{data.foodType === "veg" ? (
						<FaLeaf className="text-emerald-400 text-sm" />
					) : (
						<FaDrumstickBite className="text-orange-500 text-sm" />
					)}
				</div>

				<img
					src={data.image}
					alt={data.name}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent opacity-60 pointer-events-none" />
			</div>

			<div className="flex flex-1 flex-col p-4 pb-2">
				<h2 className="font-semibold text-white text-base truncate group-hover:text-orange-400 transition-colors">
					{data.name}
				</h2>
				<div className="flex items-center gap-1 mt-1.5">
					{renderStars(data.rating?.average || 0)}
					<span className="text-xs text-zinc-400 ml-1">
						({data.rating?.count || 0})
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between mt-auto p-4 pt-2">
				<span className="font-bold text-orange-400 text-lg">
					₹{data.price}
				</span>

				<div className="flex items-center bg-[#1c1c1c] border border-white/10 rounded-full overflow-hidden">
					<button
						type="button"
						className="px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
						onClick={handleDecrease}
					>
						<FaMinus size={10} />
					</button>
					<span className="px-2 text-xs font-semibold text-white min-w-[20px] text-center">
						{quantity}
					</span>
					<button
						type="button"
						className="px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
						onClick={handleIncrease}
					>
						<FaPlus size={10} />
					</button>
					<button
						type="button"
						title={isInCart ? "Added to cart" : "Add to cart"}
						className={`${
							isInCart
								? "bg-orange-500/20 text-orange-400 border-l border-orange-500/30"
								: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500"
						} px-3.5 py-2 transition-all cursor-pointer flex items-center justify-center`}
						onClick={() => {
							if (quantity > 0) {
								dispatch(
									addToCart({
										id: data._id,
										name: data.name,
										price: data.price,
										image: data.image,
										shop: data.shop,
										quantity,
										foodType: data.foodType,
									}),
								);
							}
						}}
					>
						<FaShoppingCart size={14} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default FoodCard;
