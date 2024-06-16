import React, { useEffect, useState } from 'react'
import { deleteEmployee, listEmployees, updateEmployeeStatus } from '../services/EmployeeService'
import { useNavigate } from 'react-router-dom'

const ListEmployeeComponent = () => {
  const [employees, setEmployees] = useState([]);
  // const [newStatus, setNewStatus] = useState('');
  const [statusUpdates, setStatusUpdates] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState({});
  const navigator = useNavigate();

  useEffect(() => {
    getAllEmployees();
  }, []);

  function getAllEmployees() {
    listEmployees()
      .then((response) => {
        console.log('Response Data:', response.data);
        setEmployees(response.data);
      }).catch(error => {
        console.error(error)
      });
  }

  function addNewEmployee() {
    navigator('/add-employee2')

  }

  function updatedEmployee(id) {
    navigator(`/edit-employee/${id}`)
  }
  function removeEmployee(id) {
    console.log(id);
    deleteEmployee(id).then((response) => {
      getAllEmployees();

    }).catch(error => {
      console.error(error)
    });
  }
  function handleStatusChange(id) {
    const newStatus = statusUpdates[id];
    if (!newStatus) {
      alert('Please enter a status.');
      return;
    }
    updateEmployeeStatus(id, newStatus).then((response) => {
      getAllEmployees();
      setButtonDisabled((prevState) => ({
        ...prevState,
        [id]: true,
      }));
    }).catch(error => {
      console.error(error);
    });
  }

  function handleInputChange(id, value) {
    setStatusUpdates((prevStatusUpdates) => ({
      ...prevStatusUpdates,
      [id]: value,
    }));
  }
  return (
    <div className='container'>
      <h2 className='text-center'>ListEmployeeComponent</h2>
      <button className='btn btn-primary mb-2' onClick={addNewEmployee}> Add Employee</button>
      <table className='table table-striped table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Job Profile</th>
            <th>Mobile No</th>
            <th>Permanent Address</th>
            <th>Current Address</th>
            <th>Gender</th>
            <th>Previous Organisation</th>
            <th>Actions</th>
            <th>Status Update</th>
          </tr>
        </thead>
        <tbody>
          {
            // employees.map((employee =>(
            Array.isArray(employees) && employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.fullName}</td>
                <td>{employee.email}</td>
                <td>{employee.jobProfile}</td>
                <td>{employee.mobileNo}</td>
                <td>{employee.permanentAddress}</td>
                <td>{employee.currentAddress}</td>
                <td>{employee.gender}</td>
                <td>{employee.previousOrganisation}</td>
                <td>
                  <button className='btn btn-info' onClick={() => updatedEmployee(employee.id)}>Update</button>
                  <button className='btn btn-danger' onClick={() => removeEmployee(employee.id)}
                    style={{ marginLeft: '10px' }}
                  >Delete</button>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="New Status"
                    value={statusUpdates[employee.id] || ''}
                    onChange={(e) => handleInputChange(employee.id, e.target.value)}
                  />
                  <button
                    className='btn btn-primary'
                    onClick={() => handleStatusChange(employee.id)}
                    disabled={buttonDisabled[employee.id] || false}
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListEmployeeComponent