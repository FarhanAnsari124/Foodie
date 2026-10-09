import express from "express";
import { createEditShop } from "../controllers/shop.controllers.js";
import isAuth from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth, upload.single("image"),createEditShop);

export default shopRouter;
