import Vue from 'vue'
import VueRouter from 'vue-router' // 引入路由组件
import login from '../views/login'
Vue.use(VueRouter) // 使用路由组件
const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: login
    }
  ]
})
export default router // 导出路由
