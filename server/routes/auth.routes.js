import { Router } from "express";
import { googleAuth, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controllers.js";

const authRouter =  Router()

authRouter.post('/signin',signIn)
authRouter.post('/signup',signUp)
authRouter.get('/signout',signOut)
authRouter.post('/send-otp',sendOtp)
authRouter.post('/verify-otp',verifyOtp)
authRouter.post('/reset-password',resetPassword)
authRouter.post('/google-auth',googleAuth)
export default authRouter