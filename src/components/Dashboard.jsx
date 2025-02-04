import React, { useState , useEffect,useContext} from 'react';
import ApplicationMetrics from './ApplicationMetrics';
import LineGraph from './LineGraph';
import { applicationData } from './data.jsx';
import GenderByJobTypeChart from './GenderByJobTypeChart.jsx';
import SourceBarChart from './SourceBarChart.jsx';
import JobtypeBarChart from './JobtypeBarChart.jsx';
import ProcessBarChart from './ProcessBarChart.jsx';
import JobApplicationChart from './JobApplicationChart.jsx'
import '../components/css/dashboard.css'
import { AuthContext } from '../components/auth/AuthContext';
import {getTotalCount,countByJobProfileAndGender,groupBySource,dayWiseCount 
  ,monthWiseCount,yearWiseCount ,jobApplicationStat} from '../components/services/DashBoardResponseApiJWT.js'
  import { useNavigate, Link } from 'react-router-dom';
const Dashboard = () => {
 
    const [chartType, setChartType] = useState('daily');
    const [activeTab, setActiveTab] = useState('source');
    const [data, setData] = useState(null); 
    const [genderData, setGenderData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [dayData, setDayData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const [jobApplicationData, setJobApplicationData] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const { logout } = useContext(AuthContext);
    const fetchData = async () => {
      try {
        const [fetchedData, genderData, sourceData,dayWiseData,monthWiseData,yearWiseData,jobApplications] = await Promise.all([
          getTotalCount(),
          countByJobProfileAndGender(),
          groupBySource(),
          dayWiseCount(),
          monthWiseCount(),
          yearWiseCount() ,
          jobApplicationStat() 
        
        ]);
    
        setData(fetchedData);
        setGenderData(processGenderData(genderData));
        setSourceData(sourceData);
        setDayData(dayWiseData);
        setMonthData(monthWiseData); 
        setYearData(yearWiseData); 
        setJobApplicationData(jobApplications);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    const processGenderData = (data) => {
      // Grouping data by job profile
      const groupedData = data.reduce((acc, item) => {
        const { jobProfile, gender, count } = item;
        if (!acc[jobProfile]) {
          acc[jobProfile] = { jobType: jobProfile, male: 0, female: 0 };
        }
        if (gender.toLowerCase() === 'male') {
          acc[jobProfile].male += count;
        } else if (gender.toLowerCase() === 'female') {
          acc[jobProfile].female += count;
        }
        return acc;
      }, {});
  
      return Object.values(groupedData);
    };

    useEffect(() => {
      fetchData(); 
      // fetchGenderData();
    }, []);



    if (!data || !dayData.length || !monthData.length || !yearData.length || !jobApplicationData.length) {
      return <div>Loading...</div>;
    }
  
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
     // Format the dayData for the line graph
    const dailyData = dayData.map((item) => ({
      day: item.Date, // Use the Date field from the API response
      applicants: item.count, // Use the count field from the API response
    }));

    // Format the monthData for the monthly line graph
    // In the component, map monthData to monthlyData without formatting Date again
    const monthlyData = monthData.map((item) => ({
      month: item.Date,  // Use the already formatted Date field
      applicants: item.count, // Use the count field from the API response
    }));


    // const yearlyData = applicationData.quarterlyApplications.map((applications, index) => ({
    //   year: `Year ${index + 1}`,
    //   applicants: applications,
    // }));
    const yearlyData = yearData.map((item) => ({
      year: item.Date,
      applicants: item.count,
    }));
    const handleChartChange = (e) => {
        setChartType(e.target.value);
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
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
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
           
            <Link className="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
            </div>
      <div className="dashboard">
        <h6>Applicant Dashboard</h6>

        {/* Row 1: Application Metrics and Gender By Job Type Chart */}
        <div className="row">
          <div className="col">
            <ApplicationMetrics data={data} />
          </div>
          
        </div>

        {/* Row 2: Line Charts for Daily, Monthly, and Yearly Applications */}
        <div className="row" style={{marginTop:'40px'}}>
          <div className="col"  style={{backgroundColor:'white',marginRight:'20px'}}>
            <div className="chart-selector" style={{textAlign:'left'}}>
              <label htmlFor="chartType">Select Time Period: </label>
              <select id="chartType" value={chartType} onChange={handleChartChange}>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {chartType === 'daily' && (
              <LineGraph
                data={dailyData}
                title="Daily Applications Trend"
                xData="day"
                lineData="applicants"
                color="#8884d8"
              />
            )}

            {chartType === 'monthly' && (
              <LineGraph
                data={monthlyData}
                title="Monthly Applications Trend"
                xData="month"
                lineData="applicants"
                color="#82ca9d"
              />
            )}

            {chartType === 'yearly' && (
              <LineGraph
                data={yearlyData}
                title="Yearly Applications Trend"
                xData="year"
                lineData="applicants"
                color="#ff7300"
                isYearly={true}
              />
            )}
          </div>
          <div className="col"  style={{backgroundColor:'white'}}>
            {/* <GenderByJobTypeChart data={genderData} /> */}
          </div>
        </div>
        
        <div className="row" style={{marginTop:'40px'}}>
        <div className="col"  style={{backgroundColor:'white',marginRight:'20px'}}>
        {/* <div className="tabs">
          <button 
            className={activeTab === 'source' ? 'active' : ''} 
            onClick={() => handleTabClick('source')}
          >
            Source
          </button>
          <button 
            className={activeTab === 'jobType' ? 'active' : ''} 
            onClick={() => handleTabClick('jobType')}
          >
            Job Type
          </button>
          <button 
            className={activeTab === 'processStatus' ? 'active' : ''} 
            onClick={() => handleTabClick('processStatus')}
          >
            Process Status
          </button>
        </div> */}

        {/* <div className="row">
          {activeTab === 'source' && <SourceBarChart data={sourceData} />}
          {activeTab === 'jobType' && <JobtypeBarChart data={applicationData.applicationsByJobType} />}
          {activeTab === 'processStatus' && <ProcessBarChart data={applicationData.applicationsByProcessStatus} />}
        </div> */}
        </div>
        <div className="col"  style={{backgroundColor:'white'}}>
        {/* <JobApplicationChart data={jobApplicationData} /> */}
        </div>
        </div>
      </div>
      </>
    );
};

export default Dashboard;
