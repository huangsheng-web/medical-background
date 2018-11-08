<template>
  <div>
    <div is="dispute-detail" :dispute-uid="disputeUid" :status="status" :only="only"></div>
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
      only: null
    }
  },
  mounted () {
    this.disputeUid = this.$route.query.disputeUid;
    this.status = this.$route.query.status;
    this.only = this.$route.query.only;
  }
}
</script>
<style>
</style>
