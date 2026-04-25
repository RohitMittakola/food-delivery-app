import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet has a known bug in React where the default marker pins disappear. 
// This quick hack fixes it instantly!
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const DeliveryMap = () => {
    // Demo coordinates set near Hanamkonda
    const restaurantLocation = [18.0004, 79.5501];
    const deliveryLocation = [18.0124, 79.5632];

    // Center the map right between the two points
    const mapCenter = [18.0064, 79.5566];

    return (
        <div className="w-full h-80 rounded-2xl overflow-hidden shadow-inner border border-gray-200 z-0 relative">
            <MapContainer
                center={mapCenter}
                zoom={14}
                style={{ height: "100%", width: "100%", zIndex: 1 }}
                scrollWheelZoom={false}
            >
                {/* This grabs the actual street map imagery from OpenStreetMap */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* The Restaurant Pin */}
                <Marker position={restaurantLocation}>
                    <Popup className="font-bold">BroBite Kitchen 🍔</Popup>
                </Marker>

                {/* The User Delivery Pin */}
                <Marker position={deliveryLocation}>
                    <Popup className="font-bold">Delivery Address 🏠</Popup>
                </Marker>

                {/* The animated GPS route line! */}
                <Polyline
                    positions={[restaurantLocation, deliveryLocation]}
                    color="#ea580c" // Orange-600 to match your app theme
                    weight={5}
                    dashArray="10, 15"
                    className="animate-pulse"
                />
            </MapContainer>
        </div>
    );
};

export default DeliveryMap;