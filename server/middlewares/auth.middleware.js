import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }
    const user = await User.findById(decodeToken.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
export default isAuth;
