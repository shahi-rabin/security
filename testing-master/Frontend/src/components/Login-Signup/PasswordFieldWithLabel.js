import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const PasswordFieldWithLabel = ({ label, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    onChange(e);
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-100">
      <label htmlFor="password" className="text-lg text-blue-600 font-bold">
        {label}
      </label>

      <div className="p-4 bg-white rounded-md flex items-center gap-2 border border-gray-300 transition-all duration-200 ease-linear">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder={placeholder}
          value={value}
          onChange={handlePasswordChange}
          className="flex-1 outline-none rounded-md font-semibold"
        />

        <div onClick={handleTogglePassword} className="cursor-pointer">
          {showPassword ? (
            <AiFillEye className="text-2xl text-gray-400" />
          ) : (
            <AiFillEyeInvisible className="text-2xl text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordFieldWithLabel;
