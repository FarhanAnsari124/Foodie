import axios from "axios";
import { useState } from "react";
import { MdPhone } from "react-icons/md";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/user.slice";

const OwnerOrderCard = ({ data }) => {
	const dispatch = useDispatch();
	const [availableBoys, setAvailableBoys] = useState([]);

	const handleUpdateStatus = async (orderId, shopId, status) => {
		try {
			const res = await axios.post(
				`${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
				{ status },
				{ withCredentials: true },
			);
			dispatch(updateOrderStatus({ orderId, shopId, status }));
			setAvailableBoys(res.data.availableDeliveryBoys ?? []);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="foodie-card rounded-2xl p-5 space-y-4">
			<div className="flex flex-col sm:flex-row sm:justify-between gap-2 border-b border-white/10 pb-3">
				<div>
					<h2 className="text-lg font-semibold text-white">
						{data.user.fullName}
					</h2>
					<p className="text-xs text-zinc-400">{data.user.email}</p>
					<p className="flex items-center gap-1.5 text-xs text-zinc-300 mt-1.5">
						<MdPhone className="text-orange-400" />
						<span>{data.user.mobile}</span>
					</p>
				</div>
				<div className="sm:text-right">
					{data.paymentMethod === "online" ? (
						<p className="text-xs text-zinc-300">
							Payment:{" "}
							<span
								className={
									data.payment
										? "text-emerald-400 font-semibold"
										: "text-orange-400 font-semibold"
								}
							>
								{data.payment ? "Paid" : "Pending"}
							</span>
						</p>
					) : (
						<span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium">
							{data.paymentMethod.toUpperCase()}
						</span>
					)}
				</div>
			</div>

			<div className="flex items-start flex-col gap-1 text-zinc-300 text-xs bg-[#151515] border border-white/10 rounded-xl p-3">
				<p>{data?.deliveryAddress?.text}</p>
				<p className="text-[11px] text-zinc-500">
					lat: {data?.deliveryAddress?.latitude}, lon:{" "}
					{data?.deliveryAddress?.longitude}
				</p>
			</div>

			<div className="flex space-x-3 overflow-x-auto pb-2">
				{data.shopOrders.shopOrderItems.map((item, index) => (
					<div
						key={index}
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
					</div>
				))}
			</div>

			<div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-white/10">
				<span className="text-sm text-zinc-300">
					Status:{" "}
					<span className="font-semibold capitalize text-orange-400">
						{data.shopOrders.status}
					</span>
				</span>
				<select
					className="rounded-xl border border-orange-500/40 bg-[#181818] px-3 py-1.5 text-sm text-orange-400 focus:outline-none focus:border-orange-500 cursor-pointer"
					onChange={(e) => {
						const shopId = data.shopOrders.shop?._id;
						if (!shopId) {
							console.error("Shop ID is missing");
							return;
						}
						if (e.target.value) {
							handleUpdateStatus(data._id, shopId, e.target.value);
						}
					}}
				>
					<option value="">Change Status</option>
					<option value="Pending">Pending</option>
					<option value="Preparing">Preparing</option>
					<option value="Out for delivery">Out for delivery</option>
				</select>
			</div>

			{data.shopOrders.status === "Out for delivery" && (
				<div className="p-3.5 border border-orange-500/30 rounded-xl text-xs bg-orange-500/10 space-y-1">
					{data.shopOrders.assignedDeliveryBoy ? (
						<p className="font-semibold text-orange-400">
							Assigned Delivery Boy:
						</p>
					) : (
						<p className="font-semibold text-orange-400">
							Available Delivery Boys:
						</p>
					)}
					{availableBoys.length > 0 ? (
						availableBoys.map((b, index) => (
							<div className="text-zinc-200" key={index}>
								{b.fullName} — {b.mobile}
							</div>
						))
					) : data.shopOrders.assignedDeliveryBoy ? (
						<div className="font-semibold text-white">
							{data.shopOrders.assignedDeliveryBoy.fullName} —{" "}
							{data.shopOrders.assignedDeliveryBoy.mobile}
						</div>
					) : (
						<div className="text-zinc-300">
							Waiting for delivery partner to accept
						</div>
					)}
				</div>
			)}

			<div className="text-right font-bold text-white text-base">
				Total: <span className="text-orange-400">₹{data.shopOrders.subTotal}</span>
			</div>
		</div>
	);
};

export default OwnerOrderCard;
