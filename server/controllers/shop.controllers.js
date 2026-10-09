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
		let image = "";
		if (req.file) {
			image = await uploadOnCloudinary(req.file.path);
		}
		let shop = await Shop.findOne({ owner: req.userId });
		if (!shop) {
			shop = await Shop.create({
				name,
				image,
				owner: req.userId,
				city,
				state,
				address,
			});
		}else{
            shop = await Shop.findByIdAndUpdate(shop._id,{
				name,
				image,
				owner: req.userId,
				city,
				state,
				address,
			},{new:true});
        }
		await shop.populate("owner");
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
	const shop = await Shop.findOne({owner:req.userId}).populate("owner items")
	if (!shop) {
	  return null;
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


