import React, { useState, useEffect, useContext } from 'react';
import { MrResponseSubmit, getEmployeeDetails, getListOfManagerResponseFieldOnRole } from '../services/EmployeeServiceJWT';
import { format } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './ManagerPageOnRoleType.css';
function ManagerPageOnRoleType({ role, name, process }) {

  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [managerRemarks, setManagerRemarks] = useState({});
  // const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  // const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  // const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [responseError, setResponseError] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('')
  const [successMessage, setSuccessMessage] = useState('');
  
  const [processingEmployeeId, setProcessingEmployeeId] = useState(null);
  console.log("Manager component page name ", name, role, process);

  useEffect(() => {
    if (process) {
      getAllEmployees();
      updateDateTime();
      const intervalId = setInterval(updateDateTime, 1000);
      return () => clearInterval(intervalId);
    }
  // }, [filterDate, sortOrder, currentPage, process]);
}, [filterDate, currentPage, process]);


  const getAllEmployees = async () => {
    try {
      const response = await getListOfManagerResponseFieldOnRole(process);
      let filteredEmployees = response.data;

      if (filterDate) {
        filteredEmployees = filteredEmployees.filter(emp =>
          new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10)
        );
      }

      // filteredEmployees.sort((a, b) => {
      //   const dateA = new Date(a.creationDate);
      //   const dateB = new Date(b.creationDate);
      //   return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      // });

      setEmployees(filteredEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };


  const handleHrResponse = (e, employeeId) => {
    const selectedValue = e.target.value;

    if (!selectedValue) {
      setSelectedResponse((prevSelectedResponse) => ({ ...prevSelectedResponse, [employeeId]: '' }));
    } else {
      setSelectedResponse((prevSelectedResponse) => ({ ...prevSelectedResponse, [employeeId]: selectedValue }));
    }
  };
  const handleRemarksChange = (e, employeeId) => {
    const managerRemarks = e.target.value;
    setManagerRemarks((prevRemarks) => ({
      ...prevRemarks,
      [employeeId]: managerRemarks
    }));
  };

 
  const handleHrResponseValue = async (employeeId) => {
    if (processingEmployeeId) {
      // Prevent submission if another response is being processed
      setResponseError('Please wait until the current submission is processed.');
      return;
    }

    const selectedValue = selectedResponse[employeeId];
    const managerRemark = managerRemarks[employeeId];
    if (!selectedValue || !managerRemark) {
      setResponseError('Please select a response and enter remarks');
      setSuccessMessage(''); // Clear success message
      return;
    }

    const confirmSubmit = window.confirm('Are you sure you want to submit this response?');
    if (confirmSubmit) {
      setProcessingEmployeeId(employeeId); // Set the employee ID being processed
      try {
        const response = await MrResponseSubmit(employeeId, selectedValue, name, managerRemark);
        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.id === employeeId ? { ...emp, ...response.data } : emp
          )
        );
        getAllEmployees();
        // setShowDetailsModal(false);
        setResponseError('');
        setSuccessMessage('Response submitted successfully!');
      } catch (error) {
        console.error('Error submitting HR response:', error);
        setResponseError('Error submitting response. Please try again.');
      } finally {
        setProcessingEmployeeId(null);
      }
    } else {
      console.log('Submission cancelled by user.');
    }
  };

  
  const handleFilterChange = (e) => {
    const date = e.target.valueAsDate;
    setFilterDate(date);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };

  // const toggleSortOrder = () => {
  //   setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  // };

  const indexOfLastEmployee = currentPage * perPage;
  const indexOfFirstEmployee = indexOfLastEmployee - perPage;
  const displayedEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateDateTime = () => {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(now);
    setCurrentDateTime(formattedDateTime);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      setEmployees([]);
      setSelectedResponse({});
      setManagerRemarks({});
      // setSelectedEmployeeDetails(null);
      // setShowDetailsModal(false);
      setFilterDate(null);
      // setSortOrder('asc');
      setCurrentPage(1);
      setResponseError('');
      logout();
      navigate('/');
    }
  };
  return (
    <>
      <div className="header">
        <span className="pe-3">{currentDateTime}</span>
        <Link className="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
      </div>
      <div className='container'>
        <br></br>
        {responseError && <div className="alert alert-danger">{responseError}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <br></br>
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
          {/* <div className="col-auto">
            <button className="btn btn-outline-info" onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? 'Sort Desc' : 'Sort Asc'}
            </button>
          </div> */}
        </div>

        <table className='table table-striped table-bordered' style={{ border: '1px solid black', padding: '10px' }}>
          <thead>
            <tr>
              <th style={{ fontFamily: 'sans-serif', fontSize: '12px', backgroundColor: '#1C3657', color: '#ffff', textAlign: 'center' }}>Name</th>
              <th style={{ fontFamily: 'sans-serif', fontSize: '12px', backgroundColor: '#1C3657', color: '#ffff', textAlign: 'center' }}>Email</th>
              <th style={{ fontFamily: 'sans-serif', fontSize: '12px', backgroundColor: '#1C3657', color: '#ffff', textAlign: 'center' }}>Job Profile</th>
              <th style={{ fontFamily: 'sans-serif', fontSize: '12px', backgroundColor: '#1C3657', color: '#ffff', textAlign: 'center' }}>Mobile No</th>
              <th style={{ fontFamily: 'sans-serif', fontSize: '12px', backgroundColor: '#1C3657', color: '#ffff', textAlign: 'center' }}>Gender</th>
              <th style={{ fontFamily: 'sans-serif', fontSize: '12px', backgroundColor: '#1C3657', color: '#ffff', textAlign: 'center' }}>Register Date</th>
              <th style={{ fontFamily: 'sans-serif', fontSize: '12px', backgroundColor: '#1C3657', color: '#ffff', textAlign: 'center' }}>Remarks</th>
              <th style={{ fontFamily: 'sans-serif', fontSize: '12px', backgroundColor: '#1C3657', color: '#ffff', textAlign: 'center', width: '120px' }}>Actions</th>
              <th style={{ fontFamily: 'sans-serif', fontSize: '12px', backgroundColor: '#1C3657', color: '#ffff', textAlign: 'center' }}>Submit Response</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.fullName}</td>
                <td>{employee.email}</td>
                <td>{employee.jobProfile}</td>
                <td>{employee.mobileNo}</td>
                <td>{employee.gender}</td>
                <td>{new Date(employee.creationDate).toLocaleDateString()}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={managerRemarks[employee.id] || ''}
                    onChange={(e) => handleRemarksChange(e, employee.id)}
                    placeholder="Enter remarks"
                  />
                </td>
                <td>
                  <select className='form-select'
                    value={selectedResponse[employee.id] || ''}
                    onChange={(e) => handleHrResponse(e, employee.id)}
                  >
                    <option value="" disabled>Choose</option>
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
      </div>
    </>
  );
};

export default ManagerPageOnRoleType;
