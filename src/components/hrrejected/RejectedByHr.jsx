import React, { useState, useEffect,useRef,useContext} from 'react'
import { gethrRejectedEmpList,updateEmployeeHrRejectedScreeningResponse,getEmployeeDetails } from '../services/EmployeeServiceJWT';
import * as XLSX from 'xlsx';
import {useUser} from '../auth/UserContext';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate,Link } from 'react-router-dom'; 

const RejectedByHr = () => {
  const {user} = useUser();
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const tableRef = useRef(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    getAllEmployees();
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(intervalId);
  }, []);

  
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
 
const handleHrResponseValue = (employeeId) => {
    if (!user || !user.name) {
        console.error('User information not available');
        return;
    }
    updateEmployeeHrRejectedScreeningResponse(employeeId, null,user.name)
      .then(response => {
        console.log('Response from backend:', response.data);
        getAllEmployees();
      })
      .catch(error => {
        console.error('Error updating employee:', error);
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
      // cell: row => (
      //   // <button className='btn btn-link' onClick={() => showEmployeeDetails(row.id)}>
      //     {row.fullName}
      //   </button>
      // ),
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
      name: 'Remark By Hr',
      selector: row => row.reMarksByHr,
      sortable: true,
    },
    {
      name: 'Remark By Manager',
      selector: row => row.reMarksByManager,
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
                <Link class="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
            </div>
    <div className='container'>
      <br></br>
      <br></br>
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
                width: '1500px'
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