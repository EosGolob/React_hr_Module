import React, { useEffect, useState ,useContext} from 'react'
import { listEmployees, selectInterviewProcess, getEmployeeDetails } from './services/EmployeeServiceJWT';
import { format } from 'date-fns';
import { useUser } from './auth/UserContext';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import '../components/css/style.css';
import '../components/css/layout.css';
import '../components/css/fontawesome.css';
import '../components/css/bootstrap.min.css';

const EmployeeProcessSelection = () => {
  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  // const [selectedProcess, setSelectedProcess] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterDate, setFilterDate] = useState(null); // State for filter date
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [selectionError, setSelectionError] = useState(false);
  const [remarks, setRemarks] = useState({})
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); 
  useEffect(() => {

    if (!token) {

      console.error('Token not found.');
      return;
    }
    getAllEmployees(token);
  }, [token, filterDate, sortOrder, currentPage]);



  const getAllEmployees = (token) => {
    listEmployees(token)
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

  const handleProcessChange = (e, employeeId) => {
    const selectedProcess = e.target.value;
    setEmployees(prevEmployees =>
      prevEmployees.map(employee => {
        if (employee.id === employeeId) {
          return { ...employee, selectedProcess: selectedProcess };
        }
        return employee;
      }));
    setSelectionError(false);
  };


  const handleAddInterviewProcess = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee.selectedProcess) {
      setSelectionError(true);
      return; // Do not proceed with submission
    }
    const interviewDate = new Date().toISOString().slice(0, 10);
    const interviewTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const interviewData = {
      processName: employee.selectedProcess,
      interviewDate: interviewDate,
      interviewTime: interviewTime,
      status: "Scheduled",
      scheduledBy: user ? user.name : 'Unknown',
      remarks: remarks[employeeId] || ''
    };
    selectInterviewProcess(employeeId, interviewData)
      .then(response => {
        console.log("Interview Process added successfully:", response.data);
        setAlertMessage("Interview process assigned successfully.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

        getAllEmployees(token);
      })
      .catch(error => {
        console.error("Error adding interview process:", error);
        setAlertMessage("Error assigning interview process. Please try again.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
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

  const handleRemarksChange = (e, employeeId) => {
    const value = e.target.value;
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [employeeId]: value
    }));
  };

  // Calculate current employees to display based on pagination
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        logout();
        navigate('/');
    }
};
  const columns = [
    {
      name: 'Name',
      selector: row => row.fullName,
      cell: row => (
        <button
          className="btn btn-link"
          onClick={() => showEmployeeDetails(row.id)}
        >
          {row.fullName}
        </button>
      )
    },
    {
      name: 'Email',
      selector: row => row.email
    },
    {
      name: 'Applied For Job Profile',
      selector: row => row.jobProfile
    },
    {
      name: 'Mobile No',
      selector: row => row.mobileNo
    },
    {
      name: 'Gender',
      selector: row => row.gender
    },
    {
      name: 'Register Date',
      selector: row => new Date(row.creationDate).toLocaleDateString()
    },
    {
      name: 'Remarks',
      selector: row => (
        <input
          type="text"
          className="form-control"
          value={remarks[row.id] || ''}
          onChange={(e) => handleRemarksChange(e, row.id)}
        />
      )
    },
    {
      name: 'Process',
      selector: row => (
        <select
          className='form-select'
          style={{ padding: "2px 5px" }}
          value={row.selectedProcess || ''}
          onChange={(e) => handleProcessChange(e, row.id)}
        >
          <option value="" disabled>Select Process</option>
          <option value="HDFC">HDFC</option>
          <option value="ICICI">ICICI</option>
          <option value="MIS">MIS</option>
        </select>
      )
    },
    {
      name: 'Action',
      cell: row => (
        <button
          className="btn btn-outline-info"
          onClick={() => handleAddInterviewProcess(row.id)}
        >
          Schedule
        </button>
      )
    }
  ];
  return (


      <>
      <div className="header">
        <span className="pe-3">Friday, July 8, 2022 19:18:17</span>
        <a className="logout-btn"onClick={handleLogout} ><i class="fas fa-power-off"></i></a>
      </div>
      <div className="dashboard-wrap">
      {/* <div className='container' > */}
        <div>
          {selectionError && <p className="alert alert-danger">Select process first</p>}
        </div>
        {showAlert && (
          <div className="alert alert-success" role="alert">{alertMessage}

          </div>
        )}
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
            <button className="btn btn-outline-info" onClick={clearFilter}>Clear Filter</button>
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-info" onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? 'Sort Desc' : 'Sort Asc'}
            </button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={employees}
          pagination
          paginationServer
          paginationTotalRows={employees.length}
          onChangePage={page => setCurrentPage(page)}
          onChangeRowsPerPage={rowsPerPage => setCurrentPage(1)}
        />
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
                      <p><strong> Updated By: </strong>{history.hrName}</p>
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

export default EmployeeProcessSelection


{/* <table className='table table-striped table-bordered' style={{ border: '1px solid black', padding: '8px' }}>
        <thead>
          <tr>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Name</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Email</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Applied For Job Profile</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Mobile No</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Gender</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Register Date</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center'}}>Remarks</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>PROCESS</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
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
              <td> <input
                  type="text"
                  className="form-control"
                  value={remarks[employee.id] || ''}
                  onChange={(e) => handleRemarksChange(e, employee.id)}
                /></td>   
              <td>
                <select className='form-select' style={{padding:"2px 5px"}} value={employee.selectedProcess || ''} onChange={(e) => handleProcessChange(e, employee.id)}>
                  <option value="" disabled>Select Process</option>
                  <option value="HDFC">HDFC</option>
                  <option value="ICICI">ICICI</option>
                  <option value="MIS">MIS</option>

                </select>
              </td>
              <td style={{ textAlign: 'center', }}>
                <button  className="btn btn-outline-info"  onClick={() => handleAddInterviewProcess(employee.id)}>Schedule</button>
               
              </td>

            </tr>
          ))}
        </tbody>
      </table> */}
{/* <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
          </li>
          <li className="page-item"><span className="page-link">{currentPage}</span></li>
          <li className={`page-item ${currentEmployees.length < itemsPerPage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav> */}