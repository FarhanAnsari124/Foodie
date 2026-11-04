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
		shop.item.push(item._id);
		await shop.save();
		await shop.populate({
			path: "item",
			options: { sort: { updatedAt: -1 } },
		});

		return res.status(201).json({
			success: true,
			message: "Item addedd successfully",
			data: shop,
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
		const updateData = {
			name,
			category,
			foodType,
			price,
		};
		if (req.file) {
			updateData.image = await uploadOnCloudinary(req.file.path);
		}
		const item = await Item.findByIdAndUpdate(itemId, updateData, {
			returnDocument: "after",
			runValidators: true,
		});
		if (!item) {
			res.status(400).json({
				success: false,
				message: "Item not found with current item Id",
			});
		}
		const shop = await Shop.findOne({ owner: req.userId }).populate({
			path: "item",
			options: { sort: { updatedAt: -1 } },
		});
		return res.status(200).json({
			success: true,
			message: "Item Updated successfully",
			data: shop,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const getItemById = async (req, res) => {
	try {
		const itemId = req.params.itemId;
		const item = await Item.findById(itemId);
		if (!item) {
			res.status(400).json({
				success: false,
				message: "Item not found with current item Id",
			});
		}
		return res.status(200).json({
			success: true,
			message: "Item Fetched successfully",
			data: item,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const deleteItem = async (req, res) => {
	try {
		const itemId = req.params.itemId;
		const item = await Item.findByIdAndDelete(itemId);
		if (!item) {
			res.status(400).json({
				success: false,
				message: "Item not found with current item Id",
			});
		}
		const shop = await Shop.findOne({ owner: req.userId });
		shop.item = shop.item.filter((i) => i._id !== item._id);
		await shop.save();
		await shop.populate({
			path: "item",
			options: { sort: { updatedAt: -1 } },
		});
		return res.status(200).json({
			success: true,
			message: "Item Deleted successfully",
			data: shop,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const getItemByCity = async (req, res) => {
	try {
		const { city } = req.params;
		if (!city) {
			res.status(400).json({
				success: false,
				message: "City is required",
			});
		}
		const shops = await Shop.find({
			city: { $regex: new RegExp(`^${city}$`, "i") },
		}).populate("item");
		if (!shops) {
			return res.status(400).json({
				success: true,
				message: "No shop found",
				data: null,
			});
		}
		const shopIds = shops.map((shop) => shop._id);
		const items = await Item.find({ shop: { $in: shopIds } });
		return res.status(200).json({
			success: true,
			message: "Items fetched successfully",
			data: items,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const getItemByShop = async (req, res) => {
	try {
		const { shopId } = req.params;

		if (!shopId) {
			return res.status(400).json({
				success: false,
				message: "Shop ID is required",
			});
		}

		const shop = await Shop.findById(shopId).populate("item");

		if (!shop) {
			return res.status(404).json({
				success: false,
				message: "No Shop Found with this Id",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Shop Items fetched successfully",
			shop: shop,
			items: shop.item,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const searchItems = async (req, res) => {
	try {
		const { query, city } = req.query;
		if (!query || !city) {
			return null;
		}
		const shops = await Shop.find({
			city: { $regex: new RegExp(`^${city}$`, "i") },
		}).populate("item");
		if (!shops) {
			return res.status(400).json({
				success: true,
				message: "No shop found",
				data: null,
			});
		}
		const shopIds = shops.map((s) => s._id);
		const items = await Item.find({
			shop: { $in: shopIds },
			$or: [
				{ name: { $regex: query, $options: "i" } },
				{ category: { $regex: query, $options: "i" } },
			],
		}).populate("shop", "name image");
		return res.status(200).json({
			success: true,
			data: items,
			message: "Searched Item fetched successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
