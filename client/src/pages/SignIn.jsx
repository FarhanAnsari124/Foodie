import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { serverURl } from "../App";

const SignIn = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const handleSignIn = async ()=>{
    try {
        const result = await axios.post(`${serverURl}/api/auth/signin`,{
            email,
            password,
        },{withCredentials:true})
        console.log(result)
    } catch (error) {
        console.log(error,error.message)
    }
  }
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8`}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          Foodie
        </h1>
        <p className="text-gray-600 mb-8">
          Good food is just a tap away.
        </p>
        {/* email */}
        <div className="mb-4">
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
            style={{ border: `1px solid ${borderColor}` }} onChange={(e)=> setEmail(e.target.value)} value={email}
          />
        </div>
        {/* password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter your Password"
              style={{ border: `1px solid ${borderColor}` }} onChange={(e)=> setPassword(e.target.value)} value={password}
            />
            <button
              className="absolute right-3 top-3  text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>
        <div className="text-right mb-4 text-[#ff4d2d] font-medium cursor-pointer" onClick={()=> navigate('/forgot-password')}>Forgot password</div>
        <button className={`w-full cursor-pointer font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`} onClick={()=> handleSignIn()}>Sign In</button>
        <button className='w-full cursor-pointer mt-4 flex items-center justify-center border gap-2 border-gray-400 rounded-lg px-4 py-2 transition duration-200 hover:bg-gray-100'>{<FcGoogle size={20}/>}<span>Sign In with Google</span></button>
        <p className="text-center mt-6">Want to create a new account ? <span className="text-[#ff4d2d] cursor-pointer hover:underline" onClick={()=> navigate('/signup')} >Sign Up</span></p>
      </div>
    </div>
  );
};

export default SignIn;
