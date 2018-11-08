<template>
  <div class="acceptance-sheet">
    <div is="dispute-crumbs" :title="title" :status="status"></div>
    <div class="content">
      <div class="bottom">
        <el-form :rules="rules" ref="acceptanceSheetData" :label-position="labelPosition" :model="acceptanceSheetData" label-width="80px">
          <h1>上报人基本信息</h1>
          <el-form-item class="flex">
            <el-form-item label="姓名:" style="width: 25%;" prop="reportName">
              <el-input v-model="acceptanceSheetData.reportName" size="small" :disabled="true" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="性别:" style="width: 25%;">
              <el-input :value="getSex(acceptanceSheetData.reportIdcard)" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="年龄:" style="width: 25%;">
              <el-input :value="getAge(acceptanceSheetData.reportIdcard)" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" style="width: 25%;" prop="reportIdcard">
              <el-input v-model="acceptanceSheetData.reportIdcard" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="日期:" style="width: 25%;">
              <el-input :value="moment(acceptanceSheetData.reportTime).format('YYYY-MM-DD')" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="电话:" style="width: 25%;" prop="reportTelephone">
              <el-input v-model="acceptanceSheetData.reportTelephone" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="提交材料:" style="width: 50%;">
              <el-input v-model="acceptanceSheetData.reportMaterial" size="small" :maxlength="500"></el-input>
            </el-form-item>
          </el-form-item>
          <h1>患者基本信息</h1>
          <el-form-item class="flex">
            <el-form-item label="姓名:" style="width: 25%;" prop="patientName">
              <el-input v-model="acceptanceSheetData.patientName" size="small" :disabled="true" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="性别:" style="width: 25%;">
              <el-input :value="getSex(acceptanceSheetData.patientIdcard)" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="年龄:" style="width: 25%;">
              <el-input :value="getAge(acceptanceSheetData.patientIdcard)" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" style="width: 25%;" prop="patientIdcard">
              <el-input v-model="acceptanceSheetData.patientIdcard" size="small"  :disabled="acceptanceSheetData.reportType === '2'"></el-input>
            </el-form-item>
            <el-form-item label="电话:" style="width: 25%;" prop="patientTelephone">
              <el-input v-model="acceptanceSheetData.patientTelephone" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="住址:" style="width: 50%;">
              <el-input v-model="acceptanceSheetData.patientAddress" size="small" :maxlength="500"></el-input>
            </el-form-item>
          </el-form-item>
          <h1>涉及医疗机构</h1>
          <p style="margin-left: 36px;">{{acceptanceSheetData.hospName}}</p>
          <h1>代理人基本信息</h1>
          <el-form-item class="flex">
            <el-form-item label="姓名:" style="width: 25%;" prop="agentName">
              <el-input v-model="acceptanceSheetData.agentName" size="small" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="性别:" style="width: 25%;">
              <el-input :value="getSex(acceptanceSheetData.agentIdcard)" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="年龄:" style="width: 25%;">
              <el-input :value="getAge(acceptanceSheetData.agentIdcard)" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" style="width: 25%;" prop="agentIdcard">
              <el-input v-model="acceptanceSheetData.agentIdcard" size="small"></el-input>
            </el-form-item>
            <el-form-item label="电话:" style="width: 25%;" prop="agentTelephone">
              <el-input v-model="acceptanceSheetData.agentTelephone" size="small"></el-input>
            </el-form-item>
          </el-form-item>
          <h1>医疗纠纷争议焦点</h1>
          <el-form-item class="flex">
            <el-input
              type="textarea"
              :rows="4"
              :maxlength="4000"
              v-model="acceptanceSheetData.disputeFocus">
            </el-input>
          </el-form-item>
          <el-form-item style="padding-top: 26px;margin-bottom: 0;text-align: center;">
            <el-button type="primary" size="small" :loading="loading" @click="preserveAcceptanceSheet('acceptanceSheetData')">保存</el-button>
            <el-button plain size="small" @click="sikpIsPrint()">打印</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {checkPhone, checkIdCard, checkName} from '@/utils/validator.js';
import disputeCrumbs from '@/components/common/dispute-mediation/dispute-crumbs.vue';
export default {
  components: { disputeCrumbs },
  data () {
    return {
      acceptanceSheetData: {
        uid: '',
        reportUid: '',
        reportName: '',
        reportIdcard: '',
        reportTime: '',
        reportTelephone: '',
        reportMaterial: '',
        patientUid: '',
        patientName: '',
        patientIdcard: '',
        patientTelephone: '',
        patientAddress: '',
        hospUid: '',
        hospName: '',
        agentName: '',
        agentIdcard: '',
        agentTelephone: '',
        disputeFocus: ''
      },
      labelPosition: 'right',
      disputeUid: '',
      status: '',
      title: '受理单',
      rules: {
        reportIdcard: [
          {validator: checkIdCard, trigger: 'blur'}
        ],
        reportTelephone: [
          {validator: checkPhone, trigger: 'blur'}
        ],
        patientIdcard: [
          {validator: checkIdCard, trigger: 'blur'}
        ],
        patientTelephone: [
          {validator: checkPhone, trigger: 'blur'}
        ],
        agentIdcard: [
          {validator: checkIdCard, trigger: 'blur'}
        ],
        agentTelephone: [
          {validator: checkPhone, trigger: 'blur'}
        ],
        reportName: [
          {validator: checkName, trigger: 'blur'}
        ],
        patientName: [
          {validator: checkName, trigger: 'blur'}
        ],
        agentName: [
          {validator: checkName, trigger: 'blur'}
        ]
      },
      loading: false
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
    sikpIsPrint () {
      this.$router.push({ name: 'print-acceptance-sheet', query: {disputeUid: this.disputeUid, status: this.status} });
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
    },
    // 保存受理单
    preserveAcceptanceSheet (formName) {
      let params = {
        disposeUid: this.disputeUid,
        uid: this.acceptanceSheetData.uid,
        reportType: this.acceptanceSheetData.reportType,
        reportUid: this.acceptanceSheetData.reportUid,
        reportName: this.acceptanceSheetData.reportName,
        reportSex: this.getSex(this.acceptanceSheetData.reportIdcard),
        reportAge: this.getAge(this.acceptanceSheetData.reportIdcard),
        reportIdcard: this.acceptanceSheetData.reportIdcard,
        reportTelephone: this.acceptanceSheetData.reportTelephone,
        reportMaterial: this.acceptanceSheetData.reportMaterial,
        patientUid: this.acceptanceSheetData.patientUid,
        patientName: this.acceptanceSheetData.patientName,
        patientSex: this.getSex(this.acceptanceSheetData.patientIdcard),
        patientAge: this.getAge(this.acceptanceSheetData.patientIdcard),
        patientIdcard: this.acceptanceSheetData.patientIdcard,
        patientTelephone: this.acceptanceSheetData.patientTelephone,
        patientAddress: this.acceptanceSheetData.patientAddress,
        hospUid: this.acceptanceSheetData.hospUid,
        hospName: this.acceptanceSheetData.hospName,
        agentName: this.acceptanceSheetData.agentName,
        agentSex: this.getSex(this.acceptanceSheetData.agentIdcard),
        agentAge: this.getAge(this.acceptanceSheetData.agentIdcard),
        agentIdcard: this.acceptanceSheetData.agentIdcard,
        agentTelephone: this.acceptanceSheetData.agentTelephone,
        disputeFocus: this.acceptanceSheetData.disputeFocus
      }
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.loading = true;
          this.axios.post('/hisServices/dispute/handlingForm', params)
            .then(res => {
              if (res) {
                console.log(res);
                this.$message.success('保存成功！');
              }
            })
            .finally(() => {
              this.loading = false;
            })
        } else {
          return false;
        }
      });
    },
    // 获取性别
    getSex (UUserCard) {
      let str = UUserCard && String(UUserCard);
      if (str && str.length < 17) {
        return '';
      }
      if (UUserCard) {
        const sex = UUserCard.substring(6, 10) + '-' + UUserCard.substring(10, 12) + '-' + UUserCard.substring(12, 14);
        if (parseInt(UUserCard.substr(16, 1)) % 2 === 1) {
          return '男';
        } else {
          return '女';
        }
      } else {
        return '';
      }
    },
    // 获取年龄
    getAge (UUserCard) {
      let str = UUserCard && String(UUserCard);
      if (str && str.length < 10) {
        return '';
      }
      if (UUserCard) {
        let myDate = new Date();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        let age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if ((UUserCard.substring(10, 12) < month) || ((UUserCard.substring(10, 12) === month) && (UUserCard.substring(12, 14) <= day))) {
          age++;
        }
        return age;
      } else {
        return '';
      }
    }
  }
}
</script>
<style lang="less">
  .acceptance-sheet .content{
    h1{
      padding: 24px 0 16px 0;
      font-weight: bold;
    }
    .bottom{
      .flex{
        margin-bottom: 0;
        > .el-form-item__content{
          display: flex;
          flex-wrap: wrap;
          margin-left: 0 !important;
          padding-bottom: 10px;
          border-bottom: 1px dotted rgba(232,232,232,1);
          .el-form-item{
            padding-right: 40px;
            margin-bottom: 15px;
            .el-input__inner{
              width: 190px;
            }
          }
        }
      }
    }
  }
</style>
