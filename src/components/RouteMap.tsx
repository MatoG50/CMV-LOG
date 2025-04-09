import mapp from "../assets/map.jpg";

const RouteMap = () => {
  return (
    <div className="bg-[#FFFFFF] text-[24px] w-[70%] rounded-[16px] overflow-hidden">
      <img src={mapp} alt="map" className="w-full h-full object-cover" />
    </div>
  );
};

export default RouteMap;
