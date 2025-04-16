import { useState } from "react";

const TripDetails = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [currentCycle, setCurrentCycle] = useState("");

  // const handleSubmit = async e => {
  //   e.preventDefault();

  const data = {
    current_location: currentLocation,
    pickup_location: pickupLocation,
    dropoff_location: dropoffLocation,
    current_cycle_hours: parseFloat(currentCycle),
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    console.log(data);
    e.preventDefault();
    setCurrentLocation("");
    setPickupLocation("");
    setDropoffLocation("");
    setCurrentCycle("");
  };

  return (
    <div className="bg-[#FFFFFF] w-[27%] flex flex-col pr-5 pl-5 rounded-[16px]">
      <div className="mr-6 ml-6 mt-10">
        <p className="font-bold text-[24px]">Trip Details</p>
        <form className="w-full mt-8 " onSubmit={handleSubmit}>
          <div className="mb-[3%]">
            <label className="block text-base font-bold mb-[1%] font-body">
              Current location:
            </label>
            <input
              type="text"
              value={currentLocation}
              onChange={e => setCurrentLocation(e.target.value)}
              className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="mb-[3%]">
            <label className="block text-base font-bold mb-[1%] font-body">
              Pickup location:
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={e => setPickupLocation(e.target.value)}
              className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="mb-[3%]">
            <label className="block text-base font-bold mb-[1%] font-body">
              Dropoff location:
            </label>
            <input
              type="text"
              value={dropoffLocation}
              onChange={e => setDropoffLocation(e.target.value)}
              className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
          <div className="mb-[3%]">
            <label className="block text-base font-bold mb-[1%] font-body">
              Current cycle User (Hrs):
            </label>
            <input
              type="text"
              value={currentCycle}
              onChange={e => setCurrentCycle(e.target.value)}
              className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <button
            className="btn w-full bg-darkgrey mb-[3%] text-white border-none text-[17px] font-body bg-green-600 rounded h-[35px] mt-3 cursor-pointer hover:bg-green-700 focus:outline-none"
            type="submit"
          >
            Submit Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripDetails;
