import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://hookbook.io/version-4v1o/api/1.1/obj/',
});

export default axiosInstance;