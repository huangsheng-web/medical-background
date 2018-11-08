<template>
  <div class="not-found">
    <div><img src="../../../assets/img/404.png" alt="" width="430px" height="222px"></div>
    <div style="margin-left: 30px;">
      <h1>很抱歉，您访问的页面不存在！</h1>
      <el-button type="primary" size="small" @click="$router.go(-1)">返回上一页</el-button>
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
  .not-found{
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
    margin-left: -313px;
    h1{
      margin-top: 50px;
      margin-bottom: 20px;
      font-size: 16px;
    }
  }
</style>
