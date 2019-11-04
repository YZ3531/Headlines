<template>
  <div class="container-publish">
    <el-card class="box-card">
      <!-- 面包屑组件 -->
      <div slot="header">
        <my-bread>{{  $route.query.id?'修改文章':"发布文章"}}</my-bread>
      </div>
      <el-form label-width="120px">
        <!-- 标题 -->
        <el-form-item label="标题:">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <!-- 内容 -->
        <el-form-item label="内容:">
            <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <!-- 封面图片 -->
        <el-form-item label="封面:">
          <!-- 单选框组触发change事件,会清空数组中的URL地址 -->
          <el-radio-group v-model="articleForm.cover.type" @change="articleForm.cover.images=[]">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三张</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 图片封面组件 --><!-- 根据单选框组选中项 决定显示 一个或是三个或是不显示封面组件 -->
          <div class="imageList" v-if="articleForm.cover.type===1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div class="imageList" v-if="articleForm.cover.type===3">
            <my-image v-for="i in 3" :key="i" v-model="articleForm.cover.images[i-1]"></my-image>
          </div>
        </el-form-item>
        <!-- 频道 -->
        <el-form-item label="频道:">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item v-if="$route.query.id"><!-- 修改文章按钮区域 -->
          <el-button @click="update(true)">存入草稿</el-button>
          <el-button @click="update(false)" type="success">修改文章</el-button>
        </el-form-item>
        <el-form-item v-else><!-- 发布文章按钮区域 -->
          <el-button @click="create(true)">存入草稿</el-button>
          <el-button @click="create(false)" type="primary">发布文章</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 富文本所需样式文件
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  // 局部挂载富文本
  components: {
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      },
      // 富文本配置
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  methods: {
    // 修改文章&存入草稿
    async update (draft) {
      await this.$http.put(`articles/${this.articleForm.id}?draft=${draft}`, this.articleForm)
      this.$message.success(draft ? '存入草稿成功!' : '修改文章成功!')
      this.$router.push('/article')
    },
    // 发表文章&存入草稿
    async create (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      this.$message.success(draft ? '存入草稿成功!' : '发表文章成功!')
      this.$router.push('/article')
    },
    // 获取传来的id对应的文章
    async getArticle (id) {
      // 通过传递进来的id获取指定文章信息
      const { data: { data } } = await this.$http.get(`articles/${id}`)
      // 赋值给articleForm,完成渲染
      this.articleForm = data
    },
    toggleArticleStatus () {
      // 取得地址栏传递来的id
      const articleID = this.$route.query.id
      // 如果存在的话,就去获取这个id所对应的文章信息
      if (articleID) {
        this.getArticle(articleID)
      } else {
        // 没有id的话将内容清空
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null
        }
      }
    }
  },
  created () {
    // 打开页面 获取地址栏id进行判断 将本页功能改为 修改还是添加
    this.toggleArticleStatus()
  },
  watch: {
    // 监听地址栏id的变化,如果消失了,就将本页面内容清空
    '$route.query.id': function () {
      this.toggleArticleStatus()
    }
  }
}
</script>

<style scoped lang="less">

</style>
