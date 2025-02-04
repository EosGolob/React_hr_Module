import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function ProcessBarChart({data}) {
    console.log(data);
  return (
    <div className="chart">
    <h4>Applications by Process Status</h4>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type='number' />
        {/* <XAxis  dataKey="processStatus" /> */}
        <YAxis dataKey="processStatus" type="category" angle={0} />
        {/* <YAxis /> */}
        <Tooltip />
        <Legend />
        <Bar dataKey="applicants" fill="#ff7300" />
      </BarChart>
    </ResponsiveContainer>
  </div>
  )
}

export default ProcessBarChart
