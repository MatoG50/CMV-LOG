import { useState } from "react";
import Eld from "./components/Eld";
import NavBar from "./components/NavBar";
import RouteMap from "./components/RouteMap";
import TripDetails from "./components/TripDetails";

function App() {
  const [tripId, setTripId] = useState<number | null>(null);
  return (
    <>
      <div className="bg-[#F6F7F8] h-screen pr-5 pl-5 flex flex-col ">
        <NavBar />
        <div className="flex justify-between overflow-hidden mt-[1%] h-[50%]">
          <TripDetails setTripId={setTripId} />
          {tripId && <RouteMap tripId={tripId} />}
        </div>
        <Eld />
      </div>
    </>
  );
}

export default App;
