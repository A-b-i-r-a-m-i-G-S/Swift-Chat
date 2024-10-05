import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signUp, signIn } from '../../config/firebase'

const Login = () => {
  const [login, setLogin] = useState(false);
  
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (e)=>{
    e.preventDefault();
    if(login === false) signUp(userName, email, password);
    else signIn(email, password);
  }

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className='logo'/>
      <form onSubmit={onSubmitHandler} action="" className="login-form">
        <h2>{login === false ? "Sign Up" : "Login"}</h2>
        <input type="text" placeholder='username' className="form-input" required onChange={(e) => {setUserName(e.target.value)}} value={userName} />
        {login === false ? <input type="email" placeholder='email' className="form-input" required onChange={(e) => {setEmail(e.target.value)}} value={email}/> : <></>}        
        <input type="password" placeholder='password' className="form-input" required onChange={(e) => {setPassword(e.target.value)}} value={password}/>
        <button type='submit'>{login === false ? "Sign Up" : "Login"}</button>

        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          <p className="login-toggle">{login === false ? "Already have an account" : "Create an account"} <span onClick={()=>setLogin(!login)}>{login===false ? "Login here" : "Register here"}</span></p>
        </div>
      </form>
    </div>
  )
}

export default Login