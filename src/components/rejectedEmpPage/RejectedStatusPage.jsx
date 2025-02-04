import React, { useState, useEffect, useContext } from 'react'
import { getlistOfRejectedEmpList, ReInterviewProcess, getEmployeeDetails } from '../services/EmployeeServiceJWT';
import { getAttendenedInterview } from '../services/InterviewServiceJWT';
import { format } from 'date-fns';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './RejectedStatusPage.css'
import UsersService from '../services/UsersService';
import NotificationIcon from '../NotificationIcon'


function RejectedStatusPage({ name }) {
  // const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  // const [selectedResponse, setSelectedResponse] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterDate, setFilterDate] = useState(null); // State for filter date
  // const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectionError, setSelectionError] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('')
  const [processNames, setProcessNames] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    fetchProcessNames();
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(intervalId);
  }, [token, filterDate, currentPage]);


  const fetchData = () => {
    getAllEmployees();
    getAttendenedProcesses();
  };

  function getAllEmployees() {
    getlistOfRejectedEmpList()
      .then((response) => {
        let filteredEmployees = response.data;

        if (filterDate) {
          filteredEmployees = filteredEmployees.filter(emp => new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10));
        }
        console.log('Response Data:', response.data);
        setEmployees(filteredEmployees);
      }).catch(error => {
        console.error(error)
      });
  }


  const getAttendenedProcesses = () => {
    Promise.all(
      employees.map(employee => getAttendenedInterview(employee.id))
    )
      .then(processes => {
        console.log('Attended Processes Data:', processes);
      })
      .catch(error => {
        console.error('Error fetching attended processes:', error);
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
    if (isSubmitting) return;

    const employee = employees.find(emp => emp.id === employeeId);

    setIsSubmitting(true);

    const interviewDate = new Date().toISOString().slice(0, 10);
    const interviewTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const interviewData = {
      processName: employee.selectedProcess,
      interviewDate: interviewDate,
      interviewTime: interviewTime,
      status: "ReScheduled",
      scheduledBy: name
    };

    ReInterviewProcess(employeeId, interviewData)
      .then(response => {
        fetchData();
        setAlertMessage("Interview Process assigned successfully");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setAlertType('');
          setAlertMessage('');
        }, 3000);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setAlertMessage(error.response.data);
        } else {
          setAlertMessage(error.message); // or error.toString()
        }
        setAlertType("error");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setAlertType('');
          setAlertMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsSubmitting(false);
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



  const handleLogout = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
      navigate('/');
    }
  };
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
      selector: row => row.email,
    },
    {
      name: 'Job Profile',
      selector: row => row.jobProfile,
    },
    {
      name: 'Mobile No',
      selector: row => row.mobileNo,
    },
    {
      name: 'Gender',
      selector: row => row.gender,
    },
    {
      name: 'Register Date',
      selector: row => new Date(row.creationDate).toLocaleDateString(),
    },

    {
      name: 'Re-Schedule',
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
      name: 'Submit Response',
      cell: row => (
        <button
          className="btn btn-outline-info"
          onClick={() => handleAddInterviewProcess(row.id)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Schedule'}
        </button>
      )
    }
  ]

  return (
    <>
      <div class="header">
        <span class="pe-3">{currentDateTime}</span>
        <NotificationIcon />
        <Link class="logout-btn" href="#" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
      </div>
      <div className='container' >
        <br></br>
        <div className={`alert ${alertType === 'success' ? 'alert-success' : alertType === 'error' ? 'alert-danger' : ''}`} role="alert">
          {alertMessage}
        </div>
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
                width: '1150px'
              }
            },
            headCells: {
              style: {
                color: 'white',
                fontSize: '11px'
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

export default RejectedStatusPage

