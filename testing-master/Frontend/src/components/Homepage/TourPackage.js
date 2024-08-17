import axios from "axios";
import { atom, useAtom } from "jotai";
import React, { useContext, useEffect, useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa"; // Added FaRegEnvelope icon
import { IoEnter, IoEnterSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export const selectedPackageAtom = atom([]);

const TourPackage = ({ trip_package, fetchUserInfo, setTourPackages }) => {
  const {
    package_description,
    package_name,
    user,
    package_cover,
    package_time,
    price,
    location,
    remaining,
    route,
    // Add more properties as needed
  } = trip_package;

  const [selectedPackage, setSelectedPackage] = useAtom(selectedPackageAtom);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user: currentUser, setUser } = useContext(UserContext);

  const isAdmin = currentUser?.data[0].userType === "admin";

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user.id) {
  //     fetchUserInfo(user.id);
  //   }
  // }, [fetchUserInfo, user.id]);

  useEffect(() => {
    if (currentUser) {
      setIsBookmarked(
        currentUser?.data[0].bookmarkedPackages.includes(trip_package._id)
      );
    }
  }, [currentUser, trip_package._id]);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      if (isBookmarked) {
        await axios.delete(
          `https://localhost:3001/packages/bookmark/${trip_package._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser((prevUser) => {
          const updatedBookmarkedPackages =
            prevUser?.data[0].bookmarkedPackages.filter(
              (packageId) => packageId !== trip_package._id
            );
          return {
            ...prevUser,
            data: [
              {
                ...prevUser.data[0],
                bookmarkedPackages: updatedBookmarkedPackages,
              },
            ],
          };
        });
        setIsBookmarked(false);
      } else {
        await axios.post(
          `https://localhost:3001/packages/bookmark/${trip_package._id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser((prevUser) => {
          const updatedBookmarkedPackages = [
            ...prevUser?.data[0].bookmarkedPackages,
            trip_package._id,
          ];
          return {
            ...prevUser,
            data: [
              {
                ...prevUser.data[0],
                bookmarkedPackages: updatedBookmarkedPackages,
              },
            ],
          };
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await axios.delete(`https://localhost:3001/packages/${trip_package._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle state updates or navigation if needed
      axios
        .get("https://localhost:3001/packages", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => setTourPackages(response.data.data))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePackageClick = () => {
    // Store package details in localStorage
    localStorage.setItem("selectedPackage", JSON.stringify(trip_package));

    // Navigate to the details page
    setSelectedPackage(trip_package);
    navigate("/details");
  };

  return (
    <div
      class="bg-gray-200 cursor-pointer rounded overflow-hidden shadow-xl relative"
      onClick={handlePackageClick}
    >
      {!isAdmin ? (
        <button
          onClick={handleBookmarkClick}
          className="absolute bg-white rounded-full w-8 h-8 flex items-center justify-center top-3 right-3 z-20 transition-all duration-300 hover:bg-gray-100"
        >
          {isBookmarked ? (
            <BsBookmarkFill className="w-5 h-5 cursor-pointer text-gray-700 transition duration-300" />
          ) : (
            <BsBookmark className="w-5 h-5 cursor-pointer text-gray-700 transition duration-300" />
          )}
        </button>
      ) : (
        <button
          className="absolute bg-white rounded-full w-8 h-8 flex items-center justify-center top-3 right-3 z-20 transition-all duration-300 hover:bg-gray-100"
          onClick={handleDeleteClick}
        >
          <FaRegTrashAlt className="text-red-600" />
        </button>
      )}
      <img
        class="w-full max-h-[200px] object-cover"
        src={`https://localhost:3001/uploads/${package_cover}`}
        // src={`https://www.nepaltripplanners.com/storage/packages/panoramic-himalayas/thumbs/thumb_1676020866main.jpg`}
        alt="Sunset in the mountains"
      />

      <div class="px-4 pt-3 pb-2">
        <div class="font-bold text-xl mb-1">{package_name}</div>
        <p class="text-gray-700">{package_description}</p>
      </div>

      <div class="px-4 pb-4 text-[15px]">
        <p class="text-gray-700">
          <strong>Time:</strong> {package_time}
        </p>
        <p class="text-gray-700">
          <strong>Price:</strong> {price}
        </p>
        <p class="text-gray-700">
          <strong>Location:</strong> {location}
        </p>
        <p class="text-gray-700">
          <strong>Remaining:</strong> {remaining}
        </p>
        <p class="text-gray-700">
          <strong>Route:</strong> {route}
        </p>
      </div>

      <button class="w-full bg-blue-500 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md">
        View Details
        <IoEnterSharp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TourPackage;
