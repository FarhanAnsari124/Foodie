import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
	try {
		const { name, city, state, address } = req.body;
		if (!name || !city || !state || !address) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const updateData = {
			name,
			owner: req.userId,
			city,
			state,
			address,
		};
		if (req.file) {
			updateData.image = await uploadOnCloudinary(req.file.path);
		}
		let shop = await Shop.findOne({ owner: req.userId });
		if (!shop) {
			if (!updateData.image) {
				return res.status(400).json({
					success: false,
					message: "Shop image is required",
				});
			}
			shop = await Shop.create(updateData);
		} else {
			shop = await Shop.findByIdAndUpdate(shop._id, updateData, {
				new: true,
				runValidators: true,
			});
		}
		await shop.populate(["owner", "item"]);
		return res.status(201).json({
			success: true,
			message: "Shop created/Updated successully",
			data: shop,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getCurrentShop = async (req, res) => {
	try {
		const shop = await Shop.findOne({ owner: req.userId })
			.populate("owner")
			.populate({
				path: "item",
				options: { sort: { updatedAt: -1 } },
			});
		if (!shop) {
			return res.status(200).json({
				success: true,
				message: "No shop found",
				data: null,
			});
		}
		return res.status(200).json({
			success: true,
			message: "Shop fetched successfully",
			data: shop,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
