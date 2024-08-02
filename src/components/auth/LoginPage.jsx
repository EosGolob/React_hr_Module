import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UsersService from "../services/UsersService";
import { AuthContext } from "../auth/AuthContext";
// import '../css/bootstrap.min.css';
// import '../css/layout.css';
// import '../css/style.css';
// import '../css/login.css';
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
      console.log("login page user data",userData);

      if (userData.token) {
        login(userData.token, userData.role ,userData.name);
        navigate('/profile');
      } else {
        setError(userData.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

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
