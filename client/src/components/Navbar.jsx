import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);

  const handleLogout = async (req, res)=>{
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        toast.success(data.message);
        setUserData(null);
        setIsLoggedIn(false);
        navigate("/");
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const sendVerificationOtp = async (req, res)=>{
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp", {example:"this is example"});
      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex w-full justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute top-0 right-0 hidden group-hover:block z-10 text-black rounded pt-10 ">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {userData.isVerified ? "" : <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li>}
              
              <li onClick={handleLogout} className="py-1 px-2 pr-10 hover:bg-gray-200 cursor-pointer">Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
