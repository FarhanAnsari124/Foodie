import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
