import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import axios from'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/user.slice'
const useGetCurrentUser = () => {
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(true)
  useEffect(()=>{
    const fetchUser = async () =>{
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            dispatch(setUserData(result.data.data))

        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        } finally {
        setLoading(false)
      }
    }
    fetchUser()
  },[dispatch])
  return {loading}
}

export default useGetCurrentUser
