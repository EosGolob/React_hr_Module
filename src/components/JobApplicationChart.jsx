// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,LabelList } from 'recharts';
// import { applicationData } from './data.jsx';
// import { useTable } from 'react-table';


// const formattedData = applicationData.jobApplicationData.map((job) => {
//     const totalApplications = job.totalApplications;
    
//     return {
//         jobTitle: job.jobTitle,
//         // hired: (job.hired / totalApplications) * 100,
//         // inProgress: (job.inProgress / totalApplications) * 100,
//         // rejected: (job.rejected / totalApplications) * 100,
//         hired:job.hired,
//         inProgress: job.inProgress,
//         rejected: job.rejected,
//         totalApplications: job.totalApplications
//     };
//   });
  

// function JobApplicationChart() {
 
    
//   return (

//     <div style={{ width: '80%', height: 400, margin: '0 auto' }}>
//     <h2>Job Application Statistics</h2>
//     <ResponsiveContainer width="100%" height={350}>
//       <BarChart data={formattedData} layout="vertical">
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis type="number" />
//         <YAxis dataKey="jobTitle" type="category" angle={0} />
//         <Tooltip />
//         <Legend />
        
//         {/* Bar for "hired" */}
//         <Bar dataKey="hired" stackId="a" fill="#8884d8">
//           <LabelList dataKey="hired" position="inside" style={{ fill: 'black' }} />
//         </Bar>
//         {/* Bar for "inProgress" */}
//         <Bar dataKey="inProgress" stackId="a" fill="#9e9de1">
//           <LabelList dataKey="inProgress" position="inside" style={{ fill: 'black' }} />
//         </Bar>
//         {/* Bar for "rejected" */}
//         <Bar dataKey="rejected" stackId="a" fill="#c1c1ed">
//           <LabelList dataKey="rejected" position="inside" style={{ fill: 'black' }} />
//         </Bar>

//         {/* Display total applications on top of each bar */}
//         {/* <Bar
//           dataKey="totalApplications"
//           fill="transparent"
//           radius={[8, 8, 0, 0]} // Rounded top corners for the total count label
//           label={{ value: 'Total Applications', position: 'top' }}
//         /> */}
//       </BarChart>
//     </ResponsiveContainer>
//   </div>
 
//   );
// }

// export default JobApplicationChart;



import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

function JobApplicationChart({ data }) {
  
  const formattedData = data.map((job) => {
    const totalApplications = job.totalApplications;

    return {
      jobTitle: job.jobTitle,
      hired: job.hired,
      inProgress: job.inProgress,
      rejected: job.rejected,
      totalApplications: job.totalApplications
    };
  });

  return (
    <div style={{ width: '80%', height: 400, margin: '0 auto' }}>
      <h2>Job Application Statistics</h2>
      <div style={{ width: '100%', height: 350, overflowY: 'auto' }}>
      <ResponsiveContainer width="100%" height='100%'>
        <BarChart data={formattedData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="jobTitle" type="category" angle={0} />
          <Tooltip />
          <Legend />
          
       
          <Bar dataKey="hired" stackId="a" fill="#8884d8">
         
          </Bar>
      
          <Bar dataKey="inProgress" stackId="a" fill="#9e9de1">
       
          </Bar>
        
          <Bar dataKey="rejected" stackId="a" fill="#c1c1ed">
          
          </Bar>
          <Bar dataKey="totalApplications" stackId="a" fill="#c1c1ed">
      
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}

export default JobApplicationChart;
