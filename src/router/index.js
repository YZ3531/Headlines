import Vue from 'vue'
import VueRouter from 'vue-router' // 引入路由组件
import login from '@/views/login' // 登陆
import home from '@/views/home' // 主页
import welcome from '@/views/welcome'
import notFond from '@/views/404'
Vue.use(VueRouter) // 使用路由组件
const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: login
    }, {
      path: '/',
      component: home,
      children: [
        {
          path: '',
          component: welcome
        }
      ]
    },
    {
      path: '*',
      component: notFond
    }
  ]
})
export default router // 导出路由
