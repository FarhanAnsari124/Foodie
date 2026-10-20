import express from "express";
import isAuth from "../middlewares/auth.middleware.js";
import { placeOrder } from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/place-order",isAuth,placeOrder)

export default orderRouter;
