import { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/owner.slice.js";
import { ClipLoader } from "react-spinners";

const EditItem = () => {
	const navigate = useNavigate();
	const { itemId } = useParams();
	const [currentItem, setCurrentItem] = useState(null);
	const [name, setName] = useState("");
	const [price, setPrice] = useState(0);
	const [frontendImage, setFrontendImage] = useState(null);
	const [backendImage, setBackendImage] = useState(null);
	const [category, setCategory] = useState("");
	const [foodType, setFoodType] = useState("veg");
	const [loading, setLoading] = useState(false);

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
		if (file) {
			setBackendImage(file);
			setFrontendImage(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
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
				`${serverUrl}/api/item/edit-item/${itemId}`,
				formData,
				{
					withCredentials: true,
				},
			);
			dispatch(setMyShopData(result.data.data));
			setLoading(false);
			navigate("/");
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const handleGetItemById = async () => {
			try {
				const result = await axios.get(
					`${serverUrl}/api/item/get-by-id/${itemId}`,
					{ withCredentials: true },
				);
				setCurrentItem(result.data.data);
			} catch (error) {
				console.log(error);
			}
		};
		handleGetItemById();
	}, [itemId]);

	useEffect(() => {
		setName(currentItem?.name || "");
		setPrice(currentItem?.price || 0);
		setFrontendImage(currentItem?.image || "");
		setCategory(currentItem?.category || "");
		setFoodType(currentItem?.foodType || "veg");
	}, [currentItem]);

	return (
		<div className="flex justify-center flex-col items-center p-6 bg-[#050505] text-zinc-100 relative min-h-screen overflow-hidden">
			<div className="absolute -top-24 right-1/3 w-96 h-96 rounded-full bg-orange-500/15 blur-[130px] pointer-events-none" />

			<button
				type="button"
				className="absolute top-6 left-6 z-10 p-1.5 rounded-full bg-[#141414] border border-white/10 hover:border-orange-500/50 text-orange-400 cursor-pointer transition"
				onClick={() => navigate("/")}
			>
				<IoIosArrowRoundBack size={28} />
			</button>

			<div className="max-w-lg w-full foodie-card rounded-3xl p-8 border border-white/10 relative z-10">
				<div className="flex flex-col items-center mb-6">
					<div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/35 flex items-center justify-center mb-4">
						<FaUtensils className="text-orange-500 text-2xl" />
					</div>
					<h1 className="text-2xl sm:text-3xl font-extrabold text-white">
						Edit Food Item
					</h1>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm font-medium text-zinc-300 mb-1.5">
							Name
						</label>
						<input
							type="text"
							placeholder="Enter food item name"
							className="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-zinc-300 mb-1.5">
							Food Image
						</label>
						<input
							type="file"
							accept="image/*"
							className="w-full px-4 py-2 bg-[#181818] border border-white/10 rounded-xl text-sm text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30 focus:outline-none focus:border-orange-500"
							onChange={handleImage}
						/>
						{frontendImage && (
							<div className="mt-4">
								<img
									src={frontendImage}
									alt="Food preview"
									className="w-full h-48 object-cover rounded-xl border border-white/10"
								/>
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-zinc-300 mb-1.5">
							Price
						</label>
						<div className="relative">
							<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 font-semibold">
								₹
							</span>
							<input
								type="number"
								placeholder="Enter Price"
								className="w-full pl-9 pr-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-zinc-300 mb-1.5">
							Select Category
						</label>
						<select
							className="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
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
						<label className="block text-sm font-medium text-zinc-300 mb-1.5">
							Select Food Type
						</label>
						<select
							className="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
							value={foodType}
							onChange={(e) => setFoodType(e.target.value)}
						>
							<option value="veg">Veg</option>
							<option value="non veg">Non-Veg</option>
						</select>
					</div>

					<button
						className="w-full foodie-btn-primary px-6 py-3 rounded-full font-semibold text-sm cursor-pointer mt-2"
						disabled={loading}
						type="submit"
					>
						{loading ? (
							<ClipLoader size={20} color="white" />
						) : (
							"Save"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditItem;
