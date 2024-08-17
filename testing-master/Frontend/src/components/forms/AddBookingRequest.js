import axios from "axios";
import { useAtom } from "jotai";
import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../context/UserContext";
import { selectedPackageAtom } from "../Homepage/TourPackage";
import TextFieldWithLabel from "../Login-Signup/TextFieldWithLabel";

const AddBookingRequest = () => {
  const { setIsLoading } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [furtherRequirements, setFurtherRequirements] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [packageData] = useAtom(selectedPackageAtom);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleContactNumChange = (e) => {
    setContactNum(e.target.value);
  };

  const handleFurtherRequirementsChange = (e) => {
    setFurtherRequirements(e.target.value);
  };

  const handleAddBookingRequest = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const requestedPackageId = packageData._id;

    try {
      await axios.post(
        `https://localhost:3001/booking/${requestedPackageId}/booking-request`,
        {
          email,
          contactNum,
          furtherRequirements,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Booking request added successfully.");

      // Clear the form fields
      setEmail("");
      setContactNum("");
      setFurtherRequirements("");
      setError("");

      // Show success toast
      toast.success("Booking request added successfully.");
    } catch (error) {
      console.error(error);
      setError("Failed to add booking request.");

      // Show error toast
      toast.error("Failed to add booking request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 relative w-full overflow-auto">
      <ToastContainer position="top-center" />
      <div className="relative rounded-xl">
        <h1 className="text-blue-600 text-3xl">Book Package</h1>

        <form className="my-6 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-6">
          <TextFieldWithLabel
            label="Email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleEmailChange}
          />

          <TextFieldWithLabel
            label="Contact Number"
            type="tel"
            placeholder="Enter contact number"
            value={contactNum}
            onChange={handleContactNumChange}
          />

          <div className="flex flex-col items-baseline gap-2 md:col-span-2">
            <label className="text-lg text-blue-600 font-bold">
              Further Requirements
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter further requirements"
              value={furtherRequirements}
              rows={4}
              onChange={handleFurtherRequirementsChange}
            />
          </div>

          <div className="flex items-center justify-end md:col-span-2">
            <button
              type="submit"
              className="w-fit mt-4 bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-[2px] vsm:text-base md:mt-8"
              onClick={handleAddBookingRequest}
            >
              Add Booking Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookingRequest;
