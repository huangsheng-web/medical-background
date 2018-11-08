<template>
  <div class="hp-team-list">
    <h1><i class="icon iconfont">&#xe6c4;</i><span>家庭医生团队</span></h1>
    <div class="tabs" style="width: 240px;">
      <div :class="{ active: type === 0 }" @click="getDiseaseTeamGuidesList(0)">指导中<i></i></div>
      <div :class="{ active: type === 1 }" class="not-border" @click="getDiseaseTeamGuidesList(1)">已结束<i></i></div>
    </div>
    <div class="line"></div>
    <el-form label-width="80px" :inline="true">
      <el-form-item label="乡镇卫生院:" class="hosp">
        <el-select v-model="hcId" size="small" filterable placeholder="请选择" @change="getDiseaseTeamGuidesDropList(type)">
          <el-option label="全部卫生院" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in hcData" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团队名称:">
        <el-select v-model="teamId" size="small" filterable placeholder="请选择">
          <el-option label="全部团队" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in teamData" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指导医生:">
        <el-select v-model="doctorId" size="small" filterable placeholder="请选择">
          <el-option label="全部医生" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in doctorList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" icon="el-icon-search" @click="getDiseaseTeamGuidesList(type, 1)">搜索</el-button>
      </el-form-item>
    </el-form>
    <div v-show="type === 0" class="table">
      <el-table
        v-loading="loading"
        :data="teamList.list"
        stripe>
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="team.teamName"
          label="团队名称">
        </el-table-column>
        <el-table-column
          prop="leaderDoctor.hospName"
          :show-overflow-tooltip="true"
          label="乡镇卫生院">
        </el-table-column>
        <el-table-column
          prop="team.signedCount"
          label="签约人数">
        </el-table-column>
        <el-table-column
          prop="team.countersignCount"
          label="复签人数">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link class="operate" :to="{ name: 'hp-team-detail', query: {teamId: scope.row.team.uid} }">团队详情</router-link>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
    </div>
    <div v-show="type === 1" class="table">
      <el-table
        v-loading="loading"
        :data="teamList.list"
        stripe>
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod">
        </el-table-column>
        <el-table-column
          prop="team.teamName"
          :show-overflow-tooltip="true"
          label="团队名称">
        </el-table-column>
        <el-table-column
          prop="leaderDoctor.hospName"
          :show-overflow-tooltip="true"
          label="乡镇卫生院">
        </el-table-column>
        <el-table-column
          prop="guideDoctor.docName"
          :show-overflow-tooltip="true"
          label="指导医生">
        </el-table-column>
        <el-table-column
          prop="guideDoctor.deptName"
          :show-overflow-tooltip="true"
          label="所在科室">
        </el-table-column>
        <el-table-column
          label="开始指导时间">
          <template slot-scope="scope">
            {{scope.row.startGuideDate | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column
          label="结束指导时间">
          <template slot-scope="scope">
            {{scope.row.endGuideDate | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="endGuideReason"
          :show-overflow-tooltip="true"
          label="结束原因">
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
    </div>
    <div class="pagination-box" v-if="teamList && teamList.list && teamList.list.length > 0">
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="teamList.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {checkPhone, checkName} from '@/utils/validator.js';
export default {
  data () {
    return {
      type: 1,
      doctorList: [],
      hcData: [],
      teamData: [],
      teamId: '',
      hcId: '',
      doctorId: '',
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      teamList: [],
      loading: false
    }
  },
  mounted () {
    this.getDiseaseTeamGuidesList(0);
    this.getHcDropdownList(0);
    this.getDiseaseTeamGuidesDropList(0);
    this.getGuideDoctorDropdownList();
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  methods: {
    // 分页查询慢病指导团队列表
    getDiseaseTeamGuidesList (status, search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      if (this.type !== status) {
        this.pageNum = 1;
        this.currentPage = 1;
        this.teamId = '';
        this.hcId = '';
        this.doctorId = '';
        this.getDiseaseTeamGuidesDropList(status);
        this.getHcDropdownList(status);
      }
      this.type = status;
      let jsonStr = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        where: {
          hospUid: this.userInfo.organInfoList[0].uid,
          townshipHospUid: this.hcId,
          teamUid: this.teamId,
          guideDocUid: this.doctorId,
          status: '1',
          guideStatus: String(status + 1)
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/chronic/teamGuides/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.teamList = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    // 查询乡镇卫生院下拉列表
    getHcDropdownList (status) {
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          guideHospUid: this.userInfo.organInfoList[0].uid
        }
      }
      if (status === 0) {
        jsonStr.where.status = '6'
      } else {
        jsonStr.where.status = '8'
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      console.log(jsonStr)
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.hcData = res.data.list.map(item => {
              return {
                label: item.name,
                value: item.uid
              }
            });
          }
        })
    },
    // 查询慢病指导医生下拉列表
    getGuideDoctorDropdownList () {
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          hospUid: this.userInfo.organInfoList[0].uid
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/guideDocs/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.doctorList = res.data.list.map(item => {
              return {
                label: item.doctor.docName,
                value: item.doctor.uid
              }
            });
          }
        })
    },
    // 分页查询慢病团队指导下拉列表
    getDiseaseTeamGuidesDropList (status) {
      this.teamId = '';
      this.teamData = [];
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          hospUid: this.userInfo.organInfoList[0].uid,
          townshipHospUid: this.hcId,
          guideStatus: String(status + 1)
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/teamGuides/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.teamData = res.data.list.map(item => {
              return {
                label: item.team.teamName,
                value: item.team.uid
              }
            });
            // 去重
            let obj = {};
            this.teamData = this.teamData.reduce((item, next) => {
              if (!obj[next.value]) {
                obj[next.value] = true;
                item.push(next);
              }
              return item;
            }, []);
          }
        })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getDiseaseTeamGuidesList(this.type);
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getDiseaseTeamGuidesList(this.type);
    }
  }
}
</script>
<style lang="less" scoped>
  .hp-team-list{
    h1{
      i{
        font-size: 18px;
        vertical-align: bottom;
      }
      span{
        margin-left: 10px;
        color: #333333;
        font-weight: bold;
      }
    }
    .line{
      width: 100%;
      height: 1px;
      background:rgba(232,232,232,1);
      margin: 16px 0;
    }
    .add{
      .form{
        border-bottom: 1px solid rgba(232,232,232,1);
      }
    }
  }
</style>
<style lang="less">
  .hp-team-list{
    .hosp .el-form-item__label{
      width: 86px !important;
    }
    .el-dialog__wrapper .el-dialog__body{
      padding: 14px 30px 10px 26px;
    }
  }
</style>
