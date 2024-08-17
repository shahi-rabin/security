import React, { useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { UserContext } from "./context/UserContext";
import MainPage from "./pages/MainPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  const { user, isLoading } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <SigninPage />}
        />
        <Route path="/*" element={<MainPage />} />
        <Route
          path="/signin"
          element={user ? <Navigate to="/home" /> : <SigninPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/home" /> : <SignupPage />}
        />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
