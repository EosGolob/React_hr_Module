import React, { useEffect, useState } from 'react'
import { listEmployees , selectInterviewProcess } from '../services/EmployeeService'


const EmployeeProcessSelection = () => {
    const [employees, setEmployees] = useState([]);
    // const [selectedProcess, setSelectedProcess] = useState([]);
    useEffect(() => {
        getAllEmployees();
    }, []);

    function getAllEmployees() {
        listEmployees()
            .then((response) => {
                console.log('Response Data:', response.data);
                const updatedEmployees = response.data.map(employee => ({ ...employee, selectedProcess: null }));
                setEmployees(updatedEmployees);
            }).catch(error => {
                console.error(error)
            });
        };
        const handleProcessChange = (e, employeeId) => {
            const selectedProcess = e.target.value;
            setEmployees(prevEmployees => prevEmployees.map(employee => {
                if (employee.id === employeeId) {
                    return { ...employee, selectedProcess: selectedProcess };
                }
                return employee;
            }));
        };

        const handleAddInterviewProcess = (employeeId) => {
            const employee = employees.find(emp => emp.id === employeeId);
            const interviewDate = new Date().toISOString().slice(0, 10);
            const interviewTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
            const interviewData = {
                processName: employee.selectedProcess,
                interviewDate: interviewDate,
                interviewTime: interviewTime,
                status: "Scheduled"
            };
        
            // Call the selectInterviewProcess API function
            selectInterviewProcess(employeeId, interviewData)
                .then(response => {
                    console.log("Interview Process added successfully:", response.data);
                    // Perform any additional actions after successfully adding interview process
                })
                .catch(error => {
                    console.error("Error adding interview process:", error);
                    // Handle error
                });
        };
        

        return (
            <div className='container'>
                <h2 className='text-center'>SELECT PROCESS</h2>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>JOB PROFILE</th>
                            <th>MOBILE NO</th>
                            <th>PERMANENT ADD</th>
                            <th>CURRENT ADD</th>
                            <th>GENDER</th>
                            <th>PROCESS</th>
                            <th>ACTION</th>


                        </tr>
                    </thead>
                    <tbody>
                        {
                            
                            Array.isArray(employees) && employees.map((employee) => (
                                <tr key={employee.id}>

                                    <td>{employee.fullName}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.jobProfile}</td>
                                    <td>{employee.mobileNo}</td>
                                    <td>{employee.permanentAddress}</td>
                                    <td>{employee.currentAddress}</td>
                                    <td>{employee.gender}</td>
                                    <td>
                                        <select value={employee.selectedProcess} onChange={(e) => handleProcessChange(e,employee.id)}>
                                            <option value="">Select Process</option>
                                            <option value="HDFC">HDFC</option>
                                            <option value="ICICI">ICICI</option>
                                            <option value="MIS">MIS</option>

                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => handleAddInterviewProcess(employee.id)}>Interview Process</button>
                                        
                                    </td>

                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        );
    };

    export default EmployeeProcessSelection