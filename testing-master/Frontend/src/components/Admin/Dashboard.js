import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsCheckLg, BsClock } from "react-icons/bs";
import { FaExchangeAlt, FaUserFriends } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";

const Dashboard = () => {
  const [dashboardSummary, setDashboardSummary] = useState({
    totalUsers: 0,
    totalPackages: 0,
    totalBookingRequests: 0,
    pendingBookingRequests: 0,
    acceptedBookingRequests: 0,
    declinedBookingRequests: 0,
  });

  useEffect(() => {
    // Fetch dashboard summary data when the component mounts
    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3001/admin/dashboard-summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDashboardSummary(response.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchDashboardSummary();
  }, []); // Empty dependency array to ensure it runs only once on mount

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://localhost:3001/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(response.data);
      console.log(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3001/admin/dashboard-summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDashboardSummary(response.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchUsers();
    fetchDashboardSummary();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`https://localhost:3001/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // You may want to refresh the user data after deletion
      fetchUsers();

      // reload page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-5 py-5">
        <h2 className="text-3xl font-bold text-blue-600">Summary</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gray-200 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-gray-600 text-black font-medium group">
            <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <FaUserFriends className="w-5 h-5" />
            </div>
            <div class="text-right">
              <p class="text-2xl">{dashboardSummary.totalUsers}</p>
              <p>Total Users</p>
            </div>
          </div>

          <div class="bg-gray-200 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-gray-600 text-black font-medium group">
            <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <IoBookSharp className="w-5 h-5" />
            </div>
            <div class="text-right">
              <p class="text-2xl">{dashboardSummary.totalPackages}</p>
              <p>Total Packages</p>
            </div>
          </div>

          <div class="bg-gray-200 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-gray-600 text-black font-medium group">
            <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <FaExchangeAlt className="w-5 h-5" />
            </div>
            <div class="text-right">
              <p class="text-2xl">{dashboardSummary.totalBookingRequests}</p>
              <p>Total Booking Requests</p>
            </div>
          </div>

          <div class="bg-gray-200 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-gray-600 text-black font-medium group">
            <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <BsClock className="w-5 h-5" />
            </div>
            <div class="text-right">
              <p class="text-2xl">{dashboardSummary.pendingBookingRequests}</p>
              <p>Pending Booking Requests</p>
            </div>
          </div>

          <div class="bg-gray-200 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-gray-600 text-black font-medium group">
            <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <BsCheckLg className="w-7 h-7" />
            </div>
            <div class="text-right">
              <p class="text-2xl">{dashboardSummary.acceptedBookingRequests}</p>
              <p>Accepted Booking Requests</p>
            </div>
          </div>

          {/* <div class="bg-gray-200 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-gray-600 text-black font-medium group">
            <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <IoClose className="w-7 h-7" />
            </div>
            <div class="text-right">
              <p class="text-2xl">{dashboardSummary.declinedBookingRequests}</p>
              <p>Declined Booking Requests</p>
            </div>
          </div> */}
        </div>

        {/* Display a table of users */}
        <div>
          <h1 className="text-2xl text-blue-600">Manage Users</h1>
          {users.length > 0 && (
            <table className="min-w-full border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Users
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Username
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {user.fullname}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {user.username}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2 flex items-center justify-center">
                      <button
                        className="bg-red-500 text-black px-4 py-1.5 font-medium rounded"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
