
// import React ,{useState,useEffect} from 'react';
// import { Link } from 'react-router-dom';
// import UsersService from '../services/UsersService';

// function Navbar() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [isHdfc , setIsHdfc] =useState(false);
//     const [isUser,setIsUser] =useState(false);
//     const [isMis,setIsMis] =useState(false);
//     const [isIcici,setIsIcici] =useState(false);

//     useEffect(() => {
       
//         setIsAuthenticated(UsersService.isAuthenticated());
//         setIsAdmin(UsersService.isAdmin());
//         setIsHdfc(UsersService.isHdfc());
//         setIsUser(UsersService.isUser());
//         setIsIcici(UsersService.isIcici);
//         setIsMis(UsersService.isMis());
    
      
//     }, []);

//     const handleLogout = () => {
//         const confirmDelete = window.confirm('Are you sure you want to logout this user?');
//         if (confirmDelete) {
//             UsersService.logout();
//             setIsAuthenticated(false);
//             setIsAdmin(false); 
//             setIsHdfc(false);
//             setIsUser(false);
//             setIsIcici(false);
//             setIsMis(false);
//         }
//     };


//     return (
//         <nav>
//             <ul>
                
//                 <div className='navbar-span'  style={{ color: 'white' }}>
//                 {!isAuthenticated && <span>EMPLOYEE MANAGEMENT SERVICES</span>}
//                 </div>
//                 {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
//                 {isAdmin && <li><Link to="/process-Selection">Assign Interview process</Link></li>}
//                 {isAdmin && <li><Link to="/rejected">REJECTED EMPLOYEES</Link></li>}
//                 {isAdmin && <li><Link to="/approved">APPROVED EMPLOYEES</Link></li>}
//                 {isUser && <li><Link to ="/hdfcmrpage"> Manager Response</Link></li>}
//                 {isHdfc && <li><Link to = "/hdfcmrpage"> Manager Response</Link></li>}
//                 {isIcici && <li><Link to = "/icicimrpage">Manager Response</Link></li>}
//                 {isMis && <li><Link to = "/mispage">Manager Response</Link></li>}
//                 {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
//             </ul>
//       </nav>
//     );
// }

// export default Navbar;
import React, { useContext } from 'react';
import { Link ,useLocation} from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
// import  './navbar.css'
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
    <nav className="navbar" >
      <ul>
        {/* <div className='navbar-span' style={{ color: 'white' }}>
          {!isAuthenticated && <span>EMPLOYEE MANAGEMENT SERVICES</span>}
        </div> */}
        <div className='navbar-span'>
        {isAuthenticated && <li className={location.pathname === '/profile' ? 'active' : ''}><Link to="/profile"style={{ color: 'black' }}>Profile</Link></li>}
        {role === 'ADMIN' && <li className={location.pathname === '/profile-screening' ? 'active' : ''}><Link to="/profile-screening" style={{ color: 'black'}}>{`Profile Screening`}</Link></li>}
        {role === 'ADMIN' && <li className={location.pathname === '/process-Selection' ? 'active' : ''}><Link to="/process-Selection"  style={{ color: 'black'}}>{`Schedule Interview Process`}</Link></li>}
        {role === 'ADMIN' && <li className={location.pathname === '/rejected' ? 'active' : ''}><Link to="/rejected" style={{ color: 'black'}}>{`Rejected Employees`}</Link></li>}
        {role === 'ADMIN' && <li className={location.pathname === '/approved' ? 'active' : ''}><Link to="/approved" style={{ color: 'black'}}>{`Approved Employees`}</Link></li>}
        {role === 'USER' && <li className={location.pathname === '/hdfcmrpage' ? 'active' : ''}><Link to="/hdfcmrpage"style={{ color: 'black'}}>{`Manager Response`}</Link></li>}
        {role === 'HDFC' && <li className={location.pathname === '/hdfcmrpage' ? 'active' : ''}><Link to="/hdfcmrpage"style={{ color: 'black'}}>{`Manager Response`}</Link></li>}
        {role === 'ICICI' && <li className={location.pathname === '/icicimrpage' ? 'active' : ''}><Link to="/icicimrpage"style={{ color: 'black'}}>{`Manager Response`}</Link></li>}
        {role === 'MIS' && <li className={location.pathname === '/mispage' ? 'active' : ''}><Link to="/mispage"style={{ color: 'black'}}>{`Manager Response`}</Link></li>}
        {isAuthenticated ? (
          <li><Link to="/" onClick={handleLogout} style={{ color: 'black'}}>Logout</Link></li>
        ) : (
          <li><Link to="/"></Link></li>
        )}
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;