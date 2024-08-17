import axios from "axios";
import React, { useState } from "react";
import { IoTime } from "react-icons/io5";

const BookingRequest = ({ bookingRequest, onUpdate }) => {
  const {
    formattedCreatedAt,
    requester,
    requestedPackage,
    email,
    contactNum,
    furtherRequirements,
    status,
    statusUpdatedAt,
    _id,
  } = bookingRequest;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAccept = () => {
    setLoading(true);
    setError(null);

    axios
      .put(
        `https://localhost:3001/booking/booking-request/${_id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setSuccess(true);
        onUpdate();
      })
      .catch((error) => {
        setLoading(false);
        setError("Failed to accept the booking request.");
      });
  };

  const handleDecline = () => {
    setLoading(true);
    setError(null);

    axios
      .delete(
        `https://localhost:3001/booking/booking-request/${_id}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setSuccess(true);
        onUpdate();
      })
      .catch((error) => {
        setLoading(false);
        setError("Failed to decline the booking request.");
        console.log(error);
      });
  };

  return (
    <div className="w-full bg-gray-600 px-4 py-4 rounded-xl flex flex-col gap-4 justify-between sm:flex-row">
      <div className="flex items-center gap-4">
        <div>
          <IoTime className="w-6 h-6 text-white" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-300">
            Requested {formattedCreatedAt}
          </p>
          <p className="text-sm font-medium text-white">
            <span className="text-purple-lighter">Requester:</span>{" "}
            {requester.fullname} (@{requester.username})
          </p>
          <p className="text-sm font-medium text-white">
            <span className="text-purple-lighter">Phone Num:</span> {contactNum}
          </p>
          <p className="text-sm font-medium text-white">
            <span className="text-purple-lighter">Email:</span> {email}
          </p>
          <p className="text-sm font-medium text-white">
            <span className="text-purple-lighter">Package:</span>{" "}
            {requestedPackage.package_name}
          </p>
          <p className="text-sm font-medium text-white">
            <span className="text-purple-lighter">Requirements:</span>{" "}
            {furtherRequirements}
          </p>
        </div>
      </div>

      <div className="flex self-center items-center gap-4">
        <button
          className="py-2 px-4 bg-green-500 text-white rounded-md transition duration-200 hover:scale-[1.02] focus:outline-none"
          onClick={handleAccept}
          // disabled={loading || success}
        >
          Accept
        </button>

        <button
          className="py-2 px-4 bg-red-500 text-white rounded-md transition duration-200 hover:scale-[1.02] focus:outline-none"
          onClick={handleDecline}
          // disabled={loading || success}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default BookingRequest;
