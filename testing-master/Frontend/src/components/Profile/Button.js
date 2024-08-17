const Button = ({ btnName, activeButton, handleButtonClick }) => {
  return (
    <button
      className={`${
        activeButton === btnName
          ? "text-black bg-blue-300"
          : "bg-none"
      } font-semibold text-sm px-4 py-2 rounded-[5px] vsm:px-6 vsm:text-base vsm:min-w-[150px]`}
      onClick={() => handleButtonClick(btnName)}
    >
      {btnName}
    </button>
  );
};

export default Button;
