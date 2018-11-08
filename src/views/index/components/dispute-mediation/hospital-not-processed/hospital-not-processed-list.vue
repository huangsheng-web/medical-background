<template>
  <div class="not-processed-list">
    <div class="title">
      <i class="icon iconfont">&#xe686;</i>
      <span>已处理</span>
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
          label="医院上报时间">
          <template slot-scope="scope">
              {{ scope.row.reportTime | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="结案时间">
          <template slot-scope="scope">
            {{ scope.row.finishTime |  moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="220">
          <template slot-scope="scope">
            <router-link tag="span" :to="{ name: 'hospital-not-processed-detail', query: { disputeUid: scope.row.uid, status: scope.row.status } }">纠纷详情</router-link>
            <strong>|</strong>
            <router-link tag="span" :to="{ name: 'processed-not-advice-note', query: { disputeUid: scope.row.uid, status: scope.row.status, type: 1, noticeBookUid: scope.row.noticeBookUid, deptName: scope.row.deptName } }">调解通知书</router-link>
            <strong>|</strong>
            <el-tooltip class="item" effect="dark" content="请先填写调解通知书" placement="top-end">
              <span v-if="scope.row.noticeBookUid === null" tag="span" class="disabled">公示</span>
            </el-tooltip>
            <span v-if="scope.row.noticeBookUid !== null" tag="span" @click="popPublicity(scope.row)" style="cursor: pointer;">公示</span>
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
    <div class="publicity">
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
              <label>纠纷上报人：</label><span>{{reportRen}}</span>
            </span>
            <span>
              <label>纠纷医院：</label><span class="as-ellipsis" title="卢宇飞">{{disputeHospital}}</span>
            </span>
            <span>
              <label>纠纷科室：</label><span class="as-ellipsis" title="卢宇飞">{{disputeDept}}</span>
            </span>
          </div>
          <div class="form">
            <el-form :model="ruleFormPublicity" :rules="rulesPublicity" ref="ruleFormPublicity" label-width="100px">
              <el-form-item label="公示类型:" prop="publicityType" style="margin-bottom: 10px;">
                <el-radio-group v-model="ruleFormPublicity.publicityType">
                  <el-radio :label="0">医患双方公示</el-radio>
                  <el-radio :label="1" @click.native="dialogAffirm = true">公开公示</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loading" @click="disputePublic()">确 定</el-button>
          <el-button size="small" plain @click="dialogPublicity = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="affirm">
       <el-dialog
        :visible.sync="dialogAffirm"
        :close-on-click-modal="false"
        width="400px"
        title="确认"
        center>
        <p>公开后所有人均可查看纠纷信息，风险较大，请谨慎操作</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="affirm()">确 定</el-button>
          <el-button size="small" plain @click="cancel()">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      disputeUid: '',
      status: 0,
      reportPerson: '',
      disputeHosp: '',
      disputeNum: '',
      reportName: '',
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      hospitalList: [],
      dialogPublicity: false,
      dialogAffirm: false,
      reportRen: '',
      disputeHospital: '',
      disputeDept: '',
      ruleFormPublicity: {
        publicityType: 0
      },
      rulesPublicity: {
        publicityType: [
          { required: true, message: '请选择科室名称', trigger: 'change' }
        ]
      },
      disputeList: [],
      loading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    this.getHospitalList();
    this.getDisputeList(1);
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
      this.getDisputeList();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getDisputeList();
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
          status: '4',
          order: '4',
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
    popPublicity (info) {
      this.disputeUid = info.uid;
      this.reportRen = info.reportName;
      this.disputeHospital = info.hospName;
      this.disputeDept = info.deptName;
      this.ruleFormPublicity.publicityType = 0;
      this.dialogPublicity = true;
    },
    // 纠纷公示
    disputePublic () {
      let params = {
        uid: this.disputeUid,
        operUserUid: this.userInfo.uid,
        publicityType: this.ruleFormPublicity.publicityType
      }
      this.loading = true;
      this.axios.post('/hisServices/dispute/public', params)
        .then(res => {
          if (res) {
            this.getDisputeList();
            this.dialogPublicity = false;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    // 是否确认选择公开公示
    affirm () {
      this.ruleFormPublicity.publicityType = 1;
      this.dialogAffirm = false;
    },
    // 是否取消选择公开公示
    cancel () {
      this.ruleFormPublicity.publicityType = 0;
      this.dialogAffirm = false;
    }
  }
}
</script>
<style scoped lang="less">
  .not-processed-list{
    .title i{
      margin-right: 10px;
    }
    .title span{
      color:rgba(51,51,51,1);
      font-weight: bold;
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
  }
</style>
<style lang="less">
  .not-processed-list{
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
    .el-dialog__wrapper .el-dialog__body{
      padding: 25px 25px 10px;
    }
  }
</style>
