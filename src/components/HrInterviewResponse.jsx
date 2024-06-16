import React, { useState, useEffect} from 'react'
import {getlistOfEmpIntSchedule ,hrResponseSubmit}  from '../services/EmployeeService';

const HrInterviewResponse = () => {

  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    getAllEmployees();
  }, []);

  
  function getAllEmployees() {
   getlistOfEmpIntSchedule()
      .then((response) => {
        console.log('Response Data:', response.data);
        setEmployees(response.data);
      }).catch(error => {
        console.error(error)
      });
  }
 const handleHrResponse = (e,employeeId) =>{
  const selectedResponse = e.target.value;
  setEmployees(prevEmployees => prevEmployees.map(employee => {
    if(employee.employeeId === employeeId){
      return{...employee , selectedResponse:selectedResponse};
    }
    return employee;
  }));
 };

  const handleHrResponseValue = (employeeId, selectedResponse) => {
    hrResponseSubmit(employeeId, selectedResponse)
      .then(response => {
        console.log('Response:', response.data);
        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.id === employeeId ? response.data : emp
          )
        );
      })
      .catch(error => {
        console.error('Error submitting HR response:', error);
      });
  };
  
  return (
    <div className='container'>
      <h2 className='text-center'>HR Response</h2>
      <table className='table table-striped table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Job Profile</th>
            <th>Mobile No</th>
            <th>Permanent Address</th>
            <th>Gender</th>
            <th>Previous Organisation</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Submit Response</th>
          </tr>
        </thead>
        <tbody>
          {
            Array.isArray(employees) && employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.fullName}</td>
                <td>{employee.email}</td>
                <td>{employee.jobProfile}</td>
                <td>{employee.mobileNo}</td>
                <td>{employee.permanentAddress}</td>
                <td>{employee.gender}</td>
                <td>{employee.previousOrganisation}</td>
                <td>{employee.initialStatus}</td>
                <td>
                  <select value={employee.selectedResponse || ''} onChange={e=> handleHrResponse(e,employee.id)}>
                  <option value = "Approved">Approved</option>
                  <option value = "Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleHrResponseValue(employee.id,employee.selectedResponse)}>Submit</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
  
};

export default HrInterviewResponse