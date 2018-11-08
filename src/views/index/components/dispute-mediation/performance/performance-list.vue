<template>
  <div class="performance-list">
    <div class="title">
      <i class="icon iconfont">&#xe67f;</i>
      <span>绩效考核</span>
    </div>
    <div class="report-person">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="状态:">
          <el-select v-model="disputeStatus" size="small" filterable placeholder="请选择">
            <el-option label="全部状态" :value="null"></el-option>
            <el-option label="未受理" value="2"></el-option>
            <el-option label="处理中" value="3"></el-option>
            <el-option label="已处理" value="4"></el-option>
            <el-option label="已公示" value="5"></el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item>
          <el-button icon="el-icon-search" size="small" @click="getDisputeList(1)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <div v-show="!isdDevelop" class="develop" @click="isdDevelop = !isdDevelop"><span>展开</span><i class="el-icon-arrow-down"></i></div>
          <div v-show="isdDevelop" class="develop" @click="isdDevelop = !isdDevelop"><span>收起</span><i class="el-icon-arrow-up"></i></div>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="dropdown" :class="{ dp: isdDevelop }" style="height: 0;">
        <el-form-item label="时间类型:" class="time-type">
          <el-select v-model="disputeDate" size="small" filterable placeholder="请选择" @change="changeTimeQuantum()">
            <el-option label="全部类型" :value="0"></el-option>
            <el-option label="上报时间" :value="1"></el-option>
            <el-option label="上报时间/结案时间" :value="2"></el-option>
            <el-option label="医调委受理时间" :value="3"></el-option>
            <el-option label="医调委处理时间" :value="4"></el-option>
            <el-option label="医调委结案时间" :value="5"></el-option>
            <el-option label="公示时间" :value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间段:" class="time-period">
          <el-date-picker
            :disabled="!disputeDate"
            v-model="timeQuantum"
            @change="changeTimeQuantum(1)"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="table" style="min-height: 550px;">
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
          label="纠纷编号"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.disputeCode ? scope.row.disputeCode : '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="100">
          <template slot-scope="scope">
            <i class="status" :class="{ red: scope.row.status === '3', blue: scope.row.status === '0' || scope.row.status === '4', yellow: scope.row.status === '1' || scope.row.status === '2' || scope.row.status === '5', green: scope.row.status === '6' }"></i>
            <span>{{ scope.row.status === '0' || scope.row.status === '4' ? '处理中' : scope.row.status === '3' ? '未受理' : scope.row.status === '1' || scope.row.status === '2' || scope.row.status === '5'? '已处理' : '已公示' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hospName"
          label="纠纷医院"
          width="130"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="上报时间"
          width="100">
          <template slot-scope="scope">
            {{ scope.row.createTime | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="医院处理时间"
          width="120"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.handleTime ? moment(scope.row.handleTime).format('YYYY-MM-DD') : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          label="医院上报/结案时间"
          :show-overflow-tooltip="true"
          width="150">
          <template slot-scope="scope">
            {{ scope.row.hospFinishTime ? moment(scope.row.hospFinishTime).format('YYYY-MM-DD') : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          label="医院上报/结案人"
          :show-overflow-tooltip="true"
          width="150">
          <template slot-scope="scope">
            {{ scope.row.handleUserName ? scope.row.handleUserName : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="acceptTime"
          label="医调委受理时间"
          :show-overflow-tooltip="true"
          width="120">
          <template slot-scope="scope">
            {{ scope.row.acceptTime !== null ? moment(scope.row.acceptTime).format('YYYY-MM-DD') : '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="acceptUserName"
          label="受理人"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.acceptUserName !== null ? scope.row.acceptUserName : '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="mediateHandleTime"
          label="医调委处理时间"
          :show-overflow-tooltip="true"
          width="120">
          <template slot-scope="scope">
            {{ scope.row.mediateHandleTime !== null ? moment(scope.row.mediateHandleTime).format('YYYY-MM-DD') : '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="医调委结案时间"
          :show-overflow-tooltip="true"
          width="120">
          <template slot-scope="scope">
            {{ scope.row.finishTime !== null ? moment(scope.row.finishTime).format('YYYY-MM-DD') : '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="finishUserName"
          label="结案人"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.finishUserName !== null ? scope.row.finishUserName : '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="publicityTime"
          label="公示时间"
          width="100">
          <template slot-scope="scope">
            {{ scope.row.publicityTime !== null ? moment(scope.row.publicityTime).format('YYYY-MM-DD') : '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="publicityUserName"
          label="公示人"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.publicityUserName !== null ? scope.row.publicityUserName : '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right">
          <template slot-scope="scope">
            <router-link tag="span" :to="{ name: 'performance-detail', query: { disputeUid: scope.row.uid, status: scope.row.status, alone: 1 } }" class="operate">纠纷详情</router-link>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      disputeStatus: '',
      disputeHosp: '',
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      hospitalList: [],
      disputeList: [],
      disputeNum: '',
      disputeDate: '',
      lastdDsputeDate: '',
      timeQuantum: [],
      isdDevelop: false,
      reportStartDate: null,
      reportEndDate: null,
      hospHandleStartDate: null,
      hospHandleEndDate: null,
      acceptStartDate: null,
      acceptEndDate: null,
      mediateHandleStartDate: null,
      mediateHandleEndDate: null,
      finishStartDate: null,
      finishEndDate: null,
      publicityStartDate: null,
      publicityEndDate: null,
      loading: false
    }
  },
  mounted () {
    this.getHospitalList();
    this.getDisputeList(1);
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
    changeTimeQuantum (type) {
      console.log(this.timeQuantum)
      this.reportStartDate = null;
      this.reportEndDate = null;
      this.hospHandleStartDate = null;
      this.hospHandleEndDate = null;
      this.acceptStartDate = null;
      this.acceptEndDate = null;
      this.mediateHandleStartDate = null;
      this.mediateHandleEndDate = null;
      this.finishStartDate = null;
      this.finishEndDate = null;
      this.publicityStartDate = null;
      this.publicityEndDate = null;
      if (this.lastdDsputeDate !== this.disputeDate) {
        this.timeQuantum = [];
      }
      this.lastdDsputeDate = this.disputeDate;
      if (type) {
        if (this.disputeDate === 0) {
          this.timeQuantum = [];
        } else if (this.disputeDate === 1) {
          this.reportStartDate = this.timeQuantum[0];
          this.reportEndDate = this.timeQuantum[1];
        } else if (this.disputeDate === 2) {
          this.hospHandleStartDate = this.timeQuantum[0];
          this.hospHandleEndDate = this.timeQuantum[1];
        } else if (this.disputeDate === 3) {
          this.acceptStartDate = this.timeQuantum[0];
          this.acceptEndDate = this.timeQuantum[1];
        } else if (this.disputeDate === 4) {
          this.mediateHandleStartDate = this.timeQuantum[0];
          this.mediateHandleEndDate = this.timeQuantum[1];
        } else if (this.disputeDate === 5) {
          this.finishStartDate = this.timeQuantum[0];
          this.finishEndDate = this.timeQuantum[1];
        } else if (this.disputeDate === 6) {
          this.publicityStartDate = this.timeQuantum[0];
          this.publicityEndDate = this.timeQuantum[1];
        }
      }
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
          channel: '3',
          order: '0',
          status: this.disputeStatus,
          hospUid: this.disputeHosp,
          disputeCode: this.disputeNum,
          reportStartDate: this.reportStartDate !== null ? this.moment(this.reportStartDate).format('YYYY-MM-DD') : null,
          reportEndDate: this.reportEndDate !== null ? this.moment(this.reportEndDate).format('YYYY-MM-DD') : null,
          hospHandleStartDate: this.hospHandleStartDate !== null ? this.moment(this.hospHandleStartDate).format('YYYY-MM-DD') : null,
          hospHandleEndDate: this.hospHandleEndDate !== null ? this.moment(this.hospHandleEndDate).format('YYYY-MM-DD') : null,
          acceptStartDate: this.acceptStartDate !== null ? this.moment(this.acceptStartDate).format('YYYY-MM-DD') : null,
          acceptEndDate: this.acceptEndDate !== null ? this.moment(this.acceptEndDate).format('YYYY-MM-DD') : null,
          mediateHandleStartDate: this.mediateHandleStartDate !== null ? this.moment(this.mediateHandleStartDate).format('YYYY-MM-DD') : null,
          mediateHandleEndDate: this.mediateHandleEndDate !== null ? this.moment(this.mediateHandleEndDate).format('YYYY-MM-DD') : null,
          finishStartDate: this.finishStartDate !== null ? this.moment(this.finishStartDate).format('YYYY-MM-DD') : null,
          finishEndDate: this.finishEndDate !== null ? this.moment(this.finishEndDate).format('YYYY-MM-DD') : null,
          publicityStartDate: this.publicityStartDate !== null ? this.moment(this.publicityStartDate).format('YYYY-MM-DD') : null,
          publicityEndDate: this.publicityEndDate !== null ? this.moment(this.publicityEndDate).format('YYYY-MM-DD') : null

        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      console.log(jsonStr)
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
    }
  }
}
</script>
<style scoped lang="less">
  .performance-list{
    .title i{
      margin-right: 10px;
    }
    .title span{
      color:rgba(51,51,51,1);
      font-weight: bold;
    }
    .table .el-table{
    }
    .dropdown{
      transition: all .3s linear;
    }
    .dropdown.dp{
      height: 60px !important;
    }
    .develop{
      cursor: pointer;
      span{
        color: #1890FF;
      }
      i{
        color: #1890FF;
      }
    }
  }
</style>
<style lang="less">
  .performance-list{
    .report-person{
      margin-top: 26px;
      .el-form-item{
        margin-right: 25px;
      }
      .el-form-item__label{
        color: #000;
      }
      .time-type .el-input__inner{
        width: 170px !important;
      }
      .time-period .el-form-item__label{
        width: 70px !important;
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
      }
      .status{
        margin-right: 8px;
        vertical-align: middle;
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        &.yellow{
          background: #FB8C00;
        }
        &.blue{
          background: #1890FF;
        }
        &.green{
          background: #01897B;
        }
        &.red{
          background: #EF5555;
        }
      }
    }
  }
</style>
