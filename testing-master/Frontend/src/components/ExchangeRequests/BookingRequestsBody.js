import axios from "axios";
import React, { useEffect, useState } from "react";
import BookingRequest from "./BookingRequest";

const BookingRequestsBody = () => {
  const [bookingRequests, setBookingRequests] = useState([]);  

  const handleUpdate = () => {
    axios
      .get("https://localhost:3001/booking/booking-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setBookingRequests(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // Fetch booking requests from the API
    handleUpdate();
  }, []);

  // Filter booking requests by status (show only "pending" requests)
  const pendingBookingRequests = bookingRequests.filter(
    (bookingRequest) => bookingRequest.status === "pending"
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen pb-16 flex flex-col items-stretch gap-8 md-2:pb-5">
      <p className="font-medium text-center md-2:text-lg">
        You have{" "}
        <span className="text-purple-lighter">
          {pendingBookingRequests.length}
        </span>{" "}
       pending booking requests.
      </p>

      <div className="flex flex-col gap-4">
        {pendingBookingRequests.map((bookingRequest) => (
          <BookingRequest
            key={bookingRequest._id}
            bookingRequest={bookingRequest}
            onUpdate={handleUpdate} // Pass the handleUpdate function as a prop
          />
        ))}
      </div>
    </div>
  );
};

export default BookingRequestsBody;
