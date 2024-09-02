import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://list-data.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

