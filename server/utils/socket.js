import User from "../models/user.model.js";

export const socketHandler = (io) => {
	io.on("connection", (socket) => {
		socket.on("identity", async ({ userId }) => {
			try {
				const user = await User.findByIdAndUpdate(
					userId,
					{
						socketId: socket.id,
						isOnline: true,
					},
					{ returnDocument: "after" },
				);
				if (!user) {
					console.log("User not found");
				}
			} catch (error) {
				console.log(error);
			}
		});
		socket.on("disconnect", async () => {
			try {
				await User.findOneAndUpdate(
					{ socketId: socket.id },
					{
						socketId: null,
						inOnline: false,
					},
				);
			} catch (error) {
				console.log(error);
			}
		});
	});
};
