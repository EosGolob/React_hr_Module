import axios from "axios";

const  REST_API_BASE_URL = 'http://localhost:8080/api/employees';
const INTERVIEW_API_BASE_URL = 'http://localhost:8080/api/interviews';
const endpoint = 'employees-schedule-interview';

export const listEmployees = () => axios.get(REST_API_BASE_URL);
export const creatEmployee = (employee) => axios.post(REST_API_BASE_URL,employee);
export const getEmployee =(employeeId) => axios.get(REST_API_BASE_URL +'/'+ employeeId);
export const updateEmployee = (employeeId , employee) => axios.put(REST_API_BASE_URL+'/'+employeeId,employee);
export const deleteEmployee = (employeeId,) => axios.delete(REST_API_BASE_URL +'/' + employeeId);
export const updateEmployeeStatus = (employeeId, newStatus) => axios.patch(`${REST_API_BASE_URL}/${employeeId}/status`, null, {
    params: {
      newStatus
    }
  });
  // New methods for handling interview processes
export const scheduleInterview = (employeeId, interviewDetails) => {
  return axios.post(`${INTERVIEW_API_BASE_URL}/${employeeId}/interviews`, interviewDetails);
};

export const listInterviewsByEmployeeId = (employeeId) => {
  return axios.get(`${INTERVIEW_API_BASE_URL}/${employeeId}/interviews`);
};

export const selectInterviewProcess = (employeeId, interviewData) => {
  return axios.post(`${REST_API_BASE_URL}/${employeeId}/interview-process`, interviewData);
};
export const getlistOfEmpIntSchedule = () => axios.get(REST_API_BASE_URL+'/'+ endpoint);

//export const hrResponseSubmit = (employeeId, newStatus) => axios.put(`${REST_API_BASE_URL}/${employeeId}/hrResponse`, null, { params: { newStatus: newStatus } });

export const hrResponseSubmit = (employeeId, newStatus) => {
  const url = `${REST_API_BASE_URL}/${employeeId}/hrResponse`;
  return axios.put(url, { newStatus: newStatus });
};


 
