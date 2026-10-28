import DeliveryAssignment from "../models/deliveryAssignment.model.js";
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
		await newOrder.populate(
			"shopOrders.shopOrderItems.item",
			"name image price",
		);
		await newOrder.populate("shopOrders.shop", "name");
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
		let filteredOrders;
		if (user.role == "User") {
			orders = await Order.find({ user: req.userId })
				.sort({ createdAt: -1 })
				.populate("shopOrders.shop", "name")
				.populate("shopOrders.owner", "fullName email mobile")
				.populate("shopOrders.shopOrderItems.item", "name image price");
		} else if (user.role == "Owner") {
			orders = await Order.find({
				"shopOrders.owner": req.userId,
			})
				.sort({ createdAt: -1 })
				.populate("shopOrders.shop", "name")
				.populate("user")
				.populate("shopOrders.shopOrderItems.item", "name image price");
			filteredOrders = orders.map((order) => ({
				_id: order._id,
				paymentMethod: order.paymentMethod,
				deliveryAddress: order.deliveryAddress,
				user: order.user,
				shopOrders: order.shopOrders.find(
					(o) => String(o.owner?._id) == String(req.userId),
				),
				createdAt: order.createdAt,
			}));
			return res.status(200).json({
				success: true,
				message: "Orders fetched successfully",
				data: filteredOrders,
			});
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

export const updateOrderStatus = async (req, res) => {
	try {
		const { orderId, shopId } = req.params;
		const { status } = req.body;
		const order = await Order.findById(orderId);
		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found",
			});
		}
		const shopOrder = order.shopOrders.find((o) => o.shop == shopId);
		if (!shopOrder) {
			return res.status(400).json({
				success: false,
				message: "Shop Order Not Found",
			});
		}
		shopOrder.status = status;
		let deliveryBoysPayload = [];
		if (status === "Out for delivery" && !shopOrder.assignment) {
			const { longitude, latitude } = order.deliveryAddress;
			const nearByDeliveryBoys = await User.find({
				role: "Delivery Boy",
				location: {
					$near: {
						$geometry: {
							type: "Point",
							coordinates: [Number(longitude), Number(latitude)],
						},
						$maxDistance: 5000,
					},
				},
			});
			const nearByIds = nearByDeliveryBoys.map((b) => b._id);
			const busyIds = await DeliveryAssignment.find({
				assignedTo: { $in: nearByIds },
				status: { $nin: ["Broadcasted", "Completed"] },
			}).distinct("assignedTo");
			const busyIdSet = new Set(busyIds.map((id) => String(id)));
			const availableDeliveryBoys = nearByDeliveryBoys.filter(
				(b) => !busyIdSet.has(String(b._id)),
			);
			const candidates = availableDeliveryBoys.map((b) => b._id);
			if (candidates.length == 0) {
				await order.save();
				return res.status(400).json({
					success: false,
					message: "Order status updated but 0 Delivery Boys Found",
				});
			}
			const deliveryAssignment = await DeliveryAssignment.create({
				order: order._id,
				shop: shopOrder.shop,
				shopOrderId: shopOrder._id,
				broadcastedTo: candidates,
				status: "Broadcasted",
			});
			shopOrder.assignment = deliveryAssignment._id;
			deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
				id: b._id,
				fullName: b.fullName,
				longitude: b.location.coordinates?.[0],
				latitude: b.location.coordinates?.[1],
				mobile: b.mobile,
			}));
		}
		await order.save();
		const updatedShopOrder = order.shopOrders.find((o) => o.shop == shopId);
		await order.populate("shopOrders.shop", "name");
		await order.populate(
			"shopOrders.assignedDeliveryBoy",
			"fullName email mobile",
		);

		return res.status(200).json({
			shopOrder: updatedShopOrder,
			assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
			availableDeliveryBoys: deliveryBoysPayload,
			assignment: updatedShopOrder?.assignment?._id ?? null,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getDeliveryBoyAssignment = async (req, res) => {
	try {
		const deliveryBoyId = req.userId;
		const assignments = await DeliveryAssignment.find({
			broadcastedTo: deliveryBoyId,
			status: "Broadcasted",
		}).populate({
				path: "order",
				populate: {
					path: "shopOrders.shopOrderItems.item",
					select: "name image price",
				},
			})
			.populate("shop", "name");
		const formattedData = assignments
			.filter((a) => a.order && a.shop)
			.map((a) => {
				const shopOrder = a.order.shopOrders.find(
					(so) => String(so._id) === String(a.shopOrderId),
				);

				if (!shopOrder) return null;

				return {
					assignmentId: a._id,
					orderId: a.order._id,
					shopName: a.shop.name,
					deliveryAddress: a.order.deliveryAddress,
					items: shopOrder.shopOrderItems,
					subTotal: shopOrder.subTotal,
				};
			})
			.filter(Boolean);

		return res.status(200).json({
			success: true,
			message: "Delivery Assignments fetched successfully",
			data: formattedData,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const acceptOrder = async (req, res) => {
	try {
		const { assignmentId } = req.params;
		const assignment = await DeliveryAssignment.findById(assignmentId);
		if (!assignment) {
			return res.status(400).json({
				success: false,
				message: "Assignment not found",
			});
		}
		if (assignment.status !== "Broadcasted") {
			return res.status(400).json({
				success: false,
				message: "Assignment is expired",
			});
		}
		const wasBroadcastedTo = assignment.broadcastedTo.some(
			(id) => String(id) === String(req.userId),
		);

		if (!wasBroadcastedTo) {
			return res.status(403).json({
				success: false,
				message: "This order was not offered to you",
			});
		}
		const alreadyAssigned = await DeliveryAssignment.findOne({
			assignedTo: req.userId,
			status: { $nin: ["Broadcasted", "Completed"] },
		});
		if (alreadyAssigned) {
			return res.status(400).json({
				success: false,
				message: "You are already assigned to another order",
			});
		}

		const order = await Order.findById(assignment.order);
		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found",
			});
		}
		const shopOrder = order.shopOrders.find(
			(so) => String(so._id) == String(assignment.shopOrderId),
		);
		if (!shopOrder) {
			return res.status(404).json({
				success: false,
				message: "Shop order not found in this order",
				shopOrderId: String(assignment.shopOrderId),
			});
		}
		assignment.assignedTo = req.userId;
		assignment.status = "Assigned";
		assignment.acceptedAt = new Date();

		shopOrder.assignedDeliveryBoy = req.userId;

		await Promise.all([assignment.save(), order.save()]);

		await order.populate(
			"shopOrders.assignedDeliveryBoy",
			"fullName email mobile",
		);
		return res.status(200).json({
			success: true,
			message: "Order accepted successfully",
			data: shopOrder,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
