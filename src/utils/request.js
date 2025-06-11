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
    const { message } = errorHandle(error)
    return Promise.reject(message)
  }
)

// 响应错误码处理
const errorHandle = error => {
  const { response } = error
  switch (response.status) {
    case 400:
      error.message = '请求错误'
      break
    case 401:
      error.message = '未授权，请登录'
      break
    case 403:
      error.message = '拒绝访问'
      break
    case 404:
      error.message = '未找到访问地址'
      break
    case 408:
      error.message = '请求超时'
      break
    case 500:
      error.message = '服务器内部错误'
      break
    case 501:
      error.message = '服务未实现'
      break
    case 502:
      error.message = '网关错误'
      break
    case 503:
      error.message = '服务不可用'
      break
    case 504:
      error.message = '网关超时'
      break
    case 505:
      error.message = 'HTTP版本不受支持'
      break
    default:
      error.message = '系统出错'
      break
  }
  return error
}

export default service