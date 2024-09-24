
import React, { useState, useEffect, useContext } from 'react';
import { getAllSearchNameApi } from './services/EmployeeServiceJWT';
import DataTable from 'react-data-table-component';
import NotificationIcon from './NotificationIcon';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../components/auth/AuthContext';
const columns = [
    // { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Full Name', selector: row => row.fullName, sortable: true },
    // { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Aadhaar Number', selector: row => row.aadhaarNumber, sortable: true },
    { name: 'Initial Status', selector: row => row.initialStatus, sortable: true },
    { name: 'Processes Status', selector: row => row.processesStatus, sortable: true },
    { name: 'HR Status', selector: row => row.hrStatus, sortable: true },
    { name: 'Manager Status', selector: row => row.managerStatus, sortable: true },
    { name: 'Last Interview Assin', selector: row => row.lastInterviewAssin, sortable: true },
    { name: 'RE Marks By HR', selector: row => row.reMarksByHr, sortable: true },
    { name: 'RE Marks By Manager', selector: row => row.reMarksByManager, sortable: true },
    { name: 'Profile Screen Remarks', selector: row => row.profileScreenRemarks, sortable: true },
];

const SearchByName = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState('');
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        getAllSearchNameApi()
            .then(response => {
                setEmployees(response.data);
                setFilteredEmployees(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (search) {
            setFilteredEmployees(
                employees.filter(employee =>
                    Object.values(employee).some(value =>
                        String(value).toLowerCase().includes(search.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredEmployees(employees);
        }
    }, [search, employees]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;


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
    const handleLogout = (e) => {
        e.preventDefault();
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            logout();
            navigate('/');
        }
    };
    return (
        <>
            <div className="header">
                <span className="pe-3">{currentDateTime}</span>
                <NotificationIcon />
                <Link className="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
            </div>
            <div className='container'>
                <br></br>
                <div className="row mb-3">
                <div className="col-auto">
                    <label htmlFor="filterDate" className="col-form-label">Search By Name</label>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ marginBottom: '10px', padding: '5px' }}
                    />
                    </div>
                </div>
                <DataTable
                    // title="Employee List"
                    columns={columns}
                    data={filteredEmployees}
                    pagination
                    // selectableRows
                    highlightOnHover
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
                            color: 'white', 
                            fontSize: '11px'
                          }
                        }
                      }}
                />
            </div>
        </>
    );
};

export default SearchByName;
