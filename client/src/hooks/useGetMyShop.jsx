import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import axios from'axios'
import { useDispatch } from 'react-redux'
import { setMyShopData } from '../redux/owner.slice.js'
const useGetMyShop = () => {
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(true)
  useEffect(()=>{
    const fetchShop = async () =>{
        try {
            const result = await axios.get(`${serverUrl}/api/shop/get-my`,{withCredentials:true})
            dispatch(setMyShopData(result.data.data))

        } catch (error) {
            console.log(error)
            dispatch(setMyShopData(null))
        } finally {
        setLoading(false)
      }
    }
    fetchShop()
  },[dispatch])
  return {loading}
}

export default useGetMyShop