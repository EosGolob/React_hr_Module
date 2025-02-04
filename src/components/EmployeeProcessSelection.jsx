import React, { useEffect, useState, useContext } from 'react'
import { listEmployees, selectInterviewProcess, getEmployeeDetails } from './services/EmployeeServiceJWT';
import UsersService from './services/UsersService';
import { format } from 'date-fns';
import { useUser } from './auth/UserContext';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../components/auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../components/css/style.css';
import '../components/css/layout.css';
import '../components/css/fontawesome.css';
import '../components/css/bootstrap.min.css';
import './EmployeeProcessSelection.css';
import NotificationIcon from '../components/NotificationIcon'

function EmployeeProcessSelection({ name }) {
  const [employees, setEmployees] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  // const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectionError, setSelectionError] = useState(false);
  const [remarks, setRemarks] = useState({})
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('')
  const [processNames, setProcessNames] = useState([]);

  const [alert, setAlert] = useState({ message: '', type: '' });
  
  const jobTitles = [
    "CUSTOMER CARE EXECUTIVE",
    "CUSTOMER SERVICE REPRESENTATIVE",
    "ANALYSIS EXECUTIVE",
    "SENIOR CUSTOMER SERVICE REPRESENTATIVE",
    "SENIOR CUSTOMER CARE EXECUTIVE",
    "BILL DESK CO-ORDINATOR",
    "APPRENTICE - CUSTOMER CONTACT ASSISTANT",
    "RETAIL SALES ASSOCIATE",
    "SENIOR RETAIL SALES ASSOCIATE",
    "FLOOR COACH",
    "SR.CUSTOMER SERVICE REPRESENTATIVE",
    "CUSTOMER SUPPORT REPRESENTATIVE",
    "CUSTOMER SERVICE EXECUTIVE",
    "APPRENTICE-CUSTOMER CONTACT ASSISTANT",
    "SR. CUSTOMER SERVICE EXECUTIVE",
    "TR. SQL DEVELOPER",
    "SR. CUSTOMER SUPPORT REPRESENTATIVE",
    "SUBJECT MATTER EXPERT",
    "SENIOR ACCOUNTS EXECUTIVE",
    "ENGINEER",
    "ACCOUNTS EXECUTIVE FOR EMERSON PROJECT",
    "ACCOUNT EXECUTIVE",
    "CUSTOMER CARE ASSOCIATE",
    "QUALITY EXECUTIVE",
    "EXPORT CO-ORDINATOR",
    "ACCOUNTS EXECUTIVE-OPERATIONS",
    "ENGINEER RAC",
    "DIGITAL RELATIONSHIP MANAGER",
    "SOFTWARE TEST ENGINEER",
    "QUALITY ANALYST",
    "COORDINATOR",
    "TECHNICAL HELPDESK",
    "SR.DIGITAL RELATIONSHIP MANAGER",
    "QUALITY AND TRAINING- EXECUTIVE",
    "CREDIT CONTROL ASSISTANT",
    "BACK OFFICE EXECUTIVE",
    "MIS EXECUTIVE",
    "APPRENTICE-CUSTOMER CARE ASSOCIATE",
    "ASSISTANT MANAGER - OPERATIONS",
    "OFFICE ASSISTANT",
    "SOFTWARE DEVELOPER",
    "MECHANICAL DRAUGHTSMAN",
    "SR. MIS EXECUTIVE",
    "SR. MIS EXECUTIVE-OPERATIONS",
    "SR. QUALITY EXECUTIVE",
    "TEAM LEADER-OPERATIONS",
    "QUALITY AUDITOR",
    "Sr. PURCHASE EXECUTIVE",
    "OFFICE ASSISTANT - FRONT OFFICE DESK",
    "EXECUTIVE",
    "CUSTOMER RELATIONSHIP OFFICER",
    "Sr. CUSTOMER CARE EXECUTIVE",
    "TRAINER",
    "APPRENTICE- CUSTOMER CARE ASSOCIATE",
    "BUSINESS ANALYST",
    "DIGITAL MARKETING EXECUTIVE",
    "DATA EXECUTIVE",
    "CLIENT SERVICE RM",
    "Senior Software Developer",
    "SQL DEVELOPER",
    "PROCESS ASSOCIATE",
    "Sr. QUALITY ANALYST",
    "DIGITAL ACQUISITION SPECIALIST",
    "EXECUTIVE-ACCOUNTS RECEIVABLES",
    "DOT NET DEVELOPER",
    "CONSULTANT",
    "INTERN-CUSTOMER CARE EXECUTIVE",
    "FIELD SALES ASSOCIATES",
    "L1 TECHNICAL SUPPORT",
    "PRINCIPAL SOFTWARE ENGINEER"
  ];
  
  useEffect(() => {

    if (!token) {

      console.error('Token not found.');
      return;
    }
    getAllEmployees(token);
    fetchProcessNames();
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
    // }, [token, filterDate, sortOrder, currentPage]);
  }, [token, filterDate, currentPage]);


  const fetchProcessNames = () => {
    if (!token) {
      console.error('Token not found.');
      return;
    }
    UsersService.getAllProcessNames(token)
      .then(response => {
        setProcessNames(response);
      })
      .catch(error => {
        console.error('Error fetching process names:', error);
      });
  };

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
        // filteredEmployees.sort((a, b) => {
        //   if (sortOrder === 'asc') {
        //     return new Date(a.creationDate) - new Date(b.creationDate);
        //   } else {
        //     return new Date(b.creationDate) - new Date(a.creationDate);
        //   }
        // });
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
  const handleJobProfileChange = (e, employeeId) => {
    const selectedJobProfile = e.target.value;
    setEmployees(prevEmployees =>
      prevEmployees.map(employee => {
        if (employee.id === employeeId) {
          return { ...employee, selectedJobProfile: selectedJobProfile };
        }
        return employee;
      }));
  };

  const handleAddInterviewProcess = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    // if (!employee.selectedProcess || !remarks[employeeId]) {
    //   setSelectionError(true);
    //   return; 
    // }
    const interviewDate = new Date().toISOString().slice(0, 10);
    const interviewTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const interviewData = {
      processName: employee.selectedProcess,
      interviewDate: interviewDate,
      interviewTime: interviewTime,
      status: "Scheduled",
      jobProfile: employee.selectedJobProfile,
      // scheduledBy: user ? user.name : 'Unknown',
      scheduledBy: name,
      remarks: remarks[employeeId] || ''
    };
    selectInterviewProcess(employeeId, interviewData)
      .then(response => {
        console.log("Interview Process added successfully:", response.data);
        // setAlertMessage("Interview process assigned successfully.");
        setAlert({ message: "Interview process assigned successfully.", type: 'success' });
        // setShowAlert(true);
        setTimeout(() => {
          // setShowAlert(false);
          getAllEmployees(token);
        }, 1000);

        getAllEmployees(token);
      })
      //     .catch(error => {
      //       console.error("Error adding interview process:", error);
      //       setAlertMessage("Error assigning interview process. Please try again.");
      //       setShowAlert(true);
      //       setTimeout(() => {
      //         setShowAlert(false);
      //       },1000);
      //     });
      // };
      .catch(error => {
        const errorMessage = error.response && error.response.data ? error.response.data : "Error assigning interview process. Please try again.";
        console.error("Error adding interview process:", error);
        setAlert({ message: errorMessage, type: 'error' });
        setTimeout(() => setAlert({ message: '', type: '' }), 3000); // Clear after 3 seconds
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

  // const toggleSortOrder = () => {
  //   setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  // };


  const handleRemarksChange = (e, employeeId) => {
    const value = e.target.value;
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [employeeId]: value
    }));
    const inputElement = e.target;
    inputElement.addEventListener('blur', () => {
      if (!value) {
        setSelectionError(true);
      } else {
        setSelectionError(false);
      }
    });
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
    // {
    //   name: 'Applied For Job Profile',
    //   selector: row => row.jobProfile
    // },
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
          style={{
            padding: "10px 15px",
            fontSize: "14px",
            height: "40px",
            width: "100px"
          }}
          value={row.selectedProcess || ''}
          onChange={(e) => handleProcessChange(e, row.id)}
        >
          <option value="" disabled>Select</option>
          {processNames.map((process, index) => (
            <option key={index} value={process}>{process}</option>
          ))}
        </select>
      )
    },
    {
      name: 'Job Profile',
      selector: row => row.selectedJobProfile || 'Not selected',
      cell: (row) => (
        <select  className='form-select'
        style={{
                  padding: "10px 15px",
                  fontSize: "14px",
                  height: "40px",
                  width: "100px"
                }}
        onChange={(e) => handleJobProfileChange(e, row.id)} value={row.selectedJobProfile || ''}>
          <option value="">Select Job Profile</option>
          {jobTitles.map((jobTitle, index) => (
            <option key={index} value={jobTitle}>{jobTitle}</option>
          ))}
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
        <span className="pe-3">{currentDateTime}</span>
        <NotificationIcon />
        <Link className="logout-btn" onClick={handleLogout} ><i class="fas fa-power-off"></i></Link>
      </div>
      <div className="dashboard-wrap">
        {/* <div>
          {selectionError && <p className="alert alert-danger">Please fill all required fields</p>}
        </div>
        {showAlert && (
          <div className="alert alert-success" role="alert">{alertMessage}

          </div>
        )} */}
        {alert.message && (
          <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
            {alert.message}
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
          {/* <div className="col-auto">
            <button className="btn btn-outline-info" onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? 'Sort Desc' : 'Sort Asc'}
            </button>
          </div> */}
        </div>
        <DataTable
          columns={columns}
          data={employees}
          pagination
          paginationServer
          paginationTotalRows={employees.length}
          onChangePage={page => setCurrentPage(page)}
          onChangeRowsPerPage={rowsPerPage => setCurrentPage(1)}
          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#1C3657',
              }
            },
            table: {
              style: {
                border: '1px solid #ddd',
                width: '1700px',
                // textAlign:'right'
              }
            },
            headCells: {
              style: {
                color: 'white', // Change text color of header cells
                fontSize: '12px',// Example: Adjust font size of header cells

              }
            }
          }}
        />
        {selectedEmployeeDetails && (
          <div className="modal" style={{ display: showDetailsModal ? 'block' : 'none' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Employee Details:</h5>
                </div>
                <div className="modal-body">
                  {/* <p><strong>Full Name:</strong> {selectedEmployeeDetails.fullName}</p>
                  <p><strong>Email: </strong>{selectedEmployeeDetails.email}</p>
                  <p><strong>Aadhar Number:</strong>  {selectedEmployeeDetails.aadhaarNumber}</p>
                  <p><strong>Screening Remarks: </strong>{selectedEmployeeDetails.profileScreenRemarks}</p> */}
                  <table>
                    <tr>
                      <th>Full Name</th>
                      <td>{selectedEmployeeDetails.fullName}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{selectedEmployeeDetails.email}</td>
                    </tr>
                    <tr>
                      <th>Aadhar Number</th>
                      <td>{selectedEmployeeDetails.aadhaarNumber}</td>
                    </tr>
                  </table>
                  <hr />
                  {/* {selectedEmployeeDetails.statusHistories && selectedEmployeeDetails.statusHistories.map((history, index) => (
                    <div key={index}>
                      <p><strong>Status: </strong><span className="status" data-status={history.status}>{history.status}</span></p>
                      <p><strong> Updated By: </strong>{history.hrName}</p>
                      <p><strong>Changes DateTime: </strong>{format(new Date(history.changesDateTime), 'yyyy-MM-dd HH:mm:ss')}</p>
                      <hr />
                    </div>
                  ))} */}
                  {/* {selectedEmployeeDetails.statusHistories && (
                    <table>
                      <thead>
                        <tr>
                          <th>status</th>
                          <th>Updated By</th>
                          <th>Changes Date Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployeeDetails.statusHistories.map((history, index) => (
                          <tr key={index}>
                            <td><span className="status" data-status={history.status}>{history.status}</span></td>
                            {history.hrName && <td>{history.hrName}</td>}
                            <td>{format(new Date(history.changesDateTime), 'yyyy-MM-dd HH:mm:ss')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )} */}
                  <table>
                    <thead>
                      <tr>
                        <th>status</th>
                        <th>Remarks</th>
                        <th>Updated By</th>
                        <th>Changes Date Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployeeDetails.statusHistories.map((history, index) => (
                        <tr key={index}>
                          <td>
                            {history.status ? <span className="status" data-status={history.status}>{history.status}</span> : <span></span>}
                          </td>
                          {history.remarksOnEveryStages ? <td>{history.remarksOnEveryStages}</td> : <td></td>}
                          {history.hrName ? <td>{history.hrName}</td> : <td></td>}
                          <td>{format(new Date(history.changesDateTime), 'yyyy-MM-dd HH:mm:ss')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
