import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controllers.js";

const authRouter =  Router()

authRouter.post('/signin',signIn)
authRouter.post('/signup',signUp)
authRouter.get('/signout',signOut)

export default authRouter