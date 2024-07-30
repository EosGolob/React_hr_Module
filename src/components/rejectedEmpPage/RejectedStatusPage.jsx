import React, { useState, useEffect,useContext } from 'react'
import { getlistOfRejectedEmpList, selectInterviewProcess, getEmployeeDetails } from '../services/EmployeeServiceJWT';
import { getAttendenedInterview } from '../services/InterviewServiceJWT';
import { useUser } from '../auth/UserContext';
import { format } from 'date-fns';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom'; 


const RejectedStatusPage = () => {

  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  // const [selectedResponse, setSelectedResponse] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterDate, setFilterDate] = useState(null); // State for filter date
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectionError, setSelectionError] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    getAllEmployees();
    getAttendenedProcesses();
  }, [token, filterDate, sortOrder, currentPage]);

  function getAllEmployees() {
    getlistOfRejectedEmpList()
      .then((response) => {
        let filteredEmployees = response.data;

        if (filterDate) {
          filteredEmployees = filteredEmployees.filter(emp => new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10));
        }

        filteredEmployees.sort((a, b) => {
          if (sortOrder === 'asc') {
            return new Date(a.creationDate) - new Date(b.creationDate);
          } else {
            return new Date(b.creationDate) - new Date(a.creationDate);
          }
        });
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
        // setAttendedProcesses(processes);
      })
      .catch(error => {
        console.error('Error fetching attended processes:', error);
      });
  };

  const handleProcessChange = (e, employeeId) => {
    const selectedProcess = e.target.value;
    setEmployees(preEmployees =>
      preEmployees.map(employee =>
        employee.id === employeeId ? { ...employee, selectedProcess } : employee
      ));
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
      status: "ReScheduled",
      scheduledBy: user ? user.name : 'Unknown',

    };
    selectInterviewProcess(employeeId, interviewData)
      .then(response => {
        window.location.reload();
        setAlertMessage("Interview Process assigned succussfully");
        // setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

      }).catch(error => {
        setAlertMessage("Error assigning interview process.try again");
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
      name: 'Remark By Hr',
      selector: row => row.reMarksByHr,
    },
    {
      name: 'Remark By Manager',
      selector: row => row.reMarksByManager,
    },
    {
      name: 'Remark Profile Screen',
      selector: row => row.profileScreenRemarks,
    },
    {
      name: 'Re Interview',
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
      name: 'Submit Response',
      cell: row => (
        <button
          className="btn btn-outline-info"
          onClick={() => handleAddInterviewProcess(row.id)}
        >
          Schedule
        </button>
      )
    }
  ]

  return (
    <>
      <div class="header">
        <span class="pe-3">Friday, July 8, 2022 19:18:17</span>
        <a class="logout-btn" href="#" onClick={handleLogout}><i class="fas fa-power-off"></i></a>
      </div>
      <div className='container' >
        <div>
          {selectionError && <p className="alert alert-danger">Select process first</p>}
        </div>
        {showAlert && (
          <div className="alert alert-success" role="alert">
            {alertMessage}
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

export default RejectedStatusPage


  // Calculate current employees to display based on pagination
  // const indexOfLastEmployee = currentPage * itemsPerPage;
  // const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  // const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Change page
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

{/* <table className='table table-striped table-bordered'style={{ border: '1px solid black', padding: '8px' }}>
        <thead>
          <tr>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Name</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Email</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Job Profile</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Mobile No</th>         
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Gender</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Register Date</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Remark By Hr</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Remark By Manager</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Remark Profile Screen</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Re Interview</th>
            <th style={{fontFamily:'sans-serif',backgroundColor:'lightblue',textAlign:'center' }}>Submit Response</th> 
          </tr>
        </thead>
        <tbody>
          { currentEmployees.map((employee) => (
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
                <td>{employee.reMarksByHr}</td>
                <td>{employee.reMarksByManager}</td>
                <td>{employee.profileScreenRemarks}</td>
                <td  style={{ textAlign: 'center' }}>
                  <select className='form-select' value={employee.selectedProcess||''} onChange={e=> handleProcessChange(e,employee.id)}>
                  <option value="" disabled>Select response</option>
                  <option value = "HDFC">HDFC</option>
                  <option value = "ICICI">ICICI</option>
                  <option value = "MIS">MIS</option>
                  </select>
                </td>  
               
                 <td  style={{ textAlign: 'center', }}>
                  <button  className="btn btn-outline-info" onClick={() => handleAddInterviewProcess(employee.id)}>Submit</button>
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