import Logo from "../assets/logo.png";
import { MdOutlineCalendarToday } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCircleUser } from "react-icons/fa6";
import { LuLogs } from "react-icons/lu";
import { FcAbout } from "react-icons/fc";

const NavBar = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mt-[1.5%] bg-[#FFFFFF] rounded-[17px] h-[7%] flex items-center text-[16px] justify-between ">
      <div>
        <img className="h-[80px]" src={Logo} alt="Logo" />
      </div>

      <div className="flex gap-5 font-bold">
        <div className="flex items-center gap-1">
          <LuLogs />
          <p>Logs</p>
        </div>
        <a className="flex items-center gap-1" href="#">
          <FcAbout /> <p>About</p>
        </a>

        <div className="flex items-center gap-1">
          <MdOutlineCalendarToday /> <p>Trip planner</p>
        </div>
        <div>{today}</div>
      </div>
      <div className="flex items-center">
        <FaCircleUser className="w-[48px] h-[48px]" />
        <div className="ml-1.5">
          <a href="#" className="font-bold mr-2">
            Login
          </a>
          <a href="#">Sign Up</a>
        </div>
        <div className="w-[1px] h-[48px] bg-gray-700 mx-auto ml-2.5" />
        <BsThreeDotsVertical className="size-6" />
      </div>
    </div>
  );
};

export default NavBar;
