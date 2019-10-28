<template>
    <div >
        <img src="../../assets/welcome.jpg" class="welcome" alt="">
    </div>
</template>

<script>
export default {
  created () {
    // 测试
    this.$http.get('http://ttapi.research.itcast.cn/mp/v1_0/articles').then(res => {
    }).catch(() => {
      console.log('error')
    })
  }
}
</script>

<style>
.welcome{
    display: block;
    margin: 0 auto;
}
</style>
