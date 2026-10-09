import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "../redux/user.slice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=> state.user)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      const {data} =
        await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`);
        dispatch(setCity(data?.results[0]?.city))
    });
  }, [userData]); 
};

export default useGetCity;
