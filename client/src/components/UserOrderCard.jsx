import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

const UserOrderCard = ({ data }) => {
	const [selectedRating, setSelectedRating] = useState({});
	const navigate = useNavigate();

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const handleRating = async (itemId, rating) => {
		try {
			await axios.post(
				`${serverUrl}/api/item/rating`,
				{
					itemId,
					rating,
				},
				{ withCredentials: true },
			);
			setSelectedRating((prev) => ({
				...prev,
				[itemId]: rating,
			}));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="foodie-card rounded-2xl p-5 space-y-4">
			<div className="flex justify-between items-start border-b border-white/10 pb-3">
				<div>
					<p className="font-semibold text-white">
						Order <span className="text-orange-400">#{data._id.slice(-6)}</span>
					</p>
					<p className="text-xs text-zinc-400 mt-0.5">
						Date: {formatDate(data.createdAt)}
					</p>
				</div>
				<div className="text-right">
					{data.paymentMethod === "cod" ? (
						<span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium">
							{data.paymentMethod.toUpperCase()}
						</span>
					) : (
						<span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium">
							Payment: {data.payment ? "Paid" : "Pending"}
						</span>
					)}

					<p className="text-xs font-semibold text-orange-400 mt-1.5 capitalize">
						{data?.shopOrders?.[0]?.status}
					</p>
				</div>
			</div>

			{data.shopOrders.map((shopOrder, index) => (
				<div
					className="border border-white/10 rounded-xl p-4 bg-[#151515] space-y-3"
					key={index}
				>
					<p className="font-semibold text-white text-sm">
						{shopOrder.shop.name}
					</p>
					<div className="flex space-x-3 overflow-x-auto pb-2">
						{shopOrder.shopOrderItems.map((item, idx) => (
							<div
								key={idx}
								className="shrink-0 w-44 border border-white/10 rounded-xl p-2.5 bg-[#0e0e0e]"
							>
								<img
									src={item.item.image}
									alt={item.name}
									className="w-full h-28 object-cover rounded-lg"
								/>
								<p className="text-sm font-semibold text-white mt-2 truncate">
									{item.name}
								</p>
								<p className="text-xs text-zinc-400">
									Qty: {item.quantity} × ₹{item.price}
								</p>
								{shopOrder.status === "Delivered" && (
									<div className="flex space-x-1 mt-2">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												type="button"
												className={`text-lg cursor-pointer transition ${
													selectedRating[item.item._id] >= star
														? "text-orange-400"
														: "text-zinc-600 hover:text-orange-300"
												}`}
												onClick={() =>
													handleRating(item.item._id, star)
												}
											>
												★
											</button>
										))}
									</div>
								)}
							</div>
						))}
					</div>
					<div className="flex justify-between items-center border-t border-white/10 pt-2.5 text-sm">
						<p className="font-semibold text-zinc-200">
							Subtotal: <span className="text-orange-400">₹{shopOrder.subTotal}</span>
						</p>
						<span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 capitalize">
							{shopOrder.status}
						</span>
					</div>
				</div>
			))}

			<div className="flex justify-between items-center border-t border-white/10 pt-3">
				<p className="font-bold text-white text-base">
					Total: <span className="text-orange-400">₹{data.totalAmount}</span>
				</p>
				<button
					className="foodie-btn-primary px-5 py-2 rounded-full text-sm font-semibold cursor-pointer"
					onClick={() => navigate(`/track-order/${data._id}`)}
				>
					Track Order
				</button>
			</div>
		</div>
	);
};

export default UserOrderCard;
