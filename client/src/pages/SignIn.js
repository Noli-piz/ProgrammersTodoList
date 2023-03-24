import React, {useEffect, useState, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {AiOutlineLoading3Quarters } from 'react-icons/ai';
import { ApiContext,AlertContext } from "../context/Context";


function SignIn() {
  let navigate = useNavigate();
  const { apiBaseUrl } = useContext(ApiContext);
  const { setAlert } = useContext(AlertContext);

  const [ showLoading, setShowLoading ] = useState(false);
  const [ username, setUsername ] = useState(' ');
  const [ password, setPassword ] = useState(' ');

  useEffect(()=>{
    // Check if Username exist - Then intialized if true
    let localUsername = localStorage.getItem('username');
    if(localUsername)
      setUsername(localUsername);

    // Check if Username and Token is saved - Then it will redirected to Home Page if true
    var accessToken = localStorage.getItem('accessToken');
    if(accessToken && localUsername) {
      setAlert({"action" : "info", "message": "Welcome back! " + localUsername});
      navigate('/home');
    }
  },[])

  // Sign In the User
  const onSignIn =()=>{

    // Check if Valid Input
    let error_count =0;
    if(username.trim() === '') {
      setUsername('');
      error_count = 1;
    }
    if(password.trim() === '') {
      setPassword('');
      error_count = 1;
    }

    if(error_count === 1) return;

    //
    setShowLoading(true);

    axios.get( apiBaseUrl + '/accounts/signin',
      { params : { 'username': username, 'password' : password }} 
    ).then(function (response) {
      if(response.data.error){
        setShowLoading(false);
        return setAlert({"action" : "error", "message": response.data.error});
      }

      setTimeout( function () {
        setShowLoading(false);
        setAlert({"action" : "success", "message": "Sign in success!"});
        localStorage.setItem('username', username);
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/home');
      },1000);
    })
  }

  return (
    <div className="login-container">
        <div className="card" >
            <div className="form">
              <div className="greet-text"> Welcome to Programmer's Todo List </div>
              <div className="label-text"> Sign In </div>
              <input type="text" value={username} placeholder="Enter username" onChange={(e)=> setUsername(e.target.value) } required/>
              { !username && <div className="error" style={{width:"335px"}}> Please enter username! </div>}

              <input type="password" placeholder="Enter password" onChange={(e)=> setPassword(e.target.value) } required/>
              { !password && <div className="error" style={{width:"335px"}}> Please enter password! </div>}

              <button type="submit" className="btn-signin" onClick={()=> onSignIn()} disabled={showLoading}> 
                { !showLoading ? 'SIGN IN' : <AiOutlineLoading3Quarters className="loading"/>} 
              </button>
              <div style={{marginTop:"30px"}}> Don't have an Account? <Link to="/signup"> Sign Up </Link> </div>
            </div>
        </div>
    </div>
  )
}

export default SignIn