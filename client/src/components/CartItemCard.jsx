import { FaMinus, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../redux/user.slice";

const CartItemCard = ({ data }) => {
	const dispatch = useDispatch();

	const handleIncrease = (id, cquantity) => {
		dispatch(
			updateQuantity({
				id,
				quantity: cquantity + 1,
			}),
		);
	};

	const handleDecrease = (id, cquantity) => {
		if (cquantity > 1) {
			dispatch(
				updateQuantity({
					id,
					quantity: cquantity - 1,
				}),
			);
		}
	};

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 foodie-card foodie-card-hover p-4 rounded-2xl">
			<div className="flex items-center gap-4">
				<img
					src={data.image}
					alt={data.name}
					className="w-20 h-20 object-cover rounded-xl border border-white/10 shrink-0"
				/>
				<div>
					<h2 className="font-semibold text-white text-base">
						{data.name}
					</h2>
					<p className="text-xs text-zinc-400 mt-0.5">
						₹{data.price} × {data.quantity}
					</p>
					<p className="font-bold text-orange-400 text-base mt-1">
						₹{data.price * data.quantity}
					</p>
				</div>
			</div>

			<div className="flex items-center justify-end gap-3">
				<div className="flex items-center bg-[#1c1c1c] border border-white/10 rounded-full p-1 gap-1">
					<button
						type="button"
						className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center cursor-pointer transition"
						onClick={() => handleDecrease(data.id, data.quantity)}
					>
						<FaMinus size={11} />
					</button>
					<span className="min-w-[28px] text-center text-sm font-semibold text-white">
						{data.quantity}
					</span>
					<button
						type="button"
						className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center cursor-pointer transition"
						onClick={() => handleIncrease(data.id, data.quantity)}
					>
						<FaPlus size={11} />
					</button>
				</div>

				<button
					type="button"
					className="p-2.5 bg-orange-500/10 border border-orange-500/25 text-orange-400 rounded-full hover:bg-orange-500 hover:text-white transition cursor-pointer"
					onClick={() => dispatch(removeItem(data.id))}
					title="Remove item"
				>
					<CiTrash size={18} />
				</button>
			</div>
		</div>
	);
};

export default CartItemCard;
