import { useEffect, useState } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { ClipLoader } from "react-spinners";

const DeliveryBoy = () => {
	const [availableAssignments, setAvailableAssignments] = useState([]);
	const { userData, socket } = useSelector((state) => state.user);
	const [currentOrder, setCurrentOrder] = useState();
	const [showOtpBox, setShowOtpBox] = useState(false);
	const [otp, setOtp] = useState("");
	const [todayDeliveries, setTodayDeliveries] = useState([]);
	const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const ratePerDelivery = 50;
	const totalEarning = todayDeliveries.reduce(
		(sum, d) => sum + d.count * ratePerDelivery,
		0,
	);

	const getAssignment = async () => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/order/get-assignments`,
				{ withCredentials: true },
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
				setAvailableAssignments((prev) => [...prev, data]);
			}
		});
		let watchId;
		if (navigator.geolocation) {
			watchId = navigator.geolocation.watchPosition(
				(position) => {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;
					setDeliveryBoyLocation({ lat: latitude, lon: longitude });
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
					timeout: 10000,
				},
			);
		}
		return () => {
			socket?.off("newAssignment");
			if (watchId !== undefined) {
				navigator.geolocation.clearWatch(watchId);
			}
		};
	}, [socket, userData]);

	const acceptOrder = async (assignmentId) => {
		try {
			await axios.get(
				`${serverUrl}/api/order/accept-order/${assignmentId}`,
				{ withCredentials: true },
			);
			await getCurrentOrder();
		} catch (error) {
			console.log(error);
		}
	};

	const sendOtp = async (orderId, shopOrderId) => {
		setLoading(true);
		try {
			await axios.post(
				`${serverUrl}/api/order/send-delivery-otp`,
				{ orderId, shopOrderId },
				{ withCredentials: true },
			);
			setLoading(false);
			setShowOtpBox(true);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const verifyOtp = async (orderId, shopOrderId) => {
		setMessage("");
		try {
			const { data } = await axios.post(
				`${serverUrl}/api/order/verify-delivery-otp`,
				{ orderId, shopOrderId, otp },
				{ withCredentials: true },
			);
			setMessage(data.message);
			location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	const handleTodayDeliveries = async () => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/order/get-today-deliveries`,
				{ withCredentials: true },
			);
			setTodayDeliveries(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const getCurrentOrder = async () => {
		try {
			const { data } = await axios.get(
				`${serverUrl}/api/order/get-current-order`,
				{ withCredentials: true },
			);
			setCurrentOrder(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getAssignment();
		getCurrentOrder();
		handleTodayDeliveries();
	}, [userData]);

	return (
		<div className="w-full min-h-screen flex flex-col gap-6 items-center bg-[#050505] text-zinc-100 pb-14 pt-6 px-4">
			<Nav />
			<div className="w-full max-w-[850px] flex flex-col gap-6 items-center">
				<div className="foodie-card rounded-3xl p-6 flex flex-col justify-start items-center w-full border border-orange-500/25 text-center gap-2">
					<h1 className="text-xl sm:text-2xl font-bold text-white">
						Welcome,{" "}
						<span className="text-orange-500">{userData.fullName}</span>
					</h1>
					<p className="text-xs sm:text-sm text-zinc-400">
						<span className="font-semibold text-orange-400">
							Latitude:{" "}
						</span>
						{deliveryBoyLocation?.lat.toFixed(6) ||
							userData.location.coordinates[1].toFixed(6)}
						,{" "}
						<span className="font-semibold text-orange-400">
							Longitude:{" "}
						</span>
						{deliveryBoyLocation?.lon.toFixed(6) ||
							userData.location.coordinates[0].toFixed(6)}
					</p>
				</div>

				<div className="foodie-card rounded-3xl p-6 w-full border border-white/10">
					<h2 className="text-lg font-bold mb-4 text-white">
						Today&apos;s <span className="text-orange-500">Deliveries</span>
					</h2>
					<ResponsiveContainer width="100%" height={210}>
						<BarChart data={todayDeliveries}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="rgba(255,255,255,0.08)"
							/>
							<XAxis
								dataKey="hour"
								stroke="#a1a1aa"
								tick={{ fill: "#a1a1aa", fontSize: 12 }}
								tickFormatter={(h) => `${h}:00`}
							/>
							<YAxis
								allowDecimals={false}
								stroke="#a1a1aa"
								tick={{ fill: "#a1a1aa", fontSize: 12 }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "#141414",
									border: "1px solid rgba(255,94,0,0.35)",
									borderRadius: "12px",
									color: "#f4f4f5",
								}}
								formatter={(value) => [value, "orders"]}
								labelFormatter={(label) => `${label}:00`}
							/>
							<Bar
								dataKey="count"
								fill="#ff5e00"
								radius={[6, 6, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
					<div className="max-w-sm mx-auto mt-6 p-5 bg-[#161616] border border-orange-500/25 rounded-2xl text-center">
						<h3 className="text-sm font-medium text-zinc-400 mb-1 uppercase tracking-wider">
							Today&apos;s Earning
						</h3>
						<span className="text-3xl font-bold text-orange-400">
							₹{totalEarning}
						</span>
					</div>
				</div>

				{!currentOrder && (
					<div className="foodie-card rounded-3xl p-6 w-full border border-white/10">
						<h2 className="text-lg font-bold mb-4 text-white">
							Available <span className="text-orange-500">Orders</span>
						</h2>

						<div className="space-y-3">
							{availableAssignments.length > 0 ? (
								availableAssignments.map((a, index) => (
									<div
										className="border border-white/10 bg-[#151515] rounded-2xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
										key={index}
									>
										<div className="space-y-1">
											<p className="text-sm font-semibold text-white">
												{a?.shopName}
											</p>
											<p className="text-xs text-zinc-400">
												<span className="font-semibold text-zinc-300">
													Delivery Address:{" "}
												</span>
												{a.deliveryAddress.text}
											</p>
											<p className="text-xs text-orange-400 font-medium">
												{a.items.length} items | ₹{a.subTotal}
											</p>
										</div>
										<button
											className="foodie-btn-primary px-5 py-2 rounded-full text-xs sm:text-sm font-semibold cursor-pointer shrink-0"
											onClick={() =>
												acceptOrder(a.assignmentId)
											}
										>
											Accept
										</button>
									</div>
								))
							) : (
								<p className="text-zinc-500 text-sm">
									No Available Orders
								</p>
							)}
						</div>
					</div>
				)}

				{currentOrder && (
					<div className="foodie-card rounded-3xl p-6 w-full border border-orange-500/30">
						<h2 className="text-lg font-bold mb-3 text-white">
							Current <span className="text-orange-500">Order</span>
						</h2>
						<div className="border border-white/10 bg-[#151515] rounded-2xl p-4 mb-4 space-y-1">
							<p className="font-semibold text-sm text-white">
								{currentOrder?.shopName}
							</p>
							<p className="text-xs text-zinc-400">
								{currentOrder.deliveryAddress.text}
							</p>
							<p className="text-xs text-orange-400 font-medium">
								{currentOrder.shopOrder.shopOrderItems.length}{" "}
								items | ₹{currentOrder.shopOrder.subTotal}
							</p>
						</div>

						<DeliveryBoyTracking
							data={{
								deliveryBoyLocation: deliveryBoyLocation || {
									lat: userData.location.coordinates[1],
									lon: userData.location.coordinates[0],
								},
								customerLocation: {
									lat: currentOrder.deliveryAddress.latitude,
									lon: currentOrder.deliveryAddress.longitude,
								},
							}}
						/>

						{!showOtpBox ? (
							<button
								className="mt-5 w-full foodie-btn-primary font-semibold py-3 px-4 rounded-full cursor-pointer text-sm flex items-center justify-center"
								onClick={() =>
									sendOtp(
										currentOrder._id,
										currentOrder.shopOrder?._id,
									)
								}
								disabled={loading}
							>
								{loading ? (
									<ClipLoader size={20} color="white" />
								) : (
									"Mark As Delivered"
								)}
							</button>
						) : (
							<div className="mt-5 p-5 border border-orange-500/30 rounded-2xl bg-[#141414]">
								<p className="text-sm font-semibold mb-3 text-zinc-200">
									Enter OTP sent to{" "}
									<span className="text-orange-400">
										{currentOrder.user.fullName}
									</span>
								</p>

								<input
									type="text"
									className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-2.5 rounded-xl mb-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
									onChange={(e) => setOtp(e.target.value)}
									value={otp}
									placeholder="Enter OTP"
								/>
								<button
									className="w-full foodie-btn-primary py-2.5 rounded-full font-semibold text-sm cursor-pointer"
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
								{message && (
									<p className="text-center text-emerald-400 text-sm mt-2">
										{message}
									</p>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default DeliveryBoy;
