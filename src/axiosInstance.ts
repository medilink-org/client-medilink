import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001'
  // baseUrl: 'https://easy-emr-backend.onrender.com/', // swap to local as needed
});

export default axiosInstance;
