<template>
  <div>
    <div is="dispute-detail" :dispute-uid="disputeUid" :status="status" :alone="alone"></div>
  </div>
</template>
<script>
import disputeDetail from '@/components/common/dispute-mediation/dispute-detail.vue';
export default {
  components: { disputeDetail },
  data () {
    return {
      disputeUid: '',
      status: '',
      alone: ''
    }
  },
  mounted () {
    this.disputeUid = this.$route.query.disputeUid;
    this.status = this.$route.query.status;
    this.alone = this.$route.query.alone;
  }
}
</script>
<style>
</style>
