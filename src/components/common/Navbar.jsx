import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import img1 from '../img/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchengin  } from '@fortawesome/free-brands-svg-icons';
import { faClock ,faXmark,faClipboardCheck,faTimesCircle  } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, role, logout } = useContext(AuthContext);
  const location = useLocation();

  // const handleLogout = () => {
  //   const confirmLogout = window.confirm('Are you sure you want to logout?');
  //   if (confirmLogout) {
  //     logout();
  //   }
  // };

  return (
    <div className="left-panel">
      <div className='top-wrap'>
        <div className="logo-wrap">
          <img class="edas-logo img-responsive" src={img1} alt="logo" />
        </div>
        <ul className="navbar-nav">
    
          {isAuthenticated &&
            <li className={`nav-items ${location.pathname === '/profile' ? 'active' : ''}`} >
              <Link to="/profile" className="nav-links" ><i className="fas fa-tachometer-alt"></i>  Profile</Link>
            </li>}
        
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/profile-screening' ? 'active' : ''}`}>
              <Link to="/profile-screening" className="nav-links" ><FontAwesomeIcon icon={faSearchengin}/> Profile Screening</Link>
            </li>} 
        
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/process-Selection' ? 'active' : ''}`}>
              <Link to="/process-Selection"  className="nav-links" ><FontAwesomeIcon icon={faClock}/> Schedule Interview</Link>
            </li>}
            
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/rejected' ? 'active' : ''}`}>
              <Link to="/rejected"  className="nav-links" ><FontAwesomeIcon icon={faXmark}/> Rejected</Link>
            </li>}
       
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/approved' ? 'active' : ''}`}>
              <Link to="/approved"  className="nav-links" ><FontAwesomeIcon icon={faClipboardCheck}/> Selected</Link>
            </li>}
        
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/hrRejectedEmpInfo' ? 'active' : ''}`}>
              <Link to="/hrRejectedEmpInfo" className="nav-links"><FontAwesomeIcon icon={faTimesCircle}/> Hr Rejected</Link>
            </li>}

          {role === 'USER' &&
            <li className={`nav-items ${location.pathname === '/hdfcmrpage' ? 'active' : ''}`}>
              <Link to="/hdfcmrpage" className="nav-links" ><FontAwesomeIcon icon={faClock}/> Scheduled Interview</Link>
            </li>}
          {role === 'HDFC' &&
            <li className={`nav-items ${location.pathname === '/hdfcmrpage' ? 'active' : ''}`}>
              {/* <Link to="/hdfcmrpage" className="nav-links" ><FontAwesomeIcon icon={faClock}/> Scheduled Interview</Link> */}
              <Link to="/rolemrpage" className="nav-links" ><FontAwesomeIcon icon={faClock}/>Schedule Interview</Link>
            </li>}
          {role === 'ICICI' &&
            <li className={`nav-items ${location.pathname === '/icicimrpage' ? 'active' : ''}`}>
              {/* <Link to="/icicimrpage" className="nav-links" ><FontAwesomeIcon icon={faClock}/> Scheduled Interview</Link> */}
              <Link to="/rolemrpage" className="nav-links" ><FontAwesomeIcon icon={faClock}/>Schedule Interview</Link>

            </li>}
          {role === 'MIS' &&
            <li className={`nav-items ${location.pathname === '/mispage' ? 'active' : ''}`}>
              {/* <Link to="/mispage"  className="nav-links"><FontAwesomeIcon icon={faClock}/>Scheduled Interview</Link> */}
              <Link to="/rolemrpage"  className="nav-links"><FontAwesomeIcon icon={faClock}/>Schedule Interview</Link>

            </li>}
            {/* {isAuthenticated ? (
            <li className="nav-item">
              <Link to="/" onClick={handleLogout} className="nav-link active">Logout</Link>
              </li>
          ) : (
            <li><Link to="/"></Link></li>
          )} */}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
