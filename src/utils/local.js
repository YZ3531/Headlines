// 存储用户状态(token)
const KEY = 'hm-user'
const local = {
  // 获取token
  getUser () {
    const jsonStr = window.sessionStorage.getItem(KEY)
    return JSON.parse(jsonStr)
  },
  // 设置token
  setUser (value) {
    const jsonStr = JSON.stringify(value)
    window.sessionStorage.setItem(KEY, jsonStr)
  },
  // 删除token
  delUser () {
    window.sessionStorage.removeItem(KEY)
  }
}
export default local
