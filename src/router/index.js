import Vue from 'vue'
import VueRouter from 'vue-router' // 引入路由组件
import local from '@/utils/local' // 引入状态工具
import login from '@/views/login' // 登陆
import home from '@/views/home' // 主页
import welcome from '@/views/welcome' // 欢迎页面
import notFond from '@/views/404' // 404页面
import article from '@/views/article' // 文章管理页面
import image from '@/views/image' // 素材管理页面
import publish from '@/views/publish' // 发布文章页面
import comment from '@/views/comment' // 评论管理页面
import fans from '@/views/fans' // 粉丝管理页面
import setting from '@/views/setting' // 个人设置页面

Vue.use(VueRouter) // 使用路由组件
const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: login
    },
    {
      path: '/',
      component: home,
      children: [
        { path: '', component: welcome },
        { path: '/article', component: article },
        { path: '/image', component: image },
        { path: '/publish', component: publish },
        { path: '/comment', component: comment },
        { path: '/fans', component: fans },
        { path: '/setting', component: setting }
      ]
    },
    {
      path: '*',
      component: notFond
    }
  ]
})

// 路由前置导航守卫,检测是否登录
router.beforeEach((to, from, next) => {
  const user = local.getUser()
  if (user && user.token) { // session中有键且值为token
    next() // 放过
  } else {
    if (to.path === '/login') { // 没有token但是是去登录页面的
      next() // 放过
    } else {
      next('/login') // 没有token还不是去登录页面的,强制去登录页面
    }
  }
})

export default router // 导出路由
