<template>
  <el-container class="container-home">
    <el-aside :width="isOpen?'200px':'64px'">
      <div class="logo" :class="{logoSmall:!isOpen}"></div>
      <el-menu
        default-active="/"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="!isOpen"
        :collapse-transition="false"
        router
      >
        <!-- 关闭合起动画:collapse-transition="false" -->
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>

        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <span class="el-icon-s-fold" @click="toggleMenu"></span>
        <span>江苏传智播客科技教育有限公司</span>

        <el-dropdown class="dropdown" @command="handleClick">
          <span class="el-dropdown-link">
            <img :src="userInfo.photo" class="headIcon" />
            {{userInfo.name}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting">
              <i class="el-icon-setting"></i>个人设置
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              <i class="el-icon-unlock"></i>退出登陆
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import local from '@/utils/local'
export default {
  created () {
    // 读取本地用户信息部分
    const user = local.getUser()
    this.userInfo.name = user.name
    this.userInfo.photo = user.photo
  },
  data () {
    return {
      isOpen: true,
      userInfo: {}
    }
  },
  methods: {
    // 切换导航菜单状态
    toggleMenu () {
      this.isOpen = !this.isOpen
    },
    // 登出功能
    logout () {
      this.$confirm('你确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        local.delUser()
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    // 用户设置
    setting () {
      this.$router.push('/setting')
    },
    // 将传递过来的值作为调用的函数名调用
    handleClick (comment) {
      this[comment]()
    }
  }
}
</script>

<style  scoped lang='less'>
.container-home {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  .el-aside {
    background-color: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url("../../assets/logo_admin.png") no-repeat center /
        140px auto;
    }
    .logoSmall {
      background-image: url("../../assets/logo_admin_01.png");
      background-size: 36px auto;
    }
    .el-menu {
      border: 0;
    }
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    line-height: 60px;
    .el-icon-s-fold {
      font-size: 30px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 10px;
    }
    .dropdown {
      float: right;
      .el-dropdown-link {
        cursor: pointer;
        color: #000;
        font-weight: 700;
        .headIcon {
          width: 30px;
          height: 30px;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
