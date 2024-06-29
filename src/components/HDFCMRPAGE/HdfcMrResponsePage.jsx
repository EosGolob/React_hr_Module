import React, { useState, useEffect } from 'react'
import { getlistOfManagerHdfcResponeField, MrResponseSubmit, getEmployeeDetails } from '../services/EmployeeServiceJWT';

const HdfcMrResponsePage = () => {

  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    getAllEmployees();
  }, []);


  function getAllEmployees() {
    getlistOfManagerHdfcResponeField()
      .then((response) => {
        console.log('Response Data:', response.data);
        setEmployees(response.data);
      }).catch(error => {
        console.error(error)
      });
  }


  const handleHrResponse = (e, employeeId) => {
    const selectedValue = e.target.value;
    console.log('Selected Response:', selectedValue);
    setSelectedResponse((prevSelectedResponse) => ({
      ...prevSelectedResponse,
      [employeeId]: selectedValue
    }));
  };

 

  // const handleHrResponseValue = (employeeId) => {
  //   const selectedValue = selectedResponse[employeeId];
  //   console.log('Submitting HR Response for Employee:', employeeId, 'Response:', selectedValue);
  //   MrResponseSubmit(employeeId, selectedValue)
  //     .then((response) => {
  //       console.log('Response from Backend:', response.data);
  //       setEmployees((prevEmployees) =>
  //         prevEmployees.map((emp) =>
  //          (emp.id === employeeId ? response.data : emp
  //         ))
  //       );
  //     })
  //     .catch((error) => {
  //       console.error('Error submitting HR response:', error);
  //       // Handle error
  //     });
  // };
  const handleHrResponseValue = (employeeId) => {
    const selectedValue = selectedResponse[employeeId];
    console.log('Submitting HR Response for Employee:', employeeId, 'Response:', selectedValue);

    // Show an alert to confirm submission
    const confirmSubmit = window.confirm('Are you sure you want to submit this response?');

    if (confirmSubmit) {
      // If user confirms, proceed with submission
      MrResponseSubmit(employeeId, selectedValue)
        .then((response) => {
          console.log('Response from Backend:', response.data);
          setEmployees((prevEmployees) =>
            prevEmployees.map((emp) =>
              emp.id === employeeId ? response.data : emp
            )
          );
        })
        .catch((error) => {
          console.error('Error submitting HR response:', error);
          // Handle error
        });
    } else {
      // If user cancels, do nothing or provide feedback
      console.log('Submission cancelled by user.');
    }
  };
  // const showEmployeeDetails = (employeeId) => {
  //   getEmployeeDetails(employeeId)
  //     .then((response) => {
  //       if (response.data.length > 0) {
  //         const employeeDetails = response.data[0];
  //         console.log('Employee Details:', employeeDetails);
  
  //         setSelectedEmployeeDetails(employeeDetails); // Update state with fetched data
  //       } else {
  //         console.error('Employee not found');
  //         setSelectedEmployeeDetails(null); // Handle case where employee data is not found
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching employee details:', error);
  //       setSelectedEmployeeDetails(null); // Handle error scenario
  //     });
  // };
  const showEmployeeDetails = (employeeId) => {
    getEmployeeDetails(employeeId)
      .then((response) => {
        if (response.data.length > 0) {
          const employeeDetails = response.data[0];
          console.log('Employee Details:', employeeDetails);
          setSelectedEmployeeDetails(employeeDetails);
          setShowDetailsModal(true); // Show modal when details are fetched
        } else {
          console.error('Employee not found');
          setSelectedEmployeeDetails(null);
          setShowDetailsModal(false);
        }
      })
      .catch(error => {
        console.error('Error fetching employee details:', error);
        setSelectedEmployeeDetails(null);
        setShowDetailsModal(false);
      });
  };

  const closeModal = () => {
    setShowDetailsModal(false);
  };
  
//   return (
//     <div className='container'>
//       <h2 className='text-center'>Manager Response</h2>
//       <table className='table table-striped table-bordered'>
//         <thead>
//           <tr>
//             <th>Id</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Job Profile</th>
//             <th>Mobile No</th>
//             <th>Permanent Address</th>
//             <th>Gender</th>
//             <th>Previous Organisation</th>
//             <th>Status</th>
//             <th>Actions</th>
//             <th>Submit Response</th>
//           </tr>
//         </thead>
//         <tbody>
//           {
//             Array.isArray(employees) && 
//             employees.map((employee) => (
//               <tr key={employee.id}>
//                 <td>{employee.id}</td>
//                 {/* <td>{employee.fullName}</td> */}
//                 <td onClick={() => showEmployeeDetails(employee.id)} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>{employee.fullName}</td>
//                 <td>{employee.email}</td>
//                 <td>{employee.jobProfile}</td>
//                 <td>{employee.mobileNo}</td>
//                 <td>{employee.permanentAddress}</td>
//                 <td>{employee.gender}</td>
//                 <td>{employee.previousOrganisation}</td>
//                 <td>{employee.hrStatus}</td>
//                 <td>
//                   {/* <select value={employee.selectedResponse} onChange={e=> handleHrResponse(e,employee.id)}> */}
//                   <select value={selectedResponse[employee.id] || ''} 
//                   onChange={e => handleHrResponse(e, employee.id)}>
//                     <option value="">Select response</option>
//                     <option value="Approved">Approved</option>
//                     <option value="Rejected">Rejected</option>
//                   </select>
//                 </td>
//                 <td>
//                   <button onClick={() => handleHrResponseValue(employee.id)}>Submit</button>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
  


// {selectedEmployeeDetails && (
//   <div className="card">
//     <div className="card-body">
//       <h5 className="card-title">Employee Details:</h5>
//       <p className="card-text">Full Name: {selectedEmployeeDetails.fullName}</p>
//       <p className="card-text">Email: {selectedEmployeeDetails.email}</p>
//       <p className="card-text">Aadhar Number: {selectedEmployeeDetails.aadhaarNumber}</p>
//       <p className="card-text">Employee Created Date: {selectedEmployeeDetails.creationDate}</p>
//       {/* <p className="card-text">Status: {selectedEmployeeDetails.statusHistories[0].status}</p> */}
//     </div>
//   </div>
// )}


//     </div>
//   );

// };

return (
  <div className='container'>
    <h2 className='text-center'>Manager Response</h2>
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
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.id}</td>
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
            <td>{employee.permanentAddress}</td>
            <td>{employee.gender}</td>
            <td>{employee.previousOrganisation}</td>
            <td>{employee.hrStatus}</td>
            <td>
              <select
                value={selectedResponse[employee.id] || ''}
                onChange={(e) => handleHrResponse(e, employee.id)}
              >
                <option value="">Select response</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </td>
            <td>
              <button onClick={() => handleHrResponseValue(employee.id)}>Submit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {selectedEmployeeDetails && (
      <div className="modal" style={{ display: showDetailsModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Employee Details:</h5>
              <button type="button" className="close" onClick={closeModal}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Full Name:</strong> {selectedEmployeeDetails.fullName}</p>
              <p><strong>Email: </strong>{selectedEmployeeDetails.email}</p>
              <p><strong>Aadhar Number:</strong>  {selectedEmployeeDetails.aadhaarNumber}</p>
              {/* <p><strong>Employee Created Date:</strong> {selectedEmployeeDetails.creationDate}</p> */}
              <hr />
                <h6>Status Histories:</h6>
                {selectedEmployeeDetails.statusHistories && selectedEmployeeDetails.statusHistories.map((history, index) => (
                  <div key={index}>
                    <p><strong>Status: </strong>{history.status}</p>
                    <p><strong>Changes DateTime: </strong>{history.changesDateTime}</p>
                    <hr />
                    </div>
                ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
};
export default HdfcMrResponsePage
