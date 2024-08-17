import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import BookmarkedPackage from "./BookmarkedPackage";

const BookmarkedPackages = () => {
  const { user: currentUser } = useContext(UserContext);
  const bookmarkedPackages = currentUser?.data[0].bookmarkedPackages || [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-4">
      <h1 className="text-blue-600 text-3xl">Bookmarked Packages</h1>

      {bookmarkedPackages.length === 0 ? (
        <p className="font-medium text-center md-2:text-lg">
          No Bookmarked Packages{" "}
          <span className="text-purple-lighter">yet</span>.
        </p>
      ) : (
        <div className="grid items-stretch grid-cols-2 gap-6 vsm:grid-cols-3 sm:grid-cols-4 md-2:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {currentUser?.data[0].bookmarkedPackages.map((packageId) => (
            <BookmarkedPackage key={packageId} packageId={packageId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedPackages;
