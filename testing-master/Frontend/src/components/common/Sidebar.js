import React, { useContext } from "react";
import {
  BsBookmark,
  BsFileEarmarkText,
  BsPlusSquare,
  BsSearch,
} from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FiHome, FiMoreHorizontal } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Sidebar = ({ activeTab, handleTabClick }) => {
  const { user } = useContext(UserContext);

  const userType = user?.data?.[0]?.userType || "";

  const navigate = useNavigate();

  return (
    <div className="fixed z-20 bg-blue-700 bottom-0 w-full md:w-[300px] md:min-h-[100vh] md:flex md:flex-col md:justify-between md:py-5">
      <div className="md:flex md:flex-col md:gap-10">
        <div className="hidden md:block md:px-8">
          <h1 className="text-white text-3xl font-bold">Trip Planner</h1>
        </div>

        <nav className="w-full md:px-4">
          <ul className="flex items-center justify-between px-6 py-4 border-t md-2:flex-col md-2:gap-2 md-2:items-start md-2:border-none md-2:p-0">
            <li
              className={`relative hover:text-white cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md ${
                activeTab === "home"
                  ? "text-white md:text-blue-600"
                  : "text-white"
              }`}
              onClick={() => {
                handleTabClick("home");
                navigate("/home");
              }}
            >
              <FiHome className="w-5 h-5" />
              <p className="hidden font-semibold md:block">Home</p>

              {activeTab === "home" && (
                <div className="md:bg-white h-full w-[2px] absolute left-0"></div>
              )}
            </li>

            {userType === "admin" && (
              <li
                className={`relative hover:text-white cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md ${
                  activeTab === "dashboard"
                    ? "text-white md:text-blue-600"
                    : "text-white"
                }`}
                onClick={() => {
                  handleTabClick("dashboard");
                  navigate("/dashboard");
                }}
              >
                <RxDashboard className="w-5 h-5" />
                <p className="hidden font-semibold md:block">Dashboard</p>

                {activeTab === "dashboard" && (
                  <div className="md:bg-white h-full w-[2px] absolute left-0"></div>
                )}
              </li>
            )}

            {userType === "admin" && (
              <li
                className={`relative hover:text-white cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md ${
                  activeTab === "addPackage"
                    ? "text-white md:text-blue-600"
                    : "text-white"
                }`}
                onClick={() => {
                  handleTabClick("addPackage");
                  navigate("/addPackage");
                }}
              >
                <BsPlusSquare className="w-5 h-5" />
                <p className="hidden font-semibold md:block">Add Package</p>

                {activeTab === "addPackage" && (
                  <div className="md:bg-white h-full w-[2px] absolute left-0"></div>
                )}
              </li>
            )}

            {userType !== "admin" && (
              <li
                className={`relative hover:text-white cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md ${
                  activeTab === "bookmarkedPackages"
                    ? "text-white md:text-blue-600"
                    : "text-white"
                }`}
                onClick={() => {
                  handleTabClick("bookmarkedPackages");
                  navigate("/bookmarkedPackages");
                }}
              >
                <BsBookmark className="w-5 h-5" />
                <p className="hidden font-semibold md:block">
                  Bookmarked Packages
                </p>

                {activeTab === "bookmarkedPackages" && (
                  <div className="md:bg-white h-full w-[2px] absolute left-0"></div>
                )}
              </li>
            )}

            {userType !== "admin" && (
              <li
                className={`relative hover:text-white cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md ${
                  activeTab === "search"
                    ? "text-white md:text-blue-600"
                    : "text-white"
                }`}
                onClick={() => {
                  handleTabClick("search");
                  navigate("/search");
                }}
              >
                <BsSearch className="w-5 h-5" />
                <p className="hidden font-semibold md:block">Search Packages</p>

                {activeTab === "search" && (
                  <div className="md:bg-white h-full w-[2px] absolute left-0"></div>
                )}
              </li>
            )}

            {userType === "admin" && (
              <li
                className={`relative hover:text-white cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md ${
                  activeTab === "bookingRequests"
                    ? "text-white md:text-blue-600"
                    : "text-white"
                }`}
                onClick={() => {
                  handleTabClick("bookingRequests");
                  navigate("/bookingRequests");
                }}
              >
                <BsFileEarmarkText className="w-5 h-5" />
                <p className="hidden font-semibold md:block">
                  Booking Requests
                </p>

                {activeTab === "bookingRequests" && (
                  <div className="md:bg-white h-full w-[2px] absolute left-0"></div>
                )}
              </li>
            )}

            {userType !== "admin" && (
              <li
                className={`relative hover:text-white cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md ${
                  activeTab === "yourBookings"
                    ? "text-white md:text-blue-600"
                    : "text-white"
                }`}
                onClick={() => {
                  handleTabClick("yourBookings");
                  navigate("/yourBookings");
                }}
              >
                <BsFileEarmarkText className="w-5 h-5" />
                <p className="hidden font-semibold md:block">Your Bookings</p>

                {activeTab === "yourBookings" && (
                  <div className="md:bg-white h-full w-[2px] absolute left-0"></div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div
        className="hidden cursor-pointer md:flex justify-between items-center md:px-4 md:py-2 rounded-lg mx-4"
        onClick={() => {
          navigate("/profile");
        }}
      >
        <div className="flex items-center gap-2 text-white">
          <FaUser className="w-5 h-5" />
          <p className="font-medium">{user?.data[0]?.fullname || ""}</p>
        </div>

        <div>
          <FiMoreHorizontal className="relative cursor-pointer z-20 w-6 h-6 text-white transition duration-300 hover:text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
