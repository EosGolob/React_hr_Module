import React, { useState, useEffect } from 'react'
import { getlistOfEmpIntSchedule, hrResponseSubmit, getEmployeeDetails } from './services/EmployeeServiceJWT';
import { useUser } from './auth/UserContext';
import { format } from 'date-fns';

const HrInterviewResponse = () => {
  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const [responseError, setResponseError] = useState('');

  useEffect(() => {
    getAllEmployees();
  }, [filterDate, sortOrder, currentPage]);


  function getAllEmployees() {
    getlistOfEmpIntSchedule()
      //     .then((response) => {
      //       console.log('Response Data:', response.data);
      //       const filteredData = filterDate ? response.data.filter(emp => new Date(emp.creationDate) >= filterDate) : response.data;
      //       // filteredEmployees = filteredEmployees.filter(emp => new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10));

      //       // setEmployees(response.data);
      //       setEmployees(filteredData);
      //     }).catch(error => {
      //       console.error(error)
      //     });
      // }
      .then((response) => {
        let filteredEmployees = response.data;
        // Apply filter by date if filterDate is set
        if (filterDate) {
          // filteredEmployees = filteredEmployees.filter(emp => new Date(emp.creationDate) >= filterDate);
          filteredEmployees = filteredEmployees.filter(emp => new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10));
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
      })
      .catch(error => {
        console.error('Error fetching employees:', error.message);
      });
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

  const handleHrResponse = (e, employeeId) => {
    const selectedValue = e.target.value;
    console.log('Selected Response:', selectedValue);
    setSelectedResponse(prevSelectedResponse => ({
      ...prevSelectedResponse,
      [employeeId]: selectedValue
    }));
  };


  const handleHrResponseValue = (employeeId) => {
    const selectedValue = selectedResponse[employeeId];
    if (!selectedValue) {
      setResponseError('Please select a response');
      return;
    }
    hrResponseSubmit(employeeId, selectedValue, user.name)
      .then(response => {
        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.id === employeeId ? response.data : emp
          )
        );
        window.location.reload();
      })
      .catch(error => {
        console.error('Error submitting HR response:', error);
      });
  };

  // const handleHrResponseValue = (employeeId) => {
  //   const selectedValue = selectedResponse[employeeId];
  //   hrResponseSubmit(employeeId, selectedValue)
  //     .then(response => {
  //       console.log('Response from Backend:', response.data);

  //       // Update the employees state to reflect the new response
  //       setEmployees((prevEmployees) =>
  //         prevEmployees.map((emp) =>
  //           // emp.id === employeeId ? { ...emp, initialStatus: response.data.initialStatus } : emp
  //       emp.id === employeeId ? response.data : emp    
  //     )
  //       );
  //       // window.location.reload();
  //       // Clear selected response for the employee after submission (if needed)
  //       // setSelectedResponse(prevSelectedResponse => ({
  //       //   ...prevSelectedResponse,
  //       //   [employeeId]: ''
  //       // }));
  //     })
  //     .catch(error => {
  //       console.error('Error submitting HR response:', error);
  //       // Handle error
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


  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle change in items per page
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };


  return (
    <div className='container' style={{ backgroundColor: '#A8DADC', minHeight: '100vh', padding: '20px', minWidth: '100%' }}>
      <h2 className='text-center'></h2>
      {responseError && <div className="alert alert-danger">{responseError}</div>}
      <br />
      {/* <div className="row mb-3">
        <div className="col-auto">
          <label htmlFor="filterDate" className="col-form-label">Filter by Date:</label>
        </div>
        <div className="col-auto">
          <input type="date" id="filterDate" className="form-control" onChange={handleFilterChange} value={filterDate ? filterDate.toISOString().split('T')[0] : ''} />
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-info" onClick={clearFilter}>Clear Filter</button>
        </div>
        <div className="col-auto">
          <select className="form-select" onChange={handleItemsPerPageChange} value={itemsPerPage}>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
        </div> */}
      <div className="row mb-3">
        <div className="col-auto">
          <label htmlFor="filterDate" className="col-form-label">Filter by Date:</label>
        </div>
        <div className="col-auto">
          <input type="date" id="filterDate" className="form-control" onChange={handleFilterChange} value={filterDate ? filterDate.toISOString().split('T')[0] : ''} />
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-info" onClick={clearFilter}>Clear Filter</button>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-info" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? 'Sort Desc' : 'Sort Asc'}
          </button>
        </div>
      </div>

      <table className='table table-striped table-bordered' style={{ border: '1px solid black', padding: '8px' }} >
        <thead >
          <tr>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Name</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Email</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Applied for job Profile</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Mobile No</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Permanent Address</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Gender</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Register Date</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Actions</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: 'lightblue', textAlign: 'center' }}>Submit Response</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((employee) => (
            <tr key={employee.id}>
              <td>
                <button className="btn btn-link"
                  onClick={() => showEmployeeDetails(employee.id)}>
                  {employee.fullName}
                </button></td>
              <td>{employee.email}</td>
              <td>{employee.jobProfile}</td>
              <td>{employee.mobileNo}</td>
              <td>{employee.permanentAddress}</td>
              <td>{employee.gender}</td>
              <td>{new Date(employee.creationDate).toLocaleDateString()}</td>
              <td>
                <select className='form-select' style={{ padding: "2px 5px" }} value={selectedResponse[employee.id] || ''}
                  onChange={(e) => handleHrResponse(e, employee.id)}>
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
      {selectedEmployeeDetails && (
        <div className="modal" style={{ display: showDetailsModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center">Employee Details:</h5>
              </div>
              <div className="modal-body">
                <p><strong>Full Name:</strong> {selectedEmployeeDetails.fullName}</p>
                <p><strong>Email: </strong>{selectedEmployeeDetails.email}</p>
                <p><strong>Aadhar Number:</strong>  {selectedEmployeeDetails.aadhaarNumber}</p>
                <hr />
                {selectedEmployeeDetails.statusHistories && selectedEmployeeDetails.statusHistories.map((history, index) => (
                  <div key={index}>
                    <p><strong>Status: </strong><span className="status" data-status={history.status}>{history.status}</span></p>
                    {history.hrName && <p><strong>Name: </strong>{history.hrName}</p>}
                    <p><strong>Changes Date Time: </strong>{format(new Date(history.changesDateTime), 'yyyy-MM-dd HH:mm:ss')}</p>
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
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">{currentPage}</span>
            </li>
            <li className={`page-item ${currentItems.length < itemsPerPage ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );

};

export default HrInterviewResponse