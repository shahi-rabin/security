import axios from "axios";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import TourPackage from "../Homepage/TourPackage";

const SearchBody = ({ userInfo, fetchUserInfo, handleBookClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchQuery.trim() === "") {
      // Empty search query, clear the results
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    axios
      .get(`https://localhost:3001/packages/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setSearchResults(response.data.data);
          setSearchPerformed(true);
        } else {
          setSearchResults([]);
          setSearchPerformed(true);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <form
      className="pt-5 pb-16 bg-gray-100 min-h-screen p-6 flex flex-col gap-8 md-2:mb-5"
      onSubmit={handleSearch}
    >
      <div className="bg-blue-100 flex items-center justify-between gap-2 px-4 py-2 rounded-full vsm:gap-4">
        <input
          type="text"
          placeholder="Search packages"
          className="w-full bg-blue-100 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className="focus:outline-none" onClick={handleSearch}>
          <FiSearch className="w-5 h-5" />
        </button>
      </div>

      {searchPerformed ? (
        searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="font-medium md-2:text-lg">No search results found.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 md:gap-8 2xl:grid-cols-3">
            {searchResults.map((trip_package, index) => (
              <TourPackage key={index} trip_package={trip_package} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="font-medium md-2:text-lg">
            Your <span className="text-purple-lighter">searches</span> will
            appear here.
          </p>
        </div>
      )}
    </form>
  );
};

export default SearchBody;
