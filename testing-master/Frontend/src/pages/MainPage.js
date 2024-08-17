import axios from "axios";
import React, { useContext, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import AcceptedBookings from "../components/AcceptedBookings/AcceptedBookings";
import Dashboard from "../components/Admin/Dashboard";
import BookmarkedPackages from "../components/BookmarkedPackages/BookmarkedPackages";
import BookingRequestsBody from "../components/ExchangeRequests/BookingRequestsBody";
import HomepageBody from "../components/Homepage/HomepageBody";
import PackageDetails from "../components/Homepage/PackageDetails";
import ProfileBody from "../components/Profile/ProfileBody";
import SearchBody from "../components/SearchPage/SearchBody";
import Sidebar from "../components/common/Sidebar";
import AddBookingRequest from "../components/forms/AddBookingRequest";
import AddTourPackage from "../components/forms/AddTourPackage";
import { UserContext } from "../context/UserContext";

const MainPage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useContext(UserContext);

  console.log("user", user?.data[0].bookmarkedPackages);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem("activeTab", tabName);
  };

  const fetchUserInfo = async (userId) => {
    console.log(userId);
    try {
      const response = await axios.get(
        `https://localhost:3001/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        const userData = response.data;
        setUserInfo(userData);
      } else {
        console.error("Failed to fetch user information");
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  return (
    <div className="flex w-full min-h-[100vh] bg-white">
      <Sidebar activeTab={activeTab} handleTabClick={handleTabClick} />

      <div className="flex flex-col justify-between text-black w-full md-2:ml-[300px] md-2:flex-1 md-2:relative">
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route
              path="home"
              element={
                <HomepageBody
                  userInfo={userInfo}
                  fetchUserInfo={fetchUserInfo}
                />
              }
            />
            <Route
              path="addPackage"
              element={
                <AddTourPackage
                  userInfo={userInfo}
                  fetchUserInfo={fetchUserInfo}
                />
              }
            />
            <Route
              path="dashboard"
              element={
                <Dashboard userInfo={userInfo} fetchUserInfo={fetchUserInfo} />
              }
            />
            <Route
              path="search"
              element={
                <SearchBody userInfo={userInfo} fetchUserInfo={fetchUserInfo} />
              }
            />
            <Route
              path="details"
              element={
                <PackageDetails
                  userInfo={userInfo}
                  fetchUserInfo={fetchUserInfo}
                />
              }
            />
            <Route
              path="bookmarkedPackages"
              element={
                <BookmarkedPackages
                  userInfo={userInfo}
                  fetchUserInfo={fetchUserInfo}
                />
              }
            />
            <Route
              path="profile"
              element={
                <ProfileBody
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  fetchUserInfo={fetchUserInfo}
                />
              }
            />
            <Route
              path="addBookingRequest"
              element={
                <AddBookingRequest
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  fetchUserInfo={fetchUserInfo}
                />
              }
            />
            <Route
              path="bookingRequests"
              element={
                <BookingRequestsBody
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  fetchUserInfo={fetchUserInfo}
                />
              }
            />
            <Route
              path="yourBookings"
              element={
                <AcceptedBookings
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  fetchUserInfo={fetchUserInfo}
                />
              }
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;
