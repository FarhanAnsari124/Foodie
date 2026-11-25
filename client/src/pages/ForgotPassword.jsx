import axios from "axios";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
	const [step, setStep] = useState(1);
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [err, setErr] = useState("");
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const handleSendOtp = async () => {
		setLoading(true);
		try {
			await axios.post(
				`${serverUrl}/api/auth/send-otp`,
				{ email },
				{ withCredentials: true },
			);
			setLoading(false);
			setStep((prev) => prev + 1);
			setErr("");
		} catch (error) {
			setLoading(false);
			setErr(error.response?.data?.message || "Failed to send OTP");
		}
	};

	const handleVerifyOtp = async () => {
		setLoading(true);
		try {
			await axios.post(
				`${serverUrl}/api/auth/verify-otp`,
				{ email, otp },
				{ withCredentials: true },
			);
			setLoading(false);
			setStep((prev) => prev + 1);
			setErr("");
		} catch (error) {
			setLoading(false);
			setErr(error.response?.data?.message || "Invalid OTP");
		}
	};

	const handleResetPassword = async () => {
		setLoading(true);
		try {
			await axios.post(
				`${serverUrl}/api/auth/reset-password`,
				{ email, password, confirmPassword },
				{ withCredentials: true },
			);
			setLoading(false);
			setErr("");
			navigate("/signin");
		} catch (error) {
			setLoading(false);
			setErr(error.response?.data?.message || "Failed to reset password");
		}
	};

	return (
		<div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#050505] text-zinc-100 relative overflow-hidden">
			<div className="absolute -top-20 right-1/4 w-80 h-80 rounded-full bg-orange-500/15 blur-[120px] pointer-events-none" />

			<div className="foodie-card rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] w-full max-w-md p-8 relative z-10 border border-white/10">
				<div className="flex items-center gap-3 mb-6">
					<button
						type="button"
						className="p-1.5 rounded-full bg-[#181818] border border-white/10 hover:border-orange-500/50 text-orange-400 cursor-pointer transition"
						onClick={() => navigate("/signin")}
					>
						<IoIosArrowRoundBack size={26} />
					</button>
					<h1 className="text-2xl font-bold text-white">
						Forgot <span className="text-orange-500">Password</span>
					</h1>
				</div>

				{step === 1 && (
					<div>
						<div className="mb-6">
							<label
								htmlFor="email"
								className="block text-zinc-300 text-sm font-medium mb-1.5"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition"
								placeholder="Enter your Email"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								required
							/>
						</div>
						<button
							type="button"
							className="w-full cursor-pointer font-semibold py-2.5 rounded-full foodie-btn-primary text-sm flex justify-center items-center"
							onClick={handleSendOtp}
							disabled={loading}
						>
							{loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
						</button>
						{err && (
							<p className="text-orange-400 text-xs text-center mt-4 font-medium">
								*{err}
							</p>
						)}
					</div>
				)}

				{step === 2 && (
					<div>
						<div className="mb-6">
							<label
								htmlFor="otp"
								className="block text-zinc-300 text-sm font-medium mb-1.5"
							>
								OTP
							</label>
							<input
								id="otp"
								type="text"
								className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition"
								placeholder="Enter OTP"
								onChange={(e) => setOtp(e.target.value)}
								value={otp}
								required
							/>
						</div>

						<button
							type="button"
							className="w-full cursor-pointer font-semibold py-2.5 rounded-full foodie-btn-primary text-sm flex justify-center items-center"
							onClick={handleVerifyOtp}
							disabled={loading}
						>
							{loading ? <ClipLoader size={20} color="white" /> : "Verify"}
						</button>
						{err && (
							<p className="text-orange-400 text-xs text-center mt-4 font-medium">
								*{err}
							</p>
						)}
					</div>
				)}

				{step === 3 && (
					<div>
						<div className="mb-4">
							<label
								htmlFor="password"
								className="block text-zinc-300 text-sm font-medium mb-1.5"
							>
								New Password
							</label>
							<input
								id="password"
								type="password"
								className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition"
								placeholder="Enter new password"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								required
							/>
						</div>
						<div className="mb-6">
							<label
								htmlFor="confirm-password"
								className="block text-zinc-300 text-sm font-medium mb-1.5"
							>
								Confirm New Password
							</label>
							<input
								id="confirm-password"
								type="password"
								className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition"
								placeholder="Confirm new password"
								onChange={(e) => setConfirmPassword(e.target.value)}
								value={confirmPassword}
								required
							/>
						</div>
						<button
							type="button"
							className="w-full cursor-pointer font-semibold py-2.5 rounded-full foodie-btn-primary text-sm flex justify-center items-center"
							onClick={handleResetPassword}
						>
							{loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
						</button>
						{err && (
							<p className="text-orange-400 text-xs text-center mt-4 font-medium">
								*{err}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ForgotPassword;
