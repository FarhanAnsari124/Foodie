import User from "../models/user.model.js";
import genToken from "../utils/token.js";
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    const existingUser = await User.find({ email });
    if (existingUser) {
      return res.status(400).json({
        succeess: false,
        message: "User already exists! Please signIn.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        succeess: false,
        message: "Passwords should be at least 6 characters long.",
      });
    }
    if (mobile.length < 10) {
      return res.status(400).json({
        succeess: false,
        message: "Invalid Phone Number! Enter atleast 10 digits Number",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });
    const token = await genToken(newUser._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully!!",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.find({ email });
    if (!existingUser) {
      return res.status(400).json({
        succeess: false,
        message: "User doesn't exist! Please SignUp.",
      });
    }
    const matchedPassword = bcrypt.compare(password, existingUser.password);
    if (!matchedPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = genToken(existingUser._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      message: "User signed In successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      messsage: "User SignOut successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
