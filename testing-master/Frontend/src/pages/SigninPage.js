import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordFieldWithLabel from "../components/Login-Signup/PasswordFieldWithLabel";
import TextFieldWithLabel from "../components/Login-Signup/TextFieldWithLabel";
import PrimaryButton from "../components/common/PrimaryButton";
import { UserContext } from "../context/UserContext";
import { FaUser } from "react-icons/fa";

const SigninPage = () => {
  const { user, setUser, isLoading, setIsLoading } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignin = (e) => {
    e.preventDefault();

    setIsLoading(true);

    axios
      .post("https://localhost:3001/users/login", { username, password })
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        const user = response.data.user;
        setUser(user);
        setIsLoading(false);
        window.location.href = "/";
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "An error occurred");
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-container min-h-[100vh] flex bg-gray-100">
      <ToastContainer position="top-center" />
      <div className="w-full flex flex-col items-center sm:flex-row-reverse">
        <div className="min-h-screen relative hidden lg:block lg:flex-1">
          <img
            src="https://thumbs.dreamstime.com/b/concept-planning-vacation-studying-languages-colorful-travel-vector-flat-banner-your-business-websites-etc-flat-design-68727242.jpg"
            alt=""
            className="w-full min-h-screen object-cover"
          />
        </div>
        <div className="relative w-full h-full px-4 py-8 flex flex-col items-start justify-center gap-16 lg:flex-1">
          <div className="w-full flex flex-col gap-8">
            <div>
              <h1 className="text-blue-800 text-4xl">Sign In</h1>
            </div>

            <form className="flex flex-col gap-4">
              <TextFieldWithLabel
                label="Username"
                type="username"
                placeholder="Enter your username"
                onChange={handleUsernameChange}
              />

              <PasswordFieldWithLabel
                label="Password"
                placeholder="Enter your password"
                onChange={handlePasswordChange}
              />

              <PrimaryButton
                btnLabel="Sign In"
                onClick={handleSignin}
                isLoading={isLoading}
              />

              <div className="hidden sm:flex flex-col items-center gap-1 lg:flex-row lg:gap-2">
                <p className="font-medium">Forgot Password?</p>
                <Link to="/forgotPassword" className="font-bold text-blue-800">
                  Recover Password
                </Link>
              </div>
            </form>

            <div className="flex flex-col gap-4">
              <div className="hidden sm:flex flex-col items-center gap-1 lg:flex-row lg:gap-2 2xl:mt-8">
                <p className="font-medium">You don’t have an account?</p>
                <Link to="/signup" className="font-bold text-blue-800">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
