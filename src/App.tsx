import { useState } from "react";
import NavBar from "./components/NavBar";
import RouteMap from "./components/RouteMap";
import TripDetails from "./components/TripDetails";
import ELDLogGraph from "./components/ELDLogGraph";

function App() {
  const [tripId, setTripId] = useState<number | null>(null);
  console.log("Trip ID in App component:", tripId);

  return (
    <>
      <div className="bg-[#F6F7F8] h-screen pr-5 pl-5 flex flex-col ">
        <NavBar />
        <div className="flex justify-between overflow-hidden mt-[1%] h-[50%]">
          <TripDetails setTripId={setTripId} />
          {tripId && <RouteMap tripId={tripId} />}
        </div>

        {tripId && <ELDLogGraph tripId={tripId} />}
      </div>
    </>
  );
}

export default App;
