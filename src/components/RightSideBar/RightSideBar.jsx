import React, { useContext, useEffect, useState } from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'
const RightSideBar = () => {
  const {chatUser, messages} = useContext(AppContext);
  const [msgImages, setmsgImages] = useState([]);

  useEffect(()=>{
    let temp = []
    messages.map((msg)=>{
      if(msg.image){
        temp.push(msg.image);
      }
    })
    setmsgImages(temp)
  },[messages])

  return  chatUser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 60000 ? <img src={assets.green_dot} className='dot'/> : null}</h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (<img onClick={()=>{window.open(url)}} key={index} src={url} alt="" />))}
        </div>
      </div>
      <button onClick={()=>{logout()}}>Logout</button>
    </div>
  ) : (
    <div className="rs">
      <button onClick={()=>{logout()}}>Logout</button>
    </div>
  )
}

export default RightSideBar