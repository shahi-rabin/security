import React, { useState } from "react";
import Button from "./Button";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import UserInfo from "./UserInfo";

const ProfileBody = ({ userInfo, fetchUserInfo }) => {
  const [activeButton, setActiveButton] = useState("Edit Profile");

  const handleButtonClick = (btnName) => {
    setActiveButton(btnName);
  };

  const formComponent =
    activeButton === "Edit Profile" ? (
      <EditProfile />
    ) : activeButton === "Change Password" ? (
      <ChangePassword />
    ) : null;

  return (
    <div className="p-6 bg-gray-100 min-h-screen pb-16 flex flex-col gap-8">
      <UserInfo />

      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-wrap gap-2 vsm:gap-4">
          <Button
            btnName="Edit Profile"
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
          />
          <Button
            btnName="Change Password"
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
          />
        </div>

        {formComponent}
      </div>
    </div>
  );
};

export default ProfileBody;
