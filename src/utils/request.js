import axios from 'axios'

const service = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  headers: {
    'x-business-header': 'WGW',
    "Content-Type": "application/json;charset=utf-8"
  },
  timeout: 1000 * 5
})

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.slgtoken = `Bearer ` + token
    } else {
      delete config.headers.slgtoken;
    }
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => {
    const { code, data, message } = response.data;
    if (code === '0000_1') {
      return data;
    }
    ElMessage.error(message || "系统出错");
    return Promise.reject(new Error(message || "Error"));
  },
  error => {
    const { response } = error;
    const { code, message } = response.data;
    if (code === '0001_1') {
      ElMessage.error(message);
    } else {
      ElMessage.error(message || "系统出错");
    }
    return Promise.reject(new Error(message || "Error"));
  }
)

export default service