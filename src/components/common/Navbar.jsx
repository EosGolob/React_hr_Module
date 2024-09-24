import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import img1 from '../img/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import { faClock, faXmark, faClipboardCheck, faTimesCircle ,faRegistered} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, role } = useContext(AuthContext);
  const location = useLocation();


  return (
    <div className="left-panel">
      <div className='top-wrap'>
        <div className="logo-wrap">
          <img class="edas-logo img-responsive" src={img1} alt="logo" />
        </div>
        <ul className="navbar-nav">

          {isAuthenticated &&
            <li className={`nav-items ${location.pathname === '/profile' ? 'active' : ''}`} >
              {/* <Link to="/profile" className="nav-links" ><i className="fas fa-tachometer-alt"></i>  Profile</Link> */}          
              <Link to="/profile" className="nav-links" ><span className="icons user-icon">👤</span>  Profile</Link>
            </li>
            }
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/profile-screening' ? 'active' : ''}`}>
              {/* <Link to="/profile-screening" className="nav-links" ><FontAwesomeIcon icon={faSearchengin} /> Profile Screening</Link> */}             
              <Link to="/profile-screening" className="nav-links" ><span className="icons">📋</span> Profile Screening</Link>
            </li>
            }
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/process-Selection' ? 'active' : ''}`}>
              {/* <Link to="/process-Selection" className="nav-links" ><FontAwesomeIcon icon={faClock} /> Schedule Interview</Link> */} 
              <Link to="/process-Selection" className="nav-links" ><span className="icons">🗓️</span> Schedule Interview</Link>

            </li>
            }
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/rejected' ? 'active' : ''}`}>
              {/* <Link to="/rejected" className="nav-links" ><FontAwesomeIcon icon={faXmark} /> Rejected</Link> */}        
              <Link to="/rejected" className="nav-links" ><span className="icons">⛔</span> Rejected</Link>
            </li>
            }
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/approved' ? 'active' : ''}`}>
              {/* <Link to="/approved" className="nav-links" ><FontAwesomeIcon icon={faClipboardCheck} /> Selected</Link> */}              
              <Link to="/approved" className="nav-links" ><span className="icons">✅</span> Selected</Link>
            </li>
            }
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/hrRejectedEmpInfo' ? 'active' : ''}`}>
              {/* <Link to="/hrRejectedEmpInfo" className="nav-links"><FontAwesomeIcon icon={faTimesCircle} /> Hr Rejected</Link> */}             
              <Link to="/hrRejectedEmpInfo" className="nav-links"><span className="icons">🚫</span> Hr Rejected</Link>

            </li>}
          {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/register' ? 'active' : ''}`}>
              {/* <Link to="/register" className="nav-links"><FontAwesomeIcon icon={faRegistered} /> Register User</Link> */}
              <Link to="/register" className="nav-links"><span className="icons">📝</span>  Register User</Link>

            </li>
            }
             {role === 'ADMIN' &&
            <li className={`nav-items ${location.pathname === '/search' ? 'active' : ''}`}>
              {/* <Link to="/search" className="nav-links"><FontAwesomeIcon icon={faRegistered} /> <span className="icons">🔍</span>Search User</Link> */}
              <Link to="/search" className="nav-links"><span className="icons">🔍</span>Search User</Link>

            </li>
            }
          {role === 'Manager' &&
            <li className={`nav-items ${location.pathname === '/rolemrpage' ? 'active' : ''}`}>
              <Link to="/rolemrpage" className="nav-links" ><span className="icons">🗓️</span> Scheduled Interview</Link>
            </li>
            }
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
