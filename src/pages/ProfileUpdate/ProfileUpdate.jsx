import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");

  const {setUserData} = useContext(AppContext);

  const profileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Please upload a profile image");
        return; 
      }
  
      const docRef = doc(db, 'users', uid);
  
      if (image) {
        const imageURL = await upload(image);
        setPrevImage(imageURL);
        await updateDoc(docRef, {
          avatar: imageURL,
          bio: bio,
          name: name
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name
        });
      }

      const snap = await getDoc(docRef);
      setUserData(snap.data());
  
      toast.success("Profile updated successfully!");

      navigate('/chat')
  
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please try again.");
    }
  };
  

  const navigate = useNavigate();

  useEffect(()=>{
    onAuthStateChanged(auth, async (user) =>{
      if(user){
        setUid(user.uid);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.data().name){
          setName(docSnap.data().name)
        }
        if(docSnap.data().bio){
          setBio(docSnap.data().bio)
        }
        if(docSnap.data().avatar){
          setPrevImage(docSnap.data().avatar)
        }
      }
      else{
        navigate('/')
      }
    })
  },[])

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input type="file" id='avatar'accept='.png, .jpg, .jpeg' hidden onChange={(e) => setImage(e.target.files[0])}/>
            <img src={image === false ? prevImage ? prevImage :  assets.avatar_icon : URL.createObjectURL(image)} alt="" />
            upload profile picture
          </label>

          <input type="text" placeholder='Name' onChange={(e)=> setName(e.target.value)} value={name} required/>
          <textarea placeholder='Profile Bio' onChange={(e)=>setBio(e.target.value)} value={bio}></textarea>
          <button type='submit'>Save</button>
        </form>

        <img className='profile-pic' src={image === false ? prevImage ? prevImage :  assets.avatar_icon : URL.createObjectURL(image)} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate