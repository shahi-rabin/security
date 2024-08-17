import React from "react";
import { AiFillMail } from "react-icons/ai";

const AcceptedBooking = ({ request, onUpdate }) => {
  const handleContactAdmin = () => {
    const adminEmail = "admin@gmail.com";
    const subject = `Booking Inquiry for ${request.requestedPackage.package_name}`;

    window.open(`mailto:${adminEmail}?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <div className="relative w-full p-4 bg-white rounded-xl shadow-md flex items-center justify-between md:p-6">
      <div className="w-full flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <img
            src={`https://localhost:3001/uploads/${request.requestedPackage.package_cover}`}
            alt=""
            className="md:max-w-[150px] md:max-h-[100px] rounded-lg object-fill"
          />
        </div>

        <div className="w-full flex flex-col gap-2 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-medium">
              Your request for{" "}
              <span className="text-purple-lighter font-semibold">
                {request.requestedPackage.package_name}
              </span>{" "}
              has been accepted. 🎉
            </p>

            <p className="text-gray-600">
              Contact the admin to finalize the booking.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="bg-blue-500 flex items-center gap-2 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              onClick={handleContactAdmin}
            >
              <AiFillMail className="text-xl" />
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptedBooking;
