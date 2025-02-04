import axios from "axios";

// Define the REST API URL
const REST_API_BASE_URL = 'http://localhost:8080/api/dashBord';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: REST_API_BASE_URL,
});

// Function to get the authorization token from localStorage
const authConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getTotalCount = async (month, year) => {
  try {
    const response = await axiosInstance.get('/total-Count', {
      params: { month, year },  // Pass month and year as query parameters
      ...authConfig(),           // Assuming authConfig() adds the authorization headers or other necessary configurations
    });

    return response.data; // Assuming the response contains the relevant data
  } catch (error) {
    console.error('Error fetching total count:', error);
    throw error; // Rethrow or handle error appropriately
  }
};


export const countByJobProfileAndGender = async () => {
    try {
      const response = await axiosInstance.get('/count-by-job-profile-and-gender', authConfig());
      return response.data; // Assuming the response contains the relevant data
    } catch (error) {
      console.error('Error fetching total count:', error);
      throw error;
    }
  };
//   export const groupBySource = async () => {
//     try {
//       const response = await axiosInstance.get('/groupBySource', authConfig());
//       return response.data; // Assuming the response contains the relevant data
//     } catch (error) {
//       console.error('Error fetching total count:', error);
//       throw error;
//     }
//   };

// The groupBySource function will return the data in the correct structure
export const groupBySource = async () => {
    try {
      const response = await axiosInstance.get('/groupBySource', authConfig());
      // Assuming response.data is in the format you shared
      const formattedData = response.data.map(item => ({
        source: item.source,   // The source name
        applicants: item.count  // The number of applicants for each source
      }));
      return formattedData;
    } catch (error) {
      console.error('Error fetching source data:', error);
      throw error;
    }
  };
  

  export const dayWiseCount = async () => {
    try {

      const response = await axiosInstance.get('/dayWiseCount', authConfig());
  
      // Assuming the response data is an array of objects with 'Date' and 'count'
      const formattedData = response.data.map(item => ({
        Date: item.Date,  // Assuming 'Date' is the correct field name
        count: item.count  // Assuming 'count' is the correct field name
      }));
  
      return formattedData; // Return the formatted data
    } catch (error) {
      console.error('Error fetching source data:', error);
      throw error; // Rethrow the error if needed
    }
  };
  // export const monthWiseCount = async () => {
  //   try {
  //     const response = await axiosInstance.get('/monthWiseCount', authConfig());
      
  //     // Assuming the response data is an array of objects with 'month', 'year', and 'count'
  //     const formattedData = response.data.map(item => ({
  //       Date: `${item.year}-${String(item.month).padStart(2, '0')}`,  // Format as YYYY-MM
  //       count: item.count  // Use the count as is
  //     }));
  
  //     return formattedData; // Return the formatted data
  //   } catch (error) {
  //     console.error('Error fetching source data:', error);
  //     throw error; // Rethrow the error if needed
  //   }
  // };
  
  export const yearWiseCount = async () => {
    try {
      const response = await axiosInstance.get('/yearWiseCount', authConfig());
  
      // Assuming the response data is an array of objects with 'year' and 'count'
      const formattedData = response.data.map(item => ({
        Date: `${item.year}`,  // No need to format, just return the year
        count: item.count       // Use the count as is
      }));
  
      return formattedData; // Return the formatted data
    } catch (error) {
      console.error('Error fetching source data:', error);
      throw error; // Rethrow the error if needed
    }
  };
  
  export const jobApplicationStat = async () => {
    try {
      const response = await axiosInstance.get('/count-on-job-Profile', authConfig());
      return response.data; // Assuming the response contains the relevant data
    } catch (error) {
      console.error('Error fetching total count:', error);
      throw error;
    }
  };


export const getTotalCountForDate = async (date) => {
  try {
      const response = await axiosInstance.get('/total-Count-today', {
          ...authConfig(),  // Spread authConfig to include headers (or other config)
          params: { date }   // Pass the date as a query parameter
      });
      return response.data;  // This should be the total count returned by the backend
  } catch (error) {
      console.error('Error fetching total count for date:', error);
      throw error;
  }
};

export const monthWiseCount = async (year, month) => {
  try {
    // Make an API call with the year and month as query parameters
    const response = await axiosInstance.get('/monthWiseCount', {
      params: {
        year,  // Passing year as query param
        month  // Passing month as query param
      },
      ...authConfig() // Assuming your authConfig is correctly set up for headers/authentication
    });

    // Format the response data to match the expected structure
    const formattedData = response.data.map(item => ({
      Date: `${item.year}-${String(item.month).padStart(2, '0')}`,  // Format as YYYY-MM
      count: item.count  // Use the count as is
    }));

    return formattedData; // Return the formatted data
  } catch (error) {
    console.error('Error fetching month-wise count data:', error);
    throw error; // Rethrow the error for further handling if necessary
  }
};
