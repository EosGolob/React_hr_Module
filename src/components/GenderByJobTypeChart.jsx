import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GenderByJobTypeChart = ({ data }) => {
    
  return (
    <div>
    <h4>Applications gender by Job Type</h4>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="jobType" />
        <YAxis  />
        <Tooltip />
        <Legend />
        <Bar dataKey="male" stackId="a" fill="#8784d8" />
        <Bar dataKey="female" stackId="a" fill="#dcdbff" />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default GenderByJobTypeChart;