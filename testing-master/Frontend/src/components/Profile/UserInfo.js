import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

const UserInfo = () => {
  const { user, setUser } = useContext(UserContext);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [error, setError] = useState(null); // AddedState variable to store the total number of books
  const fileInputRef = useRef(null);

  const handleProfilePictureChange = async (e) => {
    const newProfilePicture = e.target.files[0];

    if (!newProfilePicture) {
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", newProfilePicture);

    try {
      const response = await axios.post(
        "https://localhost:3001/users/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { data } = response.data;

      // Update the user's profile picture in the user context
      setUser((prevUser) => ({
        ...prevUser,
        image: data,
      }));

      setIsImageUploaded(true);

      window.location.reload();
    } catch (error) {
      console.log(error);
      setError("Failed to upload profile picture."); // Set the error message in case of an error
    }
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    // Clear the user authentication token from local storage
    localStorage.removeItem("token");

    // Navigate the user to the login page
    window.location.href = "/signin";
  };

  console.log(user);

  return (
    <div className="w-full text-black flex flex-col items-center text-center gap-4 md:flex-row md:justify-between">
      <div className=" flex flex-col items-center text-center gap-4 md:flex-row">
        <div className="relative w-fit">
          <img
            src={
              user?.data[0].image
                ? `https://localhost:3001/uploads/${user?.data[0]?.image}`
                : "https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg"
            }
            alt=""
            className="w-[100px] h-[100px] rounded-full object-fill"
          />

          <div
            className="absolute flex items-center justify-center cursor-pointer right-0 bottom-0 text-black bg-purple-lighter hover:bg-purple-lighter-hover w-8 h-8 rounded-full hover:bg-purple hover:text-black-75 transition duration-200"
            onClick={openFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleProfilePictureChange}
              className="invisible relative z-40 w-full h-full"
            />

            <button className="absolute w-8 h-8 flex items-center justify-center rounded-full bg-white ">
              <FaEdit className=" text-blue-700" />
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <div className="flex flex-col text-start gap-2">
          <p className="text-xl font-semibold">
            {user?.data[0].fullname}{" "}
            {user?.data[0].userType === "admin" && "(Admin)"}
          </p>
          <p className="text-sm font-light">{user?.data[0].email}</p>
          <p className="text-sm font-light">{user?.data[0].bio}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          className="self-center bg-blue-500 text-white flex items-center gap-1.5 px-4 py-1.5 border border-gray-500 transition duration-200 ease-linear hover:bg-purple-lighter-hover hover:text-black md-2:self-start"
          onClick={handleLogout}
        >
          <p className="font-semibold">Log Out</p>
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
