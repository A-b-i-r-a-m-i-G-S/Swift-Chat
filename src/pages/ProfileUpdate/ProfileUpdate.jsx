import React, { useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'

const ProfileUpdate = () => {
  const [image, setImage] = useState(false);

  return (
    <div className="profile">
      <div className="profile-container">
        <form >
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input type="file" id='avatar'accept='.png, .jpg, .jpeg' hidden onChange={(e) => setImage(e.target.files[0])}/>
            <img src={image === false ? assets.avatar_icon : URL.createObjectURL(image)} alt="" />
            upload profile picture
          </label>

          <input type="text" placeholder='Name' required/>
          <textarea placeholder='Profile Bio'></textarea>
          <button type='submit'>Save</button>
        </form>

        <img className='profile-pic' src={image === false ? assets.logo_icon : URL.createObjectURL(image)} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate