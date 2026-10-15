import React from "react";
import { useSelector } from "react-redux";
import DeliveryBoy from "../components/DeliveryBoy";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import useGetMyShop from "../hooks/useGetMyShop";

const Home = () => {
	const { userData } = useSelector((state) => state.user);
	const { loading } = useGetMyShop();

	if (userData?.role === "Owner" && loading) {
		return (
			<div className="w-screen min-h-screen flex justify-center items-center text-3xl text-[#ff4d2d]">
				Loading shop...
			</div>
		);
	}

	return (
		<div className="w-screen min-h-screen pt-25 flex flex-col items-center bg-[#fff9f9]">
			{userData?.role === "User" && <UserDashboard />}
			{userData?.role === "Owner" && <OwnerDashboard />}
			{userData?.role === "Delivery Boy" && <DeliveryBoy />}
		</div>
	);
};
export default Home;
