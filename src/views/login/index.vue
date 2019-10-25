<template>
  <div class="container">
    <el-card class="box">
      <img src="../../assets/logo_index.png" width="200px" style="display:block;margin:0 auto 30px"  alt />
      <el-form ref="form" :model="form">
        <el-form-item>
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.code" placeholder="请输入验证码" style="width:235px;margin-right:10px"></el-input>
          <el-button float="right">发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="read" >我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
      </el-form>
      <el-button :disabled="disab" type="primary" style="width:100%">立即登录</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        phone: '',
        code: ''
      },
      read: true
    }
  },
  computed: {
    disab () {
      return !this.read
    }
  }
}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  /* 设置背景图 不平铺 居中 全屏显示 */
  background: url("../../assets/login_bg.jpg") no-repeat center / cover;
  position: absolute;
  left: 0;
  top: 0;
}
.box {
  position: absolute;
  width: 400px;
  height: 340px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
