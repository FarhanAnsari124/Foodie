import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity,setState,setCurrentAddress } from "../redux/user.slice";
import { setAddress, setLocation } from "../redux/map.slice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=> state.user)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      dispatch(setLocation({lat:latitude,lon:longitude})) 
      const {data} =
        await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`);
        dispatch(setCity(data?.results[0]?.city))
        dispatch(setState(data?.results[0]?.state))
        dispatch(setCurrentAddress(`${data?.results[0]?.address_line1} ${data?.results[0]?.address_line2}`))
        console.log(data?.results[0])
        dispatch(setAddress(data?.results[0]?.address_line2));
    });
  }, [userData]); 
};

export default useGetCity;
