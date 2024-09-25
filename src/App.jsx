import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import Home from './pages/Home/Home'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/chat' element={<Chat/>}></Route>
      <Route path='/profile' element={<ProfileUpdate/>}></Route>
    </Routes>
  )
}

export default App