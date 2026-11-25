import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";

const TrackOrderPage = () => {
	const { orderId } = useParams();
	const [currentOrder, setCurrentOrder] = useState();
	const navigate = useNavigate();
	const { socket } = useSelector((state) => state.user);
	const [liveLocations, setLiveLocations] = useState({});

	const handleGetOrder = async () => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/order/get-order-by-id/${orderId}`,
				{ withCredentials: true },
			);
			setCurrentOrder(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!socket) return;

		const handleLocationUpdate = ({
			deliveryBoyId,
			latitude,
			longitude,
		}) => {
			setLiveLocations((prev) => ({
				...prev,
				[String(deliveryBoyId)]: {
					lat: latitude,
					lon: longitude,
				},
			}));
		};

		socket.on("update-delivery-location", handleLocationUpdate);

		return () => {
			socket.off("update-delivery-location", handleLocationUpdate);
		};
	}, [socket]);

	useEffect(() => {
		handleGetOrder();
	}, [orderId]);

	return (
		<div className="min-h-screen w-full bg-[#050505] text-zinc-100 pt-24 pb-12 px-4 sm:px-6">
			<Nav />
			<div className="max-w-4xl mx-auto flex flex-col gap-6">
				<div
					className="flex items-center gap-3 cursor-pointer w-fit"
					onClick={() => navigate("/my-orders")}
				>
					<span className="p-1.5 rounded-full bg-[#141414] border border-white/10 hover:border-orange-500/50 text-orange-400 transition">
						<IoIosArrowRoundBack size={26} />
					</span>
					<h1 className="text-2xl font-bold text-white">
						Track <span className="text-orange-500">Order</span>
					</h1>
				</div>

				{currentOrder?.shopOrders?.map((shopOrder, index) => (
					<div
						className="foodie-card p-6 rounded-3xl space-y-4"
						key={index}
					>
						<div className="space-y-2 border-b border-white/10 pb-4">
							<p className="text-lg font-bold text-orange-400">
								{shopOrder.shop.name}
							</p>
							<p className="text-sm text-zinc-300">
								<span className="font-semibold text-white">Items: </span>
								{shopOrder.shopOrderItems
									?.map((i) => i.name)
									.join(", ")}
							</p>
							<p className="text-sm text-zinc-300">
								<span className="font-semibold text-white">Subtotal: </span>
								<span className="text-orange-400 font-semibold">
									₹{shopOrder.subTotal}
								</span>
							</p>
							<p className="text-sm text-zinc-400 pt-1">
								<span className="font-semibold text-white">
									Delivery Address:{" "}
								</span>
								{currentOrder.deliveryAddress.text}
							</p>
						</div>

						{shopOrder.status !== "Delivered" ? (
							<>
								{shopOrder.assignedDeliveryBoy ? (
									<div className="text-sm bg-[#161616] border border-orange-500/25 rounded-xl p-4 space-y-1">
										<p className="text-zinc-300">
											<span className="font-semibold text-orange-400">
												Delivery Partner:{" "}
											</span>
											{shopOrder.assignedDeliveryBoy.fullName}
										</p>
										<p className="text-zinc-300">
											<span className="font-semibold text-orange-400">
												Contact No:{" "}
											</span>
											{shopOrder.assignedDeliveryBoy.mobile}
										</p>
									</div>
								) : (
									<p className="text-sm font-medium text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3">
										Delivery Boy is not assigned yet.
									</p>
								)}
							</>
						) : (
							<p className="text-emerald-400 font-semibold text-base bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3">
								Delivered
							</p>
						)}

						{shopOrder.assignedDeliveryBoy &&
							shopOrder.status !== "Delivered" && (
								<div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-md">
									<DeliveryBoyTracking
										data={{
											deliveryBoyLocation: liveLocations[
												String(shopOrder.assignedDeliveryBoy._id)
											] || {
												lat: shopOrder.assignedDeliveryBoy
													.location.coordinates[1],
												lon: shopOrder.assignedDeliveryBoy
													.location.coordinates[0],
											},
											customerLocation: {
												lat: currentOrder.deliveryAddress
													.latitude,
												lon: currentOrder.deliveryAddress
													.longitude,
											},
										}}
									/>
								</div>
							)}
					</div>
				))}
			</div>
		</div>
	);
};

export default TrackOrderPage;
