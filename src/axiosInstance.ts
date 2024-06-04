import axios from 'axios';

const devUrl = import.meta.env.VITE_API_DEV_URL;
const prodUrl = import.meta.env.VITE_API_PROD_URL;
const buildEnv = import.meta.env.VITE_BUILD_ENV;

const axiosInstance = axios.create({
  baseURL: buildEnv === 'prod' ? prodUrl : devUrl
});

export default axiosInstance;
