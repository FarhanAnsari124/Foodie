import mongoose from "mongoose";

const shopOrderItemSchema = new mongoose.Schema(
	{
		item: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item",
		},
        name:String,
		price: Number,
		quantity: Number,
	}
);
const shopOrderSchema = new mongoose.Schema(
	{
		shop: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Shop",
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		subTotal: {
			type: Number,
		},
		shopOrderItems: [shopOrderItemSchema],
		status:{
			type:String,
			enum:["Pending","Preparing","Out for delivery","Delivered"],
			default:"Pending"
		},
		assignment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "DeliveryAssignment",
			default:null
		},
		assignedDeliveryBoy:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		deliveryOtp:{
      		type:String,
			default:null
		},
		otpExpires:{
			type:Date,
			default:null
		},
		deliveredAt:{
			type:Date,
			default:null
		}
	},

);
const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		paymentMethod: {
			type: String,
			enum: ["cod", "online"],
		},
		deliveryAddress: {
			text: String,
			latitude: Number,
			longitude: Number,
		},
		totalAmount: {
			type: Number,
		},
		shopOrders: [shopOrderSchema],
	},
	{
		timestamps: true,
	},
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
