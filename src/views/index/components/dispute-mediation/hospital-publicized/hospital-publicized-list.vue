<template>
  <div class="publicized-list">
    <div class="title">
      <i class="icon iconfont">&#xe67f;</i>
      <span>已公示</span>
    </div>
    <div class="report-person">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="上报人:">
          <el-input size="small" v-model="reportName" @keyup.enter.native="getDisputeList(1)"></el-input>
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
            <el-option label="医患双方公示" :value="'0'"></el-option>
            <el-option label="公开公示" :value="'1'"></el-option>
          </el-select>
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
          label="上报人类型"
          :formatter="formatterTwo">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="纠纷科室"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="disputeObject"
          label="纠纷对象"
          :formatter="formatterSix"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="上报时间"
          :formatter="formatterThree">
        </el-table-column>
        <el-table-column
          label="公示时间"
          :formatter="formatterFour">
        </el-table-column>
        <el-table-column
          label="公示类型"
          width="110px"
          :show-overflow-tooltip="true"
          :formatter="formatterFive">
        </el-table-column>
        <el-table-column
          label="操作"
          width="160px">
          <template slot-scope="scope">
            <router-link tag="span" :to="{ name: 'hospital-publicized-detail', query: { disputeUid: scope.row.uid, status: scope.row.status } }">纠纷详情</router-link>
            <strong>|</strong>
           <router-link tag="span" :to="{ name: 'publicized-detail', query: { disputeUid: scope.row.uid, type: 1, status: scope.row.status } }">公示详情</router-link>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
    </div>
    <div class="pagination-box" v-if="disputeList.list && disputeList.list.length > 0">
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
      status: '5',
      reportName: '',
      disputeType: '',
      publicityType: '',
      disputeTypeList: [
        {label: '医德医风', value: '0'},
        {label: '就医环境', value: '1'},
        {label: '不良事件', value: '2'},
        {label: '诊疗差错', value: '3'},
        {label: '其他', value: '9'}
      ],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      options: [],
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
    formatterOne (row, column) {
      return row.disputeType === '0'
        ? '医德医风'
        : row.disputeType === '1'
          ? '就医环境'
          : row.disputeType === '2'
            ? '不良事件'
            : '诊疗差错'
    },
    formatterTwo (row, column) {
      return row.reportType === '1' ? '医务人员' : '患者';
    },
    formatterThree (row, column) {
      return row.reportTime && this.moment(row.reportTime).format('YYYY-MM-DD');
    },
    formatterFour (row, column) {
      return row.publicityTime && this.moment(row.publicityTime).format('YYYY-MM-DD');
    },
    formatterFive (row, column) {
      return row.publicityType === '0' ? '医患双方公示' : '公开公示';
    },
    formatterSix (row, column) {
      if (row.reportType === '2') {
        return '--';
      } else {
        return row.disputeObject;
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
          channel: '1',
          order: '5',
          status: this.status,
          reportName: this.reportName,
          disputeType: this.disputeType,
          publicityType: this.publicityType,
          hospUid: this.userInfo.organInfoList[0].uid
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
    }
  }
}
</script>
<style scoped lang="less">
  .publicized-list{
    .title i{
      margin-right: 10px;
    }
    .title span{
      color:rgba(51,51,51,1);
      font-weight: bold;
    }
  }
</style>
<style lang="less">
  .publicized-list{
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
