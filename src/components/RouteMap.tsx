import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import staticmap from "../assets/map.avif";

const RoutePlaceholder = () => (
  <div
    className="bg-white w-[72%] rounded-lg overflow-hidden relative flex flex-col items-center justify-center"
    style={{ height: "500px" }}
  >
    <img
      src={staticmap}
      alt="No trip selected"
      className="w-3/4 max-w-md mb-4"
    />
    <p className="text-gray-600 font-medium text-lg">No Trip Submitted</p>
    <p className="text-gray-400 text-base mt-1">
      Please submit a trip to view the route map
    </p>
  </div>
);

interface LogEntry {
  time: string;
  status: string;
  duration: number;
  activity?: string;
  location?: string;
}

interface LogSheet {
  entries: LogEntry[];
}

interface RouteData {
  route: {
    features: {
      geometry: {
        coordinates: [number, number][];
      };
      properties?: {
        summary?: {
          start_point?: string;
          end_point?: string;
        };
      };
    }[];
  };
  log_sheets: LogSheet[];
}

// Custom icons
const startIcon = new L.Icon({
  iconUrl:
    "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const endIcon = new L.Icon({
  iconUrl:
    "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconColor: "red",
});

const stopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/67/67347.png",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

const restIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2088/2088617.png",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

const RouteMap = ({ tripId }: { tripId: number | null }) => {
  const [routeCoords, setRouteCoords] = useState<LatLngExpression[]>([]);
  const [stops, setStops] = useState<
    { position: LatLngExpression; activity: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [startName, setStartName] = useState("Start Point");
  const [endName, setEndName] = useState("End Point");

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/trips/${tripId}/route`);
        const data: RouteData = await res.json();
        console.log("Route data:", data);

        if (data?.route?.features?.[0]?.geometry?.coordinates) {
          const feature = data.route.features[0];
          const routeGeometry = feature.geometry.coordinates;

          const formattedCoords: LatLngTuple[] = routeGeometry.map(
            ([lng, lat]) => [lat, lng] as LatLngTuple
          );

          setRouteCoords(formattedCoords);

          // Process start and end points
          if (feature.properties?.summary) {
            if (feature.properties.summary.start_point) {
              setStartName(feature.properties.summary.start_point);
            }
            if (feature.properties.summary.end_point) {
              setEndName(feature.properties.summary.end_point);
            }
          }

          // Process stops
          const stopPoints: { position: LatLngExpression; activity: string }[] =
            [];

          // start and end points
          if (formattedCoords.length > 0) {
            stopPoints.push({
              position: formattedCoords[0],
              activity: `Start: ${startName}`,
            });

            stopPoints.push({
              position: formattedCoords[formattedCoords.length - 1],
              activity: `End: ${endName}`,
            });
          }

          // log entries for other stops
          data.log_sheets.forEach(sheet => {
            sheet.entries.forEach(entry => {
              if (
                entry.activity &&
                !["Pickup", "Drop-off"].includes(entry.activity)
              ) {
                let positionIndex = 0;

                if (entry.location?.includes("0.0%")) positionIndex = 0;
                else if (entry.location?.includes("64.4%"))
                  positionIndex = Math.floor(formattedCoords.length * 0.644);
                else if (entry.location?.includes("73.2%"))
                  positionIndex = Math.floor(formattedCoords.length * 0.732);
                else positionIndex = Math.floor(formattedCoords.length * 0.5);

                if (
                  positionIndex >= 0 &&
                  positionIndex < formattedCoords.length
                ) {
                  stopPoints.push({
                    position: formattedCoords[positionIndex],
                    activity: entry.activity,
                  });
                }
              }
            });
          });

          setStops(stopPoints);
        } else {
          console.error("Invalid route data format");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [tripId, startName, endName]);

  // placeholder
  if (tripId === null) {
    return <RoutePlaceholder />;
  }

  if (loading)
    return (
      <div
        className="bg-white w-[72%] rounded-lg overflow-hidden relative flex items-center justify-center"
        style={{ height: "500px" }}
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );

  return (
    <div className="bg-white w-[72%] rounded-lg  overflow-hidden relative">
      <MapContainer
        center={routeCoords[0] || [0, 0]}
        zoom={routeCoords.length ? 6 : 2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={routeCoords} color="blue" />

        {stops.map((stop, index) => (
          <Marker
            key={index}
            position={stop.position}
            icon={
              stop.activity.includes("Start")
                ? startIcon
                : stop.activity.includes("End")
                ? endIcon
                : stop.activity.includes("break") ||
                  stop.activity.includes("reset")
                ? restIcon
                : stopIcon
            }
          >
            <Popup>
              <div className="text-sm">
                <strong>{stop.activity}</strong>
                {Array.isArray(stop.position) && (
                  <p>
                    {stop.position[0].toFixed(4)}, {stop.position[1].toFixed(4)}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Legend */}
        <div className="leaflet-bottom leaflet-right">
          <div className="leaflet-control bg-white p-3 rounded-md shadow-md text-sm text-gray-700">
            <h4 className="font-semibold mb-2">Route Legend</h4>
            <div className="flex items-center mb-1">
              <img
                src={startIcon.options.iconUrl}
                alt="Start"
                className="w-4 h-4 mr-2"
              />
              <span>Start/End</span>
            </div>

            <div className="flex items-center mb-1">
              <img
                src={stopIcon.options.iconUrl}
                alt="Stop"
                className="w-4 h-4 mr-2"
              />
              <span>Stop</span>
            </div>
            <div className="flex items-center">
              <img
                src={restIcon.options.iconUrl}
                alt="Rest"
                className="w-4 h-4 mr-2"
              />
              <span>Rest</span>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default RouteMap;
