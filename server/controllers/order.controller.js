import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
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
			deliveryAddress.latitude==null ||
			deliveryAddress.longitude==null
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
                        sum +
                        Number(item.price) * Number(item.quantity),
                    0
                );
				return {
					shop: shop._id,
					owner: shop.owner._id,
					subTotal,
					shopOrderItems: items.map((i) => ({
						item: i._id,
						price: i.price,
						quantity: i.quantity,
						name: i.name,
					})),
				};
			}),
		);

		const newOrder = await Order.create(
			{
				user: req.userId,
				paymentMethod,
				deliveryAddress,
				totalAmount,
				shopOrders,
			}
		);
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
