import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ClipLoader } from "react-spinners";

const DeliveryBoy = () => {
	const [availableAssignments, setAvailableAssignments] = useState([]);
	const { userData, socket } = useSelector((state) => state.user);
	const [currentOrder, setCurrentOrder] = useState();
	const [showOtpBox, setShowOtpBox] = useState(false);
	const [otp, setOtp] = useState("");
	const [todayDeliveries, setTodayDeliveries] = useState([]);
	const [deliveryBoyLocation,setDeliveryBoyLocation] = useState(null)
	
	const [loading,setLoading] = useState(false)
	const [message,setMessage] = useState("")

	const ratePerDelivery = 50
	const totalEarning = todayDeliveries.reduce((sum,d)=>sum+d.count*ratePerDelivery,0)
	const getAssignment = async () => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/order/get-assignments`,
				{
					withCredentials: true,
				},
			);
			setAvailableAssignments(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		if (!socket || userData.role !== "Delivery Boy") return;
		socket?.on("newAssignment", (data) => {
			if (data.sentTo == userData._id) {
				setAvailableAssignments([...availableAssignments, data]);
			}
		});
		let watchId;
		if (navigator.geolocation) {
			watchId = navigator.geolocation.watchPosition((position) => {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;
				setDeliveryBoyLocation({lat:latitude,lon:longitude})
				socket.emit("update-location", {
					latitude,
					longitude,
					userId: userData._id,
				});
			},
				(error) => {
					console.log(error);
				},
				{
					enableHighAccuracy: true,
					maximumAge: 5000,
                	timeout: 10000
				});
		}
		return () => {
			socket?.off("newAssignment");
			if (watchId!== undefined) {
				navigator.geolocation.clearWatch(watchId);
			}
		};
	}, [socket, userData]);
	const acceptOrder = async (assignmentId) => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/order/accept-order/${assignmentId}`,
				{
					withCredentials: true,
				},
			);
			
			await getCurrentOrder();
		} catch (error) {
			console.log(error);
		}
	};
	const sendOtp = async (orderId, shopOrderId) => {
		setLoading(true)
		try {
			const { data } = await axios.post(
				`${serverUrl}/api/order/send-delivery-otp`,
				{
					orderId,
					shopOrderId,
				},
				{
					withCredentials: true,
				},
			);
			setLoading(false)
			setShowOtpBox(true);
		} catch (error) {
			console.log(error);
			setLoading(false)
		}
	};
	const verifyOtp = async (orderId, shopOrderId) => {
		setMessage("")
		try {
			const { data } = await axios.post(
				`${serverUrl}/api/order/verify-delivery-otp`,
				{
					orderId,
					shopOrderId,
					otp,
				},
				{
					withCredentials: true,
				},
			);
			setMessage(data.message)
			location.reload()
		} catch (error) {
			console.log(error);
		}
	};
	const handleTodayDeliveries = async () => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/order/get-today-deliveries`,
				{
					withCredentials: true,
				},
			);
			console.log(data.data)
			setTodayDeliveries(data.data)
		} catch (error) {
			console.log(error);
		}
	};
	const getCurrentOrder = async () => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/order/get-current-order`,
				{
					withCredentials: true,
				},
			);
			setCurrentOrder(data);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getAssignment();
		getCurrentOrder();
		handleTodayDeliveries()
	}, [userData]);
	return (
		<div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-auto">
			<Nav />
			<div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
				<div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2">
					<h1 className="text-xl font-bold text-[#ff4d2d]">
						Welcome, {userData.fullName}
					</h1>
					<p className="text-[#ff4d2d]">
						<span className="font-semibold">Latitude: </span>
						{deliveryBoyLocation?.lat.toFixed(6) || userData.location.coordinates[1].toFixed(6)},
						<span className="font-semibold"> Longitude: </span>
						{deliveryBoyLocation?.lon.toFixed(6) || userData.location.coordinates[0].toFixed(6)}
					</p>
				</div>
				<div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100">
					<h1 className="text-lg font-bold mb-3 text-[#ff4d2d]">
						Today Deliveries
					</h1>
					<ResponsiveContainer width="100%" height={200}>
						<BarChart data={todayDeliveries}>
							<CartesianGrid strokeDasharray="3 3"/>
							<XAxis dataKey="hour" tickFormatter={(h)=>`${h}:00`}/>
							<YAxis allowDecimals={false}/>
							<Tooltip formatter={(value)=>[value,"orders"]} labelFormatter={(label)=>`${label}:00`}/>
							<Bar dataKey="count" fill="#ff4d2d"/>
						</BarChart>
					</ResponsiveContainer>
					<div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center">
						<h1 className="text-xl font-semibold text-gray-800 mb-2">Today's Earning</h1>
						<span className="text-3xl font-bold text-green-600">₹{totalEarning}</span>
					</div>
				</div>


				{!currentOrder && (
					<div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
						<h1 className="text-lg font-bold mb-4 flex items-center gap-2">
							Available Orders
						</h1>

						<div className="space-y-4">
							{availableAssignments.length > 0 ? (
								availableAssignments.map((a, index) => (
									<div
										className="border rounded-lg p-4 flex justify-between items-center"
										key={index}
									>
										<div>
											<p className="text-sm font-semibold">
												{a?.shopName}
											</p>
											<p className="text-sm text-gray-500">
												<span className="font-semibold">
													Delivery Address:{" "}
												</span>{" "}
												{a.deliveryAddress.text}
											</p>
											<p className="text-xs text-gray-400">
												{a.items.length} items | ₹
												{a.subTotal}
											</p>
										</div>
										<button
											className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600 cursor-pointer"
											onClick={() =>
												acceptOrder(a.assignmentId)
											}
										>
											Accept
										</button>
									</div>
								))
							) : (
								<p className="text-gray-400 text-sm">
									No Available Orders
								</p>
							)}
						</div>
					</div>
				)}
				{currentOrder && (
					<div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
						<h2 className="text-lg font-bold mb-3">
							Current Order
						</h2>
						<div className="border rounded-lg p-4 mb-3">
							<p className="font-semibold text-sm">
								{currentOrder?.shopName}
							</p>
							<p className="text-sm text-gray-500">
								{currentOrder.deliveryAddress.text}
							</p>
							<p className="text-xs text-gray-400">
								{currentOrder.shopOrder.shopOrderItems.length}{" "}
								items | {currentOrder.shopOrder.subTotal}
							</p>
						</div>
						<DeliveryBoyTracking
							data={{
								deliveryBoyLocation: deliveryBoyLocation || {
									lat: userData.location
										.coordinates[1],
									lon: userData.location
										.coordinates[0],
								},
								customerLocation: {
									lat: currentOrder.deliveryAddress.latitude,
									lon: currentOrder.deliveryAddress.longitude,
								},
							}}
						/>
						{!showOtpBox ? (
							<button
								className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
								onClick={() =>
									sendOtp(
										currentOrder._id,
										currentOrder.shopOrder?._id,
									)
								}
								disabled={loading}
							>
								{loading?<ClipLoader size={20} color="white"/>:"Mark As Delivered"}
							</button>
						) : (
							<div className="mt-4 p-4 border rounded-xl bg-gray-50">
								<p className="text-sm font-semibold mb-2">
									Enter OTP sent to{" "}
									<span className="text-orange-500">
										{currentOrder.user.fullName}
									</span>
								</p>

								<input
									type="text"
									className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none foucs:ring-2 focus:ring-orange-400"
									onChange={(e) => setOtp(e.target.value)}
									value={otp}
									placeholder="Enter OTP"
								/>
								<button
									className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all"
									onClick={() =>
										verifyOtp(
											currentOrder._id,
											currentOrder.shopOrder?._id,
											otp,
										)
									}
								>
									Submit OTP
								</button>
								{message && <p className="text-center text-green-400">{message}</p>}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default DeliveryBoy;
