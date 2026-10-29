
import React, { useEffect, useState } from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";

const deliveryBoyIcon = new L.Icon({
	iconUrl: scooter,
	iconSize: [40, 40],
	iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
	iconUrl: home,
	iconSize: [40, 40],
	iconAnchor: [20, 40],
});

function FitRoute({ path }) {
	const map = useMap();

	useEffect(() => {
		if (path.length > 0) {
			map.fitBounds(path, { padding: [40, 40] });
		}
	}, [path, map]);

	return null;
}

const DeliveryBoyTracking = ({ data }) => {
	const deliveryBoyLat = Number(data.deliveryBoyLocation.lat);
	const deliveryBoyLon = Number(data.deliveryBoyLocation.lon);
	const customerLat = Number(data.customerLocation.lat);
	const customerLon = Number(data.customerLocation.lon);

	const [path, setPath] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		const getRoute = async () => {
			try {
				setLoading(true);
				setError("");

				const url =
					`https://router.project-osrm.org/route/v1/driving/` +
					`${deliveryBoyLon},${deliveryBoyLat};` +
					`${customerLon},${customerLat}` +
					`?overview=full&geometries=geojson`;

				const response = await fetch(url, {
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error("Failed to fetch route");
				}

				const result = await response.json();

				if (result.code !== "Ok" || !result.routes?.length) {
					throw new Error("No road route found");
				}
				const coordinates = result.routes[0].geometry.coordinates;
				setPath(
					coordinates.map(([lon, lat]) => [lat, lon])
				);
			} catch (err) {
				if (err.name !== "AbortError") {
					setError(err.message || "Unable to load route");
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		};
		getRoute();
		return () => controller.abort();
	}, [
		deliveryBoyLat,
		deliveryBoyLon,
		customerLat,
		customerLon,
	]);

	const center = [deliveryBoyLat, deliveryBoyLon];

	return (
		<div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md relative">
			<MapContainer
				className="w-full h-full"
				center={center}
				zoom={16}
				scrollWheelZoom={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<Marker
					position={[customerLat, customerLon]}
					icon={customerIcon}
				>
					<Popup>Customer</Popup>
				</Marker>

				<Marker
					position={[deliveryBoyLat, deliveryBoyLon]}
					icon={deliveryBoyIcon}
				>
					<Popup>Delivery Boy</Popup>
				</Marker>

				{path.length > 0 && (
					<>
						<Polyline
							positions={path}
							color="blue"
							weight={4}
						/>
						<FitRoute path={path} />
					</>
				)}
			</MapContainer>

			{loading && (
				<div className="absolute top-3 left-3 z-[1000] bg-white px-3 py-2 rounded shadow">
					Loading road route...
				</div>
			)}

			{error && (
				<div className="absolute top-3 left-3 z-[1000] bg-white text-red-600 px-3 py-2 rounded shadow">
					{error}
				</div>
			)}
		</div>
	);
};

export default DeliveryBoyTracking;
