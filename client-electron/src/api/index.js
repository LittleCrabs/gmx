import axios from 'axios'

const instance = axios.create({
  timeout: 600000  // 10分钟超时
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  setBaseUrl(url) {
    instance.defaults.baseURL = url
  },
  
  setToken(token) {
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete instance.defaults.headers.common['Authorization']
    }
  },
  
  get: (url) => instance.get(url),
  post: (url, data) => instance.post(url, data),
  put: (url, data) => instance.put(url, data),
  delete: (url) => instance.delete(url)
}
