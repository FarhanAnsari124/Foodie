import { IoIosArrowRoundBack } from "react-icons/io";
import { FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";
import Nav from "../components/Nav";

const CartPage = () => {
	const navigate = useNavigate();
	const { cartItems, totalAmount } = useSelector((state) => state.user);

	return (
		<div className="min-h-screen bg-[#050505] text-zinc-100 pt-24 pb-12 px-4 sm:px-6 flex justify-center">
			<Nav />
			<div className="w-full max-w-[850px]">
				{/* Figma-style Progress Stepper */}
				<div className="flex items-center justify-center gap-3 sm:gap-6 mb-8">
					<div className="flex flex-col items-center gap-1.5">
						<div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shadow-[0_0_20px_rgba(255,94,0,0.45)]">
							1
						</div>
						<span className="text-xs font-medium text-orange-400">
							Shopping Cart
						</span>
					</div>
					<div className="h-[1px] w-12 sm:w-24 bg-white/15 -mt-5" />
					<div className="flex flex-col items-center gap-1.5">
						<div className="w-10 h-10 rounded-full border border-white/25 bg-[#121212] text-zinc-400 font-semibold flex items-center justify-center">
							2
						</div>
						<span className="text-xs text-zinc-500">Address</span>
					</div>
					<div className="h-[1px] w-12 sm:w-24 bg-white/15 -mt-5" />
					<div className="flex flex-col items-center gap-1.5">
						<div className="w-10 h-10 rounded-full border border-white/25 bg-[#121212] text-zinc-400 font-semibold flex items-center justify-center">
							3
						</div>
						<span className="text-xs text-zinc-500">Payment</span>
					</div>
				</div>

				<div className="flex items-center gap-3 mb-6">
					<button
						type="button"
						className="p-1.5 rounded-full bg-[#141414] border border-white/10 hover:border-orange-500/50 text-orange-400 cursor-pointer transition"
						onClick={() => navigate("/")}
					>
						<IoIosArrowRoundBack size={28} />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-white">Your Cart</h1>
						<p className="text-xs text-zinc-400">
							{cartItems?.length || 0} {cartItems?.length === 1 ? "item" : "items"} in your cart
						</p>
					</div>
				</div>

				{cartItems?.length === 0 ? (
					<div className="foodie-card rounded-3xl p-12 text-center flex flex-col items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-500">
							<FiShoppingBag size={28} />
						</div>
						<p className="text-zinc-300 text-lg font-medium">
							Your Cart is Empty
						</p>
						<p className="text-zinc-500 text-sm max-w-sm">
							Explore delicious dishes from restaurants near you and add them here.
						</p>
						<button
							className="foodie-btn-primary px-6 py-2.5 rounded-full text-sm font-semibold cursor-pointer mt-2"
							onClick={() => navigate("/")}
						>
							Browse Menu
						</button>
					</div>
				) : (
					<div className="foodie-card rounded-3xl p-5 sm:p-7 space-y-6">
						<div className="space-y-4">
							{cartItems?.map((item, index) => (
								<CartItemCard data={item} key={item.id || index} />
							))}
						</div>

						<div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<p className="text-xs text-zinc-400 uppercase tracking-wider">
									Total Amount
								</p>
								<span className="text-2xl font-bold text-orange-400">
									₹{totalAmount}
								</span>
							</div>

							<button
								className="foodie-btn-primary px-8 py-3 rounded-full text-base font-semibold cursor-pointer"
								onClick={() => navigate("/check-out")}
							>
								Proceed to Checkout
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CartPage;
