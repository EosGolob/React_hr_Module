import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import EmployeeCreateComponent from './components/EmployeeCreateComponent';
import EmployeeCreatePageComponent from './components/EmployeeCreatePageComponent';
import EmployeeProcessSelection from './components/EmployeeProcessSelection';
import HrInterviewResponse from './components/HrInterviewResponse';
import LoginPage from './components/auth/LoginPage';
import ProfilePage from './components/userspage/ProfilePage';;
import UserManagementPage from './components/userspage/UserManagementPage';
import UpdateUser from './components/userspage/UpdateUser';
import Navbar from './components/common/Navbar';
import HdfcMrResponsePage from './components/HDFCMRPAGE/HdfcMrResponsePage';
import IciciMrResponePage from './components/ICICMRPAGE/IcisMrResponsePage';
import MisResponsePage from './components/MISMRPAGE/MisMrResponsePage';
import ApprovedStatusPage from './components/approvedEmpPage/ApprovedStatusPage';
import RejectedStatusPage from './components/rejectedEmpPage/RejectedStatusPage';
import { AuthContext } from './components/auth/AuthContext';
import RejectedByHr from './components/hrrejected/RejectedByHr';
import ManagerPageOnRoleType from './components/commonManagerPageOnRoleType/ManagerPageOnRoleType';

function App() {

  const { isAuthenticated, role } = useContext(AuthContext);
  const displayPanelClass = isAuthenticated ? 'display-panel' : '';

  return (
    <BrowserRouter>
      <div className='App'>
        {isAuthenticated && (
          <div className={displayPanelClass}>
            <Navbar />
            <div className="right-panel">
              <Routes>
                <Route path="/" element={<Navigate to="/profile" />} />
                <Route path="/profile" element={<ProfilePage />} />
                {role === 'ADMIN' && (
                  <>
                    <Route path='/profile-screening' element={<HrInterviewResponse />} />
                    <Route path='/process-Selection' element={<EmployeeProcessSelection />} />
                    <Route path="/admin/user-management" element={<UserManagementPage />} />
                    <Route path="/approved" element={<ApprovedStatusPage />} />
                    <Route path="/rejected" element={<RejectedStatusPage />} />
                    <Route path="/update-user/:userId" element={<UpdateUser />} />
                    <Route path='/add-employee2' element={<EmployeeCreatePageComponent />} />
                    <Route path='/addemp' element={<EmployeeCreateComponent />} />
                    <Route path='/hrRejectedEmpInfo' element={<RejectedByHr />} />
                  </>
                )}
                {role === 'USER' && (
                  <Route path="/hdfcmrpage" element={<HdfcMrResponsePage />} />
                )}
                {role === 'HDFC' && (
                  // <Route path="/hdfcmrpage" element={<HdfcMrResponsePage />} />
                  <Route path = "/rolemrpage" element={<ManagerPageOnRoleType/>}/>
                )}
                {role === 'ICICI' && (
                  // <Route path="/icicimrpage" element={<IciciMrResponePage />} />
                  <Route path = "/rolemrpage" element={<ManagerPageOnRoleType/>}/>
                )}
                {role === 'MIS' && (
                  // <Route path="/mispage" element={<MisResponsePage />} />
                  <Route path = "/rolemrpage" element={<ManagerPageOnRoleType/>}/>
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        )}
        {/* Show only login page when not authenticated */}
        {!isAuthenticated && <LoginPage />}
      </div>
    </BrowserRouter>
  );
}

export default App;





// function App() {

//   const { isAuthenticated, role } = useContext(AuthContext);
  
//   return (
//     <BrowserRouter>
//       <div className='App'>
//         <div className='display-panel' >
//           {isAuthenticated && <Navbar />}
//           <div className="right-panel">
//             <Routes>
//               <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />} />
//               <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
//               {isAuthenticated && role === 'ADMIN' && (
//                   <>
//                   <Route path='/profile-screening' element={<HrInterviewResponse />} />
//                   <Route path='/process-Selection' element={<EmployeeProcessSelection />} />
//                   <Route path="/admin/user-management" element={<UserManagementPage />} />
//                   <Route path="/approved" element={<ApprovedStatusPage />} />
//                   <Route path="/rejected" element={<RejectedStatusPage />} />
//                   <Route path="/update-user/:userId" element={<UpdateUser />} />
//                   <Route path='/add-employee2' element={<EmployeeCreatePageComponent />} />
//                   <Route path='/addemp' element={<EmployeeCreateComponent></EmployeeCreateComponent>} />
//                   <Route path='/hrRejectedEmpInfo' element={<RejectedByHr />} />
//                   </>
//               )}
//               {isAuthenticated && role === 'USER' && (
//                 <>
//                   <Route path="/hdfcmrpage" element={<HdfcMrResponsePage />} />
//                 </>
//               )}
//               {isAuthenticated && role === 'HDFC' && (
//                 <>
//                   <Route path="/hdfcmrpage" element={<HdfcMrResponsePage />} />
                
//                 </>
//               )}
//               {isAuthenticated && role === 'ICICI' && (
//                 <>
//                   <Route path="/icicimrpage" element={<IciciMrResponePage />} />
//                 </> 
//               )}
//               {isAuthenticated && role === 'MIS' && (
//                 <>
//                   <Route path="/mispage" element={<MisResponsePage />} />
//                 </>
//               )}
//               <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
              
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;