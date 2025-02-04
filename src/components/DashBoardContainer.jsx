import React, { useEffect, useState ,useContext } from 'react';
import { getTotalCount, getTotalCountForDate, countByJobProfileAndGender, groupBySource, monthWiseCount } from '../components/services/DashBoardResponseApiJWT.js';
import './DashBoardContainer.css'; 
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/auth/AuthContext';

const DashBoardContainer = () => {

    const [data, setData] = useState({
        totalEmp: 0,
        registerCountOnDateWise: 0,
        hiredCount: 0,
        rejectedCount: 0,
        inProcessApplicationCount: 0
    });
    const { logout } = useContext(AuthContext);
    const [genderData, setGenderData] = useState([]);
    const [selectedJobProfile, setSelectedJobProfile] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [filteredData, setFilteredData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sourceData, setSourceData] = useState([]);
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [totalCountForDate, setTotalCountForDate] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [monthWiseCountData, setMonthWiseCountData] = useState(0);
    // const [selectedFilterDate, setSelectedFilterDate] = useState('');
    const [selectedMonthForYearFilter, setSelectedMonthForYearFilter] = useState('');
    const [selectedYearForFilter, setSelectedYearForFilter] = useState('');


    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        if (selectedMonth && selectedYear) {
            const fetchMonthWiseCount = async () => {
                try {
                    const monthData = await monthWiseCount(selectedYear, selectedMonth);
                    setMonthWiseCountData(monthData[0]?.count || 0);
                } catch (error) {
                    setError("Failed to fetch month-wise data.");
                }
            };

            fetchMonthWiseCount();
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        if (selectedMonthForYearFilter && selectedYearForFilter) {
            handleMonthYearFilterChange();
        }
    }, [selectedMonthForYearFilter, selectedYearForFilter]);


    const fetchData = async (date = '') => {
        try {
            
            const fetchedData = await getTotalCount(date); 
            setData(fetchedData);
           
            const [genderData, sourceData] = await Promise.all([
                countByJobProfileAndGender(),
                groupBySource()
            ]);

            setGenderData(genderData);
            setSourceData(sourceData);
            setLoading(false);
        } catch (error) {
            setError(error.message || "Failed to fetch data.");
            setLoading(false);
        }
    };

  

    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;
        setSelectedDate(selectedDate);
        if (selectedDate) {
            try {
                const count = await getTotalCountForDate(selectedDate);
                setTotalCountForDate(count);
            } catch (error) {
                setError("Failed to fetch data for the selected date.");
            }
        }
        else {
            setTotalCountForDate(0);
            fetchData();
        }
    };





    const handleMonthYearFilterChange = async () => {
        if (selectedMonthForYearFilter && selectedYearForFilter) {
            try {         
                const fetchedData = await getTotalCount(selectedMonthForYearFilter, selectedYearForFilter);
                setData(fetchedData);
                setMonthWiseCountData(fetchedData?.monthWiseCount || 0);
            } catch (error) {
                setError("Failed to fetch month-wise data.");
            }
        }
    };




    const handleFilterChange = () => {
        if (selectedJobProfile && selectedGender) {
            const filtered = genderData.filter(item =>
                item.jobProfile === selectedJobProfile && item.gender === selectedGender
            );
            setFilteredData(filtered);
        }
    };

    const handleSourceChange = (e) => {
        setSelectedSource(e.target.value);
    };


    const handleJobProfileChange = (e) => {
        setSelectedJobProfile(e.target.value);
        handleFilterChange();
    };

    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value);
        handleFilterChange();
    };

    const handleLogout = (e) => {
        e.preventDefault();
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            logout();
            navigate('/');
        }
    };


    const filteredSourceData = selectedSource
        ? sourceData.filter(item => item.source === selectedSource)
        : [];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <div className="header">
                <Link className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-power-off"></i>
                </Link>
            </div>

            <div className="top-class-filter" style={{ display: 'flex'}}>
                <div>            
                    <input
                        type="number"
                        value={selectedYearForFilter}
                        onChange={(e) => setSelectedYearForFilter(e.target.value)}
                        placeholder="YYYY"
                        style={{
                            borderRadius: '5px',
                            fontSize: "12px",
                            width: "120px",
                            padding: "5px 5px",
                            marginLeft: "20px",
                            marginTop: "35px"
                        }}
                    />
                </div>
                <div>
                    <select
                        id="month"
                        style={{
                            borderRadius: '5px',
                            fontSize: "12px",
                            width: "120px",
                            padding: "5px 5px",
                            marginLeft: "25px",
                            marginTop: "35px"
                        }}
                        value={selectedMonthForYearFilter}
                        onChange={(e) => setSelectedMonthForYearFilter(e.target.value)}
                    >
                        <option value="">Select Month</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="dashboard-container">
                <div className="card">
                    <h3>Total Employees</h3>
                    <div className='circle'>
                        <p >{data.totalEmp}</p>
                    </div>
                </div>

                <div className="card" style={{ backgroundColor: 'transparent' }}>
                    <h3>Hired Count</h3>
                    <div className='circle'>
                        <p>{data.hiredCount}</p>
                    </div>
                </div>
                <div className="card" style={{ backgroundColor: 'transparent' }}>
                    <h3>Rejected Count</h3>
                    <div className='circle'>
                        <p>{data.rejectedCount}</p>
                    </div>

                </div>
                <div className="card">
                    <h3>In Process Applications</h3>
                    <div className='circle'>
                        <p>{data.inProcessApplicationCount}</p>
                    </div>
                </div>
                {/* <div className='card' style={{ backgroundColor: 'transparent' }} > */}
                <div className='second-card' >

                    {/* <label htmlFor="jobProfile">Profile:</label> */}
                    {/* <div className='select-filter' > */}
                    <div >
                        <select
                            id="jobProfile"
                            value={selectedJobProfile}
                            onChange={handleJobProfileChange}
                            style={{
                                borderRadius: '5px',
                                fontSize: "12px"
                                , width: "120px"
                                , padding: "5px 5px",
                                marginRight: '20px'
                            }}
                        >
                            <option value="" disabled>Select Job Profile</option>
                            {genderData.map((item, index) => (
                                <option key={index} value={item.jobProfile}>
                                    {item.jobProfile}
                                </option>
                            ))}
                        </select>
                        {/* <label htmlFor="gender">Gender: </label> */}
                        <select
                            id="gender"
                            value={selectedGender}
                            onChange={handleGenderChange}
                            style={{ borderRadius: '5px', fontSize: "12px", width: "120px", padding: "5px 5px" }}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>

                    </div>
                    <div className="card"  >
                        <h3>Job Profile Count</h3>
                        {filteredData && filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <div key={index} >
                                    <div className='circle'>
                                        <p>{item.count}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="circle">
                                <p>0</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="second-card" style={{ backgroundColor: 'transparent' }}>

                    {/* <label htmlFor="source">Source:</label> */}
                    {/* <div className='select-filter'> */}
                    <div>
                        <select
                            id="source"
                            value={selectedSource}
                            onChange={handleSourceChange}
                            style={{ borderRadius: '5px', fontSize: "12px", width: "255px", padding: "5px 5px" }}
                        >
                            <option value="" disabled>Select Source</option>
                            {sourceData.map((item, index) => (
                                <option key={index} value={item.source}>
                                    {item.source || "Unknown"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='card'style={{ backgroundColor: 'transparent' }}>
                        <h3>Source Count</h3>
                        {selectedSource && filteredSourceData.length > 0 ? (
                            filteredSourceData.map((item, index) => (
                                <div key={index}>
                                    <div className='circle'>
                                        <p>{item.applicants}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='circle'>
                                <p>0</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="second-card" style={{ backgroundColor: 'transparent' }}>
                    {/* <div className='select-filter'> */}
                    <div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            style={{ borderRadius: '5px', fontSize: "12px", width: "255px", padding: "5px 5px" }}
                        />
                    </div>
                    <div className='card'style={{ backgroundColor: 'transparent' }}>
                        <h3>Date Wise Count</h3>
                        <div className='circle'>
                            {totalCountForDate > 0 ? (
                                <p>{totalCountForDate}</p>
                            ) : (
                                <p>0</p>
                            )}

                        </div>
                    </div>
                </div>

                <div className="second-card" style={{ backgroundColor: 'transparent' }}>

                    {/* <label htmlFor="year">Year:</label> */}
                    {/* <div className='select-filter'> */}
                    <div>
                        <input
                            type="number"
                            id="year"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            placeholder="YYYY"
                            style={{
                                borderRadius: '5px',
                                fontSize: "12px"
                                , width: "120px"
                                , padding: "5px 5px",
                                marginRight: '20px'
                            }}
                        />
                        {/* <label htmlFor="month">Month:</label> */}
                        <select
                            id="month"
                            style={{ borderRadius: '5px', fontSize: "12px", width: "120px", padding: "5px 5px" }}
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">Select Month</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className='card'>
                        <h3>Month Wise Count</h3>
                        <div className='circle'>
                            {selectedMonth && selectedYear && monthWiseCountData > 0 ? (
                                <p>{monthWiseCountData}</p>
                            ) : (
                                <p>0</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default DashBoardContainer;

