<template>
  <div>
    <div is="dispute-crumbs" :title="title" :status="status" :lastTitle="lastTitle"></div>
    <div id="contractPrintDetail" style="width: 210mm">
      <div style="color: #000; margin: 0 auto; padding: 14px 90px 10px 60px;font-size: 16px;line-height: 40px;text-align: justify;overflow: hidden;">
        <h1 style="letter-spacing: 5px; font-size: 16px; text-align: center; padding: 0 0 0 0;color: #999;">溆浦县医疗纠纷人民调解委员会</h1>
        <h1 style="letter-spacing: 5px; font-size: 20px; font-weight: bold; text-align: center; padding: 0 0 0 0;">人民调解申请书（医方）</h1>
        <div style="display: flex;padding-top: 20px;"><label style="width: 12%;">申请日期</label><div style="width: 92%;height: 34px;border-bottom: 1px solid #999;">{{requisitionData.reportTime | moment()}}</div></div>
        <div style="display: flex;"><label style="width: 17%;">医疗机构名称</label><div style="width: 89%;height: 34px;border-bottom: 1px solid #999;">{{requisitionData.hospName}}</div></div>
        <div style="display: flex;"><label style="width: 15%;">法定代表人</label><div style="width: 91%;height: 34px;border-bottom: 1px solid #999;">{{requisitionData.legalPerson}}</div></div>
        <div style="display: flex;flex-wrap: wrap;">
          <label style="width: 17%;">受委托人姓名</label><div style="width: 20%;height: 34px;border-bottom: 1px solid #999;">{{requisitionData.trustee}}</div>
          <label style="width: 8%;text-align: center;">职务</label><div style="min-width: 8%;height: 34px;border-bottom: 1px solid #999;">{{requisitionData.position}}</div>
          <label style="width: 12%;;text-align: center;">联系方式</label><div style="width: 35%;height: 34px;border-bottom: 1px solid #999;">{{requisitionData.telephone}}</div>
        </div>
        <div style="line-height: 34px;margin-top: 10px;" v-show="!requisitionData.disputeFact">
          <div style="height: 34px;line-height: 34px;border-bottom: 1px dashed #999;position: relative;">
            <div style="position: absolute;left: 0;top: 0;"><label style="display: inline-block;width: 80px;height: 34px;line-height: 34px;border-bottom: 1px solid #fff;">纠纷事实：</label></div>
          </div>
          <div style="height: 34px;line-height: 34px;border-bottom: 1px dashed #999;"></div>
          <div style="height: 34px;line-height: 34px;border-bottom: 1px dashed #999;"></div>
        </div>
        <div v-show="requisitionData.disputeFact" style="line-height: 34px;">
          <label>纠纷事实：</label><span style="border-bottom: 1px solid #999;">{{requisitionData.disputeFact}}</span>
        </div>
        <div style="line-height: 34px;margin-top: 10px;" v-show="!requisitionData.medicalProcess">
          <div style="height: 34px;line-height: 34px;border-bottom: 1px dashed #999;position: relative;">
            <div style="position: absolute;left: 0;top: 0;"><label style="display: inline-block;width: 80px;height: 34px;line-height: 34px;border-bottom: 1px solid #fff;">诊疗过程：</label></div>
          </div>
          <div style="height: 34px;line-height: 34px;border-bottom: 1px dashed #999;"></div>
          <div style="height: 34px;line-height: 34px;border-bottom: 1px dashed #999;"></div>
        </div>
        <div v-show="requisitionData.medicalProcess" style="line-height: 34px;">
          <label>诊疗过程：</label><span style="border-bottom: 1px solid #999;">{{requisitionData.medicalProcess}}</span>
        </div>
        <p style="padding-left: 50px;padding-top: 20px;">特申请溆浦县医疗纠纷人民调解委员会予以调解。</p>
        <div style="display: flex;justify-content: flex-end;"><label style="width: 30%;">申请人或受委托人（签名）</label><div style="width: 14%;height: 34px;border-bottom: 1px solid #999;;text-align: center;"></div></div>
        <div style="display: flex;justify-content: flex-end;text-align: center;">
          <div style="width: 8%;height: 34px;border-bottom: 1px solid #999;">{{slice(requisitionData.inscribeTime, 1)}}</div><label style="width: 2%;">年</label>
          <div style="width: 6%;height: 34px;border-bottom: 1px solid #999;">{{slice(requisitionData.inscribeTime, 2)}}</div><label style="width: 2%;">月</label>
          <div style="width: 6%;height: 34px;border-bottom: 1px solid #999;">{{slice(requisitionData.inscribeTime, 3)}}</div><label style="width: 2%;">日</label>
        </div>
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
      requisitionData: {},
      title: '调解申请书 >',
      lastTitle: '调解申请书打印预览',
      status: ''
    }
  },
  mounted () {
    this.disputeUid = this.$route.query.disputeUid;
    this.status = this.$route.query.status;
    if (this.disputeUid) {
      this.getRequisition();
    }
  },
  methods: {
    printPage () {
      $('#contractPrintDetail').printArea();
    },
    // 查询调解申请书
    getRequisition () {
      this.axios.get('/hisServices/dispute/apply/' + this.disputeUid)
        .then(res => {
          if (res) {
            console.log(res);
            this.requisitionData = res.data;
          }
        })
    },
    slice (str, type) {
      let value = this.moment(str).format('YYYY-MM-DD');
      let indexOne = value.indexOf('-');
      let indexTwo = value.lastIndexOf('-');
      if (type === 1) {
        return value.slice(0, indexOne);
      } else if (type === 2) {
        return value.slice(indexOne + 1, indexTwo);
      } else {
        return value.slice(indexTwo + 1);
      }
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
