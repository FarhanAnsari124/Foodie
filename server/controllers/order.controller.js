import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
export const placeOrder = async (req, res) => {
	try {
		const { cartItems, paymentMethod, deliveryAddress, totalAmount } =
			req.body;
		if (!Array.isArray(cartItems) || cartItems.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Cart is Empty",
			});
		}
		if (
			!deliveryAddress?.text ||
			deliveryAddress.latitude == null ||
			deliveryAddress.longitude == null
		) {
			return res.status(400).json({
				success: false,
				message: "Send Complete Delivery Address",
			});
		}
		const groupItemsByShop = {};
		cartItems.forEach((item) => {
			const shopId = item.shop;
			if (!groupItemsByShop[shopId]) {
				groupItemsByShop[shopId] = [];
			}
			groupItemsByShop[shopId].push(item);
		});
		const shopOrders = await Promise.all(
			Object.keys(groupItemsByShop).map(async (shopId) => {
				const shop = await Shop.findById(shopId).populate("owner");
				if (!shop) {
					throw new Error("Shop Not Found");
				}
				if (!shop.owner) {
					throw new Error("Shop Owner Not Found");
				}
				const items = groupItemsByShop[shopId];
				const subTotal = items.reduce(
					(sum, item) =>
						sum + Number(item.price) * Number(item.quantity),
					0,
				);
				return {
					shop: shop._id,
					owner: shop.owner._id,
					subTotal,
					shopOrderItems: items.map((i) => ({
						item: i.id,
						price: i.price,
						quantity: i.quantity,
						name: i.name,
					})),
				};
			}),
		);

		const newOrder = await Order.create({
			user: req.userId,
			paymentMethod,
			deliveryAddress,
			totalAmount,
			shopOrders,
		});
		return res.status(201).json({
			success: true,
			message: "Order Created Successfully",
			data: newOrder,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getMyOrders = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User Not Found",
			});
		}
		let orders;
		if (user.role == "User") {
			orders = await Order.find({ user: req.userId })
				.sort({ createdAt: -1 })
				.populate("shopOrders.shop", "name")
				.populate("shopOrders.owner", "name email mobile")
				.populate("shopOrders.shopOrderItems.item", "name image price");
		} else if (user.role == "Owner") {
			orders = await Order.find({
				"shopOrders.owner": req.userId,
			})
				.sort({ createdAt: -1 })
				.populate("shopOrders.shop", "name")
				.populate("user")
				.populate("shopOrders.shopOrderItems.item", "name image price");
		} else {
			return res.status(403).json({
				success: false,
				message: "Unauthorized Role",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Orders fetched successfully",
			data: orders,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

