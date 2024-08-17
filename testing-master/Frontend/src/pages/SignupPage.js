import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordFieldWithLabel from "../components/Login-Signup/PasswordFieldWithLabel";
import TextFieldWithLabel from "../components/Login-Signup/TextFieldWithLabel";
import PrimaryButton from "../components/common/PrimaryButton";
import { UserContext } from "../context/UserContext";
import zxcvbn from "zxcvbn";

const SignupPage = () => {
  const { isLoading, setIsLoading } = useContext(UserContext);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSignup = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const passwordScore = zxcvbn(password);
    setPasswordStrength(passwordScore.score);

    try {
      const response = await axios.post(
        "https://localhost:3001/users/register",
        {
          fullname,
          username,
          email,
          password,
        }
      );

      setFullname("");
      setUsername("");
      setEmail("");
      setPassword("");

      toast.success(response.data.message);
      setIsLoading(false);

      // Redirect to the signin page after successful signup
      window.location.href = "/signin";
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Moderate";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const handlePasswordChange = (e) => {
    // Update password state
    setPassword(e.target.value);

    // Assess password strength on each input change
    const passwordScore = zxcvbn(e.target.value);
    setPasswordStrength(passwordScore.score);
  };

  return (
    <div className="bg-container min-h-[100vh] flex bg-gray-100">
      <ToastContainer position="top-center" />
      <div className="w-full flex flex-col items-center sm:flex-row-reverse sm:items-start">
        <div className="h-full relative hidden lg:block lg:flex-1">
          <img
            src="https://thumbs.dreamstime.com/b/concept-planning-vacation-studying-languages-colorful-travel-vector-flat-banner-your-business-websites-etc-flat-design-68727242.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative w-full h-full px-4 py-8 flex flex-col items-start justify-center gap-16 lg:flex-1">
          <div className="w-full flex flex-col gap-8">
            <div>
              <h1 className="text-blue-800 text-4xl">Sign Up</h1>
            </div>

            <form className="flex flex-col gap-4">
              <TextFieldWithLabel
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />

              <TextFieldWithLabel
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextFieldWithLabel
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordFieldWithLabel
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
              />

              {password && (
                <div className="text-sm text-gray-500">
                  Strength:{" "}
                  <span className="font-medium">
                    {getPasswordStrengthLabel(passwordStrength)}
                  </span>
                </div>
              )}

              <PrimaryButton
                btnLabel="Sign Up"
                isLoading={isLoading}
                onClick={handleSignup}
              />
            </form>

            <div className="hidden sm:flex flex-col items-center gap-1 lg:flex-row lg:gap-2 2xl:mt-[10%]">
              <p className="font-medium">Already registered?</p>
              <Link to="/signin" className="font-bold text-blue-800">
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
