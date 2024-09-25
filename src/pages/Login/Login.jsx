import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'

const Login = () => {
  const [login, setLogin] = useState(false);
  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className='logo'/>
      <form action="" className="login-form">
        <h2>{login === false ? "Sign Up" : "Login"}</h2>
        <input type="text" placeholder='username' className="form-input" required />
        {login === false ? <input type="email" placeholder='email' className="form-input" required /> : <></>}        
        <input type="password" placeholder='password' className="form-input" required />
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