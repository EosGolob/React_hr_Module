import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
// import '../css/bootstrap.min.css';
import '../css/layout.css';
// import '../css/fontawesome.css';
import '../css/style.css';
import img1 from '../img/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchengin  } from '@fortawesome/free-brands-svg-icons';
import { faClock ,faXmark,faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const { isAuthenticated, role, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
    }
  };

  return (
<div className='display-panel'>
    {/* <nav className="left-panel" > */}
    <div className="left-panel">
      <div className='top-wrap'>
        <div className="logo-wrap">
          <img class="edas-logo img-responsive" src={img1} alt="logo" />
        </div>
        <ul className="navbar-nav">
    
          {isAuthenticated &&
            <li className="nav-item"  >
              <Link to="/profile" className="nav-link" ><i className="fas fa-tachometer-alt"></i>  Profile</Link>
            </li>}
          {role === 'ADMIN' &&
            <li className="nav-item">
              <Link to="/profile-screening" className="nav-link" ><FontAwesomeIcon icon={faSearchengin}/> Profile Screening</Link>
            </li>} 
          {role === 'ADMIN' &&
            <li className="nav-item">
              <Link to="/process-Selection"  className="nav-link" ><FontAwesomeIcon icon={faClock}/> Schedule Interview</Link>
            </li>}
          {role === 'ADMIN' &&
            <li className="nav-item">
              <Link to="/rejected"  className="nav-link" ><FontAwesomeIcon icon={faXmark}/> Rejected</Link>
            </li>}
          {role === 'ADMIN' &&
            <li className="nav-item">
              <Link to="/approved"  className="nav-link" ><FontAwesomeIcon icon={faClipboardCheck}/> Selected</Link>
            </li>}
          {role === 'ADMIN' &&
            <li className="nav-item">
              <Link to="/hrRejectedEmpInfo" className="nav-link">Hr Rejected</Link>
            </li>}

          {role === 'USER' &&
            <li className="nav-item">
              <Link to="/hdfcmrpage" className="nav-link" >Scheduled Interview</Link>
            </li>}
          {role === 'HDFC' &&
            <li className="nav-item">
              <Link to="/hdfcmrpage" className="nav-link" >Scheduled Interview</Link>
            </li>}
          {role === 'ICICI' &&
            <li className="nav-item">
              <Link to="/icicimrpage" className="nav-link" >Scheduled Interview</Link>
            </li>}
          {role === 'MIS' &&
            <li className="nav-item">
              <Link to="/mispage"  className="nav-link">Scheduled Interview</Link>
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
    {/* </nav> */}
    </div>
    </div>
  );
}

export default Navbar;


// {/* <nav className="navbar" >
//       <ul>
//         {/* <div className='navbar-span' style={{ color: '#A8DADC',padding:'5px 10px'}}>
//           {!isAuthenticated && <li style={{marginLeft:'440px'}}>Recruitment Management Service</li>}
//         </div> */}
//         <div className='navbar-span'>
//         {!isAuthenticated && <li style={{marginLeft:'390px', fontSize:'35px', color: '#A8DADC'}}>Recruitment Management Service</li>}
//         {isAuthenticated && <li className={location.pathname === '/profile' ? 'active' : ''}><Link to="/profile"style={{ color: '#A8DADC',padding:'5px 10px', textDecoration:'underline'}}>Profile</Link></li>}
//         {role === 'ADMIN' && <li className={location.pathname === '/profile-screening' ? 'active' : ''}><Link to="/profile-screening" style={{ color: '#A8DADC', padding:'5px 10px',textDecoration:'underline'}}>{`Profile Screening`}</Link></li>}
//         {role === 'ADMIN' && <li className={location.pathname === '/process-Selection' ? 'active' : ''}><Link to="/process-Selection"  style={{ color: '#A8DADC', padding:'5px 10px',textDecoration:'underline'}}>{`Schedule Interview`}</Link></li>}
//         {role === 'ADMIN' && <li className={location.pathname === '/rejected' ? 'active' : ''}><Link to="/rejected" style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Rejected`}</Link></li>}
//         {role === 'ADMIN' && <li className={location.pathname === '/approved' ? 'active' : ''}><Link to="/approved" style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Selected`}</Link></li>}
//         {role === 'ADMIN' && <li className={location.pathname === '/hrRejectedEmpInfo' ? 'active' : ''}><Link to="/hrRejectedEmpInfo" style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Hr Rejected`}</Link></li>}

//         {role === 'USER' && <li className={location.pathname === '/hdfcmrpage' ? 'active' : ''}><Link to="/hdfcmrpage"style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Scheduled Interview`}</Link></li>}
//         {role === 'HDFC' && <li className={location.pathname === '/hdfcmrpage' ? 'active' : ''}><Link to="/hdfcmrpage"style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Scheduled Interview`}</Link></li>}
//         {role === 'ICICI' && <li className={location.pathname === '/icicimrpage' ? 'active' : ''}><Link to="/icicimrpage"style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Scheduled Interview`}</Link></li>}
//         {role === 'MIS' && <li className={location.pathname === '/mispage' ? 'active' : ''}><Link to="/mispage"style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Scheduled Interview`}</Link></li>}
//         {/* {role === 'HDFC' && <li className={location.pathname === '/managerCommonPage' ? 'active' : ''}><Link to="/managerCommonPage"style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Scheduled Interview`}</Link></li>} */}
// {/*{role === 'ICICI' && <li className={location.pathname === '/managerCommonPage' ? 'active' : ''}><Link to="/managerCommonPage"style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Scheduled Interview`}</Link></li>}
//         {role === 'MIS' && <li className={location.pathname === '/managerCommonPage' ? 'active' : ''}><Link to="/managerCommonPage"style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>{`Scheduled Interview`}</Link></li>} */}
//         {isAuthenticated ? (
//           <li><Link to="/" onClick={handleLogout} style={{ color: '#A8DADC',padding:'5px 10px',textDecoration:'underline'}}>Logout</Link></li>
//         ) : (
//           <li><Link to="/"></Link></li>
//         )}
//         </div>
//         </ul>
//     </nav> */}