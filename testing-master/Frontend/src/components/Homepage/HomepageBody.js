import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { IoPricetag, IoTime } from "react-icons/io5";
import { UserContext } from "../../context/UserContext";
import TourPackage from "./TourPackage";

const HomepageBody = ({ userInfo, fetchUserInfo }) => {
  const { user } = useContext(UserContext);
  const [originalPackages, setOriginalPackages] = useState([]);
  const [tourPackages, setTourPackages] = useState([]);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    axios
      .get("https://localhost:3001/packages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setOriginalPackages(response.data.data);
        setTourPackages(response.data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (sortBy === "price") {
      const sortedPackages = [...tourPackages].sort(
        (a, b) => a.price - b.price
      );
      setTourPackages(sortedPackages);
    } else {
      setTourPackages(originalPackages);
    }
  }, [sortBy, originalPackages, tourPackages]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 mb-16 flex flex-col gap-6 md:mb-5">
      <div className="flex items-center gap-2 font-medium vsm:gap-4">
        <button
          className={`text-sm flex items-center gap-1 bg-gray-100 border border-gray-400 text-gray-700 px-2 py-1.5 rounded-md vsm:px-3 vsm:text-base ${
            sortBy === "recent" ? "bg-gray-300" : ""
          }`}
          onClick={() => setSortBy("recent")}
        >
          <IoTime className="w-4 h-4 vsm:w-5 vsm:h-5" />
          Recently Added
        </button>

        <button
          className={`text-sm flex items-center gap-1 bg-gray-100 border border-gray-400 text-gray-700 px-2 py-1.5 rounded-md vsm:px-3 vsm:text-base ${
            sortBy === "price" ? "bg-gray-300" : ""
          }`}
          onClick={() => setSortBy("price")}
        >
          <IoPricetag className="w-4 h-4 vsm:w-5 vsm:h-5" />
          Filter by Price
        </button>
      </div>

      <div className="grid gap-6 items-start md:grid-cols-2 md:gap-8 2xl:grid-cols-3 lg:gap-x-10">
        {tourPackages.length === 0 ? (
          <div>
            <p className="font-medium">
              No <span className="text-purple-lighter">tourPackages</span>{" "}
              available. Please check back later.
            </p>
          </div>
        ) : (
          tourPackages.map((trip_package, index) => (
            <TourPackage
              key={index}
              trip_package={trip_package}
              userInfo={userInfo}
              fetchUserInfo={fetchUserInfo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomepageBody;
