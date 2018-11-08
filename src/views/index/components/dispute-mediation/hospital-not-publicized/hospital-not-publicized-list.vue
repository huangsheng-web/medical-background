<template>
  <div class="not-publicized-list">
    <div class="title">
      <i class="icon iconfont">&#xe67f;</i>
      <span>已公示</span>
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
        <el-form-item label="纠纷类型:">
          <el-select v-model="disputeType" size="small" filterable placeholder="请选择">
            <el-option label="全部类型" :value="null"></el-option>
            <el-option
              v-for="item in disputeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公示类型:">
          <el-select v-model="publicityType" size="small" filterable placeholder="请选择">
            <el-option label="全部类型" :value="null"></el-option>
            <el-option label="医患双方公示" :value="0"></el-option>
            <el-option label="公开公示" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" size="small"  @click="getDisputeList(1)">搜索</el-button>
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
          label="纠纷编号"
          :index="indexMethod">
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
          prop="publicityType"
          label="公示类型"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.publicityType === '0' ? '医患双方公示' : '公开公示'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="publicityTime"
          label="公示时间">
          <template slot-scope="scope">
            {{ scope.row.publicityTime | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160">
          <template slot-scope="scope">
            <router-link tag="span" :to="{ name: 'hospital-not-publicized-detail', query: { disputeUid: scope.row.uid, status: scope.row.status } }">纠纷详情</router-link>
            <strong>|</strong>
            <router-link tag="span" :to="{ name: 'publicity-not-detail', query: { disputeUid: scope.row.uid, status: scope.row.status, type: 1 } }">调解公示</router-link>
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
      disputeHosp: '',
      disputeType: '',
      status: 0,
      reportPerson: '',
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      hospitalList: [],
      dialogPublicity: false,
      disputeTypeList: [
        {label: '医德医风', value: '0'},
        {label: '就医环境', value: '1'},
        {label: '不良事件', value: '2'},
        {label: '诊疗差错', value: '3'},
        {label: '其他', value: '9'}
      ],
      publicityType: '',
      disputeList: [],
      loading: false
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
          status: '5',
          order: '5',
          hospUid: this.disputeHosp,
          disputeType: this.disputeType,
          publicityType: this.publicityType
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
    }
  }
}
</script>
<style scoped lang="less">
  .not-publicized-list{
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
  .not-publicized-list{
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
    .el-dialog__wrapper .el-dialog__body{
      padding: 25px 25px 10px;
    }
  }
</style>
