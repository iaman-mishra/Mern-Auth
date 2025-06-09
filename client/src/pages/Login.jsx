import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [islogin, SetisLogin] = useState(false);
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const { backendUrl, isLoggedIn, setIsLoggedIn,getUserData } = useContext(AppContext);

  const navigate = useNavigate();

  const onsubmitHandler = async (e) =>{
    e.preventDefault();
    axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
    try {
      
      if (islogin) {
        // Login case
        const {data} = await axios.post(backendUrl + "/api/auth/login", {email: Email, password: Password});
        if (data.success) {
          getUserData();
          toast.success(data.message);
          setIsLoggedIn(true);
          navigate("/");
        }else{
          toast.error(data.message);
        }
      } else {
        // Register case
        const {data} = await axios.post(backendUrl + "/api/auth/register", {name: Name, email: Email, password: Password});
        if (data.success) {
          getUserData();
          toast.success(data.message);
          setIsLoggedIn(true);
          navigate("/");
        }else{
          toast.error(data.message);
        }
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to to-purple-400">
      <img src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" onClick={() => navigate("/")} />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">{islogin === true ? "Login" : "Create account"}</h2>
        <p className="text-center text-sm mb-6 ">{islogin === true ? "Login to your account" : "Create your account"}</p>
        <form onSubmit={onsubmitHandler}>
          {islogin === false && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name"
                value={Name}
                required
                className="bg-transparent outline-none"
                onChange={(e) => SetName(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email Id"
              value={Email}
              required
              className="bg-transparent outline-none"
              onChange={(e) => SetEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              value={Password}
              className="bg-transparent outline-none"
              onChange={(e) => SetPassword(e.target.value)}
            />
          </div>
          <p className="mb-4 text-indigo-500 cursor-pointer" onClick={() => navigate("/reset-password")}>
            Forgot password
          </p>
          <button type="submit" className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {islogin === true ? "Login" : "Sign Up"}
          </button>
        </form>
        {islogin === false && (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span className="text-blue-400 cursor-pointer underline" onClick={() => SetisLogin(!islogin)}>
              Login here
            </span>
          </p>
        )}
        {islogin === true && (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span className="text-blue-400 cursor-pointer underline" onClick={() => SetisLogin(!islogin)}>
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
