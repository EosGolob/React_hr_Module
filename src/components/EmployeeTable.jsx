import React, { useState, useEffect } from 'react';

const EmployeeTable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/employees/employees-schedule-interview')
      .then(response => response.json())
      .then(data => setTableData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h2>Employee Data</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Qualification</th>                
            <th>Current Address</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Job Profile</th>
            <th>Marital Status</th>
            <th>Mobile No</th>
            <th>Previous Organisation</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tableData) && tableData.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.fullName}</td>
              <td>{row.qualification}</td>
              <td>{row.currentAddress}</td>
              <td>{new Date(row.dob).toLocaleDateString()}</td>
              <td>{row.email}</td>
              <td>{row.gender}</td>
              <td>{row.jobProfile}</td>
              <td>{row.maritalStatus}</td>
              <td>{row.mobileNo}</td>
              <td>{row.previousOrganisation}</td>
              <th>{row.status}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
