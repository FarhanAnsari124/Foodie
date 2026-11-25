import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/map.slice";
import axios from "axios";
import { serverUrl } from "../App";
import { addMyOrder } from "../redux/user.slice";
import Nav from "../components/Nav";

function ReCenterMap({ location }) {
	const map = useMap();

	useEffect(() => {
		if (location?.lat != null && location?.lon != null) {
			map.setView([Number(location.lat), Number(location.lon)], 16, {
				animate: true,
			});
		}
	}, [location.lat, location.lon, map]);

	return null;
}

const CheckOut = () => {
	const { location, address } = useSelector((state) => state.map);
	const { cartItems, totalAmount, userData } = useSelector(
		(state) => state.user,
	);
	const [addressInput, setAddressInput] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("cod");
	const dispatch = useDispatch();
	const deliveryFee = totalAmount > 500 ? 0 : 40;
	const amountWithDeliveryFee = totalAmount + deliveryFee;

	const onDragEnd = (e) => {
		const { lat, lng } = e.target._latlng;
		dispatch(setLocation({ lat, lon: lng }));
		getAddressByLatLng(lat, lng);
	};

	const navigate = useNavigate();

	const getAddressByLatLng = async (latitude, longitude) => {
		try {
			const { data } = await axios.get(
				`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`,
			);
			dispatch(setAddress(data?.results[0].formatted));
		} catch (error) {
			console.log(error);
		}
	};

	const getCurrentLocation = () => {
		const latitude = userData.location.coordinates[1];
		const longitude = userData.location.coordinates[0];
		dispatch(setLocation({ lat: latitude, lon: longitude }));
		getAddressByLatLng(latitude, longitude);
	};

	const getLatLngByAddress = async () => {
		if (!addressInput.trim()) return;
		try {
			const { data } = await axios.get(
				`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`,
			);
			const { lat, lon } = data?.features[0]?.properties;
			dispatch(setLocation({ lat, lon }));
			dispatch(
				setAddress(
					data?.features[0]?.properties.formatted || addressInput,
				),
			);
		} catch (error) {
			console.log(error);
		}
	};

	const handlePlaceOrder = async () => {
		try {
			const { data } = await axios.post(
				`${serverUrl}/api/order/place-order`,
				{
					cartItems,
					paymentMethod,
					deliveryAddress: {
						text: addressInput,
						latitude: location.lat,
						longitude: location.lon,
					},
					totalAmount: amountWithDeliveryFee,
				},
				{ withCredentials: true },
			);
			if (paymentMethod == "cod") {
				dispatch(addMyOrder(data.data));
				navigate("/order-placed");
			} else {
				const orderId = data.orderId;
				const razorpayOrder = data.razorpayOrder;
				openRazorpayWindow(orderId, razorpayOrder);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const openRazorpayWindow = (orderId, razorpayOrder) => {
		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY_ID,
			amount: razorpayOrder.amount,
			currency: "INR",
			name: "Foodie",
			description: "Food Delivery Website",
			order_id: razorpayOrder.id,
			handler: async function (response) {
				try {
					const { data } = await axios.post(
						`${serverUrl}/api/order/verify-payment`,
						{
							razorpayPaymentId: response.razorpay_payment_id,
							orderId,
						},
						{ withCredentials: true },
					);
					dispatch(addMyOrder(data.data));
					navigate("/order-placed");
				} catch (error) {
					console.log(error);
				}
			},
		};
		const rzp = new window.Razorpay(options);
		rzp.open();
	};

	useEffect(() => {
		setAddressInput(address ?? "");
	}, [address]);

	return (
		<div className="min-h-screen bg-[#050505] text-zinc-100 pt-24 pb-12 px-4 sm:px-6 flex flex-col items-center">
			<Nav />

			<div className="w-full max-w-[900px]">
				{/* Progress Stepper */}
				<div className="flex items-center justify-center gap-3 sm:gap-6 mb-8">
					<div className="flex flex-col items-center gap-1.5">
						<div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500 text-orange-400 font-bold flex items-center justify-center">
							1
						</div>
						<span className="text-xs text-zinc-400">Shopping Cart</span>
					</div>
					<div className="h-[1px] w-12 sm:w-24 bg-orange-500/50 -mt-5" />
					<div className="flex flex-col items-center gap-1.5">
						<div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shadow-[0_0_20px_rgba(255,94,0,0.45)]">
							2
						</div>
						<span className="text-xs font-medium text-orange-400">
							Address
						</span>
					</div>
					<div className="h-[1px] w-12 sm:w-24 bg-orange-500/50 -mt-5" />
					<div className="flex flex-col items-center gap-1.5">
						<div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shadow-[0_0_20px_rgba(255,94,0,0.45)]">
							3
						</div>
						<span className="text-xs font-medium text-orange-400">
							Payment
						</span>
					</div>
				</div>

				<div className="foodie-card rounded-3xl p-6 sm:p-8 space-y-7">
					<div className="flex items-center gap-3">
						<button
							type="button"
							className="p-1.5 rounded-full bg-[#181818] border border-white/10 hover:border-orange-500/50 text-orange-400 cursor-pointer transition"
							onClick={() => navigate("/cart")}
						>
							<IoIosArrowRoundBack size={26} />
						</button>
						<h1 className="text-2xl font-bold text-white">Checkout</h1>
					</div>

					{/* Delivery Location */}
					<section>
						<h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-white">
							<IoLocationSharp className="text-orange-500" size={18} />
							Delivery Location
						</h2>
						<div className="flex gap-2 mb-4">
							<input
								type="text"
								className="flex-1 bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
								placeholder="Enter Your Delivery Address..."
								value={addressInput ?? ""}
								onChange={(e) => setAddressInput(e.target.value)}
							/>
							<button
								className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2.5 rounded-xl flex items-center justify-center cursor-pointer transition"
								onClick={getLatLngByAddress}
								title="Search address"
							>
								<IoSearchOutline size={18} />
							</button>
							<button
								className="bg-[#1c1c1c] border border-orange-500/40 hover:bg-orange-500/15 text-orange-400 px-4 py-2.5 rounded-xl flex items-center justify-center cursor-pointer transition"
								onClick={getCurrentLocation}
								title="Use current location"
							>
								<TbCurrentLocation size={18} />
							</button>
						</div>

						<div className="rounded-2xl border border-white/10 overflow-hidden bg-[#101010]">
							<div className="h-64 w-full flex items-center justify-center">
								{location?.lat != null && location?.lon != null ? (
									<MapContainer
										className="w-full h-full"
										center={[
											Number(location.lat),
											Number(location.lon),
										]}
										zoom={16}
										scrollWheelZoom={true}
									>
										<TileLayer
											attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
											url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										/>

										<ReCenterMap location={location} />

										<Marker
											position={[
												Number(location.lat),
												Number(location.lon),
											]}
											draggable
											eventHandlers={{ dragend: onDragEnd }}
										/>
									</MapContainer>
								) : (
									<div className="flex items-center justify-center h-full text-zinc-400 text-sm">
										Please select your delivery location.
									</div>
								)}
							</div>
						</div>
					</section>

					{/* Payment Method */}
					<section>
						<h2 className="text-base font-semibold mb-3 text-white">
							Payment Method
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div
								className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border p-4 text-left transition ${
									paymentMethod === "cod"
										? "border-orange-500 bg-orange-500/10 shadow-[0_0_24px_rgba(255,94,0,0.16)]"
										: "border-white/10 bg-[#151515] hover:border-white/25"
								}`}
								onClick={() => setPaymentMethod("cod")}
							>
								<span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/30">
									<MdDeliveryDining className="text-orange-400 text-xl" />
								</span>
								<div>
									<p className="font-semibold text-white text-sm">
										Cash On Delivery
									</p>
									<p className="text-xs text-zinc-400">
										Pay when your food arrives
									</p>
								</div>
							</div>

							<div
								className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border p-4 text-left transition ${
									paymentMethod === "online"
										? "border-orange-500 bg-orange-500/10 shadow-[0_0_24px_rgba(255,94,0,0.16)]"
										: "border-white/10 bg-[#151515] hover:border-white/25"
								}`}
								onClick={() => setPaymentMethod("online")}
							>
								<div className="flex -space-x-2">
									<span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/30">
										<FaMobileScreenButton className="text-orange-400 text-base" />
									</span>
									<span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30">
										<FaCreditCard className="text-amber-400 text-base" />
									</span>
								</div>
								<div>
									<p className="font-semibold text-white text-sm">
										UPI / Credit / Debit Card
									</p>
									<p className="text-xs text-zinc-400">
										Pay Securely Online
									</p>
								</div>
							</div>
						</div>
					</section>

					{/* Order Summary */}
					<section>
						<h2 className="text-base font-semibold mb-3 text-white">
							Order Summary
						</h2>
						<div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-2.5">
							{cartItems.map((item, index) => (
								<div
									key={index}
									className="flex justify-between text-sm text-zinc-300"
								>
									<span>
										{item.name} × {item.quantity}
									</span>
									<span className="font-medium text-white">
										₹{item.price * item.quantity}
									</span>
								</div>
							))}
							<hr className="border-white/10 my-2" />
							<div className="flex justify-between text-sm font-medium text-zinc-300">
								<span>Subtotal</span>
								<span>₹{totalAmount}</span>
							</div>
							<div className="flex justify-between text-sm text-zinc-400">
								<span>Delivery Fee</span>
								<span className={deliveryFee === 0 ? "text-emerald-400 font-medium" : ""}>
									{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
								</span>
							</div>
							<div className="flex justify-between text-lg font-bold text-orange-400 pt-2 border-t border-white/10">
								<span>Total</span>
								<span>₹{amountWithDeliveryFee}</span>
							</div>
						</div>
					</section>

					<button
						className="w-full foodie-btn-primary py-3.5 rounded-full font-semibold text-base cursor-pointer"
						onClick={handlePlaceOrder}
					>
						{paymentMethod === "cod"
							? "Place Order"
							: "Pay & Place Order"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CheckOut;
