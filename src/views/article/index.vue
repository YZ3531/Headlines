<template>
  <div>
    <!-- 筛选条件部分 -->
    <el-card class="box-card">
      <div slot="header">
        <!-- 调用全局自定义组件my-bread并将内容传进留的坑里面 -->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单组件 -->
      <el-form size="small" label-width="80px">
        <!-- 状态组件 -->
        <el-form-item label="状态:">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 频道组件 -->
        <el-form-item label="频道:">
          <!-- 使用自己封装的全局频道组件 -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <!-- 日期组件 -->
        <el-form-item label="日期:">
          <div class="block">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="timesAtr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeAtr"
            ></el-date-picker>
          </div>
        </el-form-item>
        <!-- 筛选按钮 -->
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果部分 -->
    <el-card style="margin-top:20px">
      <div slot="header">根据筛选条件共查询到 {{total}} 条结果:</div>
      <el-table :data="articles" style="width: 100%">
        <!-- 封面部分 -->
        <el-table-column prop="cover.images[0]" label="封面" width="280">
          <template slot-scope="scope">
            <el-image
              style="width: 150px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="fill"
            >
              <!-- 错误显示图片 -->
              <div slot="error">
                <img src="../../assets/error.gif" style="width:150px;height:100px" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <!-- 标题部分 -->
        <el-table-column prop="title" label="标题"></el-table-column>
        <!-- 状态部分 -->
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <!-- 发布时间部分 -->
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <!-- 操作部分 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="editArticle(scope.row.id)"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="delArticle(scope.row.id)"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
      background layout="prev, pager, next"
      :total="total"
      :current-page="reqParams.page"
      :page-size="reqParams.per_page"
      @current-change="pager"
      ></el-pagination>
      <!-- total是总条数 -->
      <!-- current-page动态激活当前的页码对应的按钮 -->
      <!-- page-size规定一页显示多少条 -->
      <!-- current-change事件:当页码改变(点击页码&上一页&下一页)就执行,参数当前改变后的页码 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timesAtr: [],
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: null,
        per_page: 20
      },
      // 所有文章的列表
      articles: [],
      // 文章总条数
      total: 0
    }
  },
  methods: {
    // 当时间发生变化，赋值给reqParams中的起止时间--选择日期触发函数
    changeAtr (e) {
      // 有值为数组,无值为null(清除日期后为null)
      if (e !== null) { // 不为null,就可以将值取出来赋值给reqParams对象的属性
        this.reqParams.begin_pubdate = e[0]
        this.reqParams.end_pubdate = e[1]
      } else { // 为null,就要手动更改reqParams里面的值为null
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 获取文章列表
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      console.log(data)
      this.articles = data.results // 取得所有文章的列表赋值给articles
      this.total = data.total_count // 取得文章总条数赋值给total
    },
    // 修改文章
    editArticle (id) {
      this.$router.push({ path: '/publish', query: { id } }) // 页面跳转,附带被点击文章ID
    },
    // 删除文章
    async delArticle (id) {
      try {
        // 发删除请求
        await this.$http.delete(`articles/${id}`)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 刷新页面
        this.getArticles()
      } catch (err) {
        this.$message({
          type: 'info',
          message: '删除失败!'
        })
      }
    },
    // 文章筛选
    async search () {
      // 如果进行筛选的时候里面的频道组件为空字符串,说明本来被选中的后来被清空掉了
      // 发去的请求,频道传递参数为字符串的话,会报错,就手动给它赋值null
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null

      // 页码恢复到第一页
      this.reqParams.page = 1
      // 调用获取文章列表,更省事,它会在请求中携带绑定好的数据,即用户选择的条件
      this.getArticles()
    },
    // 分页点击功能
    pager (newPage) {
      // 将新的页码赋值给数据中的页码,重新获取文章列表数据
      this.reqParams.page = newPage
      this.getArticles()
    }
  },
  created () {
    // 默认打开获取一次所有文章的列表数据
    this.getArticles()
  }
}
</script>

<style>
</style>
