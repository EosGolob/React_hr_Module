import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersService from "../services/UsersService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
// import '../auth/LoginPage.css';


function LoginPage() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const userDate = await UsersService.login(email, password)
         console.log(userDate)
         if (userDate.token) {
            localStorage.setItem('token', userDate.token)
            localStorage.setItem('role', userDate.role)
            navigate('/profile')
         } else {
            setError(userDate.message)
         }
      } catch (error) {
         console.log(error)
         setError(error.message)
         setTimeout(() => {
            setError('');
         }, 5000);
      }
   }

   return (
   
      <div className="auth-container">
         <h2>Login</h2>
         {error && <p className="error-message">{error}</p>}
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <label>Email: </label>
               <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
               <label>Password: </label>
               <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
         </form>
      </div>
   )
}
export default LoginPage;