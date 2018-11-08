<template>
  <div>
    <div is="dispute-crumbs" :title="title" :status="status" :lastTitle="lastTitle"></div>
    <div id="contractPrintDetail" style="width: 210mm;">
      <div style="color: #000; margin: 0 auto; padding: 14px 60px 10px 60px;font-size: 16px;line-height: 40px;text-align: justify;">
        <h1 style="letter-spacing: 5px; font-size: 20px; font-weight: bold; text-align: center; padding: 0 0 0 0;">医疗纠纷协议书</h1>
        <div><label style="font-weight: bold;">甲方：</label>{{disputeProtocol.partyAName}}</div>
        <div><label style="font-weight: bold;">乙方：</label>{{disputeProtocol.partyBName}}</div>
        <div><label style="font-weight: bold;">事由：</label>{{disputeProtocol.cause}}</div>
        <p><label>一、</label><span>甲方一次性赔偿乙方人民币{{disputeProtocol.compensationMoney}}元整，现实付{{disputeProtocol.actualMoney}}元整。</span></p>
        <p><label>二、</label><span>乙方通过甲方同意，协商前{{disputeProtocol.agreeInformation}}。</span></p>
        <p><label>三、</label><span>此医疗纠纷为一次性了解，甲、乙双方自动放弃向对方主张任何权利和义务。</span></p>
        <p><label>四、</label><span>此协议一式三份，甲、乙双方各执一份，送卫计局一份。</span></p>
        <p v-if="disputeProtocol.additionalRemarks"><span>{{disputeProtocol.additionalRemarks}}</span></p>
        <div style="padding-top: 50px;display: flex;font-weight: bold;">
          <div style="width: 60%;">甲方签字：</div>
          <div style="width: 40%;">乙方签字：</div>
        </div>
        <div style="text-align: right;padding-top: 30px;">{{disputeProtocol.inscribeTime | moment('YYYY年MM月DD日')}}</div>
      </div>
    </div>
    <div style="text-align: center;padding-top: 30px;">
      <el-button type="primary" size="small" @click="printPage()">打 印</el-button>
      <el-button size="small" plain @click="$router.go(-1)">取 消</el-button>
    </div>
  </div>
</template>
<script>
import disputeCrumbs from '@/components/common/dispute-mediation/dispute-crumbs.vue';
export default {
  components: { disputeCrumbs },
  data () {
    return {
      disputeUid: '',
      disputeProtocol: '',
      title: '纠纷协议书 >',
      lastTitle: '纠纷协议书打印预览',
      status: ''
    }
  },
  mounted () {
    this.disputeUid = this.$route.query.disputeUid;
    this.status = this.$route.query.status;
    if (this.disputeUid) {
      this.getDisputeProtocol();
    }
  },
  methods: {
    printPage () {
      $('#contractPrintDetail').printArea();
    },
    skipIsProtocol () {
      this.$router.push({ name: 'hospital-in-hand-protocol', query: { disputeUid: this.disputeUid } });
    },
    // 查询纠纷协议书
    getDisputeProtocol () {
      this.axios.get('/hisServices/dispute/agreement/' + this.disputeUid)
        .then(res => {
          if (res) {
            console.log(res);
            this.disputeProtocol = res.data;
          }
        })
    }
  }
}
</script>
<style scoped lang="less">
  #contractPrintDetail{
    height: 297mm;
    margin: 0 auto;
    margin-top: 20px;
    border: 1px solid #E8E8E8;
  }
</style>
