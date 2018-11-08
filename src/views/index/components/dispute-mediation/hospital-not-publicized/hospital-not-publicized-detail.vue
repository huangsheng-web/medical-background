<template>
  <div>
    <div is="dispute-detail" :dispute-uid="disputeUid" :status="status"></div>
  </div>
</template>
<script>
import disputeDetail from '@/components/common/dispute-mediation/dispute-detail.vue';
export default {
  components: { disputeDetail },
  data () {
    return {
      disputeUid: '',
      status: ''
    }
  },
  mounted () {
    this.disputeUid = this.$route.query.disputeUid;
    this.status = this.$route.query.status;
  }
}
</script>
<style>
</style>
