import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function JobtypeBarChart({data}) {
    console.log(data);
  return (

<div className="chart">
<h4>Applications by Source</h4>
    <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} layout="vertical">  {/* Set layout to vertical for horizontal bars */}
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" /> {/* X-axis should represent the applicants count */}
      <YAxis dataKey="jobType" type="category" angle={0} />
      <Tooltip />
      <Legend />
      <Bar dataKey="applicants" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
  </div>

  )
}

export default JobtypeBarChart
