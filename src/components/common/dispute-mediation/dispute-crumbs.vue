<template>
  <div class="title">
    <div><i class="icon iconfont" @click="skipIsList">&#xe681;</i>
      <span v-if="status === '3' && only">未受理&nbsp;></span>
      <span v-if="status === '0' || status === '4' || (status === '3' && !only)">处理中&nbsp;></span>
      <span v-if="status === '1' || status === '2' || status === '5'">已处理&nbsp;></span>
      <span v-if="status === '6'">已公示&nbsp;></span>
      <span>{{title !== undefined ? title : '纠纷详情'}}</span>
      <span v-if="lastTitle">{{lastTitle !== undefined ? lastTitle : null}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['status', 'title', 'lastTitle', 'only'],
  data () {
    return {}
  },
  methods: {
    skipIsList () {
      this.$router.go(-1);
    }
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
