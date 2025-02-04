import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineGraph = ({ data, title, xData, lineData, color, isYearly = false }) => {
  return (
    <div className="chart">
      <h3>{title}</h3>
      <ResponsiveContainer width="180%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xData} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={lineData} stroke={color} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;