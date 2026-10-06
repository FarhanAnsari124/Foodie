import nodemailer from 'nodemailer'
import dotenv from'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpMail = async (to,otp)=>{
    await transporter.sendMail({
        from:process.env.SMTP_USER,
        to:to,
        subject:"Reset your password",
        html:`<p>Your OTP for password reset is <br>${otp}</br>. It expires in 5 minutes.</p>`
    })
}