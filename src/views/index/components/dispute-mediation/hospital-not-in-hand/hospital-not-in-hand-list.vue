<template>
  <div class="not-in-hand">
    <div class="title">
      <i class="icon iconfont">&#xe67d;</i>
      <span>处理中</span>
    </div>
    <div class="report-person">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="纠纷医院:">
          <el-select v-model="disputeHosp" size="small" filterable placeholder="请选择">
            <el-option label="全部医院" :value="null"></el-option>
            <el-option
              v-for="item in hospitalList"
              :key="item.value"
              :label="item.hospName"
              :value="item.uid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纠纷编号:">
          <el-input size="small" v-model="disputeNum" @keyup.enter.native="getDisputeList(1)"></el-input>
        </el-form-item>
        <el-form-item label="上报人:">
          <el-input size="small" v-model="reportName" @keyup.enter.native="getDisputeList(1)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" size="small" @click="getDisputeList(1)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="disputeList.list"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod">
        </el-table-column>
        <el-table-column
          prop="disputeCode"
          label="纠纷编号">
        </el-table-column>
        <el-table-column
          prop="disputeType"
          label="纠纷类型"
          :formatter="formatterOne">
        </el-table-column>
        <el-table-column
          prop="reportName"
          label="上报人"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="reportType"
          label="上报人类型">
          <template slot-scope="scope">
            {{ scope.row.reportType === '1' ? '医务人员' : '患者' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="hospName"
          label="纠纷医院"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="纠纷科室"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="医院上报时间"
          width="110"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.reportTime | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="受理时间"
          width="110"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.acceptTime | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <router-link tag="span" :to="{ name: 'hospital-not-in-hand-detail', query: { disputeUid: scope.row.uid, status: scope.row.status } }">纠纷详情</router-link>
            <strong>|</strong>
            <router-link tag="span" :to="{ name: 'acceptance-sheet', query: { disputeUid: scope.row.uid, status: scope.row.status } }">受理单</router-link>
            <strong>|</strong>
            <router-link tag="span" :to="{ name: 'in-hand-process-book', query: { disputeUid: scope.row.uid, status: scope.row.status, type: 0, processBookUid: scope.row.processBookUid, deptName: scope.row.deptName, disputeObject: scope.row.disputeObject, reportType: scope.row.reportType } }">调解过程书</router-link>
            <strong>|</strong>
            <span tag="span" v-if="scope.row.processBookUid !== null" @click="popWindUpCase(scope.row.uid, scope.row.mediateHandleUid, scope.row.hospName, scope.row.deptName, scope.row.reportName, scope.row.acceptTime, scope.row.disputeObject, scope.row.reportType)" :class="{ disabled: scope.row.processBookUid === null }">结案</span>
            <el-tooltip class="item" effect="dark" content="请先填写调解过程书" placement="top-end">
              <span tag="span" class="disabled" v-if="scope.row.processBookUid === null">结案</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="disputeList.total">
      </el-pagination>
    </div>
    <div class="wind-up-case">
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
              <label>纠纷医院：</label><span>{{hospName}}</span>
            </span>
            <span>
              <label>纠纷科室:</label><span class="as-ellipsis" title="卢宇飞">{{deptName}}</span>
            </span>
            <span>
              <label>纠纷上报人：</label><span class="as-ellipsis" title="卢宇飞">{{reportRen}}</span>
            </span>
            <span class="right" v-if="reportType === '1'">
              <label>纠纷对象：</label><span class="as-ellipsis" :title="disputeObject">{{disputeObject}}</span>
            </span>
          </div>
          <div class="form">
            <el-form :model="ruleFormWindUpCase" :rules="rulesWindUpCase" :show-message="false" ref="ruleFormWindUpCase" label-width="100px">
              <el-form-item label="处理时间:" prop="date" style="margin-bottom: 10px;">
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
          <el-button type="primary" size="small" @click="windUpCase('ruleFormWindUpCase')">确 定</el-button>
          <el-button size="small" plain @click="dialogWindUpCase = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      status: 0,
      disputeHosp: '',
      disputeNum: '',
      hospitalList: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      options: [],
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
      disputeList: [],
      hospName: '',
      deptName: '',
      reportName: '',
      reportRen: '',
      disputeUid: '',
      mediateHandleUid: '',
      acceptTime: '',
      reportType: '',
      disputeObject: '',
      loading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    this.getDisputeList(1);
    this.getHospitalList();
  },
  methods: {
    formatterOne (row, column) {
      return row.disputeType === '0'
        ? '医德医风'
        : row.disputeType === '1'
          ? '就医环境'
          : row.disputeType === '2'
            ? '不良事件'
            : '诊疗差错'
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getDiseaseList();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getDiseaseList();
    },
    // 查询纠纷列表
    getDisputeList (search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      let jsonStr = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        where: {
          channel: '2',
          status: '3',
          order: '3',
          hospUid: this.disputeHosp,
          reportName: this.reportName,
          disputeCode: this.disputeNum
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/dispute/disputeList/background/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.disputeList = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    // 获取医院列表
    getHospitalList () {
      const params = {businessType: '2'};
      this.axios.get('/hisServices/scheduling/queryHospitalList', {params})
        .then(res => {
          if (res) {
            console.log(res);
            this.hospitalList = res.data;
          }
        })
    },
    resetForm (formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    // 弹出结案框
    popWindUpCase (disputeUid, mediateHandleUid, hospName, deptName, reportName, acceptTime, disputeObject, reportType) {
      this.dialogWindUpCase = true;
      this.resetForm('ruleFormWindUpCase');
      this.disputeUid = disputeUid;
      this.mediateHandleUid = mediateHandleUid;
      this.acceptTime = acceptTime;
      this.hospName = hospName;
      this.deptName = deptName;
      this.reportRen = reportName;
      this.disputeObject = disputeObject;
      this.reportType = reportType;
    },
    // 医调委结案
    windUpCase (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            disposeUid: this.disputeUid,
            uid: this.mediateHandleUid,
            finishUserUid: this.userInfo.uid,
            handleDate: this.moment(this.ruleFormWindUpCase.date).format('YYYY-MM-DD'),
            mediateType: this.ruleFormWindUpCase.methods
          }
          this.axios.put('/hisServices/dispute/finish', params)
            .then(res => {
              if (res) {
                console.log(res);
                this.$message.success('结案成功！');
                this.dialogWindUpCase = false;
                this.ruleFormWindUpCase.methods = null;
                this.getDisputeList();
              }
            })
        } else {
          return false;
        }
      })
    }
  }
}
</script>
<style lang="less">
  .not-in-hand{
    .title i{
      margin-right: 10px;
    }
    .title span{
      color:rgba(51,51,51,1);
      font-weight: bold;
    }
    .report-person{
      margin-top: 26px;
      .el-form-item{
        margin-right: 25px;
      }
      .el-form-item__label{
        color: #000;
      }
    }
    .table .el-table .cell{
      strong{
        margin-left: 4px;
        color: #E9E9E9;
      }
      span{
        cursor: pointer;
        margin-left: 4px;
        color: #1890FF;
      }
      span.disabled {
        color: #999;
        cursor: default;
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
  }
</style>
