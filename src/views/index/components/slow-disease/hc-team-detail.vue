<template>
  <div is="team-detail" :titleList="titleList" :path="path" :teamId="teamId"></div>
</template>
<script>
import teamDetail from '@/components/common/slow-disease/team-detail.vue';
export default {
  components: {teamDetail},
  data () {
    return {
      titleList: ['家庭医生团队', '团队详情'],
      path: 'hc-team-list',
      teamId: ''
    }
  },
  mounted () {
    this.teamId = this.$route.query.teamId;
  }
}
</script>
<style lang="less" scoped>
</style>
