import React, { useState, useEffect} from 'react'
import { getlistOfRejectedEmpList,MrResponseSubmit, selectInterviewProcess ,getEmployeeDetails } from '../services/EmployeeServiceJWT';
import {getAttendenedInterview} from '../services/InterviewServiceJWT';
import {useUser} from '../auth/UserContext';
import { format } from 'date-fns';

const RejectedStatusPage = () => {

  const {user} = useUser();
  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({}); 
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterDate, setFilterDate] = useState(null); // State for filter date
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


  const [attendedProcesses, setAttendedProcesses] = useState([]);

  useEffect(() => {
    getAllEmployees();
    getAttendenedProcesses();  
  }, [token,filterDate, sortOrder,currentPage]);

  function getAllEmployees() {
    getlistOfRejectedEmpList()
      .then((response) => {
        let filteredEmployees = response.data;

        if (filterDate) {
          filteredEmployees = filteredEmployees.filter(emp => new Date(emp.creationDate) >= filterDate);
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
    setAttendedProcesses(processes);
  })
  .catch(error => {
    console.error('Error fetching attended processes:', error);
  });
};

  const handleProcessChange =(e, employeeId) => {
    const selectedProcess = e.target.value;
    setEmployees(preEmployees => 
      preEmployees.map (employee =>
        employee.id === employeeId ? { ...employee, selectedProcess } : employee
    ));
  };

  // const handleHrResponse = (e, employeeId) => {
  //   const selectedValue = e.target.value;
  //   console.log('Selected Response:', selectedValue);
  //   setSelectedResponse(prevSelectedResponse => ({ ...prevSelectedResponse, [employeeId]: selectedValue }));
  // };


  // const handleHrResponseValue = (employeeId) => {
  //   const selectedValue = selectedResponse[employeeId];
  //   console.log('Submitting HR Response for Employee:', employeeId, 'Response:', selectedValue);
  //   MrResponseSubmit(employeeId, selectedValue)
  //     .then(response => {
  //       console.log('Response from Backend:', response.data);
  //       setEmployees(prevEmployees =>
  //         prevEmployees.map(emp =>
  //           emp.id === employeeId ? response.data : emp
  //         )
  //       );
  //     })
  //     .catch(error => {
  //       console.error('Error submitting HR response:', error);
  //     });
  // };
  const handleAddInterviewProcess = (employeeId) =>{
    const employee = employees.find(emp => emp.id === employeeId);
    const interviewDate = new Date().toISOString().slice(0,10);
    const interviewTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
   
    const interviewData = {
      processName:employee.selectedProcess,
      interviewDate:interviewDate,
      interviewTime:interviewTime,
      status:"ReScheduled",
      scheduledBy:user?user.name:'Unknown',

    };
    selectInterviewProcess(employeeId,interviewData)
    .then(response => {
      setAlertMessage("Interview Process assigned succussfully");
      setAlertType("success");
      setTimeout(() =>{
        setShowAlert(false);
      },3000);
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
    if(response.data.length > 0){
      const employeeDetails = response.data[0];
      console.log('Employee Details:', employeeDetails);
      setSelectedEmployeeDetails(employeeDetails);
      setShowDetailsModal(true);
    }else {
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
 const indexOfLastEmployee = currentPage * itemsPerPage;
 const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
 const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

 // Change page
 const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='container'>
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
            <th>Re Interview</th>
            <th>Submit Response</th> 
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
                {/* <td>
                  <select value={employee.selectedProcess||''} onChange={e=> handleProcessChange(e,employee.id)}>
                  <option value="" disabled>Select response</option>
                  <option value = "HDFC">HDFC</option>
                  <option value = "ICICI">ICICI</option>
                  <option value = "MIS">MIS</option>
                  </select>
                </td>  */}
                {/* <td>
                  <select value={employee.selectedProcess || ''} onChange={e => handleProcessChange(e, employee.id)}>
                    <option value="" disabled>Select response</option>
                    <option value="HDFC" disabled={attendedProcesses[employee.id] && attendedProcesses[employee.id].includes("HDFC")}>HDFC</option>
                    <option value="ICICI" disabled={attendedProcesses[employee.id] && attendedProcesses[employee.id].includes("ICICI")}>ICICI</option>
                    <option value="MIS" disabled={attendedProcesses[employee.id] && attendedProcesses[employee.id].includes("MIS")}>MIS</option>
                  </select>
                </td> */}
                 <td>
                <select
                  value={employee.selectedProcess || ''}
                  onChange={e => handleProcessChange(e, employee.id)}
                >
                  <option value="" disabled>Select response</option>
                  <option
                    value="HDFC"
                    disabled={attendedProcesses.some(process => process.employeeId === employee.id && process.processName === "HDFC")}
                  >
                    HDFC
                  </option>
                  <option
                    value="ICICI"
                    disabled={attendedProcesses.some(process => process.employeeId === employee.id && process.processName === "ICICI")}
                  >
                    ICICI
                  </option>
                  <option
                    value="MIS"
                    disabled={attendedProcesses.some(process => process.employeeId === employee.id && process.processName === "MIS")}
                  >
                    MIS
                  </option>
                </select>
              </td>
                 {/* <td>
                  <button onClick={() => handleAddInterviewProcess(employee.id)}>Submit</button>
                </td> */}
                 <td>
                <button
                  onClick={() => handleAddInterviewProcess(employee.id)}
                  disabled={attendedProcesses.some(process => process.employeeId === employee.id)}
                >
                  Submit
                </button>
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
          <li className={`page-item ${currentEmployees.length < itemsPerPage ? 'disabled' : ''}`}>
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

export default RejectedStatusPage
