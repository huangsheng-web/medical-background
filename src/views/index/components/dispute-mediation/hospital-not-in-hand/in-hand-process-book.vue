<template>
  <div>
    <div is="dispute-crumbs" :title="title" :status="status"></div>
    <div is="book-detail" :disputeUid="disputeUid" :type="type" :status="status" :processBookUid="processBookUid" :deptName="deptName" :disputeObject="disputeObject" :reportType="reportType"></div>
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
      title: '调解过程书',
      type: null,
      processBookUid: '',
      deptName: '',
      disputeObject: '',
      reportType: ''
    }
  },
  mounted () {
    this.disputeUid = this.$route.query.disputeUid;
    this.status = this.$route.query.status;
    this.type = this.$route.query.type;
    this.processBookUid = this.$route.query.processBookUid;
    this.deptName = this.$route.query.deptName;
    this.disputeObject = this.$route.query.disputeObject;
    this.reportType = this.$route.query.reportType;
  }
}
</script>
<style>
</style>
