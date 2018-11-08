<template>
<div class="requisition">
  <div is="dispute-crumbs" :title="title" :status="status"></div>
  <div class="form">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item class="one" style="margin-top: 20px;">
        <el-form-item label="申请日期:" style="margin-bottom: 0;">
          <span>{{reportTime}}</span>
        </el-form-item>
        <el-form-item label="医疗机构名称:" class="hisp">
          <span>{{hospName}}</span>
        </el-form-item>
      </el-form-item>
      <el-form-item class="two">
        <el-form-item label="法定代表人:" prop="representative" class="representative" style="width: 26%;">
          <el-input v-model="ruleForm.representative" size="small"></el-input>
        </el-form-item>
        <el-form-item label="受委托人姓名:" prop="name" class="name" style="width: 27%;">
          <el-input v-model="ruleForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="职务:" prop="post" class="post" style="width: 23%;">
          <el-input v-model="ruleForm.post" size="small"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" prop="phone" class="contact" style="width: 24%;">
          <el-input v-model="ruleForm.phone" size="small"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="纠纷事实:" prop="facts" class="textarea">
        <el-input
          type="textarea"
          :rows="4"
          disabled
          placeholder="读取医院上报医调委时填写的内容，不能修改"
          v-model="ruleForm.facts">
        </el-input>
      </el-form-item>
      <el-form-item label="诊疗过程:" prop="process" class="textarea">
        <el-input
          type="textarea"
          :rows="4"
          disabled
          placeholder="读取医院上报医调委时填写的内容，不能修改"
          v-model="ruleForm.process">
        </el-input>
      </el-form-item>
      <el-form-item label="日期:" prop="date">
        <el-date-picker
          v-model="ruleForm.date"
          type="date"
          size="small"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="text-align: center;margin-bottom: 0;">
        <el-button type="primary" size="small" :loading="loading" @click="preserveRequisition('ruleForm')">保存</el-button>
        <el-button size="small" plain :disabled="applyBookUid === null" @click="skipIsRequisition()">打印</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
import {checkPhone, checkName} from '@/utils/validator.js';
import disputeCrumbs from '@/components/common/dispute-mediation/dispute-crumbs.vue';
export default {
  components: { disputeCrumbs },
  data () {
    return {
      disputeUid: '',
      title: '调解申请书',
      status: '',
      reportTime: '',
      hospName: '',
      hospUid: '',
      legalPerson: '',
      trustee: '',
      position: '',
      requisitionData: {},
      applyBookUid: '',
      ruleForm: {
        representative: null,
        name: null,
        post: null,
        phone: null,
        facts: null,
        process: null,
        date: null
      },
      rules: {
        representative: [
          {required: true, message: '不能为空！', trigger: 'blur'},
          {validator: checkName, trigger: 'blur'}
        ],
        name: [
          {required: true, message: '不能为空！', trigger: 'blur'},
          {validator: checkName, trigger: 'blur'}
        ],
        post: [
          {required: true, message: '不能为空！', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '不能为空！', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        facts: [
          {required: true, message: '不能为空！', trigger: 'blur'}
        ],
        process: [
          {required: true, message: '不能为空！', trigger: 'blur'}
        ],
        date: [
          {required: true, message: '不能为空！', trigger: 'blur'}
        ]
      },
      loading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    this.status = this.$route.query.status;
    this.disputeUid = this.$route.query.disputeUid;
    this.applyBookUid = this.$route.query.applyBookUid;
    if (this.disputeUid) {
      this.getRequisition();
    }
  },
  methods: {
    skipIsRequisition () {
      this.$router.push({ name: 'print-requisition', query: {disputeUid: this.disputeUid, status: this.status} });
    },
    // 查询调解申请书
    getRequisition () {
      this.axios.get('/hisServices/dispute/apply/' + this.disputeUid)
        .then(res => {
          if (res) {
            console.log(res);
            this.requisitionData = res.data;
            this.reportTime = this.moment(res.data.reportTime).format('YYYY-MM-DD');
            this.hospName = res.data.hospName;
            this.hospUid = res.data.hospUid;
            this.ruleForm.name = res.data.trustee;
            this.ruleForm.post = res.data.position;
            this.ruleForm.phone = res.data.telephone;
            this.ruleForm.representative = res.data.legalPerson;
            this.ruleForm.facts = res.data.disputeFact;
            this.ruleForm.process = res.data.medicalProcess;
            this.ruleForm.date = res.data.inscribeTime !== null ? res.data.inscribeTime : new Date();
          }
        })
    },
    changeDate (value) {
      return new Date(this.moment(value).format('YYYY-MM-DD')).getTime()
    },
    // 保存调解申请书
    preserveRequisition (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            uid: this.disputeUid,
            handleUser: this.userInfo.uid,
            reportDate: this.reportTime,
            hospUid: this.hospUid,
            hospName: this.hospName,
            legalPerson: this.ruleForm.representative,
            trustee: this.ruleForm.name,
            position: this.ruleForm.post,
            telephone: this.ruleForm.phone,
            disputeFact: this.ruleForm.facts,
            medicalProcess: this.ruleForm.process,
            inscribeDate: this.moment(this.ruleForm.date).format('YYYY-MM-DD')
          }
          if (this.changeDate(this.reportTime) > this.changeDate(this.ruleForm.date)) {
            this.$message.error('日期应大于或等于申请日期');
            return false;
          }
          if (this.changeDate(this.ruleForm.date) > new Date().getTime()) {
            this.$message.error('日期必须小于等于当前日期');
            return false;
          }
          this.loading = true;
          this.axios.post('/hisServices/dispute/apply', params)
            .then(res => {
              if (res) {
                this.$message.success('保存成功！');
                this.applyBookUid = '1';
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            })
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style lang="less">
  .requisition{
    .form{
      .one .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        margin-left: 0 !important;
        .hisp .el-form-item__label{
          width: 100px !important;
          margin-left: 120px;
        }
      }
      .two .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        margin-left: 0 !important;
      .el-form-item{
          padding-right: 2%;
          .el-form-item__content{
            padding-left: 0 !important;
          }
        }
        .representative .el-form-item__label{
          width: 100px !important;
        }
        .name .el-form-item__label{
          width: 110px !important;
        }
        .post .el-form-item__label{
          width: 55px !important;
        }
        .contact .el-form-item__label{
          width: 82px !important;
        }
      }
      .textarea .el-form-item__content{
        padding-right: 2%;
      }
      .el-textarea__inner, .el-input__inner{
        color: #000;
      }
    }
  }
</style>
