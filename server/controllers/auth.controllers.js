import User from "../models/user.model.js";
import { sendOtpMail } from "../utils/mail.js";
import genToken from "../utils/token.js";
import bcrypt from "bcryptjs";
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists! Please signIn.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Passwords should be at least 6 characters long.",
      });
    }
    if (mobile.length < 10) {
      return res.status(400).json({
        success: false,
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist! Please SignUp.",
      });
    }
    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!matchedPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = await genToken(existingUser._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      message: "User signed In successfully!",
      data: existingUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
      reason: error.message,
    });
  }
};
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Provide valid email!",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists!",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      reason: error.message,
    });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid/Expired OTP",
      });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password doesn't match with confirm password",
      });
    }
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "Otp is not verified!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password forgot successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName: fullName || email.split("@")[0],
        email,
        mobile: mobile || "99XXXXXXXX",
        role: role || "User",
      });
    }
    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
