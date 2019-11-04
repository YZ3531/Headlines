<template>
  <el-card class="box-card">
    <div slot="header">
      <!-- 调用全局自定义组件my-bread并将内容传进留的坑里面 -->
      <my-bread>评论管理</my-bread>
    </div>
    <!-- 表格区域 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column label="标题" prop="title" width="400"></el-table-column>
      <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
      <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{scope.row.comment_status?"正常":"关闭"}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="toggleStatus(scope.row.id,false)" v-if="scope.row.comment_status" type="danger" size="small">关闭评论</el-button>
          <el-button @click="toggleStatus(scope.row.id,true)" v-else type="success" size="small">打开评论</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
    background layout="prev, pager, next"
    :total="total"
    :page-size="reqParams.per_page"
    :current-page="reqParams.page"
    @current-change="pager"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      articles: [], // 渲染数据
      reqParams: { // 请求数据
        response_type: 'comment',
        per_page: 20,
        page: 1
      },
      total: 0 // 总页数
    }
  },
  methods: {
    // 分页切换
    pager (newPage) {
      this.reqParams.page = newPage
      this.getArticle()
    },
    // 获取评论列表数据
    async getArticle () {
      const { data: { data } } = await this.$http.get(`articles`, { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    },
    // 关闭/打开 评论事件
    toggleStatus (id, status) {
      // 友好提示是否确定
      this.$confirm(`您确定要${status ? '打开' : '关闭'}评论, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 取到 状态及id ,发送更改状态请求,更改之后更新页面,并提示成功信息
        const { data: { data } } = await this.$http.put(`comments/status?article_id=${id}`, { allow_comment: status })
        this.$message(data.allow_comment ? '打开评论成功' : '关闭评论成功')
        this.getArticle()
      }).catch(() => {
      })
    }
  },
  created () {
    this.getArticle()
  }
}
</script>

<style>
</style>
