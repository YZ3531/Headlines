/***
 *
 *注册全局组件文件
 * */

import MyBread from '@/components/my-bread' // 引入面包屑
export default {
  install (Vue) {
    Vue.component('my-bread', MyBread) // 全局注册面包屑组件
  }
}
