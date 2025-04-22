import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";

const RouteMap = ({ tripId }: { tripId: number }) => {
  const [routeCoords, setRouteCoords] = useState<LatLngExpression[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/trips/${tripId}/route`);
        const data = await res.json();

        if (data && data.features && data.features[0].geometry) {
          const routeGeometry = data.features[0].geometry.coordinates;

          const formattedCoords = routeGeometry.map(([lng, lat]: number[]) => [
            lat,
            lng,
          ]);

          setRouteCoords(formattedCoords);
        } else {
          console.error("Invalid route data format");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [tripId]);

  if (loading) return <p className="justify-start">Loading map...</p>;

  return (
    <div className="bg-[#FFFFFF] text-[24px] w-[70%] h-[500px] rounded-[16px] overflow-hidden">
      <MapContainer
        center={routeCoords[0]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Polyline positions={routeCoords} color="blue" />

        <Marker position={routeCoords[0]}>
          <Popup>Start</Popup>
        </Marker>

        <Marker position={routeCoords[routeCoords.length - 1]}>
          <Popup>End</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default RouteMap;
