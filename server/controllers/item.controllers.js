import Item from "../models/items.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
	try {
		const { name, category, foodType, price } = req.body;
		let image = "";
		if (req.file) {
			image = await uploadOnCloudinary(req.file.path);
		}
		const shop = await Shop.findOne({ owner: req.userId });
		if (!shop) {
			return res.status(400).json({
				success: false,
				message: "Shop not found",
			});
		}
		const item = await Item.create({
			name,
			category,
			foodType,
			price,
			image,
			shop: shop._id,
		});
		await item.populate("shop");
		return res.status(201).json({
			success: true,
			message: "Item addedd successfully",
			data: item,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const editItem = async (req, res) => {
	try {
		const itemId = req.params.itemId;
		const { name, category, foodType, price } = req.body;
		let image = "";
		if (req.file) {
			image = await uploadOnCloudinary(req.file.path);
		}
		const item = Item.findByIdAndUpdate(
			itemId,
			{
				name,
				category,
				foodType,
				price,
				image,
			},
			{ new: true },
		);
		if (!item) {
			res.status(400).json({
				success: false,
				message: "Item not found with current item Id",
			});
		}
		return res.status(201).json({
			success: true,
			message: "Item Updated successfully",
			data: item,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
