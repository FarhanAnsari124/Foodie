import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { serverURl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";

const TrackOrderPage = () => {
	const { orderId } = useParams();
	const [currentOrder, setCurrentOrder] = useState();
	const navigate = useNavigate();
	const handleGetOrder = async () => {
		try {
			const { data } = await axios.get(
				`${serverURl}/api/order/get-order-by-id/${orderId}`,
				{ withCredentials: true },
			);
			setCurrentOrder(data.data);
			console.log(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		handleGetOrder();
	}, [orderId]);
	return (
		<div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
			<div
				className="relative top-5 left-5 flex items-center gap-4 z-10 mb-2.5"
				onClick={() => navigate("/my-orders")}
			>
				<IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
				<h1 className="txt-2xl font-bold md:text-center">
					Track Order
				</h1>
			</div>
			{currentOrder?.shopOrders?.map((shopOrder, index) => (
				<div
					className="bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4"
					key={index}
				>
					<div>
						<p className="text-lg font-bold mb-2 text-[#ff4d2d]">
							{shopOrder.shop.name}
						</p>
						<p className="font-semibold">
							<span>Items: </span>
							{shopOrder.shopOrderItems
								?.map((i) => i.name)
								.join(",")}
						</p>
						<p>
							<span className="font-semibold">Subtotal:</span>₹
							{shopOrder.subTotal}
						</p>
						<p className="mt-6">
							<span className="font-semibold">
								Delivery Address:
							</span>
							{currentOrder.deliveryAddress.text}
						</p>
					</div>
					{shopOrder.status != "Delivered" ? (
						<>
							{shopOrder.assignedDeliveryBoy ? (
								<div className="text-sm text-gray-700">
									<p className="font-semibold">
										<span>Delivery Boy Name: </span>
										{shopOrder.assignedDeliveryBoy.fullName}
									</p>
									<p className="font-semibold">
										<span>Delivery Boy Contact No: </span>
										{shopOrder.assignedDeliveryBoy.mobile}
									</p>
								</div>
							) : (
								<p className="font-semibold">
									Delivery Boy is not assigned yet.
								</p>
							)}
						</>
					) : (
						<p className="text-green-600 font-semibold text-lg">
							Delivered
						</p>
					)}
					{shopOrder.assignedDeliveryBoy && (
						<div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
							<DeliveryBoyTracking
								data={{
									deliveryBoyLocation: {
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
	);
};

export default TrackOrderPage;
