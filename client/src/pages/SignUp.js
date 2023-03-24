import React, {useState, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {AiOutlineLoading3Quarters,AiFillCheckCircle } from 'react-icons/ai';
import {IoMdRadioButtonOff } from 'react-icons/io';
import { ApiContext, AlertContext } from "../context/Context";

function SignUp() {
  let navigate = useNavigate();
  const { apiBaseUrl } = useContext(ApiContext);
  const { setAlert } = useContext(AlertContext);

  const [ showLoading, setShowLoading ] = useState(false);
  const [ username, setUsername ] = useState(' ');
  const [ password, setPassword ] = useState(' ');
  const [ confirmPassword, setConfirmPassword ] = useState(' ');
  const [ notEqualPass, setNotEqualPass ] = useState(false);

  const [passContent] = useState([
    { title : 'Min8', condition_meet : false },
    { title : 'UppercaseAndLowercase', condition_meet : false },
    { title : 'NumAndLetter', condition_meet : false },
    { title : 'SpecialCharacter', condition_meet : false },
    { title : 'Whitespace', condition_meet : false },
  ]);

  const onPassContentChecker = (pass)=>{
    setPassword(pass);
    setNotEqualPass(false);

    // Start of Checking Password Content
    // Check if password have 8+ character
    if(pass.length > 7){
      passContent[0].condition_meet= true;
    }else{
      passContent[0].condition_meet= false;
    }

    // Password have atleast 1 Uppercase and 1 Lowercase
    var formatUppercase = /[A-Z]/;
    var formatLowercase = /[a-z]/;
    if (formatUppercase.test(pass) && formatLowercase.test(pass)){
      passContent[1].condition_meet= true;
    }else{
      passContent[1].condition_meet= false;
    }
    
    // Password have atleast number and letter
    var formatNumber = /\d/;
    var formatString = /\D/;
    if (formatNumber.test(pass) && formatString.test(pass) ){
      passContent[2].condition_meet= true;
    }else{
      passContent[2].condition_meet= false;
    }

    // Password have Special Characters
    var formatSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (formatSpecialChar.test(pass)){
      passContent[3].condition_meet= true;
    }else{
      passContent[3].condition_meet= false; 
    }

    // Password have no Whitespaces
    var formatNoWhitespace = /\s/;
    if (!formatNoWhitespace.test(pass)){
      passContent[4].condition_meet= true;
    }else{
      passContent[4].condition_meet= false; 
    }  

  }

  // Sign Up the User
  const onSignUp =()=>{

    // Checking all input if Valid
    let error_count =0;
    if(username.trim() === '') {
      setUsername('');
      error_count = 1;
    }

    // Check if all password content is valid
    for(let i=0; i < passContent.length ;i++){
      if(!passContent[i].condition_meet) {
        return alert("Password does not meet the requirements!");
      }
    }

    if(password.trim() === '') {
      setPassword('');
      error_count = 1;
    }
    if(confirmPassword.trim() === '') {
      setConfirmPassword('');
      error_count = 1;
    }  
    
    if(confirmPassword.trim() !== password) {
      setNotEqualPass(true);
      error_count = 1;
    }  

    if(error_count === 1) return;

    //
    setShowLoading(true);

    axios.post( apiBaseUrl +'/accounts/signup',
      { 'username': username, 'password' : password } 
    ).then(function (response) {
      if(response.data.error){
        setShowLoading(false);
        return setAlert({"action" : "error", "message": response.data.error});
      }

      setTimeout( function () {
        setShowLoading(false);
        alert("Sign Up Success! You will be redirected to the Home Page.")
        localStorage.setItem('username', username);
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/home');
      },1000);
    })
  }

  return (
    <div className="login-container">
        <div className="card" style={{padding:"50px 15px"}}>
            <div className="form" style={{height:"fit-content"}}>
              <div className="label-text"> Sign Up </div>
              <input type="text" placeholder="Enter username" onChange={(e)=> setUsername(e.target.value) } />
              { !username && <div className="error" style={{width:"335px"}}> Username is required! </div>}

              <input type="password" placeholder="Enter password" onChange={(e)=> { onPassContentChecker(e.target.value) } } />
              { !password && <div className="error" style={{width:"335px"}}> Password is required! </div>}

              <input type="password" placeholder="Enter confirm password" onChange={(e)=> {setConfirmPassword(e.target.value); setNotEqualPass(false) } } />
              { !confirmPassword && <div className="error" style={{width:"335px"}}> Confirm password is required! </div>}
              { notEqualPass && <div className="error" style={{width:"335px"}}> Password and Confirm password is not equal! </div>}
             
              <div  style={{width:"325px", marginTop:"10px"}}>
                <div> Password Content: </div>
                <div className="icon-password-container"> 
                  { passContent[0].condition_meet ? <AiFillCheckCircle className="icon-password-content" /> : <IoMdRadioButtonOff className="icon-password-content"/> } 
                  At least 8 characters 
                </div>

                <div className="icon-password-container"> 
                  { passContent[1].condition_meet ? <AiFillCheckCircle className="icon-password-content" /> : <IoMdRadioButtonOff className="icon-password-content"/> } 
                  Mixture of both uppercase and lowecase letter 
                </div>

                <div className="icon-password-container"> 
                  { passContent[2].condition_meet ? <AiFillCheckCircle className="icon-password-content" /> : <IoMdRadioButtonOff className="icon-password-content"/> } 
                  Mixture of letters and numbers 
                </div>

                <div className="icon-password-container"> 
                  { passContent[3].condition_meet ? <AiFillCheckCircle className="icon-password-content" /> : <IoMdRadioButtonOff className="icon-password-content"/> } 
                  Atleast have one special character, e.g., ! @ # ? ]
                </div>

                <div className="icon-password-container"> 
                  { passContent[4].condition_meet ? <AiFillCheckCircle className="icon-password-content" /> : <IoMdRadioButtonOff className="icon-password-content"/> } 
                  No whitespace
                </div>

              </div>
              <button type="submit" className="btn-signup" onClick={()=> onSignUp()} disabled={showLoading}> 
                { !showLoading ? 'SIGN UP' : <AiOutlineLoading3Quarters className="loading"/>} 
              </button>

              <div style={{marginTop:"30px"}}> Already have an Account? <Link to="/signin"> Sign In </Link> </div>
            </div>
        </div>
    </div>
  )
}

export default SignUp