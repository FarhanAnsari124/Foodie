import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const OrderPlaced = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col justify-center items-center px-4 text-center relative overflow-hidden">
			<div className="absolute w-96 h-96 rounded-full bg-orange-500/15 blur-[120px] pointer-events-none" />
			<div className="foodie-card rounded-3xl p-8 sm:p-10 max-w-md w-full flex flex-col items-center relative z-10 border border-orange-500/30">
				<div className="w-20 h-20 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(255,94,0,0.3)]">
					<FaCircleCheck className="text-orange-500 text-4xl" />
				</div>
				<h1 className="text-3xl font-bold text-white mb-2">
					Order Placed!
				</h1>
				<p className="text-zinc-400 text-sm leading-relaxed mb-7">
					Thank you for your purchase. Your order is being prepared. You
					can track your order status anytime in the &ldquo;My Orders&rdquo; section.
				</p>
				<button
					className="foodie-btn-primary px-8 py-3 rounded-full text-base font-semibold cursor-pointer w-full"
					onClick={() => navigate("/my-orders")}
				>
					Track My Orders
				</button>
			</div>
		</div>
	);
};

export default OrderPlaced;
