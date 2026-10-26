import axios from "axios";
import React from "react";
import { MdPhone } from "react-icons/md";
import { serverURl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/user.slice";

const OwnerOrderCard = ({ data }) => {
	const dispatch = useDispatch()
	const handleUpdateStatus = async (orderId,shopId,status)=>{
		try {
			const {data} = await axios.post(`${serverURl}/api/order/update-status/${orderId}/${shopId}`,{status},{withCredentials:true})
			dispatch(updateOrderStatus({orderId,shopId,status}))
			console.log(data.data)
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<div className="bg-white rounded-lg shadow p-4 space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-gray-800">
					{data.user.fullName}
				</h2>
				<p className="text-sm text-gray-500">{data.user.email}</p>
				<p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
					<MdPhone />
					<span>{data.user.mobile}</span>
				</p>
			</div>
			<div className="flex items-start flex-col gap-2 text-gray-600 text-sm">
				<p>{data?.deliveryAddress?.text}</p>
				<p className="text-xs text-gray-500">
					lat: {data?.deliveryAddress?.latitude} , lon:{" "}
					{data?.deliveryAddress?.longitude}
				</p>
			</div>
			<div className="flex space-x-4 overflow-x-auto pb-2">
				{data.shopOrders.shopOrderItems.map((item, index) => (
					<div
						key={index}
						className="shrink-0 w-42 border rounded-lg p-2 bg-white"
					>
						<img
							src={item.item.image}
							alt="img"
							className="w-full h-28 object-cover rounded"
						/>
						<p className="text-sm font-semibold mt-1">
							{item.name}
						</p>
						<p className="text-xs text-gray-500">
							Qty: {item.quantity} x ₹{item.price}
						</p>
					</div>
				))}
			</div>
			<div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
				<span className="text-sm">
					Status:
					<span className="font-semibold capitalize text-[#ff4d2d]">
						{data.shopOrders.status}
					</span>
				</span>
				<select
					
					className="rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]"
					onChange={(e)=>handleUpdateStatus(data._id,data.shopOrders.shop._id,e.target.value)}
				>
					<option value="">Change</option>
					<option value="Pending">Pending</option>
					<option value="Preparing">Preparing</option>
					<option value="Out for delivery">Out for delivery</option>
				</select>
			</div>
			<div className="text-right font-bold text-gray-800 text-sm">
				Total: ₹{data.shopOrders.subTotal}
			</div>
		</div>
	);
};

export default OwnerOrderCard;
