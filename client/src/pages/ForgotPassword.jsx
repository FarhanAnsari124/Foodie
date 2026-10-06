import axios from "axios";
import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverURl } from "../App";

const ForgotPassword = () => {
  const borderColor = "#ddd";
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleSendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverURl}/api/auth/send-otp`,
        {
          email,
        },
        { withCredentials: true },
        setStep((prev) => prev + 1),
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverURl}/api/auth/verify-otp`,
        {
          email,
          otp,
        },
        { withCredentials: true },
        setStep((prev) => prev + 1),
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleResetPassword = async () => {
    try {
      const result = await axios.post(
        `${serverURl}/api/auth/reset-password`,
        {
          email,
          password,
          confirmPassword,
        },
        { withCredentials: true },
      );
      navigate("/signin");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-[#ff4d24] cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d24]">
            Forgot Password
          </h1>
        </div>
        {step == 1 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter your Email"
                style={{ border: `1px solid ${borderColor}` }}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button
              className={`w-full cursor-pointer font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`}
              onClick={() => handleSendOtp(email)}
            >
              Send OTP
            </button>
          </div>
        )}
        {step == 2 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter OTP"
                style={{ border: `1px solid ${borderColor}` }}
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>
            <button
              className={`w-full cursor-pointer font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`}
              onClick={() => handleVerifyOtp()}
            >
              Verify
            </button>
          </div>
        )}
        {step == 3 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter new password"
                style={{ border: `1px solid ${borderColor}` }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Confirm new password"
                style={{ border: `1px solid ${borderColor}` }}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <button
              className={`w-full cursor-pointer font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`}
              onClick={() => handleResetPassword()}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
