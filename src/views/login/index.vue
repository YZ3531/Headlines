<template>
  <div class="container">
    <el-card class="box">
      <img src="../../assets/logo_index.png" width="200px" style="display:block;margin:0 auto 30px"  alt />

      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item  prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item  prop="code">
          <el-input v-model="form.code" placeholder="请输入验证码" style="width:235px;margin-right:10px"></el-input>
          <el-button plain @click="send" float="right">发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="readAndAgree" >我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
      </el-form>

      <el-button
       @click="login" :disabled="disab" type="primary" style="width:100%">立即登录</el-button>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    const formatMobile = (rule, value, callback) => {
      // 正则匹配是否为手机号
      if ((/^1[3-9]\d{9}$/.test(this.form.mobile))) {
        callback()
      } else {
        callback(new Error('手机号格式不对哦！'))
      }
    }
    return {
      readAndAgree: true,
      form: {
        mobile: '',
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '手机号不可为空', trigger: 'blur' },
          { validator: formatMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不可为空', trigger: 'blur' },
          { len: 6, message: '验证码格式不对', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.post('authorizations', this.form).then(res => {
            // 登录成功,设置token,保持登录状态
            local.setUser(res.data.data)
            // 页面跳转
            this.$router.push('/')
          }).catch(() => {
            this.$message.error('手机号或验证码错误')
          })
        }
      })
    },
    send () {
      const h = this.$createElement
      this.$notify({
        title: '温馨提示',
        message: h('span', { style: 'color: green' }, '验证码为:' + '246810'),
        duration: 0
      })
    }
  },
  computed: {
    // 计算属性-有没有勾选已阅读
    disab () {
      return !this.readAndAgree
    }
  }

}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  background: url("../../assets/login_bg.jpg") no-repeat center / cover;/* 设置背景图 不平铺 居中 全屏显示 */
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
