import React, { useState, useEffect, useContext } from 'react';
import { getListOfManagerResponseFieldOnRole, MrResponseSubmit} from '../services/EmployeeServiceJWT';
import './ManagerPageRole.css';
import { Link , useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { useUser } from '../auth/UserContext';
function ManagerPageRole({role}) {
  const [employees, setEmployees] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [actions, setActions] = useState({});
  const [selectedResponse, setSelectedResponse] = useState({});
  const [managerRemarks, setManagerRemarks] = useState({});
  const [responseError, setResponseError] = useState('');
  const { user } = useUser();
  const{logout} = useContext(AuthContext);
  const navigate = useNavigate();
  
 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getListOfManagerResponseFieldOnRole(role);
        console.log("data" , response.data)
        setEmployees(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployees();
  }, [role]);
 
  const handleLogout =(e) =>{
    e.preventDefault();
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if(confirmLogout){
        localStorage.removeItem('token');
        logout();
        navigate('/');
    }
  }
  const handleRemarksChange = (e, employeeId) => {
    setRemarks({ ...remarks, [employeeId]: e.target.value });
  }

//   const handleActionChange = (e, employeeId) => {
//     setActions({ ...actions, [employeeId]: e.target.value });
//   }
const handleActionChange = (e, employeeId) => {
    setActions({ ...actions, [employeeId]: e.target.value });
    setSelectedResponse({ ...selectedResponse, [employeeId]: e.target.value });
  }
//   const handleHrResponseValue = async (employeeId) => {
//     try {
//       const response = await MrResponseSubmit(employeeId, {
//         newStatus: actions[employeeId],
//         mrUserName: 'Manager',
//         managerRemarks: remarks[employeeId]
//       });
//       console.log("response", response);
//       const updatedEmployees = employees.map((employee) => {
//         if (employee.id === employeeId) {
//           return { ...employee, remarks: remarks[employeeId], action: actions[employeeId] };
//         }
//         return employee;
//       });
//       setEmployees(updatedEmployees);
//     } catch (error) {
//       console.error(error);
//     }
//   }
const handleHrResponseValue = async (employeeId) => {
    try {
      const selectedValue = selectedResponse[employeeId];
      const managerRemark = managerRemarks[employeeId];
      if (!selectedValue) {
        setResponseError('Please select a response');
        return;
      }
  
      const confirmSubmit = window.confirm('Are you sure you want to submit this response?');
      if (confirmSubmit) {
        console.log('Submitting response for employee', employeeId);
        console.log('Selected value:', selectedValue);
        console.log('Manager remark:', managerRemark);
  
        const response = await MrResponseSubmit(employeeId, selectedValue, user.name, managerRemark);
        console.log('Response:', response);
  
        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.id === employeeId ? { ...emp, ...response.data } : emp
          )
        );
        getAllEmployees();
        setShowDetailsModal(false);
        setResponseError('');
      } else {
        console.log('Submission cancelled by user.');
      }
    } catch (error) {
      console.error('Error submitting HR response:', error);
    }
  };
  return (
    <>
    <div className="header">
    <span className="pe-3">Friday, July 8, 2022 19:18:17</span>
    <Link className="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
    </div>
    <div>
    <table className='table table-striped table-bordered' style={{ border: '1px solid black', padding: '8px' }}>
        <thead>
          <tr>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Name</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Email</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Job Profile</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Mobile No</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Gender</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Register Date</th>
            <th  style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center'}}>Remarks</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Actions</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Submit Response</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <button
                  className="btn btn-link"
                  onClick={() => showEmployeeDetails(employee.id)}
                >
                  {employee.fullName}
                </button>
              </td>
              <td>{employee.email}</td>
              <td>{employee.jobProfile}</td>
              <td>{employee.mobileNo}</td>
              <td>{employee.gender}</td>
              <td>{new Date(employee.creationDate).toLocaleDateString()}</td>
            <td>
            <input
                type="text"
                className="form-control"
                placeholder="Enter remarks"
                value={remarks[employee.id] || ''}               
                onChange={(e) => handleRemarksChange(e, employee.id)}
              /> 
            </td>
              <td>
                <select className='form-select' value={actions[employee.id] || ''} 
                onChange={(e) => handleActionChange(e, employee.id)}>
                  <option value="">Select response</option>
                  <option value="Select">Select</option>
                  <option value="Reject">Reject</option>
                </select>
              </td>
              <td style={{ textAlign: 'center', }}>
                <button className="btn btn-outline-info" onClick={() => handleHrResponseValue(employee.id)}>Submit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

    </>
  );

}

export default ManagerPageRole;