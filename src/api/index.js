import axios from 'axios'
import local from '@/utils/local'
import router from '@/router'
import JSONBIG from 'json-bigint' // 此插件用来解决最大安全数值问题

// 基准地址，公共地址头部
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.transformResponse = [(data) => {
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]

// 请求拦截器-实现每次请求附带token
axios.interceptors.request.use((req) => {
  const user = local.getUser() || {} // 获取token,没有就给一个空对象
  req.headers.Authorization = `Bearer ${user.token}` // 给拦截下来的请求设置请求头,带上token
  return req
}, (err) => {
  return Promise.reject(err)
})

// 响应拦截器-处理token失效
axios.interceptors.response.use(res => res, (err) => {
  // 拦截到错误状态的响应体信息
  if (err.response.status === 401) { // 如果遇到响应体状态码401,说明token失效,跳回登录页面
    // window.location.hash = '/login' 操作dom不可取
    local.delUser()
    return router.push('/login')
  }
  return Promise.reject(err)
})

export default axios
