import { useSelector } from "react-redux";
import {useEffect, useRef, useState} from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import {useDispatch} from 'react-redux';
import {updateUserStart, updateUserSuccess, updateUserFailure, 
deleteUserStart, deleteUserSuccess, deleteUserFailure} from "../redux/user/userSlice";
// import { current } from "@reduxjs/toolkit";

export default function Profile() {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const {currentUser, loading, error} = useSelector(state => state.user)
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if(image){
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage= getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setImagePercent(progress);
    },
    (err) => {
      setImageError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
        setFormData({...formData, profilePicture: downloadURL}));
    });

};

const handleChange = (e) => {
  setFormData({...formData, [e.target.id]: e.target.value});
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(updateUserStart()); 
    const res = await fetch(`api/user/update/${currentUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success === false) {
      dispatch(updateUserFailure(data));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true); 

  }catch (error){
    dispatch(updateUserFailure(error));
  }
};

const handleDeleteAccount = async () => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data));
      return;
    }
    dispatch(deleteUserSuccess(data));

  } catch (error) {
    dispatch(deleteUserFailure(error));
  }

  }

  return (
    <div className="p-3 max-w-lg mx-auto">
    <h1 className="text-3xl font-semibold text-center
    my-7">Profile</h1>
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}> 
       <input type= "file" ref= {fileRef} hidden accept = "image/*'"
        onChange={(e)=> setImage(e.target.files[0])}/> 

      <img src= {formData.profilePicture || currentUser.profilePicture} alt= "profile"
        className="h-24 w-24 self-center cursor-pointer mt-2 rounded-full object-cover"
        onClick = {() => fileRef.current.click()}/>

      <p className="text-small self-center"> 
        {imageError ? (
          <span className="text-red-700"> Error uploading image </span>
        ) : imagePercent > 0 && imagePercent < 100 ? (
          <span className="text-blue-500"> Uploading: {imagePercent}% </span>) : 
          imagePercent === 100 ? ( 
            <span className="text-green-500"> Uploaded image </span>) : ''}
      </p>

      <input defaultValue={currentUser.username} type = "text" id= 'username' placeholder= 'Username' 
        className="bg-slate-100 rounded-lg p-3"
        onChange={handleChange}/>

      <input defaultValue= {currentUser.email} type = "email" id= 'email' 
        placeholder= 'Email' 
        className="bg-slate-100 rounded-lg p-3"
        onChange={handleChange}/>

      <input type = "text" id= 'password' placeholder= 'Password' 
        className="bg-slate-100 rounded-lg p-3"
        onChange={handleChange}/>

      <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"> 
      {loading ? 'Loading...' : 'Update'} </button>
    </form>
    <div className="flex justify-between mt-5">
       <span onClick= {handleDeleteAccount} className="text-red-700 cursor-pointer" > Delete account </span>
       <span className="text-red-700 cursor-pointer " > Sign out </span>
    </div>
    <p className = 'text-red-700 mt-5'> {error && 'Something went wrong'} </p>
    <p className = 'text-green-700 mt-5'> {updateSuccess && 'User updated successfully! '} </p>
    
    </div>

  ); }
