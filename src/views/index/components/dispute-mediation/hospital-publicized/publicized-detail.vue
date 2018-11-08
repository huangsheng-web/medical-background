<template>
  <div>
    <div is="dispute-crumbs" :title="title" :status="status"></div>
    <div is="book-detail" :disputeUid="disputeUid" :type="type"></div>
  </div>
</template>
<script>
import disputeCrumbs from '@/components/common/dispute-mediation/dispute-crumbs.vue';
import bookDetail from '@/components/common/dispute-mediation/book-detail.vue';
export default {
  components: { disputeCrumbs, bookDetail },
  data () {
    return {
      disputeUid: '',
      status: '',
      title: '公示详情',
      type: null
    }
  },
  mounted () {
    this.disputeUid = this.$route.query.disputeUid;
    this.status = this.$route.query.status;
    this.type = this.$route.query.type;
  }
}
</script>
<style>
</style>
