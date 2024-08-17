import React, { useState } from "react";

const TextFieldWithLabel = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  className,
}) => {
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.trim() === "") {
      setError("Please fill out this field");
    } else {
      setError("");
    }

    onChange(e);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <label htmlFor={label} className="text-lg text-blue-600 font-bold">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          id={label}
          placeholder={placeholder}
          value={value}i
          onChange={handleInputChange}
          className="w-full p-4 outline-none border border-gray-300 focus:border-blue-500 font-semibold rounded-md transition-all duration-300 ease-in-out"
        />
      </div>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default TextFieldWithLabel;
