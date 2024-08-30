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
import ApprovedStatusPage from './components/approvedEmpPage/ApprovedStatusPage';
import RejectedStatusPage from './components/rejectedEmpPage/RejectedStatusPage';
import { AuthContext } from './components/auth/AuthContext';
import RejectedByHr from './components/hrrejected/RejectedByHr';
import ManagerPageOnRoleType from './components/commonManagerPageOnRoleType/ManagerPageOnRoleType';
import RegistrationPage from './components/auth/RegistrationPage';
function App() {

  const { isAuthenticated, role,name,process } = useContext(AuthContext);
  console.log("value on app page:", isAuthenticated, role, name,process);
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
                    <Route path='/profile-screening' element={<HrInterviewResponse role={role} name={name} />} />
                    <Route path='/process-Selection' element={<EmployeeProcessSelection name = {name}/>} />
                    <Route path="/admin/user-management" element={<UserManagementPage />} />
                    <Route path="/approved" element={<ApprovedStatusPage />} />
                    <Route path="/rejected" element={<RejectedStatusPage name = {name}/>} />
                    <Route path="/update-user/:userId" element={<UpdateUser />} />
                    <Route path='/add-employee2' element={<EmployeeCreatePageComponent />} />
                    <Route path='/addemp' element={<EmployeeCreateComponent />} />
                    <Route path='/hrRejectedEmpInfo' element={<RejectedByHr name ={name} />} />
                    <Route path = '/register' element = {<RegistrationPage/>}/>
                    
                  </>
                )}
                {
                  role ==='Manager' &&(      
                      <Route path = "/rolemrpage" element={<ManagerPageOnRoleType role={role} name={name} process={process}/>}/>      
                  ) 
                }
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        )}
        {!isAuthenticated && <LoginPage />}
      </div>
    </BrowserRouter>
  );
}

export default App;
