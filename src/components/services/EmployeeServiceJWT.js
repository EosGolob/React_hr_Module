import axios from "axios";
const REST_API_BASE_URL = 'http://localhost:8080/api/employees';
const maendpoint = 'managerResponeField';
const hdfcendpoint = 'managerHdfcResponeField';
const iciciendpoint = 'managerIciciResponeField';
const misendpoint   ='managerMisResponeField';
const empDetailsInfoEndpoint = 'empDetailsInfo';
const approvedendpoint   = 'approvedEmpdetails';
const rejectedEmpdetails = 'rejectedEmpdetails';

const axiosInstance = axios.create({
    baseURL: REST_API_BASE_URL,
  })


  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Double negation to convert to boolean
};

  const authConfig = () => {
    const token = localStorage.getItem('token');
    return{
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

  export const listEmployees = (token) => {
    return axiosInstance.get('/getAllEmp', authConfig());
  };

  export const selectInterviewProcess = (employeeId, interviewData) => {
    const token = localStorage.getItem('token');
    return axiosInstance.post(`${REST_API_BASE_URL}/${employeeId}/interview-process`, interviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  export const getlistOfManagerResponeField = () => {
    return axiosInstance.get(`/${maendpoint}`, authConfig());
  };
  export const getlistOfManagerHdfcResponeField = () => {
    return axiosInstance.get(`/${hdfcendpoint}`, authConfig());
  };
  export const getlistOfManagerIciciResponeField = () => {
    return axiosInstance.get(`/${iciciendpoint}`, authConfig());
  };
  export const getlistOfManagerMisResponeField = () => {
    return axiosInstance.get(`/${misendpoint}`, authConfig());
  };
  export const getlistOfApprovedEmpList = () =>{
    return axiosInstance.get(`/${approvedendpoint}`, authConfig());
  }
  export const getlistOfRejectedEmpList = () => {
    return axiosInstance.get(`/${rejectedEmpdetails}`, authConfig());
  }
  export const getEmployeeDetails = (employeeId) => {
    return axiosInstance.get(`/${empDetailsInfoEndpoint}/${employeeId}`, authConfig());
  };
  
  export const MrResponseSubmit = (employeeId, selectedResponse) => {
    const url = `${REST_API_BASE_URL}/${employeeId}/mRResponse`;
    const data = { newStatus: selectedResponse };
  
    return axios.put(url, data, authConfig()); // Include authConfig() here to pass headers
  };

// class EmployeeServiceJWT{
//     static Base_URL = 'http://localhost:8080/api/employees';

//     static async listofemployeeonprocesspage(userData ,token){
//       try{
//         const response = await axios.get(`${EmployeeServiceJWT.Base_URL}/getAllEmp`,userData,
//           {
//             headers: {Authorization:`Bearer ${token}`}
//           })
//           return response.data;
//         }catch(err){
//           throw err;
//         }
//       }
    
//     static isAuthenticated(){
//         const token =  localStorage.getItem('token') 
//         return !! token
//     }

//     static isAdmin(){
//         const role =  localStorage.getItem('role') 
//         return role === 'ADMIN'
//     }

//     static isUser(){
//         const role =  localStorage.getItem('role') 
//         return role === 'USER'
//     }

//     static adminOnly(){
        
//         return this.isAuthenticated() && this.isAdmin();
//     }
// }
// export default EmployeeServiceJWT;