import axios from "axios";

const  REST_API_BASE_URL = 'http://localhost:8080/api/employees';
const INTERVIEW_API_BASE_URL = 'http://localhost:8080/api/interviews';
const endpoint = 'employees-schedule-interview';
const maendpoint = 'managerResponeField';
const x = 'getAllEmp';
export const getAllSearchNameApi = () => axios.get(REST_API_BASE_URL + '/' + searchByNameAPI)
export const listEmployees = () => axios.get(REST_API_BASE_URL+'/'+x);
export const creatEmployee = (employee) => axios.post(REST_API_BASE_URL,employee);
export const getEmployee =(employeeId) => axios.get(REST_API_BASE_URL +'/'+ employeeId);
export const updateEmployee = (employeeId , employee) => axios.put(REST_API_BASE_URL+'/'+employeeId,employee);
export const deleteEmployee = (employeeId,) => axios.delete(REST_API_BASE_URL +'/' + employeeId);
export const updateEmployeeStatus = (employeeId, newStatus) => axios.patch(`${REST_API_BASE_URL}/${employeeId}/status`, null, {
    params: {
      newStatus
    }
  });
 
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

export const hrResponseSubmit = (employeeId, selectedResponse) => {
 
  const url = `${REST_API_BASE_URL}/${employeeId}/hrResponse`;
  const data = { newStatus: selectedResponse }
  console.log("data to send "+ data)
  return axios.put(url,data);
};


export const MrResponseSubmit = (employeeId, selectedResponse) => {
 
  const url = `${REST_API_BASE_URL}/${employeeId}/mRResponse`;
  const data = { newStatus: selectedResponse }
  console.log("data to send "+ data)
  return axios.put(url,data);
};

export const getlistOfManagerResponeField = () => axios.get(REST_API_BASE_URL+'/'+maendpoint);

 
