<template>
  <div class="title">
    <div>
      <i class="icon iconfont" @click="$router.go(-1)">&#xe681;</i>
      <span v-for="(item, index) in titleList" :key="index">{{item}}<span v-if="titleList.length - 1 > index">&nbsp;>&nbsp;</span></span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['titleList'],
  data () {
    return {}
  }
}
</script>
<style scoped lang="less">
  .title{
    i{
      cursor: pointer;
      vertical-align: bottom;
    }
    span{
      color: #666666;
      font-weight: bold;
      &:last-child{
        color: #333333;
      }
    }
  }
</style>
