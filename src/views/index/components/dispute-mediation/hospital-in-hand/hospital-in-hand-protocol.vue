<template>
<div>
  <div is="dispute-crumbs" :title="title" :status="status"></div>
  <div class="protocol">
    <h1>医疗纠纷协议书</h1>
    <div class="form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
        <el-form-item label="甲方:" style="margin-bottom: 0;">
          <span>{{disputeProtocol.partyAName}}</span>
        </el-form-item>
        <el-form-item label="乙方:">
          <span>{{disputeProtocol.partyBName}}</span>
        </el-form-item>
        <el-form-item label="事由:" prop="cause">
          <el-input
            type="textarea"
            :rows="4"
            :maxlength="4000"
            placeholder="请填写事由"
            v-model="ruleForm.cause">
          </el-input>
        </el-form-item>
        <el-form-item label="协议:" class="one">
          <el-form-item class="pay">
            <span style="margin-right: 10px;color: #606266;">一、甲方一次性赔偿乙方</span>
          </el-form-item>
          <el-form-item prop="pay" class="pay">
            <el-input v-model="ruleForm.pay" size="small"></el-input>
          </el-form-item>
          <el-form-item class="pocket">
            <span style="margin: 0 10px;color: #606266;">元整，现实付</span>
          </el-form-item>
          <el-form-item prop="outOfPocket" class="pocket">
            <el-input v-model="ruleForm.outOfPocket" size="small"></el-input>
          </el-form-item>
          <el-form-item label="元整；" class="text">
          </el-form-item>
        </el-form-item>
        <el-form-item class="two">
          <el-form-item>
            <span style="margin-right: 10px;color: #606266;">二、乙方通过甲方同意，协商前往</span>
          </el-form-item>
          <el-form-item prop="address">
            <el-input v-model="ruleForm.address" size="small" :maxlength="2000"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="three">
          <el-form-item label="三、此医疗纠纷为一次性了结，甲、乙双方自动放弃向对方主张任何权力和义务；">
          </el-form-item>
        </el-form-item>
        <el-form-item class="four">
          <el-form-item label="四、此协议一式三份，甲、乙双方各执一份，送卫计局一份。">
          </el-form-item>
        </el-form-item>
        <el-form-item class="five">
          <el-form-item >
            <el-input
              type="textarea"
              :rows="4"
              placeholder="选填"
              v-model="ruleForm.selective">
            </el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="日期:" class="six" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="date"
            size="small"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="text-align: center;margin-bottom: 0;">
          <el-button type="primary" size="small" :loading="loading" @click="preserveProtocol('ruleForm')">保存</el-button>
          <el-button size="small" plain :disabled="agreementUid === null" @click="sikpIsPrint()">打印</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>
<script>
import disputeCrumbs from '@/components/common/dispute-mediation/dispute-crumbs.vue';
export default {
  components: { disputeCrumbs },
  data () {
    let checkMoney = (rule, value, callback) => {
      let reg = /^[0-9]*[1-9][0-9]*$/;
      if (!value) {
        callback(new Error('请输入金额'));
      } else if (value === '0') {
        callback(new Error('金额不能为0'));
      } else if (value > 5000000) {
        callback(new Error('金额不能大于5000000！'));
      } else if (!reg.test(value)) {
        callback(new Error('金额必须为正整数！'));
      } else {
        callback();
      }
    }
    return {
      title: '纠纷协议书',
      status: '',
      disputeUid: '',
      disputeProtocol: {},
      agreementUid: '',
      createTime: '',
      ruleForm: {
        cause: null,
        pay: null,
        selective: null,
        outOfPocket: null,
        address: null,
        date: null
      },
      rules: {
        cause: [
          { required: true, message: '该项内容不可为空' }
        ],
        pay: [
          {validator: checkMoney, trigger: 'blur'}
        ],
        outOfPocket: [
          {validator: checkMoney, trigger: 'blur'}
        ],
        address: [
          {required: true, message: '该项内容不可为空'}
        ],
        date: [
          {required: true, message: '该项内容不可为空'}
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
    this.agreementUid = this.$route.query.agreementUid;
    this.createTime = this.$route.query.createTime;
    if (this.disputeUid) {
      this.getDisputeProtocol();
    }
  },
  methods: {
    sikpIsPrint () {
      this.$router.push({ name: 'print-agreement', query: {disputeUid: this.disputeUid, status: this.status} });
    },
    // 查询纠纷协议书
    getDisputeProtocol () {
      this.axios.get('/hisServices/dispute/agreement/' + this.disputeUid)
        .then(res => {
          if (res) {
            console.log(res);
            this.disputeProtocol = res.data;
            this.ruleForm.cause = this.disputeProtocol.cause;
            this.ruleForm.pay = this.disputeProtocol.compensationMoney;
            this.ruleForm.outOfPocket = this.disputeProtocol.actualMoney;
            this.ruleForm.address = this.disputeProtocol.agreeInformation;
            this.ruleForm.selective = this.disputeProtocol.additionalRemarks;
            this.ruleForm.date = this.disputeProtocol.inscribeTime !== null ? this.disputeProtocol.inscribeTime : new Date();
          }
        })
    },
    changeDate (value) {
      return new Date(this.moment(value).format('YYYY-MM-DD')).getTime()
    },
    // 保存纠纷协议书
    preserveProtocol (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            uid: this.disputeUid,
            handleUser: this.userInfo.uid,
            partyAUid: this.disputeProtocol.partyAUid,
            partyAName: this.disputeProtocol.partyAName,
            partyBUid: this.disputeProtocol.partyBUid,
            partyBName: this.disputeProtocol.partyBName,
            cause: this.ruleForm.cause,
            compensationMoney: this.ruleForm.pay,
            actualMoney: this.ruleForm.outOfPocket,
            agreeInformation: this.ruleForm.address,
            inscribeDate: this.moment(this.ruleForm.date).format('YYYY-MM-DD'),
            additionalRemarks: this.ruleForm.selective
          }
          if (this.changeDate(this.createTime) > this.changeDate(this.ruleForm.date)) {
            this.$message.error('时间必须大于等于上报时间');
            return false;
          }
          if (this.changeDate(this.ruleForm.date) > new Date().getTime()) {
            this.$message.error('日期必须小于等于当前时间');
            return false;
          }
          this.loading = true;
          this.axios.post('/hisServices/dispute/agreement', params)
            .then(res => {
              if (res) {
                this.$message.success('保存成功！');
                this.agreementUid = '1';
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
  .protocol{
    > h1{
      text-align: center;
      padding: 48px;
      color:rgba(51,51,51,1);
      font-size:16px;
      font-weight: bold;
    }
    .form{
      .one .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        .pay .el-form-item__label{
          width: 168px !important;
        }
        .pocket .el-form-item__label{
          width: 110px !important;
        }
        .text .el-form-item__label{
          width: 70px !important;
        }
      }
      .two .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        .el-form-item__label{
          width: 222px !important;
        }
        .el-input{
          width: 800px;
        }
      }
      .three .el-form-item__content{
        .el-form-item__label{
          width: 516px !important;
        }
      }
      .four .el-form-item__content{
        .el-form-item__label{
          width: 390px !important;
        }
      }
    }
  }
</style>
