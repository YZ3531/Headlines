<template>
  <!-- 图片封面组件 -->
  <div class="my-image">
    <!-- 按钮 -->
    <div class="btn-image" @click="open">
      <img src="../assets/default.png" />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs type="card" v-model="activeName">
        <!-- 素材库 -->
        <el-tab-pane label="素材库" name="image">
          <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 图片区域 -->
          <div class="img_list">
            <div
              v-for="item in imgList"
              :key="item.id"
              class="img_item"
              @click="selectedImage(item.url)"
              :class="{selected:item.url===selectedImageURL}"
            >
              <img :src="item.url" alt />
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
        </el-tab-pane>
        <!-- 上传图片 -->
        <el-tab-pane label="上传图片" name="upload">
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
        </el-tab-pane>
      </el-tabs>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local.js'
export default {
  props: ['images'],
  data () {
    return {
      dialogVisible: false, // 控制对话框的显示与隐藏
      activeName: 'image', // 切换素材库与上传图片（默认显示素材库内容）
      selectedImageURL: null, // 选中的图片地址
      // 素材库所用数据
      reqParams: {
        collect: false, // 全部/收藏 状态区分
        page: 1, // 请求页码数
        per_page: 8 // 请求每次返回多少条数据
      },
      total: 0, // 数据总条数,控制分页有多少页
      imgList: [], // 图片列表,默认为空,请求回来就会存入数据
      // 上传图片所用数据
      imageUrl: null, // 上传素材路径
      headers: { Authorization: `Bearer ${local.getUser().token}` }
    }
  },
  methods: {
    selectedImage (url) {
      // 点击选中图片
      this.selectedImageURL = url
    },
    open () {
      this.dialogVisible = true
      this.activeName = 'image'
      this.getImages()
    },
    // 获取图片列表
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.imgList = data.results // 将取到的图片列表给imgList,然后去渲染
      this.total = data.total_count // 将图片总数量给total,然后去产生分页
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
    // 添加素材
    handleSuccess (res) {
      this.imageUrl = res.data.url // 将url存储到到本地的imageUrl
      this.$message.success('上传成功')
    }
  }
}
</script>

<style scoped lang="less">
.my-image {
  display: inline-block;
  margin-right: 20px;
}
.btn-image {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  text-align: center;
  width: 100%;
  display: block;
}

.img_list {
  margin-top: 20px;
  .img_item {
    display: inline-block;
    position: relative;
    width: 150px;
    height: 120px;
    border: 1px dashed #ccc;
    margin-right: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    &.selected::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat
        center / 50px 50px;
    }
  }
}
</style>
