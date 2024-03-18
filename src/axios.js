// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'

// 创建一个 Axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:3000' // 后端 API 地址
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在请求发送前可以添加一些配置，如请求头等
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 如果请求成功，直接返回响应
    NProgress.done()
    return response
  },
  (error) => {
    // 如果请求失败，捕获错误并自定义错误消息
    if (error.response.status === 401) {
      // 密码错误
      const customError = new Error('密码或账号错误 (401)')
      return Promise.reject(customError)
    } else {
      // 其他错误
      return Promise.reject(error)
    }
  }
)

export default instance
