// import React, { useState ,useContext} from 'react';
// import { downloadEmployeeReport,downloadSequentialEmployeeReport } from '../components/services/EmployeeServiceJWT'; 
// import './ReportDownload.css';
// import {Link } from 'react-router-dom';
// import { AuthContext } from '../components/auth/AuthContext';

// const ReportDownload = () => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [currentDateTime, setCurrentDateTime] = useState('');
//   const { logout } = useContext(AuthContext);

  
//   const handleDownloadReport = async () => {
//     if (!startDate || !endDate) {
//       alert('Please select both start and end dates');
//       return;
//     }

//     setLoading(true);

//     try {
     
//       const response = await downloadSequentialEmployeeReport(startDate, endDate);

      
//       const blob = new Blob([response.data], {
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       });

     
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = 'Employee_Report.xlsx'; 
//       document.body.appendChild(link);
//       link.click(); 
//       document.body.removeChild(link); 
//     } catch (error) {
//       console.error('Error downloading the report:', error);
//       alert('There was an error downloading the report. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = (e) => {
//     e.preventDefault(); 
//     const confirmLogout = window.confirm('Are you sure you want to logout?');
//     if (confirmLogout) {
//         logout();
//         navigate('/');
//     }
// };

//   return (
//   <>
//    <div className="header">
         
           
//             <Link className="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
//             </div>
//         <div className='download-report-container'>
//           <h1 className='report-title'>Employee Report</h1>
      
//           <div className='date-picker'>
//             <label className='label'>Start Date:</label>
//             <input
//               className='date-input'
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </div>
      
//           <div className='date-picker'>
//             <label className='label'>End Date:</label>
//             <input
//               className='date-input'
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>
      
//           <button className='download-button' onClick={handleDownloadReport} disabled={loading}>
//             {loading ? 'Downloading...' : 'Download Report'}
//           </button>
//         </div>
//         </>
//       );
// };

// export default ReportDownload;




import React, { useState, useContext } from 'react';
import { downloadEmployeeReport, downloadSequentialEmployeeReport } from '../components/services/EmployeeServiceJWT'; 
import './ReportDownload.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/auth/AuthContext';

const ReportDownload = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('daily'); // New state for report type (daily or monthly)
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleDownloadReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);

    try {
      let response;

      if (reportType === 'daily') {
        response = await downloadEmployeeReport(startDate, endDate); // Call the daily report API
      } else {
        response = await downloadSequentialEmployeeReport(startDate, endDate); // Call the monthly report API
      }

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Employee_Report.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading the report:', error);
      alert('There was an error downloading the report. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <Link className="logout-btn" onClick={handleLogout}><i className="fas fa-power-off"></i></Link>
      </div>

      <div className="download-report-container">
        <h1 className="report-title">Employee Report</h1>
        <div className="report-type-selector">
          <label className="label">Select Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="daily">Raw Report</option>
            <option value="monthly">Sequential Report</option>
          </select>
        </div>
        <div className="date-picker">
          <label className="label">Start Date:</label>
          <input
            className="date-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="date-picker">
          <label className="label">End Date:</label>
          <input
            className="date-input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        

        <button className="download-button" onClick={handleDownloadReport} disabled={loading}>
          {loading ? 'Downloading...' : 'Download Report'}
        </button>
      </div>
    </>
  );
};

export default ReportDownload;
