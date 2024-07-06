import React, { useState, useEffect } from 'react'
import { getlistOfManagerHdfcResponeField, MrResponseSubmit, getEmployeeDetails } from '../services/EmployeeServiceJWT';
import { format } from 'date-fns';
import { useUser } from '../auth/UserContext';

const HdfcMrResponsePage = () => {

  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterDate, setFilterDate] = useState(null); // State for filter date
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    getAllEmployees();
  }, [filterDate, sortOrder,currentPage]);


  // function getAllEmployees() {
  //   getlistOfManagerHdfcResponeField()
  //     .then((response) => {
  //       console.log('Response Data:', response.data);
  //       setEmployees(response.data);
  //     }).catch(error => {
  //       console.error(error)
  //     });
  // }

  function getAllEmployees() {
    getlistOfManagerHdfcResponeField()
      .then((response) => {
        let filteredEmployees = response.data;
        // Apply filter by date if filterDate is set
        if (filterDate) {
          filteredEmployees = filteredEmployees.filter(emp => new Date(emp.creationDate) >= filterDate);
        }
        // Sort employees by creationDate based on sortOrder
        filteredEmployees.sort((a, b) => {
          if (sortOrder === 'asc') {
            return new Date(a.creationDate) - new Date(b.creationDate);
          } else {
            return new Date(b.creationDate) - new Date(a.creationDate);
          }
        });
        setEmployees(filteredEmployees);
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


  const handleHrResponseValue = (employeeId) => {
    const selectedValue = selectedResponse[employeeId];
    console.log('Submitting HR Response for Employee:', employeeId, 'Response:', selectedValue);
    // Show an alert to confirm submission
    const confirmSubmit = window.confirm('Are you sure you want to submit this response?');
    if (confirmSubmit) {
      // If user confirms, proceed with submission
      MrResponseSubmit(employeeId, selectedValue, user.name)
        .then((response) => {
          console.log('Response from Backend:', response.data);
          setEmployees((prevEmployees) =>
            prevEmployees.map((emp) =>
              emp.id === employeeId ? response.data : emp
            )
          );
          setShowDetailsModal(false);
          window.location.reload();
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

  const showEmployeeDetails = (employeeId) => {
    getEmployeeDetails(employeeId)
      .then((response) => {
        if (response.data.length > 0) {
          const employeeDetails = response.data[0];
          console.log('Employee Details:', employeeDetails);
          setSelectedEmployeeDetails(employeeDetails);
          setShowDetailsModal(true);
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

  const handleFilterChange = (e) => {
    const date = e.target.valueAsDate;
    setFilterDate(date);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

   // Calculate current employees to display based on pagination
   const indexOfLastEmployee = currentPage * perPage;
   const indexOfFirstEmployee = indexOfLastEmployee - perPage;
   const displayedEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
 
   // Change page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='container'>
      <br></br>
      <br></br>
      <div className="row mb-3">
        <div className="col-auto">
          <label htmlFor="filterDate" className="col-form-label">Filter by Date:</label>
        </div>
        <div className="col-auto">
          <input type="date" id="filterDate" className="form-control" onChange={handleFilterChange} value={filterDate ? filterDate.toISOString().split('T')[0] : ''} />
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-primary" onClick={clearFilter}>Clear Filter</button>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-primary" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? 'Sort Desc' : 'Sort Asc'}
          </button>
        </div>
      </div>
      <table className='table table-striped table-bordered'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Job Profile</th>
            <th>Mobile No</th>
            <th>Gender</th>
            <th>Register Date</th>
            <th>Actions</th>
            <th>Submit Response</th>
          </tr>
        </thead>
        <tbody>
          {displayedEmployees.map((employee) => (
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
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
          </li>
          <li className="page-item"><span className="page-link">{currentPage}</span></li>
          <li className={`page-item ${displayedEmployees.length < perPage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
      {selectedEmployeeDetails && (
        <div className="modal" style={{ display: showDetailsModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Employee Details:</h5>
              </div>
              <div className="modal-body">
                <p><strong>Full Name:</strong> {selectedEmployeeDetails.fullName}</p>
                <p><strong>Email: </strong>{selectedEmployeeDetails.email}</p>
                <p><strong>Aadhar Number:</strong>  {selectedEmployeeDetails.aadhaarNumber}</p>
                <hr />

                {selectedEmployeeDetails.statusHistories && selectedEmployeeDetails.statusHistories.map((history, index) => (
                  <div key={index}>
                    <p><strong>Status: </strong><span className="status" data-status={history.status}>{history.status}</span></p>
                    <p><strong>Name: </strong>{history.hrName}</p>
                    <p><strong>Changes DateTime: </strong>{format(new Date(history.changesDateTime), 'yyyy-MM-dd HH:mm:ss')}</p>
                    <hr />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-primary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default HdfcMrResponsePage
