import axios from 'axios';

// Create an Axios instance with the base URL
const api = axios.create({
    baseURL: 'http://localhost:5000', // Your server URL
    withCredentials: true, // Send cookies with requests
});

export default api;
