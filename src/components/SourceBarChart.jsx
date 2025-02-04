import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function SourceBarChart({data}) {
    console.log(data);
  return (
    <div className="chart">
      <h4>Applications by Source</h4>
      <ResponsiveContainer width=" 100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          {/* <XAxis dataKey="source"  /> */}
          <YAxis dataKey="source" type="category" angle={0} />
          {/* <YAxis  /> */}
          <Tooltip />
          <Legend />
          <Bar dataKey="applicants" barSize={20} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SourceBarChart
