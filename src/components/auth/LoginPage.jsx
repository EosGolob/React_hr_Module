import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UsersService from "../services/UsersService";
import { AuthContext } from "../auth/AuthContext";
import '../css/bootstrap.min.css';
import '../css/layout.css';
// import '../css/style.css';
import '../css/login.css';
import img from '../img/logo-login.png';

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
      console.log(userData);

      if (userData.token) {
        login(userData.token, userData.role);
        navigate('/');
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

    <div className="container" >
      <div className="row align-items-center justify-content-center height-100vh">
      <div className="col-xl-3 text-center">
      <img src={img} alt="" width="180"/>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mt-80px">
              <input type="email" class="form-control" id="user" placeholder="User ID" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mt-35px">
              <input type="password" class="form-control" id="user" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mt-35px">
              <button className="btn btn-primary" type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


    // <div className="container" style={{backgroundColor: '#A8DADC', minHeight: '100vh', minWidth:'100%',overflow: 'hidden'}} >
    //   <div className="auth-container" style={{backgroundColor: '#F1FAEE'}}>
    //     <h2>Login</h2>
    //     {error && <p className="error-message">{error}</p>}
    //     <form onSubmit={handleSubmit}>
    //       <div className="form-group">
    //         <label>Email: </label>
    //         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //       </div>
    //       <div className="form-group">
    //         <label>Password: </label>
    //         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //       </div>
    //       <button type="submit" style={{ backgroundColor: '#457B9D', marginLeft:'120px', color:'whitesmoke', padding:'5px 20px'}} >Login</button>
    //     </form>
    //   </div>
    // </div>