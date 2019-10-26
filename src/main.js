import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui' // 引入element-ui插件
import 'element-ui/lib/theme-chalk/index.css' // element-ui的css文件
import router from '@/router' // 绝对路径 @是webpack指定的路径别名  @===‘/src’
import axios from '@/api' // 引入axios配置文件

Vue.use(ElementUi) // 使用
Vue.prototype.$http = axios // 挂载

new Vue({
  router, // 挂载
  render: h => h(App)
}).$mount('#app')
