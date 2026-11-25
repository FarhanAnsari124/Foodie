
const CategoryCard = ({ data, onClick, isActive = false }) => {
	return (
		<div
			onClick={onClick}
			className={`w-[125px] h-[125px] md:w-[175px] md:h-[175px] rounded-2xl shrink-0 overflow-hidden bg-[#141414] cursor-pointer relative group transition-all duration-300 ${
				isActive
					? "border-2 border-orange-500 shadow-[0_0_24px_rgba(255,94,0,0.35)]"
					: "border border-white/10 hover:border-orange-500/50 hover:shadow-[0_8px_24px_rgba(255,94,0,0.16)]"
			}`}
		>
			<img
				src={data.image}
				alt={data.name || data.category}
				className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
			<div
				className={`absolute bottom-0 w-full left-0 px-3 py-2 text-center text-xs md:text-sm font-semibold backdrop-blur-md transition-colors ${
					isActive
						? "bg-orange-500/90 text-white"
						: "bg-black/70 text-zinc-100 border-t border-white/10 group-hover:text-orange-400"
				}`}
			>
				<p className="truncate">{data.name || data.category}</p>
			</div>
		</div>
	);
};

export default CategoryCard;
