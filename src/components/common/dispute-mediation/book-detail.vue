<template>
  <div class="publicity-detail">
    <div class="content">
      <div class="header">
        <h1>溆浦县医疗纠纷人民调解委员会</h1>
        <h1>{{type == 0 ? '医调委调解过程书' : '医疗矛盾通知书'}}</h1>
      </div>
      <h2>溆医调评：&nbsp;[{{disputeCode && disputeCode.slice(0, 4)}}]&nbsp;{{disputeCode && disputeCode.slice(4)}}</h2>
      <!-- 可编辑的通知书 -->
      <template v-if="type == 1">
        <p class="one">
          <span>{{bookDetail.patientName}}</span>于<span>{{ bookDetail.reportTime | moment('YYYY年MM月DD日') }}</span>上报医疗矛盾纠纷，<span>{{bookDetail.hospName}}</span>
          于<span>{{bookDetail.handleTime | moment('YYYY年MM月DD日')}}</span>进行处理。溆浦县医疗纠纷人民调解委员会于<span>{{bookDetail.acceptTime | moment('YYYY年MM月DD日') }}</span>接到<span>{{bookDetail.hospName}}</span>
          与<span>{{bookDetail.patientName}}</span>的调解申请后，进行纠纷受理并对医患双方进行了调查，收集了相关资料。同时于
          <span>{{ bookDetail.requestTime | moment('YYYY年MM月DD日') }}</span>请求<span>{{bookDetail.areaName}}</span>医疗纠纷调解中心组织专家评鉴。<span>{{bookDetail.areaLevel === '1' ? '县' : '市'}}</span>医疗纠纷调解中心于
          <span>{{ bookDetail.evaluationTime | moment('YYYY年MM月DD日') }}</span>组织专家进行了评鉴。
        </p>
        <h3 style="margin-top: 40px;">调解结果：</h3>
        <h3 v-if="bookDetail.mediateResultType === '0'">该起医疗纠纷调解结果已获得医患双方认可，该起纠纷调解成功。</h3>
        <h3 v-if="bookDetail.mediateResultType === '1'">该起医疗纠纷调解结果并未获得医患双方认可，该起纠纷调解不成功。</h3>
        <h4>溆浦县医疗纠纷人民调解委员会</h4>
        <h5 v-if="status !== '5'">{{bookDetail.inscribeTime | moment('YYYY年MM月DD日')}}</h5>
        <div class="two" v-if="status === '5'">
          <el-form label-width="80px">
            <el-form-item label="日期:" style="display: flex;justify-content: flex-end;" class="date">
              <el-date-picker
                v-model="bookDetail.inscribeTime"
                type="date"
                size="small"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item style="padding-top: 14px;margin-bottom: 0;text-align: center;">
              <el-button type="primary" size="small" :loading="loading" @click="preserveAdviceNote()">保存</el-button>
              <el-button type="primary" size="small" :disabled="noticeUid === null" @click="dialogPublicity = true">公示</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <!-- 可编辑的过程书 -->
      <div class="two" v-if="type == 0 && status === '4'">
        <el-form :model="bookDetail" :rules="rules" ref="bookDetail" :show-message="false" label-width="80px">
          <el-form-item class="main">
            <span style="margin-left: 30px;">溆浦县医疗纠纷人民调解委员会于</span><span>{{bookDetail.hospReportTime | moment('YYYY年MM月DD日')}}</span>接到<span>{{bookDetail.hospName}}</span>与<span>{{bookDetail.patientName}}</span>的调解申请后，进行纠纷受理并对医疗双方进行了调查，收集了相关资料。同时于
            <el-form-item prop="requestTime" class="date" :class="{error: requestTimeErr}">
              <el-date-picker
                v-model="bookDetail.requestTime"
                type="date"
                size="small"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            请求
            <el-form-item prop="areaLevel">
              <el-select v-model="bookDetail.areaLevel" size="small" filterable style="width: 154px;">
                <el-option label="溆浦县" :value="'1'"></el-option>
                <el-option label="怀化市" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
            医疗纠纷调解中心组织专家评鉴。<span></span><span>{{bookDetail.areaLevel === '1' ? '县' : '市'}}</span>医疗纠纷调解中心于
            <el-form-item prop="evaluationTime" class="date" :class="{error: evaluationTimeErr}">
              <el-date-picker
                v-model="bookDetail.evaluationTime"
                type="date"
                size="small"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            组织专家进行了评鉴。
          </el-form-item>
          <el-form-item>
            <p>调解结果：</p>
            <div class="radio" style="width: 450px;">
              <el-radio v-model="bookDetail.mediateResultType" label="0">该起医疗纠纷调解结果已获得医患双方认可，该起纠纷调解成功。</el-radio>
              <el-radio v-model="bookDetail.mediateResultType" label="1">该起医疗纠纷调解结果并未获得医患双方认可，该起纠纷调解不成功。</el-radio>
            </div>
          </el-form-item>
          <h4>溆浦县医疗纠纷人民调解委员会</h4>
          <el-form-item label="日期:" style="display: flex;justify-content: flex-end;" prop="inscribeTime" class="date" :class="{error: inscribeTimeErr}">
            <el-date-picker
              v-model="bookDetail.inscribeTime"
              type="date"
              size="small"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="padding-top: 14px;margin-bottom: 0;text-align: center;">
            <el-button type="primary" size="small" :loading="loading" @click="preserveProcessAndNotice('bookDetail')">保存</el-button>
            <el-button type="primary" size="small" :disabled="processUid === null" @click="dialogWindUpCase = true">结案</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 不可编辑的过程书 -->
      <div class="two" v-if="type == 0 && (status === '5' || status === '6')">
        <p class="one">
          溆浦县医疗纠纷人民调解委员会于<span>{{bookDetail.hospReportTime | moment('YYYY年MM月DD日')}}</span>接到<span>{{bookDetail.hospName}}</span>与<span>{{bookDetail.patientName}}</span>的调解申请后，进行纠纷受理并对医疗双方进行了调查，收集了相关资料。同时于
          <span>{{bookDetail.requestTime | moment('YYYY年MM月DD日')}}</span>请求<span>{{bookDetail.areaName}}</span>医疗纠纷调解中心组织专家评鉴。<span>{{bookDetail.areaLevel === '1' ? '县' : '市'}}</span>医疗纠纷调解中心于<span>{{bookDetail.evaluationTime | moment('YYYY年MM月DD日')}}</span>组织专家进行了评鉴。
        </p>
        <h3 style="margin-top: 40px;">调解结果：</h3>
        <h3 v-if="bookDetail.mediateResultType === '0'">该起医疗纠纷调解结果已获得医患双方认可，该起纠纷调解成功。</h3>
        <h3 v-if="bookDetail.mediateResultType === '1'">该起医疗纠纷调解结果并未获得医患双方认可，该起纠纷调解不成功。</h3>
        <h4>溆浦县医疗纠纷人民调解委员会</h4>
        <h5>{{bookDetail.inscribeTime | moment('YYYY年MM月DD日')}}</h5>
      </div>
    </div>
    <div class="wind-up-case" v-if="dialogWindUpCase">
      <el-dialog
        :visible.sync="dialogWindUpCase"
        :close-on-click-modal="false"
        width="750px"
        top="40vh"
        title="结案"
        center>
        <div class="content">
          <div class="top">
            <span>
              <label>纠纷医院：</label><span>{{bookDetail.hospName}}</span>
            </span>
            <span>
              <label>纠纷科室:</label><span class="as-ellipsis" title="卢宇飞">{{deptName}}</span>
            </span>
            <span>
              <label>纠纷上报人：</label><span class="as-ellipsis" title="卢宇飞">{{bookDetail.patientName}}</span>
            </span>
            <span class="right" v-if="reportType === '1'">
              <label>纠纷对象：</label><span class="as-ellipsis" :title="disputeObject">{{disputeObject}}</span>
            </span>
          </div>
          <div class="form" style="text-align: left;">
            <el-form :model="ruleFormWindUpCase" :rules="rulesWindUpCase" :show-message="false" ref="ruleFormWindUpCase" label-width="100px">
              <el-form-item label="处理时间:" prop="date" style="margin-bottom: 10px;" class="date">
                <el-date-picker
                  v-model="ruleFormWindUpCase.date"
                  type="date"
                  size="small"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="调解方式:" prop="methods" style="margin-bottom: 10px;">
                <el-select v-model="ruleFormWindUpCase.methods" size="small" filterable placeholder="请选择">
                  <el-option label="调解结案" value="1"></el-option>
                  <el-option label="司法结案" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingBtn" @click="windUpCase('ruleFormWindUpCase')">确 定</el-button>
          <el-button size="small" plain @click="dialogWindUpCase = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="publicity" v-if="dialogPublicity">
      <el-dialog
        :visible.sync="dialogPublicity"
        :close-on-click-modal="false"
        width="600px"
        top="40vh"
        title="公示"
        center>
        <div class="content">
          <div class="top">
            <span>
              <label>纠纷上报人：</label><span>{{bookDetail.patientName}}</span>
            </span>
            <span>
              <label>纠纷医院：</label><span class="as-ellipsis" title="卢宇飞">{{bookDetail.hospName}}</span>
            </span>
            <span>
              <label>纠纷科室：</label><span class="as-ellipsis" title="卢宇飞">{{deptName}}</span>
            </span>
          </div>
          <div class="form">
            <el-form :model="ruleFormPublicity" :rules="rulesPublicity" ref="ruleFormPublicity" label-width="100px">
              <el-form-item label="公示类型:" prop="publicityType" style="margin-bottom: 10px;">
                <el-radio-group v-model="ruleFormPublicity.publicityType">
                  <el-radio :label="0">医患双方公示</el-radio>
                  <el-radio :label="1">公开公示</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingBtn" @click="disputePublic()">确 定</el-button>
          <el-button size="small" plain @click="dialogPublicity = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props: ['disputeUid', 'status', 'type', 'processBookUid', 'noticeBookUid', 'deptName', 'disputeObject', 'reportType'],
  data () {
    return {
      bookDetail: {
        uid: null,
        reportTime: null,
        hospReportTime: null,
        acceptTime: null,
        handleTime: null,
        hospUid: null,
        hospName: null,
        patientUid: null,
        patientName: null,
        requestTime: null,
        areaName: null,
        areaLevel: null,
        evaluationTime: null,
        inscribeTime: null,
        mediateResultType: null
      },
      disputeCode: '',
      rules: {
        requestTime: [
          { required: true, trigger: 'blur' }
        ],
        areaLevel: [
          { required: true, trigger: 'change' }
        ],
        evaluationTime: [
          { required: true, trigger: 'change' }
        ],
        inscribeTime: [
          { required: true, trigger: 'change' }
        ]
      },
      dialogWindUpCase: false,
      ruleFormWindUpCase: {
        date: new Date(),
        methods: null
      },
      rulesWindUpCase: {
        date: [
          { required: true, message: '请选择科室名称', trigger: 'change' }
        ],
        methods: [
          { required: true, message: '请输入疾病名称', trigger: 'blur' }
        ]
      },
      dialogPublicity: false,
      ruleFormPublicity: {
        publicityType: 0
      },
      rulesPublicity: {
        publicityType: [
          { required: true, message: '请选择科室名称', trigger: 'change' }
        ]
      },
      processUid: '',
      noticeUid: '',
      loading: false,
      loadingBtn: false,
      requestTimeErr: false,
      evaluationTimeErr: false,
      inscribeTimeErr: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  watch: {
    disputeUid () {
      if (this.disputeUid) {
        this.getProcessAndNotice();
      }
    },
    processBookUid (oldVal, newVal) {
      this.processUid = oldVal;
    },
    noticeBookUid (oldVal, newVal) {
      this.noticeUid = oldVal;
    }
  },
  methods: {
    // 获取调解过程书、通知书
    getProcessAndNotice () {
      this.axios.get('/hisServices/dispute/processAndNotice?uid=' + this.disputeUid + '&type=' + this.type)
        .then(res => {
          console.log(res);
          if (res) {
            this.bookDetail = res.data;
            this.disputeCode = res.data.num;
            this.bookDetail.inscribeTime = this.bookDetail.inscribeTime !== null ? this.bookDetail.inscribeTime : new Date();
            this.bookDetail.areaLevel = this.bookDetail.areaLevel !== null ? this.bookDetail.areaLevel : '1';
          }
        })
    },
    changeDate (value) {
      return new Date(this.moment(value).format('YYYY-MM-DD')).getTime()
    },
    // 保存调解过程书
    preserveProcessAndNotice (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            disposeUid: this.disputeUid,
            uid: this.bookDetail.uid,
            num: this.bookDetail.num,
            acceptDate: this.moment(this.bookDetail.acceptTime).format('YYYY-MM-DD'),
            hospUid: this.bookDetail.hospUid,
            hospName: this.bookDetail.hospName,
            patientUid: this.bookDetail.patientUid,
            patientName: this.bookDetail.patientName,
            requestDate: this.moment(this.bookDetail.requestTime).format('YYYY-MM-DD'),
            areaName: this.bookDetail.areaLevel === '1' ? '溆浦县' : '怀化市',
            areaLevel: this.bookDetail.areaLevel,
            evaluationDate: this.moment(this.bookDetail.evaluationTime).format('YYYY-MM-DD'),
            inscribeDate: this.moment(this.bookDetail.inscribeTime).format('YYYY-MM-DD'),
            mediateResultType: this.bookDetail.mediateResultType
          }
          if (this.changeDate(this.bookDetail.hospReportTime) > this.changeDate(this.bookDetail.requestTime)) {
            this.requestTimeErr = true;
            this.$message.error('请求评鉴时间必须大于等于医院上报时间');
            return false;
          } else {
            this.requestTimeErr = false;
          }
          if (this.changeDate(this.bookDetail.requestTime) > new Date().getTime()) {
            this.requestTimeErr = true;
            this.$message.error('请求评鉴时间必须小于等于当前时间');
            return false;
          } else {
            this.requestTimeErr = false;
          }
          if (this.changeDate(this.bookDetail.requestTime) > this.changeDate(this.bookDetail.evaluationTime)) {
            this.evaluationTimeErr = true;
            this.$message.error('评鉴时间必须大于等于请求时间');
            return false;
          } else {
            this.evaluationTimeErr = false;
          }
          if (this.changeDate(this.bookDetail.evaluationTime) > new Date().getTime()) {
            this.evaluationTimeErr = true;
            this.$message.error('评鉴时间必须小于等于当前时间');
            return false;
          } else {
            this.evaluationTimeErr = false;
          }
          if (this.changeDate(this.bookDetail.evaluationTime) > this.changeDate(this.bookDetail.inscribeTime)) {
            this.inscribeTimeErr = true;
            this.$message.error('日期必须大于等于评鉴时间');
            return false;
          } else {
            this.inscribeTimeErr = false;
          }
          if (this.changeDate(this.bookDetail.inscribeTime) > new Date().getTime()) {
            this.inscribeTimeErr = true;
            this.$message.error('日期必须小于等于当前时间');
            return false;
          } else {
            this.inscribeTimeErr = false;
          }
          if (this.bookDetail.mediateResultType === null) {
            this.$message.error('请选择调解结果！');
            return false;
          }
          this.loading = true;
          this.axios.post('/hisServices/dispute/process', params)
            .then(res => {
              if (res) {
                this.$message.success('保存成功！');
                this.processUid = '1';
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            })
        } else {
          return false;
        }
      })
    },
    // 医调委结案
    windUpCase (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            disposeUid: this.disputeUid,
            uid: this.bookDetail.uid,
            finishUserUid: this.userInfo.uid,
            handleDate: this.moment(this.ruleFormWindUpCase.date).format('YYYY-MM-DD'),
            mediateType: this.ruleFormWindUpCase.methods
          }
          this.loadingBtn = true;
          this.axios.put('/hisServices/dispute/finish', params)
            .then(res => {
              if (res) {
                this.$message.success('结案成功！');
                setTimeout(() => {
                  this.$router.push({ name: 'hospital-not-in-hand-list' });
                }, 1000)
              }
              this.loadingBtn = false;
            })
            .catch(() => {
              this.loadingBtn = false;
            })
        } else {
          return false;
        }
      })
    },
    // 保存调解通知书
    preserveAdviceNote () {
      if (this.bookDetail.inscribeTime) {
        let params = {
          disposeUid: this.disputeUid,
          uid: this.bookDetail.uid,
          num: this.bookDetail.num,
          reportDate: this.moment(this.bookDetail.reportTime).format('YYYY-MM-DD'),
          handleDate: this.moment(this.bookDetail.handleTime).format('YYYY-MM-DD'),
          acceptDate: this.moment(this.bookDetail.acceptTime).format('YYYY-MM-DD'),
          hospUid: this.bookDetail.hospUid,
          hospName: this.bookDetail.hospName,
          patientUid: this.bookDetail.patientUid,
          patientName: this.bookDetail.patientName,
          requestDate: this.moment(this.bookDetail.requestTime).format('YYYY-MM-DD'),
          areaName: this.bookDetail.areaName,
          areaLevel: this.bookDetail.areaLevel,
          evaluationDate: this.moment(this.bookDetail.evaluationTime).format('YYYY-MM-DD'),
          inscribeDate: this.moment(this.bookDetail.inscribeTime).format('YYYY-MM-DD'),
          mediateResultType: this.bookDetail.mediateResultType
        }
        if (this.changeDate(this.bookDetail.evaluationTime) > this.changeDate(this.bookDetail.inscribeTime)) {
          this.$message.error('日期必须大于等于评鉴时间');
          return false;
        }
        if (this.changeDate(this.bookDetail.inscribeTime) > new Date().getTime()) {
          this.$message.error('日期必须小于等于当前时间');
          return false;
        }
        this.loading = true;
        this.axios.post('/hisServices/dispute/notice', params)
          .then(res => {
            if (res) {
              this.$message.success('保存成功！');
              this.noticeUid = '1';
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          })
      } else {
        this.$message.error('请选择落款日期！');
      }
    },
    // 纠纷公示
    disputePublic () {
      let params = {
        uid: this.disputeUid,
        operUserUid: this.userInfo.uid,
        publicityType: this.ruleFormPublicity.publicityType
      }
      this.loadingBtn = true;
      this.axios.post('/hisServices/dispute/public', params)
        .then(res => {
          if (res) {
            this.$message.success('公示成功！');
            this.dialogPublicity = false;
            this.$router.push({ name: 'hospital-not-processed-list' });
          }
          this.loadingBtn = false;
        })
        .catch(() => {
          this.loadingBtn = false;
        })
    }
  }
}
</script>
<style lang="less">
  .publicity-detail{
    width: 100%;
    > .content{
      width: 100%;
      min-height: 537px;
      padding: 54px 30px 0;
      margin-top: 20px;
      .header h1{
        font-size: 18px;
        color: #000000;
        text-align: center;
        font-weight: bold;
        &:nth-child(1){
          padding-bottom: 6px;
        }
      }
      h2{
        padding: 20px 180px 30px 0;
        font-size: 14px;
        color: #666666;
        text-align: right;
      }
      .one{
        color: #333333;
        text-align: justify;
        letter-spacing: 1px;
        text-indent: 2em;
        line-height: 30px;
        span{
          margin-left: 4px;
          margin-right: 4px;
          text-decoration: underline;
        }
      }
      .two .el-form .el-form-item{
        .el-form-item__content{
          margin-left: 0 !important;
        }
      }
      .two .el-form .main .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        line-height: 40px;
        .el-form-item{
          margin: 0 10px;
        }
      }
      .two .main span:not(:first-child){
        margin-left: 4px;
        margin-right: 4px;
        text-decoration: underline;
      }
      .radio{
        label{
          display: block;
          &:nth-child(1){
            margin-top: 15px;
          }
          &:nth-child(2){
            margin-left: 0;
            margin-top: 30px;
          }
        }
      }
      h3{
        padding-bottom: 30px;
      }
      h4, h5{
        color: #333333;
        line-height: 30px;
        text-align: right;
      }
    }
    .wind-up-case{
      .content{
        .top{
          width: 100%;
          padding: 0 16px;
          line-height: 46px;
          display: flex;
          justify-content: space-between;
          background:rgba(250,250,250,1);
        }
        .form{
          border-bottom: 1px solid rgba(232,232,232,1);
          .el-form{
            display: flex;
            justify-content: space-between;
            margin-top: 14px;
          }
        }
      }
    }
    .el-dialog__wrapper .el-dialog__body{
      padding: 25px 25px 10px;
    }
    .publicity{
      .content{
        .top{
          width: 100%;
          padding: 0 16px;
          line-height: 46px;
          display: flex;
          justify-content: space-between;
          background:rgba(250,250,250,1);
        }
        .form{
          padding-left: 110px;
          border-bottom: 1px solid rgba(232,232,232,1);
          .el-form{
            display: flex;
            justify-content: space-between;
            margin-top: 14px;
          }
        }
      }
    }
    .date .el-date-editor {
      width: 154px;
    }
    .date.error .el-date-editor .el-input__inner{
      border-color: #f56c6c !important;
    }
  }
</style>
