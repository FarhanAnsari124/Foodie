import React, { useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { setMyOrders, updateRealtimeOrderStatus } from "../redux/user.slice";

const MyOrders = () => {
	const { userData, myOrders, socket } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!socket || !userData) return;
		const handleNewOrder = (data) => {
			if (userData.role === "Owner") {
				if (data.shopOrders?.owner?._id === userData._id) {
					dispatch(setMyOrders(data));
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
	}, [socket, userData?._id, userData?.role, myOrders, dispatch]);

	return (
		<div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-40">
			<div className="w-full max-w-[800px] p-4">
				<div className="flex items-center gap-[20px] mb-6">
					<div className="z-10" onClick={() => navigate("/")}>
						<IoIosArrowRoundBack
							size={35}
							className="text-[#ff4d2d]"
						/>
					</div>
					<h1 className="text-2xl font-bold text-start">My Orders</h1>
				</div>
				<div className="space-y-6">
					{myOrders?.map((order, index) =>
						userData.role == "User" ? (
							<UserOrderCard data={order} key={index} />
						) : userData.role == "Owner" ? (
							<OwnerOrderCard data={order} key={index} />
						) : null,
					)}
				</div>
			</div>
		</div>
	);
};

export default MyOrders;
