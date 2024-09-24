import React, { useState, useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UsersService from "../services/UsersService";
import { AuthContext } from "../auth/AuthContext";
import img from '../img/logo-login.png';
import bgImage from '../img/bg.jpg';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userData = await UsersService.login(email, password);
  
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('name', userData.name);
        localStorage.setItem('process', userData.process);
        login(userData.token, userData.role, userData.name, userData.process);
        navigate('/profile');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('process');
        setError(userData.message || 'Incorrect Id And Password');
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('process');
      console.log(error);
      setError(error.message || 'An error occurred');
    }
  };
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const name = localStorage.getItem('name');
      const process = localStorage.getItem('process');
      if (token && role && name && process) {
        try {
        
          await UsersService.validateToken(token);
          login(token, role, name);
          navigate('/profile');
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('name');
          localStorage.removeItem('process');
          setError(userData.message);
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate, login]);
  return (

    <>
      <div className="row align-items-center justify-content-center height-100vh"style={{ backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <div className="col-xl-3 text-center">
      <img src={img} alt="" width="180"/>
      {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>     
            <div className="mt-80px">
              <input type="text" class="form-control" id="user" placeholder="User ID" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mt-35px">
              <input type="password" class="form-control" id="user" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mt-35px">
              <button className="btn btn-danger" type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
