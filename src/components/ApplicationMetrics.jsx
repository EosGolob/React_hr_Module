import React from 'react';

const ApplicationMetrics = ({ data }) => {
  const total = data.totalEmp;
  const hired = data.hiredCount;
  const inProcess = data.inProcessApplicationCount;
  const rejected = data.rejectedCount;

  return (
    <>
    <h6>Overall Application Metrics</h6>
    <div className="metrics">
      
      <div className="metric">
        <h6>Total Applications</h6>
        <p>{total} ({((total / total) * 100).toFixed(2)}%)</p>
      </div>
      <div className="metric">
        <h6>Hired Applicants</h6>
        <p>{hired} ({((hired / total) * 100).toFixed(2)}%)</p>
      </div>
      <div className="metric">
        <h6>In Process Applicants</h6>
        <p>{inProcess} ({((inProcess / total) * 100).toFixed(2)}%)</p>
      </div>
      <div className="metric">
        <h6>Rejected Applicants</h6>
        <p>{rejected} ({((rejected / total) * 100).toFixed(2)}%)</p>
      </div>
    </div>
    </>
  );
};

export default ApplicationMetrics;