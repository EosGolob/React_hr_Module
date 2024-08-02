import React, { useState, useEffect ,useContext} from 'react';
import { MrResponseSubmit, getEmployeeDetails, getListOfManagerResponseFieldOnRole } from '../services/EmployeeServiceJWT';
import { format } from 'date-fns';
import { useUser } from '../auth/UserContext';
import { useNavigate,Link} from 'react-router-dom'; 
import { AuthContext } from '../auth/AuthContext';

function ManagerPageOnRoleType ({role,name}) {
  // const { user } = useUser();
 
  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [managerRemarks, setManagerRemarks] = useState({});
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [responseError, setResponseError] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); 
  
  console.log("Manager component page name " ,name);
  console.log("Manager component page role " ,role);
  useEffect(() => {
    if (role) {
    getAllEmployees();
    }
  }, [filterDate, sortOrder, currentPage,role]);
  // useEffect(() => {
  //   getAllEmployees();
  // }, [filterDate, sortOrder]);

  // function getAllEmployees() {
  //   if (!user || !user.role) {
  //     console.error('User context or role not available.');
  //     return;
  //   }
  //     getListOfManagerResponseFieldOnRole(role)
  //     .then((response) => {
  //       console.log('API Response:', response.data);
  //       let filteredEmployees = response.data;
  //       if (filterDate) {
  //         filteredEmployees = filteredEmployees.filter(emp => new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10));
  //       }
  //       filteredEmployees.sort((a, b) => {
  //         if (sortOrder === 'asc') {
  //           return new Date(a.creationDate) - new Date(b.creationDate);
  //         } else {
  //           return new Date(b.creationDate) - new Date(a.creationDate);
  //         }
  //       });
  //       setEmployees(filteredEmployees);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching employees:', error);
  //     });
  // }
  const getAllEmployees = async () => {
    try {
      const response = await getListOfManagerResponseFieldOnRole(role);
      let filteredEmployees = response.data;

      if (filterDate) {
        filteredEmployees = filteredEmployees.filter(emp =>
          new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10)
        );
      }

      filteredEmployees.sort((a, b) => {
        const dateA = new Date(a.creationDate);
        const dateB = new Date(b.creationDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

      setEmployees(filteredEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // const handleHrResponse = (e, employeeId) => {
  //   const selectedValue = e.target.value;
  //     setSelectedResponse((prevSelectedResponse) => ({ 
  //       ...prevSelectedResponse, 
  //       [employeeId]: selectedValue 
  //     }));
  //   setResponseError('');
  // };
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

  const handleHrResponseValue = (employeeId) => {
    const selectedValue = selectedResponse[employeeId];
    const managerRemark = managerRemarks[employeeId];
    if (!selectedValue || !managerRemark) {
      setResponseError('Please select a response and enter remarks');
      return;
    }

    const confirmSubmit = window.confirm('Are you sure you want to submit this response?');
    if (confirmSubmit) {
    
      console.log("first 2" ,name);
      MrResponseSubmit(employeeId, selectedValue,name,managerRemark)
        .then((response) => {
          setEmployees(prevEmployees =>
            prevEmployees.map(emp =>
              emp.id === employeeId ? { ...emp, ...response.data } : emp
            )
          );
          getAllEmployees(); 
          setShowDetailsModal(false);
          setResponseError('');
        })
        .catch((error) => {
          console.error('Error submitting HR response:', error);
        });
    }else {
   
      console.log('Submission cancelled by user.');
    }
  };


  // const showEmployeeDetails = (employeeId) => {
  //   getEmployeeDetails(employeeId)
  //     .then((response) => {
  //       if (response.data.length > 0) {
  //         const employeeDetails = response.data[0];
  //         setSelectedEmployeeDetails(employeeDetails);
  //         setShowDetailsModal(true);
  //       } else {
  //         console.error('Employee not found');
  //         setSelectedEmployeeDetails(null);
  //         setShowDetailsModal(false);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching employee details:', error);
  //       setSelectedEmployeeDetails(null);
  //       setShowDetailsModal(false);
  //     });
  // };
  
  const showEmployeeDetails = async (employeeId) => {
    try {
      const response = await getEmployeeDetails(employeeId);
      if (response.data.length > 0) {
        setSelectedEmployeeDetails(response.data[0]);
        setShowDetailsModal(true);
      } else {
        console.error('Employee not found');
        setSelectedEmployeeDetails(null);
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setSelectedEmployeeDetails(null);
      setShowDetailsModal(false);
    }
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

  const indexOfLastEmployee = currentPage * perPage;
  const indexOfFirstEmployee = indexOfLastEmployee - perPage;
  const displayedEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleLogout = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      setEmployees([]);
      setSelectedResponse({});
      setManagerRemarks({});
      setSelectedEmployeeDetails(null);
      setShowDetailsModal(false);
      setFilterDate(null);
      setSortOrder('asc');
      setCurrentPage(1);
      setResponseError('');

      logout();
      navigate('/');
    }
  };
  return (
    <>
    <div className="header">
    <span className="pe-3">Friday, July 8, 2022 19:18:17</span>
    <Link className="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
  </div>
    <div className='container'>
      <br></br>
      {responseError && <div className="alert alert-danger">{responseError}</div>}
      <br></br>
      {/* <br></br> */}
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

      <table className='table table-striped table-bordered' style={{ border: '1px solid black', padding: '8px' }}>
        <thead>
          <tr>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: '#1C3657', textAlign: 'center' }}>Name</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: '#1C3657', textAlign: 'center' }}>Email</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: '#1C3657', textAlign: 'center' }}>Job Profile</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: '#1C3657', textAlign: 'center' }}>Mobile No</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: '#1C3657', textAlign: 'center' }}>Gender</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: '#1C3657', textAlign: 'center' }}>Register Date</th>
            <th  style={{fontFamily:'sans-serif',backgroundColor:'#1C3657',textAlign:'center'}}>Remarks</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: '#1C3657', textAlign: 'center' }}>Actions</th>
            <th style={{ fontFamily: 'sans-serif', backgroundColor: '#1C3657', textAlign: 'center' }}>Submit Response</th>
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
                    <p><strong>Updated By: </strong>{history.hrName}</p>
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
    </>
  );
};

export default ManagerPageOnRoleType;
