import React, { useEffect, useState } from 'react'
import { serverURl } from '../App'
import axios from'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setitemsInMyCity} from '../redux/user.slice.js'
const useGetItemsByCity = () => {
    const dispatch = useDispatch()
    const {city} = useSelector(state => state.user)
  useEffect(()=>{
    const fetchItems = async () =>{
        try {
            const result = await axios.get(`${serverURl}/api/item/get-by-city/${city}`,{withCredentials:true})
            dispatch(setitemsInMyCity(result.data.data))
            console.log(result.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchItems()
  },[city])
}

export default useGetItemsByCity