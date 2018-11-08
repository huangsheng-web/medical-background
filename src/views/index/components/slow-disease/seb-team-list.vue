<template>
  <div class="seb-team-list">
    <h1><i class="icon iconfont">&#xe6c4;</i><span>家庭医生团队</span></h1>
    <div class="tabs" style="width: 240px;">
      <div :class="{ active: type === 1 }" @click="getDiseaseTeamList(1)">团队列表<i></i></div>
      <div :class="{ active: type === 2 }" class="not-border" @click="getGuideDoctorDropdownList(1)">指导医生<i></i></div>
    </div>
    <div class="line"></div>
    <el-form label-width="87px" :inline="true">
      <el-form-item label="乡镇卫生院:" v-if="type === 1">
        <el-select v-model="hcId" size="small" filterable placeholder="请选择" @change="getDiseaseTeamList(0)">
          <el-option label="全部卫生院" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in hcData" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团队名称:" v-if="type === 1">
        <el-select v-model="teamId" size="small" filterable placeholder="请选择">
          <el-option label="全部团队" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in teamData" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医院:" v-if="type === 2" class="hosp">
        <el-select v-model="hospId" size="small" filterable placeholder="请选择" @change="getGuideDoctorDropdownList(0)">
          <el-option label="全部医院" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in hospList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指导医生:" v-if="type === 2">
        <el-select v-model="doctorId" size="small" filterable placeholder="请选择">
          <el-option label="全部医生" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in doctorDropdownList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" icon="el-icon-search" v-if="type === 1" @click="getDiseaseTeamList(1, 1)">搜索</el-button>
        <el-button size="small" icon="el-icon-search" v-if="type === 2" @click="getGuideDoctorDropdownList(1, 1)">搜索</el-button>
      </el-form-item>
    </el-form>
    <div v-show="type === 1">
      <div class="table">
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
            prop="teamName"
            :show-overflow-tooltip="true"
            label="团队名称">
          </el-table-column>
          <el-table-column
            prop="belongToHospital"
            :show-overflow-tooltip="true"
            label="乡镇卫生院">
          </el-table-column>
          <el-table-column
            prop="signedCount"
            label="签约人数">
          </el-table-column>
          <el-table-column
            prop="countersignCount"
            label="复签人数">
          </el-table-column>
          <el-table-column
            label="新增时间">
            <template slot-scope="scope">
              {{scope.row.createTime | moment('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link class="operate" :to="{ name: 'seb-team-detail', query: {teamId: scope.row.uid} }">团队详情</router-link>
            </template>
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
          @size-change="onPageSizeChangeOne"
          @current-change="onPageChangeOne"
          :current-page.sync="currentPageOne"
          :page-size="pageSize"
          :page-sizes="[10, 20]"
          layout="total, prev, pager, next, sizes, jumper"
          :total="teamList.total">
        </el-pagination>
      </div>
    </div>
    <div v-show="type === 2">
      <div class="table">
        <el-table
          v-loading="loading"
          :data="doctorList.list"
          style="width: 100%;"
          stripe>
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            prop="doctor.docName"
            :show-overflow-tooltip="true"
            label="指导医生">
          </el-table-column>
          <el-table-column
            prop="doctor.hospName"
            :show-overflow-tooltip="true"
            label="所在医院">
          </el-table-column>
          <el-table-column
            prop="doctor.deptName"
            :show-overflow-tooltip="true"
            label="所在科室">
          </el-table-column>
          <el-table-column
            prop="guideTeamCount"
            label="指导团队数">
          </el-table-column>
          <el-table-column
            prop="docAdept"
            :show-overflow-tooltip="true"
            label="医生擅长">
          </el-table-column>
          <el-table-column
            label="新增时间">
            <template slot-scope="scope">
              {{scope.row.createTime | moment('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="pagination-box" v-if="doctorList && doctorList.list && doctorList.list.length > 0">
        <el-pagination
          background
          @size-change="onPageSizeChangeTwo"
          @current-change="onPageChangeTwo"
          :current-page.sync="currentPageTwo"
          :page-size="pageSize"
          :page-sizes="[10, 20]"
          layout="total, prev, pager, next, sizes, jumper"
          :total="doctorList.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      type: 0,
      hcData: [],
      teamData: [],
      teamId: '',
      hcId: '',
      hospId: '',
      hospList: [],
      doctorId: '',
      doctorDropdownList: [],
      doctorList: [],
      pageNum: 1,
      pageSize: 10,
      currentPageOne: 1,
      currentPageTwo: 1,
      teamList: [],
      loading: false
    }
  },
  mounted () {
    this.getHcDropdownList();
    this.getHospDropdownList();
    this.getDiseaseTeamList(0);
    this.getDiseaseTeamList(1);
  },
  methods: {
    // 查询乡镇卫生院下拉列表
    getHcDropdownList () {
      let jsonStr = {
        pageSize: 0,
        pageNum: 1
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
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
    // 查询医院下拉列表
    getHospDropdownList () {
      const params = {businessType: '1'};
      this.axios.get('/hisServices/scheduling/queryHospitalList', {params})
        .then(res => {
          if (res) {
            this.hospList = res.data.map(item => {
              return {
                label: item.hospName,
                value: item.uid
              }
            });
          }
        })
    },
    // 分页查询慢病团队以及下拉列表
    getDiseaseTeamList (index, search) {
      if (search) {
        this.pageNum = 1;
        this.currentPageOne = 1;
      }
      if (this.type !== 1) {
        this.pageNum = 1;
        this.currentPageOne = 1;
        this.hospId = '';
        this.hcId = '';
        this.teamId = '';
        this.doctorId = '';
      }
      this.type = 1;
      let jsonStr = null;
      if (index === 0) {
        this.teamId = '';
        jsonStr = {
          pageSize: 0,
          pageNum: 1,
          where: {
            townshipHospUid: this.hcId
          }
        }
      } else {
        jsonStr = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          where: {
            townshipHospUid: this.hcId,
            teamUid: this.teamId
          }
        }
        this.loading = true;
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/teams/' + jsonStr)
        .then(res => {
          if (res) {
            if (index === 0) {
              this.teamData = res.data.list.map(item => {
                return {
                  label: item.teamName,
                  value: item.uid
                }
              })
            } else {
              this.teamList = res.data;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    // 查询慢病指导医生以及下拉列表
    getGuideDoctorDropdownList (index, search) {
      if (search) {
        this.pageNum = 1;
        this.currentPageTwo = 1;
      }
      if (this.type !== 2) {
        this.pageNum = 1;
        this.currentPageTwo = 1;
        this.hospId = '';
        this.hcId = '';
        this.teamId = '';
        this.doctorId = '';
      }
      this.type = 2;
      let jsonStr = null;
      if (index === 0) {
        this.doctorId = '';
        jsonStr = {
          pageSize: 0,
          pageNum: 1,
          where: {
            hospUid: this.hospId
          }
        }
      } else {
        jsonStr = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          where: {
            hospUid: this.hospId,
            docUid: this.doctorId
          }
        }
        this.loading = true;
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/guideDocs/' + jsonStr)
        .then(res => {
          if (res) {
            if (index === 0) {
              this.doctorDropdownList = res.data.list.map(item => {
                return {
                  label: item.doctor.docName,
                  value: item.doctor.uid
                }
              });
            } else {
              this.doctorList = res.data;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChangeOne (size) {
      this.pageSize = size;
      this.getDiseaseTeamList(1);
    },
    onPageChangeOne (page) {
      this.pageNum = page;
      this.getDiseaseTeamList(1);
    },
    onPageSizeChangeTwo (size) {
      this.pageSize = size;
      this.getGuideDoctorDropdownList(1);
    },
    onPageChangeTwo (page) {
      this.pageNum = page;
      this.getGuideDoctorDropdownList(1);
    }
  }
}
</script>
<style lang="less" scoped>
  .seb-team-list{
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
    .member {
      p:nth-child(1){
        padding-bottom: 30px;
        text-align: center;
        color: #333333;
      }
      .info{
        width: 100%;
        padding: 10px 20px;
        line-height: 28px;
        background: #FAFAFA;
        h1{
          color: #333333;
        }
        > div{
          display: flex;
          justify-content: space-between;
          span{
            color: #999999;
          }
        }
        p{
          color: #999999;
        }
      }
    }
  }
</style>
<style lang="less">
  .seb-team-list{
    .hosp .el-form-item__label{
      width: 50px !important;
    }
    .el-dialog__wrapper .el-dialog__body{
      padding: 14px 30px 10px 26px;
    }
  }
</style>
