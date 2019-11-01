<template>
  <!-- 频道组件(全局) -->
  <el-select @change="fn" :value="value" placeholder="请选择" clearable>
    <el-option v-for="item in channelOptions" :value="item.id" :label="item.name" :key="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      channelOptions: []
    }
  },
  methods: {
    // 获取频道列表数据
    async getChannelOptions () {
      const {
        data: { data }
      } = await this.$http.get('channels')
      this.channelOptions = data.channels
    },
    fn (channelId) {
      if (channelId === '') channelId = null
      this.$emit('input', channelId)
    }
  },
  created () {
    this.getChannelOptions()
  }
}
</script>

<style>
</style>
