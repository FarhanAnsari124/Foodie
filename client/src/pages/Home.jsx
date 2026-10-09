import React from 'react'
import { useSelector } from 'react-redux'
import DeliveryBoy from '../components/DeliveryBoy'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'

const Home = () => {
    const {userData} = useSelector(state => state.user)
  return (
    <div className='w-screen min-h-screen pt-25 flex flex-col items-center bg-[#fff9f9]'>
      
      {userData.role =="User" && <UserDashboard/>}
      {userData.role =="Owner" && <OwnerDashboard/>}
      {userData.role =="Delivery Boy" && <DeliveryBoy/>}
    </div>
  )
}

export default Home
