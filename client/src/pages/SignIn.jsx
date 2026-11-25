import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { setUserData } from "../redux/user.slice";
import { useDispatch } from "react-redux";

const SignIn = () => {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState("");
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const handleSignIn = async () => {
		setLoading(true);
		try {
			const result = await axios.post(
				`${serverUrl}/api/auth/signin`,
				{
					email,
					password,
				},
				{ withCredentials: true },
			);
			setErr("");
			dispatch(setUserData(result.data.data));
		} catch (error) {
			setErr(error.response?.data?.message || "Sign in failed");
		}
		setLoading(false);
	};

	const handleGoogleAuth = async () => {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		try {
			const { data } = await axios.post(
				`${serverUrl}/api/auth/google-auth`,
				{
					email: result.user.email,
				},
				{ withCredentials: true },
			);
			dispatch(setUserData(data.data));
		} catch (error) {
			setErr(error.response?.data?.message || "Google sign in failed");
		}
	};

	return (
		<div className="min-h-screen w-full bg-[#050505] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
			<div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-500/15 blur-[130px] pointer-events-none" />
			<div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />

			<div className="foodie-card rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] w-full max-w-md p-8 relative z-10 border border-white/10">
				<div className="flex items-center gap-2.5 mb-2">
					<img
						src="/favicon.svg"
						alt="Foodie logo"
						className="w-10 h-10 object-contain drop-shadow-[0_4px_14px_rgba(255,94,0,0.4)]"
					/>
					<h1 className="text-3xl font-bold text-white tracking-tight">
						Food<span className="text-orange-500">ie</span>
					</h1>
				</div>
				<p className="text-zinc-400 text-sm mb-7">
					Good food is just a tap away.
				</p>

				{/* email */}
				<div className="mb-4">
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

				{/* password */}
				<div className="mb-3">
					<label
						htmlFor="password"
						className="block text-zinc-300 text-sm font-medium mb-1.5"
					>
						Password
					</label>
					<div className="relative">
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition"
							placeholder="Enter your Password"
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							required
						/>
						<button
							type="button"
							className="absolute right-3.5 top-3 text-zinc-400 hover:text-orange-400 cursor-pointer transition"
							onClick={() => setShowPassword((prev) => !prev)}
						>
							{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
						</button>
					</div>
				</div>

				<div
					className="text-right mb-5 text-xs text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
					onClick={() => navigate("/forgot-password")}
				>
					Forgot password?
				</div>

				<button
					type="button"
					className="w-full cursor-pointer font-semibold py-2.5 rounded-full foodie-btn-primary flex justify-center items-center gap-2 text-sm"
					onClick={handleSignIn}
					disabled={loading}
				>
					{loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
				</button>

				{err && (
					<p className="text-orange-400 text-xs text-center mt-3 font-medium">
						*{err}
					</p>
				)}

				<button
					type="button"
					className="w-full cursor-pointer mt-4 flex items-center justify-center border gap-2.5 border-white/15 bg-[#161616] hover:border-orange-500/50 hover:bg-[#1c1c1c] rounded-full px-4 py-2.5 text-sm font-medium text-zinc-200 transition"
					onClick={handleGoogleAuth}
				>
					<FcGoogle size={20} />
					<span>Sign In with Google</span>
				</button>

				<p className="text-center mt-6 text-sm text-zinc-400">
					Want to create a new account?{" "}
					<span
						className="text-orange-400 font-medium cursor-pointer hover:underline"
						onClick={() => navigate("/signup")}
					>
						Sign Up
					</span>
				</p>
			</div>
		</div>
	);
};

export default SignIn;
