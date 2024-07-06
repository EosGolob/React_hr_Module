import React, { useEffect, useState } from 'react'
import { listEmployees, selectInterviewProcess, getEmployeeDetails } from './services/EmployeeServiceJWT';
import { format } from 'date-fns';
import {useUser} from './auth/UserContext';


const EmployeeProcessSelection = () => {
  const{user} = useUser();

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


  useEffect(() => {

    if (!token) {
  
      console.error('Token not found.');
      return;
    }
    getAllEmployees(token);
  }, [token, filterDate,sortOrder,currentPage]);

  // function getAllEmployees() {
  //     listEmployees()
  //         .then((response) => {
  //             console.log('Response Data:', response.data);
  //             const updatedEmployees = response.data.map(employee => ({ ...employee, selectedProcess: null }));
  //             setEmployees(updatedEmployees);
  //         }).catch(error => {
  //             console.error(error.massage)
  //         });
  //     };



  const getAllEmployees = (token) => {
    listEmployees(token)
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
      })
      .catch(error => {
        console.error('Error fetching employees:', error.message);
      });
  };

  const handleProcessChange = (e, employeeId) => {
    const selectedProcess = e.target.value;
    setEmployees(prevEmployees => prevEmployees.map(employee => {
      if (employee.id === employeeId) {
        return { ...employee, selectedProcess: selectedProcess };
      }
      return employee;
    }));
  };


  const handleAddInterviewProcess = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    const interviewDate = new Date().toISOString().slice(0, 10);
    const interviewTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const interviewData = {
      processName: employee.selectedProcess,
      interviewDate: interviewDate,
      interviewTime: interviewTime,
      status: "Scheduled",
      scheduledBy:user?user.name:'Unknown',
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
            <th>Applied For Job Profile</th>
            <th>Mobile No</th>
            <th>Gender</th>
            <th>Register Date</th>
            <th>PROCESS</th>
            <th>ACTION</th>
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
              <td>
                <select value={employee.selectedProcess || ''} onChange={(e) => handleProcessChange(e, employee.id)}>
                  <option value="" disabled>Select Process</option>
                  <option value="HDFC">HDFC</option>
                  <option value="ICICI">ICICI</option>
                  <option value="MIS">MIS</option>

                </select>
              </td>
              <td>
                <button onClick={() => handleAddInterviewProcess(employee.id)}>Schedule</button>

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

export default EmployeeProcessSelection