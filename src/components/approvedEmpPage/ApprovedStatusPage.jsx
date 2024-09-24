import React, { useState, useEffect, useRef, useContext } from 'react'
import { getEmployeeDetails, getlistOfApprovedEmpList } from '../services/EmployeeServiceJWT';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Approve.css';
import NotificationIcon from '../NotificationIcon'

const ApprovedStatusPage = () => {

  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
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
    getlistOfApprovedEmpList()
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
    setCurrentPage(5);
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredEmployees(employees); // Reset to all employees
    setCurrentPage(1); // Reset pagination
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
  const showEmployeeDetails = (employeeId) => {
    getEmployeeDetails(employeeId)
      .then((response) => {
        if (response.data.length > 0) {
          const employeeDetails = response.data[0];
          console.log('Employee Details:', employeeDetails);
          setSelectedEmployeeDetails(employeeDetails);
          setShowDetailsModal(true);
        } else {
          console.error('Employee not found ');
          setSelectedEmployeeDetails(null);
          setShowDetailsModal(false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setSelectedEmployeeDetails(null);
        setShowDetailsModal(false);
      });
  };
  const closeModal = () => {
    setShowDetailsModal(false);
  };

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle change in items per page
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  // Define columns for DataTable
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
      selector: row => (
        <button className='btn btn-link' onClick={() => showEmployeeDetails(row.id)}>
          {row.fullName}
        </button>
      ),
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
    // {
    //   name: 'Remark By Hr',
    //   selector: row => row.reMarksByHr,
    //   sortable: true,
    // },
    // {
    //   name: 'Remark By Manager',
    //   selector: row => row.reMarksByManager,
    //   sortable: true,
    // },
    // {
    //   name: 'Remark Profile Screen',
    //   selector: row => row.profileScreenRemarks,
    //   sortable: true,
    // },
  ];
  return (
    <>
      <div className="header">
        <span className="pe-3">{currentDateTime}</span>
        <NotificationIcon />
        <Link className="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
      </div>
      <div className='container' >
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
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 20]}

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
                color: 'white', // Change text color of header cells
                fontSize: '11px' // Example: Adjust font size of header cells
              }
            }
          }}
        />
        {selectedEmployeeDetails && (
          <div className="modal" style={{ display: showDetailsModal ? 'block' : 'none' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-center">Employee Details:</h5>
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

export default ApprovedStatusPage

