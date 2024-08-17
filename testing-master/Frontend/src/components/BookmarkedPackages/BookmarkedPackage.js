import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const BookmarkedPackage = ({ packageId }) => {
  const [tripPackage, setTripPackage] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user: currentUser, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setIsBookmarked(
        currentUser?.data[0].bookmarkedPackages.includes(packageId)
      );
    }
  }, [currentUser, packageId]);

  useEffect(() => {
    axios
      .get(`https://localhost:3001/packages/${packageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setTripPackage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [packageId]);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Handle case when the user is not logged in
        return;
      }

      if (isBookmarked) {
        // Remove bookmark
        await axios.delete(
          `https://localhost:3001/packages/bookmark/${packageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser((prevUser) => {
          const updatedBookmarkedBooks =
            prevUser?.data[0].bookmarkedPackages.filter(
              (packageid) => packageid !== packageId
            );
          return {
            ...prevUser,
            data: [
              {
                ...prevUser.data[0],
                bookmarkedPackages: updatedBookmarkedBooks,
              },
            ],
          };
        });
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await axios.post(
          `https://localhost:3001/packages/bookmark/${packageId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser((prevUser) => {
          const updatedBookmarkedBooks = [
            ...prevUser?.data[0].bookmarkedPackages,
            packageId,
          ];
          return {
            ...prevUser,
            data: [
              {
                ...prevUser.data[0],
                bookmarkedPackages: updatedBookmarkedBooks,
              },
            ],
          };
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  return (
    <div
      className="relative overflow-hidden bg-white p-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer"
      onClick={() => {
        localStorage.setItem(
          "selectedPackage",
          JSON.stringify(tripPackage?.data[0])
        );
        navigate("/details");
        console.log("tripPackage", tripPackage);
      }}
    >
      <button
        className="absolute top-2 right-2 bg-blue-300 rounded-full w-8 h-8 flex items-center justify-center"
        onClick={handleBookmarkClick}
      >
        {isBookmarked ? (
          <BsBookmarkFill className="w-4 h-4 text-gray-700" />
        ) : (
          <BsBookmark className="w-4 h-4 text-gray-700" />
        )}
      </button>

      <img
        src={
          tripPackage?.data &&
          tripPackage?.data[0] &&
          tripPackage?.data[0].package_cover
            ? `https://localhost:3001/uploads/${tripPackage?.data[0].package_cover}`
            : "https://cdn.vectorstock.com/i/preview-1x/82/99/no-image-available-like-missing-picture-vector-43938299.jpg"
        }
        alt=""
        className="rounded-lg w-full h-32 object-cover mb-4"
      />

      {tripPackage?.data && tripPackage?.data.length > 0 ? (
        <div>
          <p className="text-sm text-gray-700 font-medium mb-2">
            {tripPackage.data[0].destination_name}
          </p>

          <div className="text-[13px] flex flex-col gap-1 font-medium">
            <p className=" text-gray-600 leading-tight">
              {tripPackage.data[0].package_name}
            </p>
            <p className=" text-gray-600 leading-tight">
              {tripPackage.data[0].package_time}
            </p>
            <p className=" text-blue-600 leading-tight">
              Rs. {tripPackage.data[0].price}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-12 w-12 border-t-4 border-pale-green border-solid rounded-full animate-spin"></div>
      )}
    </div>
  );
};

export default BookmarkedPackage;
