import { useSelector } from "react-redux";
import DeliveryBoy from "../components/DeliveryBoy";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";

const Home = () => {
	const { userData } = useSelector((state) => state.user);

	return (
		<div className="w-full min-h-screen pt-20 flex flex-col items-center bg-[#050505] text-zinc-100 overflow-x-hidden">
			{userData?.role === "User" && <UserDashboard />}
			{userData?.role === "Owner" && <OwnerDashboard />}
			{userData?.role === "Delivery Boy" && <DeliveryBoy />}
		</div>
	);
};
export default Home;
