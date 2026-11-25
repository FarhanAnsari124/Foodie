import { FaPen, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/owner.slice";

const OwnerItemCard = ({ data }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleDelete = async () => {
		try {
			const result = await axios.get(
				`${serverUrl}/api/item/delete/${data._id}`,
				{ withCredentials: true },
			);
			dispatch(setMyShopData(result.data.data));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex foodie-card foodie-card-hover rounded-2xl overflow-hidden w-full">
			<div className="w-32 sm:w-40 shrink-0 bg-[#0d0d0d]">
				<img
					src={data.image}
					alt={data.name}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="flex flex-col justify-between p-4 flex-1">
				<div>
					<h2 className="text-base font-semibold text-white">
						{data.name}
					</h2>
					<p className="text-xs text-zinc-400 mt-1">
						<span className="font-medium text-zinc-300">Category:</span>{" "}
						{data.category}
					</p>
					<p className="text-xs text-zinc-400 mt-0.5 capitalize">
						<span className="font-medium text-zinc-300">Food Type:</span>{" "}
						{data.foodType}
					</p>
				</div>
				<div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
					<div className="text-orange-400 font-bold text-base">
						₹{data.price}
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="p-2 rounded-full bg-orange-500/10 border border-orange-500/25 hover:bg-orange-500 text-orange-400 hover:text-white transition cursor-pointer"
							onClick={() => navigate(`/edit-item/${data._id}`)}
							title="Edit item"
						>
							<FaPen size={14} />
						</button>
						<button
							type="button"
							className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-orange-600 hover:border-orange-600 text-zinc-300 hover:text-white transition cursor-pointer"
							onClick={handleDelete}
							title="Delete item"
						>
							<FaTrashAlt size={14} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OwnerItemCard;
