import express from "express";
import http from 'http'
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import { Server } from "socket.io";
import { socketHandler } from "./utils/socket.js";
const app = express();
const server = http.createServer(app)

const io = new Server(server,{
	cors:{
		origin: process.env.CLIENT_URL,
		credentials: true,
		methods:['POST','GET']
	}
})
app.set("io",io)

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	}),
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter)

socketHandler(io)
server.listen(PORT, () => {
	connectDb();
	console.log(`Server is running at port ${PORT}`);
});
