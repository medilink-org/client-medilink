import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3001'
  baseURL: 'https://medi-link-api.onrender.com/' // swap to local as needed
});

export default axiosInstance;
