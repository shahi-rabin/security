import axios from "axios";
import React, { useEffect, useState } from "react";
import AcceptedBooking from "./AcceptedBooking";

const AcceptedBookings = () => {
  const [acceptedBookings, setAcceptedBookings] = useState([]);

  const fetchAcceptedBookings = async () => {
    try {
      const response = await axios.get(
        "https://localhost:3001/booking/booking-requests/accepted",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAcceptedBookings(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAcceptedBookings();
  }, []);

  return (
    <div className="pb-16 bg-gray-100 min-h-screen p-6 flex flex-col items-stretch gap-4 md-2:pb-5">
      <h1 className="text-blue-600 text-3xl">Your Bookings</h1>

      {acceptedBookings.length === 0 && (
        <div className="text-center">
          <p className="font-medium text-center md-2:text-lg">
            No Accepted Requests yet. Please check back later.
          </p>
        </div>
      )}
      {acceptedBookings.map((request) => (
        <AcceptedBooking
          key={request._id}
          request={request}
          onUpdate={fetchAcceptedBookings}
        />
      ))}
    </div>
  );
};

export default AcceptedBookings;
