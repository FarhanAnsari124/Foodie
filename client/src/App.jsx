import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
export const serverURl = "http://localhost:8000"

const App = () => {
  const {loading}= useGetCurrentUser()
  useGetCity()
  const {userData} = useSelector(state=>state.user)
  if(loading){
    return <div className='min-h-screen flex justify-center items-center text-5xl text-[#ff4d2d]'>Loading...</div>
  }
  return (
    <Routes>
      <Route path='/signup' element={!userData ?<SignUp/>:<Navigate to={"/"}/>} />
      <Route path='/signin' element={!userData ?<SignIn/>:<Navigate to={"/"}/>} />
      <Route path='/forgot-password' element={!userData ?<ForgotPassword/>:<Navigate to={"/"}/>} />
      <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>}></Route>
      <Route path='/create-edit-shop' element={userData?<CreateEditShop/>:<Navigate to={'/signin'}/>}/>
      <Route path='/add-item' element={userData?<AddItem/>:<Navigate to={'/signin'}/>}/>
      <Route path='/edit-item/:itemId' element={userData?<EditItem/>:<Navigate to={'/signin'}/>}/>
    </Routes>
  )
}

export default App