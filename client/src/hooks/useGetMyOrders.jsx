import React, { useEffect, useState } from 'react'
import { serverURl } from '../App'
import axios from'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders } from '../redux/user.slice.js'
const useGetMyOrders = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state => state.user)
  useEffect(()=>{
    const fetchOrders = async () =>{
        try {
            const {data} = await axios.get(`${serverURl}/api/order/my-orders`,{withCredentials:true})
            console.log(
					"First order item:",
					data.data?.[0]?.shopOrders?.[0]?.shopOrderItems?.[0],
				);
            dispatch(setMyOrders(data.data))
            console.log(data.data)
        } catch (error) {
            console.log(error)
            dispatch(setMyOrders(null))
        }
    }
    fetchOrders()
  },[userData])
}

export default useGetMyOrders