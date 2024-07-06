
// import './App.css'
// import ListEmployeeComponent from './components/ListEmployeeComponent'
// import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
// import EmployeeCreateComponent from './components/EmployeeCreateComponent'
// import EmployeeCreatePageComponent from './components/EmployeeCreatePageComponent'
// import UserRegisterComponent from './components/UserRegisterComponent'
// import EmployeeProcessSelection from './components/EmployeeProcessSelection'
// import EmployeeTable from './components/EmployeeTable'
// import HrInterviewResponse from './components/HrInterviewResponse'
// import MrInterviewResponse from './components/MrInterviewResponse'
// import LoginPage from './components/auth/LoginPage'
// import ProfilePage from './components/userspage/ProfilePage'
// import RegistrationPage from './components/auth/RegistrationPage'
// import UserManagementPage from './components/userspage/UserManagementPage'
// import UpdateUser from './components/userspage/UpdateUser'
// import UsersService from './components/services/UsersService'
// import Navbar from './components/common/Navbar'
// import FooterComponent from './components/common/Footer'
// import HdfcMrResponsePage from './components/HDFCMRPAGE/HdfcMrResponsePage'
// import IciciMrResponePage from './components/ICICMRPAGE/IcisMrResponsePage'
// import MisResponsePage from './components/MISMRPAGE/MisMrResponsePage'
// import ApprovedStatusPage from './components/approvedEmpPage/ApprovedStatusPage'
// import RejectedStatusPage from './components/rejectedEmpPage/RejectedStatusPage'


// import * as RoleUtils from './RoleUtils';
// function App() {


//   return (
//     <>
//       <BrowserRouter>
//         <div className='App'>
//           <Navbar />
//           <div className="content">

//             <Routes>
//               <Route exact path="/" element={<LoginPage />} />
//               <Route exact path="/login" element={<LoginPage />} />
//               <Route path="/profile" element={<ProfilePage />} />

//               {UsersService.adminOnly() && (
//                 <>
//                   <Route path='/process-Selection' element={<EmployeeProcessSelection />} />

//                   <Route path="/admin/user-management" element={<UserManagementPage />} />
//                   <Route path="/approved" element={<ApprovedStatusPage />} />
//                   <Route path='/rejected' element={<RejectedStatusPage />} />
//                   <Route path="/admin/process-Selection" element={<EmployeeProcessSelection />}></Route>
//                   <Route path="/update-user/:userId" element={<UpdateUser />} />
//                 </>
//               )}
//               {UsersService.userOnly() && (
//                 <>

//                   <Route path="/hdfcmrpage" element={<HdfcMrResponsePage />} />
//                 </>
//               )}
//               {UsersService.hdfcOnly() && (
//                 <>
//                   <Route path="/hdfcmrpage" element={<HdfcMrResponsePage />} />
//                 </>
//               )}
//               {UsersService.iciciOnly() && (
//                 <>
//                   <Route path="/icicimrpage" element={<IciciMrResponePage />} />
//                 </>
//               )}
//               {UsersService.misOnly() && (
//                 <>
//                   <Route path="/mispage" element={<MisResponsePage />} />
//                 </>
//               )}

//               <Route path="*" element={<Navigate to="/login" />} />‰
//             </Routes>
//           </div>

//         </div>
//         <FooterComponent />
//       </BrowserRouter>
//     </>
//   );

// }

// export default App
import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ListEmployeeComponent from './components/ListEmployeeComponent';
import EmployeeCreateComponent from './components/EmployeeCreateComponent';
import EmployeeCreatePageComponent from './components/EmployeeCreatePageComponent';
import UserRegisterComponent from './components/UserRegisterComponent';
import EmployeeProcessSelection from './components/EmployeeProcessSelection';
import EmployeeTable from './components/EmployeeTable';
import HrInterviewResponse from './components/HrInterviewResponse';
import MrInterviewResponse from './components/MrInterviewResponse';
import LoginPage from './components/auth/LoginPage';
import ProfilePage from './components/userspage/ProfilePage';
import RegistrationPage from './components/auth/RegistrationPage';
import UserManagementPage from './components/userspage/UserManagementPage';
import UpdateUser from './components/userspage/UpdateUser';
import Navbar from './components/common/Navbar';
import FooterComponent from './components/common/Footer';
import HdfcMrResponsePage from './components/HDFCMRPAGE/HdfcMrResponsePage';
import IciciMrResponePage from './components/ICICMRPAGE/IcisMrResponsePage';
import MisResponsePage from './components/MISMRPAGE/MisMrResponsePage';
import ApprovedStatusPage from './components/approvedEmpPage/ApprovedStatusPage';
import RejectedStatusPage from './components/rejectedEmpPage/RejectedStatusPage';
import { AuthContext } from './components/auth/AuthContext';
import ImageSlider from './components/ImageSlider';

function App() {
  
  const { isAuthenticated, role } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className='App'>
        <Navbar />
        <div className="content">
          <Routes>
            {/* <Route exact path="/" element={isAuthenticated ? <ProfilePage /> : <ImageSlider />} /> */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
            {isAuthenticated && role === 'ADMIN' && (
              <>
                <Route path ='/profile-screening' element= {<HrInterviewResponse/>}/>
                <Route path='/process-Selection' element={<EmployeeProcessSelection />} />
                <Route path="/admin/user-management" element={<UserManagementPage />} />
                <Route path="/approved" element={<ApprovedStatusPage />} />
                <Route path="/rejected" element={<RejectedStatusPage />} />
                <Route path="/update-user/:userId" element={<UpdateUser />} />
                <Route path='/add-employee2' element={<EmployeeCreatePageComponent />} />
                <Route path ='/addemp' element={<EmployeeCreateComponent></EmployeeCreateComponent>}/>
              </>
            )}
            {isAuthenticated && role === 'USER' && (
              <>
                <Route path="/hdfcmrpage" element={<HdfcMrResponsePage />} />
              </>
            )}
            {isAuthenticated && role === 'HDFC' && (
              <>
                <Route path="/hdfcmrpage" element={<HdfcMrResponsePage />} />
              </>
            )}
            {isAuthenticated && role === 'ICICI' && (
              <>
                <Route path="/icicimrpage" element={<IciciMrResponePage />} />
              </>
            )}
            {isAuthenticated && role === 'MIS' && (
              <>
                <Route path="/mispage" element={<MisResponsePage />} />
              </>
            )}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </div>
      </div>
      {/* <FooterComponent /> */}
    </BrowserRouter>
  );
}

export default App;