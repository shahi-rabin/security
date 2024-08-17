import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { HiGlobe, HiLibrary } from "react-icons/hi";
import { RxUpload } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../context/UserContext";
import TextFieldWithLabel from "../Login-Signup/TextFieldWithLabel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddTourPackage = ({ closeModal }) => {
  const { setIsLoading } = useContext(UserContext);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [packageTime, setPackageTime] = useState(new Date());

  const handlePackageTimeChange = (date) => {
    setPackageTime(date);
  };
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [remaining, setRemaining] = useState("");
  const [route, setRoute] = useState("");
  const [packagePlan, setPackagePlan] = useState("");
  const [packageCover, setPackageCover] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleDestinationNameChange = (e) => {
    setDestinationName(e.target.value);
  };

  const handlePackageNameChange = (e) => {
    setPackageName(e.target.value);
  };

  const handlePackageDescriptionChange = (e) => {
    setPackageDescription(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handlePriceChange = (e) => {
    const inputValue = e.target.value;
    const parsedValue = parseInt(inputValue, 10);

    if (!isNaN(parsedValue)) {
      setPrice(parsedValue);
    } else {
      // Optionally, you can set an error state or display a message
      // For now, let's set the price to 0 if the input is not a valid number
      setPrice(0);
    }
  };

  const handleRemainingChange = (e) => {
    const inputValue = e.target.value;
    const parsedValue = parseInt(inputValue, 10);

    if (!isNaN(parsedValue)) {
      setRemaining(parsedValue);
    } else {
      // Optionally, you can set an error state or display a message
      // For now, let's set the remaining to 0 if the input is not a valid number
      setRemaining(0);
    }
  };

  const handleRouteChange = (e) => {
    setRoute(e.target.value);
  };

  const handlePackagePlanChange = (e) => {
    setPackagePlan(e.target.value);
  };

  const handlePackageCoverChange = (e) => {
    setPackageCover(e.target.files[0]);
    setSelectedFileName(e.target.files[0].name);
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // Upload the package cover first
      const formData = new FormData();
      formData.append("profilePicture", packageCover);

      const response = await axios.post(
        "https://localhost:3001/packages/uploadPackageCover",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const filename = response.data.data;

      console.log(filename);

      // Add the package with the uploaded package cover
      await axios.post(
        "https://localhost:3001/packages",
        {
          destination_name: destinationName,
          package_name: packageName,
          package_description: packageDescription,
          package_time: packageTime.toISOString(),
          location: location,
          price: price,
          remaining: remaining,
          route: route,
          package_plan: packagePlan,
          package_cover: filename,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Tour package added successfully.");

      // updateTotalBooks(totalBooks + 1);
      setDestinationName("");
      setPackageName("");
      setPackageDescription("");
      setPackageTime("");
      setLocation("");
      setPrice("");
      setRemaining("");
      setRoute("");
      setPackagePlan("");
      setPackageCover(null);
      setSelectedFileName("");
      setError("");

      // Show success toast
      toast.success("Tour package added successfully.");
    } catch (error) {
      console.log(error);
      setError("Failed to add tour package.");

      // Show error toast
      toast.error("Failed to add tour package.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputRef = useRef(null);

  const handleDivClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="bg-gray-100 p-6 relative w-full overflow-auto">
      <ToastContainer position="top-center" />
      <div className="relative rounded-xl">
        <form className="my-6 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-6">
          <div className="flex flex-col items-baseline gap-2">
            <label className="text-lg text-blue-600 font-bold">
              Package Cover
            </label>
            <div
              onClick={handleDivClick}
              className="relative cursor-pointer bg-purple-lighter w-full h-28 md:h-full"
            >
              <div className="w-full h-full flex items-center justify-center gap-2 bg-blue-400">
                {selectedFileName ? (
                  <p>{selectedFileName}</p>
                ) : (
                  <>
                    <label>
                      <RxUpload className="cursor-pointer text-2xl text-gray-800" />
                    </label>
                    <p className="font-medium text-gray-800">
                      Add package cover
                    </p>
                  </>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  src=""
                  alt=""
                  id="image"
                  name="packageCover"
                  className="w-6 h-6 invisible absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  onChange={handlePackageCoverChange}
                />
              </div>
            </div>
          </div>

          <TextFieldWithLabel
            label="Destination Name"
            type="text"
            placeholder="Enter destination name"
            icon={HiGlobe}
            value={destinationName}
            onChange={handleDestinationNameChange}
          />

          <TextFieldWithLabel
            label="Package Name"
            type="text"
            placeholder="Enter package name"
            icon={HiLibrary}
            value={packageName}
            onChange={handlePackageNameChange}
          />

          <div className="flex flex-col items-baseline gap-2">
            <label htmlFor="packageTime" className="text-lg text-blue-600 font-bold">
              Package Date
            </label>
            <DatePicker
              id="packageTime"
              selected={packageTime}
              onChange={handlePackageTimeChange}
              dateFormat="yyyy-MM-dd"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>


          <div className="flex flex-col items-baseline gap-2 md:col-span-2">
            <label className="text-lg text-blue-600 font-bold">
              Package Description
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter package description"
              value={packageDescription}
              rows={4}
              onChange={handlePackageDescriptionChange}
            />
          </div>

          <TextFieldWithLabel
            label="Location"
            type="text"
            placeholder="Enter location"
            icon={HiGlobe}
            value={location}
            onChange={handleLocationChange}
          />

          <TextFieldWithLabel
            label="Price"
            type="text"
            placeholder="Enter price"
            icon={HiLibrary}
            value={price}
            onChange={handlePriceChange}
          />

          <TextFieldWithLabel
            label="Remaining"
            type="text"
            placeholder="Enter remaining"
            icon={HiGlobe}
            value={remaining}
            onChange={handleRemainingChange}
          />

          <TextFieldWithLabel
            label="Route"
            type="text"
            placeholder="Enter route"
            icon={HiLibrary}
            value={route}
            onChange={handleRouteChange}
          />

          <div className="flex flex-col items-baseline gap-2 md:col-span-2">
            <label className="text-lg text-blue-600 font-bold">
              Package Plan
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter package plan"
              value={packagePlan}
              rows={6}
              onChange={handlePackagePlanChange}
            />
          </div>

          <div className="flex items-center justify-end md:col-span-2">
            <button
              type="submit"
              className="w-fit mt-4 bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-[2px] vsm:text-base md:mt-8"
              onClick={handleAddPackage}
            >
              Add Tour Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTourPackage;
