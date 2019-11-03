/***
 *
 *注册全局组件文件
 *
 * */

import MyBread from '@/components/my-bread' // 引入面包屑组件
import MyChannel from '@/components/my-channel' // 引入频道组件
import MyImages from '@/components/my-images' // 引入图片封面组件

export default {
  install (Vue) {
    Vue.component('my-bread', MyBread) // 全局注册面包屑组件
    Vue.component('my-channel', MyChannel) // 全局注册频道组件
    Vue.component('my-image', MyImages) // 全局注册图片封面组件
  }
}
