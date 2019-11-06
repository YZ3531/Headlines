<template>
  <el-card class="box-card">
    <div slot="header">
      <!-- 调用全局自定义组件my-bread并将内容传进留的坑里面 -->
      <my-bread>粉丝管理</my-bread>
    </div>
    <el-tabs v-model="activeName" type="card">
      <!-- 粉丝管理 -->
      <el-tab-pane label="粉丝列表" name="fansList">
        <!-- 循环列表 -->
        <div class="item" v-for="item in fansList" :key="item.id.toString()">
          <el-avatar :size="80" :src="item.photo"></el-avatar>
          <p>{{item.name}}</p>
          <el-button type="primary" size="small" plain>+关注</el-button>
        </div>
        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total_count"
          :page-size="reqParams.per_page"
          :current-page="reqParams.page"
          @current-change="toggleList"
        ></el-pagination>
      </el-tab-pane>
      <!-- 粉丝画像 -->
      <el-tab-pane label="粉丝画像" name="fansImg">
        <div ref="dom" class="dom">

        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import Echarts from 'echarts'
export default {
  data () {
    return {
      activeName: 'fansList',
      fansList: [],
      reqParams: {
        per_page: 21,
        page: 1
      },
      total_count: null
    }
  },
  methods: {
    async getList () {
      const {
        data: { data }
      } = await this.$http.get('followers', { params: this.reqParams })
      this.fansList = data.results
      this.total_count = data.total_count
    },
    toggleList (newPage) {
      this.reqParams.page = newPage
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    const dom = this.$refs.dom
    const myEchatrs = Echarts.init(dom)
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    myEchatrs.setOption(option)
  }
}
</script>

<style>
.item {
  width: 150px;
  height: 190px;
  text-align: center;
  border: 1px dashed #ddd;
  padding-top: 20px;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
}
.dom{
  width: 600px;
  height: 400px;
}
</style>
