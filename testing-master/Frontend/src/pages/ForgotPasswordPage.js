import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordFieldWithLabel from "../components/Login-Signup/PasswordFieldWithLabel";
import TextFieldWithLabel from "../components/Login-Signup/TextFieldWithLabel";
import PrimaryButton from "../components/common/PrimaryButton";
import { HiKey, HiMail } from "react-icons/hi";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [password, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handleSendToken = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://localhost:3001/users/password-recovery/request-password-reset",
        { email }
      );

      toast.success("Token sent successfully!");
      setToken("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send token");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckToken = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `https://localhost:3001/users/password-recovery/reset-password/${token}`,
        { password, token }
      );

      toast.success("Password recovery successful!");

      window.location.href = "/signin";
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to recover password");
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-blue-800 text-4xl">Forgot Password</h1>
              <p className="text-gray-600">
                Enter your email below, and you will receive instructions on how
                to reset your password.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <TextFieldWithLabel
                label="Email"
                type="email"
                placeholder="Enter your email"
                icon={HiMail}
                value={email}
                onChange={handleEmailChange}
              />

              {token === null ? (
                <PrimaryButton
                  btnLabel="Send Token"
                  onClick={handleSendToken}
                  isLoading={loading}
                />
              ) : (
                <>
                  <TextFieldWithLabel
                    label="Token"
                    type="text"
                    placeholder="Enter the token from your email"
                    icon={HiKey}
                    value={token}
                    onChange={handleTokenChange}
                  />

                  <PasswordFieldWithLabel
                    label="New Password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={handleNewPasswordChange}
                  />

                  <PrimaryButton
                    btnLabel="Recover Password"
                    onClick={handleCheckToken}
                    isLoading={loading}
                  />
                </>
              )}
            </div>

            <div className="hidden sm:flex flex-col items-center gap-1 lg:flex-row lg:gap-2 2xl:mt-8">
              <p className="font-medium">Remember your password?</p>
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

export default ForgotPasswordPage;
