import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverURl } from "../App";

const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=> state.user)
  useEffect(()=>{
    const updateLocation = async(lat,lon)=>{
        const result = await axios.post(`${serverURl}/api/user/update-location`,{
            lat
            ,lon
        },{withCredentials:true})
        console.log(result.data)
    }
    navigator.geolocation.watchPosition((pos)=>{
        let lat = pos.coords.latitude
        let lon = pos.coords.longitude
        updateLocation(lat,lon);
    })
  },[userData])
};

export default useUpdateLocation;