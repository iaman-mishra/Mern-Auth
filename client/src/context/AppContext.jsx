import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthStatus = async ()=>{
        try {
            axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
            const {data} =await axios.post(backendUrl + "/api/auth/is-auth", {example:"body data example"})
            if(data.success){
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }   

    useEffect(()=>{
        getAuthStatus();
    },[]);

    const getUserData = async ()=>{
        try {
            axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
            const {data} =await axios.post(backendUrl + "/api/user/data", {example:"body"})
            if (data.success) {
                setUserData(data.userData);
            }else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const value = {
        backendUrl,
        isLoggedIn,setIsLoggedIn,
        userData, setUserData,
        getUserData
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}