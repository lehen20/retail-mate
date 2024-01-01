// import React from 'react'
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state)=> state.user);
  const navigate= useNavigate();
  const dispatch= useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin',{
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
      },
        body: JSON.stringify(formData),

      });
      const data = await res.json();
      // const error=data.error;
      if(data.success === false){
        console.log(data.error);
        dispatch(signInFailure(data.error));
        return;}
      dispatch(signInSuccess(data));
      navigate('/');
    } catch(error){
      dispatch(signInFailure(error));
    }
    // } catch(error){
    //   setLoading(false)
    //   setError(true)
  };
  return(
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className= 'text-3xl text-center font-semibold my-7'> 
      Sign In </h1>
      <form onSubmit= {handleSubmit} className='flex flex-col gap-4'> 
        <input 
        type= "text" 
        placeholder='Email'
        id= 'email' 
        className='bg-slate-100 p-3 rounded-lg'
        onChange={handleChange} 
        />
        <input type= "password" 
        placeholder='Password'
        id= 'password' 
        className='bg-slate-100 p-3 rounded-lg'
        onChange={handleChange} 
        />
        <button disabled= {loading}
        className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'> 
        {loading ? 'Loading...' : 'Sign In'} </button>
      </form>
      <div className='flex gap-3 mt-5'> 
        <p> Dont have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-500'> Sign Up </span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'> 
        {error ? error || 'Something went wrong' : ""}
        {/* {error && 'Something is wrong'} */}
      </p>
    </div>
  );
    
}

