<template>
  <div>
    <div is="dispute-crumbs" :title="title" :status="status" :lastTitle="lastTitle"></div>
    <div id="contractPrintDetail" style="width: 210mm;">
      <div style="color: #000; margin: 0 auto;padding: 14px 60px 10px;font-size: 16px;line-height: 40px;text-align: justify;overflow: hidden;">
        <h1 style="letter-spacing: 5px; font-size: 20px; font-weight: bold; text-align: center; padding: 0 0 0 0;">受理单</h1>
        <div style="display: flex;justify-content: space-between;padding-top: 20px;">
          <div style="width: 18%;height: 50px;margin-top: 10px;line-height: 50px;text-align: center;border: 1px solid #999;">报案人基本信息</div>
          <div style="width: 82%;padding-left: 10px;">
            <div style="display: flex;justify-content: space-between;flex-wrap: wrap;line-height: 30px;">
              <label>姓名：</label><div style="min-width: 10%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.reportName}}</div>
              <label>性别：</label><div style="min-width: 3%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.reportSex}}</div>
              <label>年龄：</label><div style="min-width: 3%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.reportAge}}</div>
              <label>身份证号码：</label><div style="min-width: 10%;border-bottom: 1px solid #999;">{{acceptanceSheetData.reportIdcard}}</div>
            </div>
            <div style="display: flex;justify-content: space-between;flex-wrap: wrap;line-height: 30px;">
              <label>时间：</label><div style="min-width: 10%;;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.reportTime | moment()}}</div>
              <label>电话：</label><div style="min-width: 10%;hmargin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.reportTelephone}}</div>
              <label>提交材料：</label><div style="min-width: 26%;border-bottom: 1px solid #999;">{{acceptanceSheetData.reportMaterial}}</div>
            </div>
          </div>
        </div>
        <div style="display: flex;ustify-content: space-between;padding-top: 20px;">
          <div style="width: 18%;height: 50px;margin-top: 10px;line-height: 50px;border: 1px solid #999;text-align: center;">患者基本信息</div>
          <div style="width: 82%;padding-left: 10px;">
            <div style="display: flex;justify-content: space-between;flex-wrap: wrap;line-height: 30px;">
              <label>姓名：</label><div style="min-width: 10%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.patientName}}</div>
              <label>性别：</label><div style="min-width: 3%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.patientSex}}</div>
              <label>年龄：</label><div style="min-width: 3%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.patientAge}}</div>
              <label>住址：</label><div style="min-width: 26%;border-bottom: 1px solid #999;">{{acceptanceSheetData.patientAddress}}</div>
            </div>
            <div style="display: flex;justify-content: space-between;flex-wrap: wrap;line-height: 30px;">
              <label>身份证号码：</label><div style="min-width: 14%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.patientIdcard}}</div>
              <label>电话：</label><div style="min-width: 40%;border-bottom: 1px solid #999;">{{acceptanceSheetData.patientTelephone}}</div>
            </div>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between;flex-wrap: wrap;line-height: 30px;padding: 20px 0;">
          <label style="min-width: 8%;">涉及医疗结构：</label><div style="min-width: 80%;border-bottom: 1px solid #999;">{{acceptanceSheetData.hospName}}</div>
        </div>
        <div style="display: flex;justify-content: space-between;flex-wrap: wrap;line-height: 30px;">
          <label>代理人基本信息：姓名：</label><div style="min-width: 10%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.agentName}}</div>
          <label>性别：</label><div style="min-width: 3%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.agentSex}}</div>
          <label>年龄：</label><div style="min-width: 3%;margin-right: 10px;border-bottom: 1px solid #999;">{{acceptanceSheetData.agentAge}}</div>
          <label>电话：</label><div style="min-width: 20%;border-bottom: 1px solid #999;">{{acceptanceSheetData.agentTelephone}}</div>
        </div>
        <div style="display: flex;justify-content: space-between;flex-wrap: wrap;line-height: 30px;padding-left: 126px;padding-top: 10px;">
          <label style="min-width: 10%;">身份证号码：</label><div style="min-width: 80%;border-bottom: 1px solid #999;">{{acceptanceSheetData.agentIdcard}}</div>
        </div>
        <div style="line-height: 30px;padding-top: 20px;">
          <div style="width: 100%;height: 30px;position: relative;border-bottom: 1px solid #999;">
            <div style="position: absolute;left: 0;top: 0;line-height: 30px;"><span style="display: inline-block;line-height: 30px;border-bottom: 1px solid #fff;">医疗矛盾争议焦点：</span><span>{{acceptanceSheetData.disputeFocus}}</span></div>
          </div>
          <div style="width: 100%;height: 30px;border-bottom: 1px solid #999;"></div>
          <div style="width: 100%;height: 30px;border-bottom: 1px solid #999;"></div>
          <div style="width: 100%;height: 30px;border-bottom: 1px solid #999;"></div>
          <div style="width: 100%;height: 30px;border-bottom: 1px solid #999;"></div>
          <div style="width: 100%;height: 30px;border-bottom: 1px solid #999;"></div>
          <div style="width: 100%;height: 30px;border-bottom: 1px solid #999;"></div>
        </div>
        <div>
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
      acceptanceSheetData: {},
      title: '受理单 >',
      lastTitle: '受理单打印预览',
      status: ''
    }
  },
  mounted () {
    this.disputeUid = this.$route.query.disputeUid;
    this.status = this.$route.query.status;
    if (this.disputeUid) {
      this.getAcceptanceSheet();
    }
  },
  methods: {
    printPage () {
      $('#contractPrintDetail').printArea();
    },
    // 查询受理单
    getAcceptanceSheet () {
      this.axios.get('/hisServices/dispute/handlingForm/' + this.disputeUid)
        .then(res => {
          if (res) {
            console.log(res);
            this.acceptanceSheetData = res.data;
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
