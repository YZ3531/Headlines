<template>
  <el-card class="box-card">
    <div slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form size="small" label-width="80px">
      <el-form-item label="状态:">
        <el-radio-group v-model="getAtr.status">
          <el-radio :label="null">全部</el-radio>
          <el-radio :label="0">草稿</el-radio>
          <el-radio :label="1">待审核</el-radio>
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="3">审核失败</el-radio>
          <el-radio :label="4">已删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道:">
        <el-select v-model="getAtr.channel_id" placeholder="请选择">
          <el-option
            v-for="item in channelOptions"
            :value="item.value"
            :label="item.label"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

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

      <el-form-item>
        <el-button type="primary">筛选</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      timesAtr: [],
      getAtr: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null
      },
      channelOptions: [{ value: 1, label: 'java' }, { value: 2, label: '前端' }]
    }
  },
  methods: {
    // 当时间发生变化，赋值给getAtr中的起止时间
    changeAtr (e) {
      this.getAtr.begin_pubdate = e[0]
      this.getAtr.end_pubdate = e[1]
    }
  }
}
</script>

<style>
</style>
