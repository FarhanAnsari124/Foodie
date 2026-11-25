import { useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { addMyOrder, updateRealtimeOrderStatus } from "../redux/user.slice";
import Nav from "../components/Nav";

const MyOrders = () => {
	const { userData, myOrders, socket } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!socket || !userData) return;
		const handleNewOrder = (data) => {
			if (userData.role === "Owner") {
				if (data.shopOrders?.owner?._id === userData._id) {
					dispatch(addMyOrder(data));
				}
			}
		};
		const handleUpdateStatus = ({ orderId, shopId, status, userId }) => {
			if (userData.role === "User" && userId == userData._id) {
				dispatch(
					updateRealtimeOrderStatus({ orderId, shopId, status }),
				);
			}
		};
		socket?.on("newOrder", handleNewOrder);
		socket?.on("update-status", handleUpdateStatus);
		return () => {
			socket?.off("newOrder", handleNewOrder);
			socket?.off("update-status", handleUpdateStatus);
		};
	}, [socket, userData?._id, userData?.role, dispatch]);

	return (
		<div className="w-full min-h-screen bg-[#050505] text-zinc-100 pt-24 pb-12 px-4 sm:px-6 flex justify-center">
			<Nav />
			<div className="w-full max-w-[850px]">
				<div className="flex items-center gap-3 mb-6">
					<button
						type="button"
						className="p-1.5 rounded-full bg-[#141414] border border-white/10 hover:border-orange-500/50 text-orange-400 cursor-pointer transition"
						onClick={() => navigate("/")}
					>
						<IoIosArrowRoundBack size={28} />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-white">
							Order <span className="text-orange-500">History</span>
						</h1>
						<p className="text-xs text-zinc-400">
							Review and track your active and past orders
						</p>
					</div>
				</div>

				<div className="space-y-5">
					{myOrders && myOrders.length > 0 ? (
						myOrders.map((order, index) =>
							userData.role === "User" ? (
								<UserOrderCard data={order} key={order._id || index} />
							) : userData.role === "Owner" ? (
								<OwnerOrderCard data={order} key={order._id || index} />
							) : null,
						)
					) : (
						<div className="foodie-card rounded-2xl p-10 text-center text-zinc-400">
							No orders found yet.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MyOrders;
