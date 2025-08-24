
// import axios from 'axios';

// // Define the base URL for your API
// const API_BASE_URL = 'http://localhost:5000/api';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
// });

// // Add a request interceptor to include the token in all requests
// apiClient.interceptors.request.use(
//   (config) => {
//     //
//     // THIS IS THE FIX
//     //
//     // Get the token from local storage using the correct key: 'authToken'
//     const token = localStorage.getItem('authToken');

//     if (token) {
//       // If the token exists, add it to the Authorization header
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     // Handle the error
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend API base URL
});

// Use an interceptor to automatically add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;