import React, { useEffect, useState } from 'react'
import { serverURl } from '../App'
import axios from'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity, setUserData } from '../redux/user.slice'
const useGetShopByCity = () => {
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(true)
    const {city} = useSelector(state => state.user)
  useEffect(()=>{
    const fetchShops = async () =>{
        try {
            const result = await axios.get(`${serverURl}/api/shop/get-by-city/${city}`,{withCredentials:true})
            dispatch(setShopsInMyCity(result.data.data))
            console.log(result.data.data)
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        } finally {
        setLoading(false)
      }
    }
    fetchShops()
  },[city])
  return {loading}
}

export default useGetShopByCity
