
import React ,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import UsersService from '../services/UsersService';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isHdfc , setIsHdfc] =useState(false);
    const [isUser,setIsUser] =useState(false);
    const [isMis,setIsMis] =useState(false);
    const [isIcici,setIsIcici] =useState(false);

    useEffect(() => {
       
        setIsAuthenticated(UsersService.isAuthenticated());
        setIsAdmin(UsersService.isAdmin());
        setIsHdfc(UsersService.isHdfc());
        setIsUser(UsersService.isUser());
        setIsIcici(UsersService.isIcici);
        setIsMis(UsersService.isMis());
    
      
    }, []);

    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UsersService.logout();
            setIsAuthenticated(false);
            setIsAdmin(false); 
            setIsHdfc(false);
            setIsUser(false);
            setIsIcici(false);
            setIsMis(false);
        }
    };


    return (
        <nav>
            <ul>
                
                <div className='navbar-span'  style={{ color: 'white' }}>
                {!isAuthenticated && <span>EMPLOYEE MANAGEMENT SERVICES</span>}
                </div>
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAdmin && <li><Link to="/process-Selection">Assign Interview process</Link></li>}
                {isAdmin && <li><Link to="/rejected">REJECTED EMPLOYEES</Link></li>}
                {isAdmin && <li><Link to="/approved">APPROVED EMPLOYEES</Link></li>}
                {isUser && <li><Link to ="/hdfcmrpage"> Manager Response</Link></li>}
                {isHdfc && <li><Link to = "/hdfcmrpage"> Manager Response</Link></li>}
                {isIcici && <li><Link to = "/icicimrpage">Manager Response</Link></li>}
                {isMis && <li><Link to = "/mispage">Manager Response</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
            </ul>
      </nav>
    );
}

export default Navbar;