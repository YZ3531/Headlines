<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <!-- 调用全局自定义组件my-bread并将内容传进留的坑里面 -->
        <my-bread>素材管理</my-bread>
      </div>
      <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button @click="open" style="float:right" type="success" size="small">添加素材</el-button>
      <!-- 图片区域 -->
      <div class="img_list">
        <div v-for="item in imgList" :key="item.id" class="img_item">
          <img :src="item.url" alt />
          <!-- 根据 全部&收藏 的状态来决定底部的隐藏与显示 -->
          <div class="footer" v-if="!reqParams.collect">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span @click="delImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页区 -->
      <el-pagination
        style="text-align:center"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
    <!-- 添加素材部分 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :show-file-list="false"
        :on-success="handleSuccess"
        :headers="headers"
        name="image"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local.js'
export default {
  data () {
    return {
      reqParams: {
        collect: false, // 全部/收藏 状态区分
        page: 1, // 请求页码数
        per_page: 10 // 请求每次返回多少条数据
      },
      total: 0, // 数据总条数,控制分页有多少页
      imgList: [], // 图片列表,默认为空,请求回来就会存入数据
      dialogVisible: false, // 上传素材页面默认隐藏
      imageUrl: null, // 上传素材路径
      headers: { Authorization: `Bearer ${local.getUser().token}` }
    }
  },
  methods: {
    // 打开对话框
    open () {
      this.dialogVisible = true
      this.imageUrl = null
    },
    // 获取图片列表
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.imgList = data.results // 将取到的图片列表给imgList,然后去渲染
      this.total = data.total_count // 将图片总数量给total,然后去产生分页
      console.log(data)
    },
    // 分页切换
    pager (newPage) {
      this.reqParams.page = newPage // 将点击的分页取到以此为条件重新发请求获取图片列表
      this.getImages()
    },
    // 全部页面&收藏页面的切换
    toggleList () {
      this.reqParams.page = 1 // 请求的页码归为第一页
      this.getImages() // 发送请求
    },
    // 星星的切换
    async toggleStatus (item) {
      // 发送更改状态请求,携带头参数(当前ID),体参数(是否收藏-状态),解构出响应体里面的信息
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 将当前状态更改为响应体返回的状态
      item.is_collected = data.collect
      this.$message.success((data.collect ? '添加' : '取消') + '收藏成功')
    },
    // 删除图片
    async delImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.delete(`user/images/${id}`)
          this.getImages()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加素材
    handleSuccess (res) {
      this.imageUrl = res.data.url // 将url存储到到本地的imageUrl
      this.$message.success('上传成功')
      window.setTimeout(() => {
        this.dialogVisible = false
        this.getImages() // 刷新
      }, 2000)
    }
  },
  created () {
    this.getImages()
  }
}
</script>

<style scoped  lang="less">
.img_list {
  margin-top: 20px;
  .img_item {
    display: inline-block;
    position: relative;
    width: 180px;
    height: 180px;
    border: 1px dashed #ccc;
    margin-right: 50px;
    margin: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      background-color: rgba(0, 0, 0, 0.2);
      text-align: center;
      color: #fff;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
