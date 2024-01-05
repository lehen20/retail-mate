import { useSelector } from "react-redux";
import {useEffect, useRef, useState} from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';

export default function Profile() {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const {currentUser} = useSelector(state => state.user)
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  // const [visible, setVisible] = useState(false);

  

  // const handleVisibility = () => {
  //   setVisible(true);
  //   setTimeout(() => { 
  //     setVisible(false);
  //   }, 1000);
  // };

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
    (error) => {
      setImageError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
        setFormData({...formData, profilePicture: downloadURL}));
    });

}
  return (
    <div className="p-3 max-w-lg mx-auto">
    <h1 className="text-3xl font-semibold text-center
    my-7">Profile</h1>
    <form className="flex flex-col gap-4"> 
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
        className="bg-slate-100 rounded-lg p-3"/>

      <input defaultValue= {currentUser.email} type = "email" id= 'email' 
        placeholder= 'Email' 
        className="bg-slate-100 rounded-lg p-3"/>

      <input type = "text" id= 'password' placeholder= 'Password' 
        className="bg-slate-100 rounded-lg p-3"/>

      <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"> UPDATE </button>
    </form>
    <div className="flex justify-between mt-5">
       <span className="text-red-700 cursor-pointer" > Delete account </span>
       <span className="text-red-700 cursor-pointer " > Sign out </span>
    </div>
    </div>

  );
}
