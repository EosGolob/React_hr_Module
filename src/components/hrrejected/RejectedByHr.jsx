import React, { useState, useEffect,useRef,useContext} from 'react'
import { gethrRejectedEmpList,updateEmployeeHrRejectedScreeningResponse,getEmployeeDetails } from '../services/EmployeeServiceJWT';
import * as XLSX from 'xlsx';
import {useUser} from '../auth/UserContext';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate,Link } from 'react-router-dom'; 
import NotificationIcon from '../NotificationIcon';

  function RejectedByHr ({name}) {
  // const {user} = useUser();
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  // const tableRef = useRef(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('idle'); 
  const [submissionError, setSubmissionError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllEmployees();
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let timeoutId;
    if (submissionStatus === 'success') {
      timeoutId = setTimeout(() => setSubmissionStatus('idle'), 2000); // Hide success message after 2 seconds
    } else if (submissionStatus === 'error') {
      timeoutId = setTimeout(() => setSubmissionError(null), 2000); // Hide error message after 2 seconds
    }
    return () => clearTimeout(timeoutId); // Cleanup timeout if component unmounts
  }, [submissionStatus]);

  function getAllEmployees() {
    gethrRejectedEmpList()
      .then((response) => {
        console.log('Response Data:', response.data);
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      }).catch(error => {
        console.error(error)
      });
  }
  
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const handleFilter = () => {
  const filtered = employees.filter(employee => {
    const creationDate = new Date(employee.creationDate);
    // Set hours, minutes, seconds, and milliseconds to 0 to compare only the date part
    creationDate.setUTCHours(0, 0, 0, 0);

    // Assuming startDate and endDate are already Date objects
    // Convert them to UTC dates as well
    const startDateUTC = startDate ? new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) : null;
    const endDateUTC = endDate ? new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())) : null;

    return (
      (!startDateUTC || creationDate >= startDateUTC) &&
      (!endDateUTC || creationDate <= endDateUTC)
    );
  });
  const sortedFiltered = filtered.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
  setFilteredEmployees(sortedFiltered);
  // setFilteredEmployees(filtered);
};

const handleClearFilter = () => {
  setStartDate(null);
  setEndDate(null);
  setFilteredEmployees(employees); 
  setCurrentPage(1); 
};

const handleDownload = () => {
  if (submissionStatus === 'pending') {
    console.error('Please wait for previous submission to complete');
    return;
  }
  const filteredData = filteredEmployees.map(employee => ({
    Name: employee.fullName,
    Email: employee.email,
    'Job Profile': employee.jobProfile,
    'Mobile No': employee.mobileNo,
    'Register Date': formatDate(employee.creationDate),
    'Permanent Address': employee.permanentAddress,
    Gender: employee.gender,
  }));

  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Employees');
  XLSX.writeFile(workbook, 'filtered_employees.xlsx');
};
 
// const handleHrResponseValue = (employeeId) => {
   
//     setSubmissionStatus('pending');
//     updateEmployeeHrRejectedScreeningResponse(employeeId, null,name)
//       .then(response => {
//         setSubmissionStatus('success');
//         console.log('Response from backend:', response.data);
//         getAllEmployees();
//       })
//       .catch(error => {
//         setSubmissionStatus('error')
//         setSubmissionError(error.message)
//         console.error('Error updating employee:', error);
//       });
//   };

const handleHrResponseValue = (employeeId) => {
  if (isSubmitting) {
    console.error('Please wait for the current submission to complete');
    return;
  }

  setIsSubmitting(true);
  setSubmissionStatus('pending');
  
  updateEmployeeHrRejectedScreeningResponse(employeeId, null, name)
    .then(response => {
      setSubmissionStatus('success');
      console.log('Response from backend:', response.data);
      getAllEmployees();
    })
    .catch(error => {
      setSubmissionStatus('error');
      setSubmissionError(error.message);
      console.error('Error updating employee:', error);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
};


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
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Job Profile',
      selector: row => row.jobProfile,
      sortable: true,
    },
    {
      name: 'Mobile No',
      selector: row => row.mobileNo,
      sortable: true,
    },
    {
      name: 'Register Date',
      selector: row => formatDate(row.creationDate),
      sortable: true,
    },
    {
      name: 'Permanent Address',
      selector: row => row.permanentAddress,
      sortable: true,
    },
    {
      name: 'Gender',
      selector: row => row.gender,
      sortable: true,
    },
    {
      name: 'Remark Profile Screen',
      selector: row => row.profileScreenRemarks,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <button className="btn btn-outline-info" onClick={() => handleHrResponseValue(row.id)}>Screening</button>
      )
    }
  ];


  return (
    <>
    <div class="header">
                <span class="pe-3">{currentDateTime}</span>
                <NotificationIcon />
                <Link class="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
            </div>
    <div className='container'>
      <br></br>
      <br></br>
      
      {submissionStatus === 'error' && (
          <div className="alert alert-danger">
            {submissionError}
          </div>
        )}
        {submissionStatus === 'success' && (
          <div className="alert alert-success">
            Submission successful!
          </div>
        )}

      <div className="row mb-3">
        <div className="col-auto d-flex align-items-center">
          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" className='form-control' onChange={(e) => setStartDate(new Date(e.target.value))} />
        </div>
        <div className="col-auto d-flex align-items-center">
          <label htmlFor="endDate">End Date:</label>
          <input type="date" id="endDate" className='form-control' onChange={(e) => setEndDate(new Date(e.target.value))} />
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-info me-2" onClick={handleFilter}>Filter</button>
          <button className="btn btn-outline-info me-2" onClick={handleClearFilter}>Clear Filter</button>
          <button className="btn btn-outline-info" onClick={handleDownload} disabled={filteredEmployees.length === 0}>Download Filtered Data</button>
        </div>
      </div>
      {isSubmitting && (
          <div className="loading-indicator">
            Submitting response, please wait...
          </div>
        )}
      <DataTable
          columns={columns}
          data={filteredEmployees}
          pagination
          highlightOnHover
          pointerOnHover
          striped
          responsive
          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#1C3657',
              }
            },
            table: {
              style: {
                border: '1px solid #ddd',
                width: '1160px'
              }
            },
            headCells: {
              style: {
                color: 'white', // Change text color of header cells
                fontSize: '11px' // Example: Adjust font size of header cells
              }
            }
          }}
        />
    
      </div>
    </>
  );
  
};

export default RejectedByHr
