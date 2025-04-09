const TripDetails = () => {
  return (
    <div className="bg-[#FFFFFF] w-[27%] flex flex-col pr-5 pl-5 rounded-[16px]">
      <div className="mr-6 ml-6 mt-10">
        <p className="font-bold text-[24px]">Trip Details</p>
        <form className="w-full mt-8">
          <div className="mb-[3%]">
            <label className="block text-base font-bold mb-[1%] font-body">
              Current location:
            </label>
            <input
              type="text"
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
