import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/interviews';

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
export const getAttendenedInterview = (employeeId) =>{
    return axiosInstance.get(`/getAttendenedInterview/${employeeId}`, authConfig())
    .then(response => {
      return response.data; // Return the data from the response
    })
    .catch(error => {
      throw error; // Throw the error to handle it in the calling component
    });
  }
