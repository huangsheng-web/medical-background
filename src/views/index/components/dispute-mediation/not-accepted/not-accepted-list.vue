<template>
  <div class="not-accepted-list">
    <div class="title">
      <i class="icon iconfont">&#xe68a;</i>
      <span>未受理</span>
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
          width="90">
          <template slot-scope="scope">
            {{ scope.row.disputeType === '0'
                ? '医德医风'
                : scope.row.disputeType === '1'
                  ? '就医环境'
                  : scope.row.disputeType === '2'
                    ? '不良事件'
                    : '诊疗差错' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="reportName"
          label="上报人"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="reportType"
          width="90"
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
          label="上报时间"
          width="100"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.createTime | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="医院上报时间">
          <template slot-scope="scope">
            {{ scope.row.reportTime | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <router-link tag="span" :to="{ name: 'not-accepted-detail', query: { disputeUid: scope.row.uid, status: scope.row.status, only: 1 } }">纠纷详情</router-link>
            <strong>|</strong>
            <span tag="span" @click="acceptDispute(scope.row.uid)">受理</span>
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
    <el-dialog
      :visible.sync="dialogAccept"
      :close-on-click-modal="false"
      width="290px"
      top="40vh"
      center>
      <p style="color: #333333;text-align: center;">受理成功</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogAccept = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      status: 0,
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      options: [],
      disputeList: [],
      dialogAccept: false,
      disputeHosp: '',
      disputeNum: '',
      reportName: '',
      hospitalList: [],
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
          status: '2',
          order: '2',
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
    // 受理纠纷
    acceptDispute (disputeUid) {
      let params = {
        uid: disputeUid,
        operUserUid: this.userInfo.uid
      }
      this.axios.put('/hisServices/dispute/mediate', params)
        .then(res => {
          if (res) {
            console.log(res);
            this.dialogAccept = true;
            this.getDisputeList();
          }
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
    }
  }
}
</script>
<style lang="less">
  .not-accepted-list{
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
    }
  }
</style>
