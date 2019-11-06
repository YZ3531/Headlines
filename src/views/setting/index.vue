<template>
  <el-card class="box-card">
    <div slot="header">
      <!-- 调用全局自定义组件my-bread并将内容传进留的坑里面 -->
      <my-bread>个人设置</my-bread>
    </div>
    <!-- 栅格系统 -->
    <el-row>
      <el-col :span="12">
        <el-form>
          <!-- 编号 -->
          <el-form-item label="编号:" label-width="120px">{{userInfo.id}}</el-form-item>
          <!-- 手机号 -->
          <el-form-item label="手机号:" label-width="120px">{{userInfo.mobile}}</el-form-item>
          <!-- 媒体名称 -->
          <el-form-item label="媒体名称:"  label-width="120px">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <!-- 媒体介绍 -->
          <el-form-item label="媒体介绍:" label-width="120px">
            <el-input type="textarea" rows="3" v-model="userInfo.intro" ></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱:" label-width="120px">
            <el-input  v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item label-width="120px">
            <el-button type="primary" @click="saveInfo">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
         <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="uploadImage"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import eventBus from '@/eventBus'
import local from '@/utils/local'
export default {
  data () {
    return {
      userInfo: {
        id: null,
        name: null,
        intro: null,
        mobile: null,
        email: null,
        photo: null
      }
    }
  },
  methods: {
    // 获取用户个人信息
    async getUserProfile () {
      const { data: { data } } = await this.$http.get('user/profile')
      this.userInfo = data
    },
    // 保存用户设置
    async saveInfo () {
      const { name, intro, email } = this.userInfo
      await this.$http.patch('user/profile', { name, intro, email })
      this.$message.success('修改设置成功')
      eventBus.$emit('updateName', name) // 触发自定义事件,向home组件传递更改后的用户名
      const user = local.getUser() // 更新本地存储
      user.name = name
      local.setUser(user)
    },
    // 上传用户头像
    async uploadImage ({ file }) {
      const formDate = new FormData()
      formDate.append('photo', file)
      const { data: { data } } = await this.$http.patch('user/photo', formDate)
      this.userInfo.photo = data.photo // 更改预览图'
      this.$message.success('修改头像成功')
      eventBus.$emit('updatePhoto', data.photo) // 触发自定义事件,向home组件传递更改后的用户头像
      const user = local.getUser() // 更新本地存储
      user.photo = data.photo
      local.setUser(user)
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>
</style>
