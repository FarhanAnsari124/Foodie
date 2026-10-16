import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import OwnerDashboard from "../components/OwnerDashboard";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverURl } from "../App";
import { setMyShopData } from "../redux/owner.slice.js";
import { ClipLoader } from "react-spinners";

const AddItem = () => {
	const navigate = useNavigate();
	const { myShopData } = useSelector((state) => state.owner);
	const [name, setName] = useState("");
	const [price, setPrice] = useState(0);
	const [frontendImage, setFrontendImage] = useState(null);
	const [backendImage, setBackendImage] = useState(null);
	const [category, setCategory] = useState("");
	const [foodType, setFoodType] = useState("veg");
	const [loading,setLoading] = useState(false)
	const categories = [
		"Snacks",
		"Main Course",
		"Desserts",
		"Pizza",
		"Burgers",
		"Sandwiches",
		"South Indian",
		"North Indian",
		"Chinese",
		"Fast Food",
		"Others",
	];
	const dispatch = useDispatch();
	const handleImage = (e) => {
		const file = e.target.files[0];
		setBackendImage(file);
		setFrontendImage(URL.createObjectURL(file));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)
		try {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("price", price);
			formData.append("category", category);
			formData.append("foodType", foodType);
			if (backendImage) {
				formData.append("image", backendImage);
			}
			const result = await axios.post(
				`${serverURl}/api/item/add-item`,
				formData,
				{
					withCredentials: true,
				},
			);
			dispatch(setMyShopData(result.data.data));
			setLoading(false)
			navigate("/")
		} catch (error) {
			console.log(error);
		} finally{
			setLoading(false)
		}
	};
	// useEffect(() => {
	// 	setName(myShopData?.item[0]?.name || "");
	// 	setFrontendImage(myShopData?.item[0]?.image || null);
	// }, [myShopData]);

	return (
		<div className="flex justify-center flex-col items-center p-6 bg-linear-to-br from-orange-100 relative to-white min-h-screen">
			<div
				className="absolute top-5 left-5 z-10 mb-2.5 cursor-pointer"
				onClick={() => navigate("/")}
			>
				<IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
			</div>
			<div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
				<div className="flex flex-col items-center mb-6">
					<div className="bg-orange-100 p-4 rounded-full mb-4">
						<FaUtensils className="text-[#ff4d2d] w-16 h-16" />
					</div>
					<div className="text-3xl font-extrabold text-gray-900">
						Add Food Item
					</div>
				</div>
				<form className="space-y-5" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Name
						</label>
						<input
							type="text"
							placeholder="Enter food Item name"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Food Image
						</label>
						<input
							type="file"
							accept="image/*"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
							onChange={handleImage}
						/>
						{frontendImage && (
							<div className="mt-4">
								<img
									src={frontendImage}
									alt=""
									className="w-full h-48 object-cover rounded-lg border"
								/>
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Price
						</label>

						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
								₹
							</span>

							<input
								type="number"
								placeholder="Enter Price"
								className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Select Category
						</label>
						<select
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						>
							<option value="">Select Category</option>
							{categories.map((cat, ind) => (
								<option value={cat} key={ind}>
									{cat}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Select Food Type
						</label>
						<select
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
							value={foodType}
							onChange={(e) => setFoodType(e.target.value)}
						>
							<option value="veg">Veg</option>
							<option value="non veg">Non-Veg</option>
						</select>
					</div>

					<button
						className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
						type="submit"
						disabled={loading}
					>
						{loading? <ClipLoader size={20} color="white" className="text-center"/>:"Save"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default AddItem;
