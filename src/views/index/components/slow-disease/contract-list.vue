<template>
  <div class="contract-list">
    <h1><i class="icon iconfont">&#xe6c0;</i><span>居民签约管理</span></h1>
    <div class="tabs" :style="{width: nabs.length * 120 + 'px'}">
      <div v-for="(item, index) in nabs" :key="index" :class="{ active: index === type, 'not-border': index === nabs.length - 1 }" @click="getContractList(index)">{{item}}<i></i></div>
    </div>
    <div class="line"></div>
    <el-form label-width="80px" :inline="true" v-if="isWSY">
      <el-form-item label="团队名称:" style="margin-bottom: 21px;">
        <el-select v-model="teamId" size="small" filterable placeholder="请选择">
          <el-option label="全部团队" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in teamData" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员类别:" style="margin-bottom: 21px;" v-if="type !== 2">
        <el-select v-model="personnelType" size="small" filterable placeholder="请选择">
          <el-option label="全部类别" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in personnelTypeList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结案原因:" style="margin-bottom: 21px;" v-if="type === 2">
        <el-select v-model="cause" size="small" filterable placeholder="请选择">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in causeTypeList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名:" style="margin-bottom: 21px;">
        <el-input v-model="name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 21px;">
        <el-button size="small" icon="el-icon-search" @click="getContractList(type, 1)">搜索</el-button>
      </el-form-item>
      <el-form-item style="margin-bottom: 21px;">
        <div v-show="!isdDevelop" class="develop" @click="isdDevelop = !isdDevelop"><span>展开</span><i class="el-icon-arrow-down"></i></div>
        <div v-show="isdDevelop" class="develop" @click="isdDevelop = !isdDevelop"><span>收起</span><i class="el-icon-arrow-up"></i></div>
      </el-form-item>
      <el-form :inline="true" class="dropdown" :class="{ dp: isdDevelop }" label-width="80px" style="height: 0;">
        <el-form-item label="身份证号:">
          <el-input size="small" v-model="idCard"></el-input>
        </el-form-item>
        <el-form-item label="代签约:" v-if="type !== 2">
          <el-select v-model="isReplace" size="small" filterable placeholder="请选择">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="是" :value="'1'"></el-option>
            <el-option label="否" :value="'2'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form>
    <el-form label-width="86px" :inline="true" v-if="isYY || isWJJ">
      <el-form-item label="乡镇卫生院:" style="margin-bottom: 21px;">
        <el-select v-model="hcId" size="small" filterable placeholder="请选择" @change="getDiseaseTeamList()">
          <el-option label="全部卫生院" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in hcData" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团队名称:" style="margin-bottom: 21px;">
        <el-select v-model="teamId" size="small" filterable placeholder="请选择">
          <el-option label="全部团队" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in teamData" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员类别:" style="margin-bottom: 21px;" v-if="type !== 2">
        <el-select v-model="personnelType" size="small" filterable placeholder="请选择">
          <el-option label="全部类别" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in personnelTypeList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结案原因:" style="margin-bottom: 21px;" v-if="type === 2">
        <el-select v-model="cause" size="small" filterable placeholder="请选择">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in causeTypeList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 21px;">
        <el-button size="small" icon="el-icon-search" @click="getContractList(type, 1)">搜索</el-button>
      </el-form-item>
      <el-form-item style="margin-bottom: 21px;">
        <div v-show="!isdDevelop" class="develop" @click="isdDevelop = !isdDevelop"><span>展开</span><i class="el-icon-arrow-down"></i></div>
        <div v-show="isdDevelop" class="develop" @click="isdDevelop = !isdDevelop"><span>收起</span><i class="el-icon-arrow-up"></i></div>
      </el-form-item>
      <el-form :inline="true" class="dropdown" :class="{ dp: isdDevelop }" label-width="86px" style="height: 0;">
        <el-form-item label="姓名:" style="margin-bottom: 21px;">
          <el-input v-model="name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="身份证号:">
          <el-input size="small" v-model="idCard"></el-input>
        </el-form-item>
        <el-form-item label="代签约:" v-if="type !== 2">
          <el-select v-model="isReplace" size="small" filterable placeholder="请选择">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="是" :value="'1'"></el-option>
            <el-option label="否" :value="'2'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form>
    <div>
      <div class="table" v-show="type !== 2">
        <el-table
          v-loading="loading"
          :data="signingList.list"
          stripe>
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            prop="userName"
            :show-overflow-tooltip="true"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="userIdcrad"
            :show-overflow-tooltip="true"
            style="width: 30%;"
            label="身份证号">
          </el-table-column>
          <el-table-column
            :formatter="transcoding"
            :show-overflow-tooltip="true"
            width="200"
            label="人员类别">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            width="200"
            prop="teamWithAvatar.teamName"
            label="签约团队">
          </el-table-column>
          <el-table-column
            label="代签约">
            <template slot-scope="scope">
              {{scope.row.signedReplace === '1' ? '是' : scope.row.signedReplace === '2' ? '否' : ''}}
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="签约时间">
            <template slot-scope="scope">
              {{scope.row.signedStatus.reviewTime | moment('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link class="operate" tag="span" :to="{ name: 'contract-detail', query: {id: $route.query.id, contractId: scope.row.uid, stepIndex: 1} }">签约详情</router-link>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="table" v-show="type === 2">
        <el-table
          v-loading="loading"
          :data="signingList.list"
          stripe>
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            prop="userName"
            width="120px"
            :show-overflow-tooltip="true"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="userIdcrad"
            width="200px"
            :show-overflow-tooltip="true"
            label="身份证号">
          </el-table-column>
          <el-table-column
            prop="teamWithAvatar.teamName"
            width="200px"
            :show-overflow-tooltip="true"
            label="签约团队">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            width="200px"
            :formatter="transcodingCause"
            label="结案原因">
          </el-table-column>
          <el-table-column
            label="结案时间">
            <template slot-scope="scope">
              {{scope.row.signedStatus.closeCaseTime | moment('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column
            label="签约时间">
            <template slot-scope="scope">
              {{scope.row.signedStatus.reviewTime | moment('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link class="operate" tag="span" :to="{ name: 'contract-detail', query: {id: $route.query.id, contractId: scope.row.uid, stepIndex: 1} }">签约详情</router-link>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
    </div>
    <div class="pagination-box" v-if="signingList.list && signingList.list.length > 0">
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="signingList.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {checkPhone, checkName} from '@/utils/validator.js';
export default {
  data () {
    return {
      type: 0,
      nabs: ['首签中', '复签中', '已结案'],
      hcData: [],
      teamData: [],
      teamId: '',
      hcId: '',
      personnelType: '',
      personnelTypeList: [
        {label: '儿童', value: '01'},
        {label: '老年人', value: '02'},
        {label: '孕产妇', value: '03'},
        {label: '高血压', value: '04'},
        {label: '糖尿病', value: '05'},
        {label: '结核病', value: '06'},
        {label: '严重精神障碍', value: '07'},
        {label: '残疾人', value: '08'},
        {label: '农村建档立卡贫困人', value: '09'},
        {label: '计划生育特殊家庭', value: '10'},
        {label: '城乡低保五保人口', value: '11'},
        {label: '重点人群', value: '12'},
        {label: '其他重点人群', value: '99'}
      ],
      cause: '',
      causeTypeList: [
        {label: '服务到期', value: '1'},
        {label: '死亡', value: '2'},
        {label: '迁出', value: '3'},
        {label: '失访', value: '4'},
        {label: '拒绝服务', value: '5'},
        {label: '其他', value: '9'}
      ],
      name: null,
      idCard: null,
      isReplace: '',
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      signingList: [],
      dialogAdd: false,
      isdDevelop: false,
      isWJJ: false,
      isWSY: false,
      isYY: false,
      loading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    this.isWJJ = this.userInfo.roleList.some(item => item.roleName === '卫计局');
    this.isWSY = this.userInfo.roleList.some(item => item.roleName === '卫生院');
    this.isYY = this.userInfo.roleList.some(item => item.roleName === '医院');
    this.getContractList(0);
    if (this.isWJJ || this.isYY) {
      this.getHcDropdownList();
    }
    this.getDiseaseTeamList();
  },
  methods: {
    transcoding: function (row) {
      let typeList = row.userType.split('|');
      let typeStr = '';
      for (let i = 0; i < typeList.length; i++) {
        typeStr += typeList[i] === '01' ? '儿童' : typeList[i] === '02'
          ? '老年人' : typeList[i] === '03'
            ? '孕产妇' : typeList[i] === '04'
              ? '高血压' : typeList[i] === '05'
                ? '糖尿病' : typeList[i] === '06'
                  ? '结核病' : typeList[i] === '07'
                    ? '严重精神障碍' : typeList[i] === '08'
                      ? '残疾人' : typeList[i] === '09'
                        ? '农村建档立卡贫困人' : typeList[i] === '10'
                          ? '计划生育特殊家庭' : typeList[i] === '11'
                            ? '城乡低保五保人口' : typeList[i] === '12'
                              ? '重点人群' : typeList[i] === '99'
                                ? '其他重点人群' : ''
        if (i < typeList.length - 1) {
          typeStr += '/';
        }
      }
      return typeStr;
    },
    transcodingCause (row) {
      let type = row.signedStatus.closeCaseType;
      return type === '1' ? '服务到期' : type === '2'
        ? '死亡' : type === '3'
          ? '迁出' : type === '4'
            ? '失访' : type === '5'
              ? '拒绝服务' : type === '9'
                ? row.signedStatus.description : ''
    },
    // 分页查询慢病团队签约信息
    getContractList (status, search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      if (this.type !== status) {
        this.teamId = '';
        this.hcId = '';
        this.personnelType = '';
        this.name = null;
        this.idCard = null;
        this.isReplace = '';
        this.cause = '';
        this.townshipHospUid = null;
        this.pageNum = 1;
        this.currentPage = 1;
      }
      this.type = status;
      let jsonStr = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        where: {
          teamUid: this.teamId,
          userType: this.personnelType,
          userName: this.name,
          idcard: this.idCard,
          signedReplace: this.isReplace,
          closeCaseType: this.cause,
          signedStatus: status === 0 ? '4' : status === 1 ? '5' : '3'
        }
      }
      if (this.isWSY) {
        jsonStr.where.townshipHospUid = this.userInfo.organInfoList[0].uid;
      } else if (this.isYY) {
        jsonStr.where.hospUid = this.userInfo.organInfoList[0].uid;
        jsonStr.where.townshipHospUid = this.hcId;
      } else if (this.isWJJ) {
        jsonStr.where.townshipHospUid = this.hcId;
      }
      console.log(jsonStr)
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/chronic/signeds/' + jsonStr)
        .then(res => {
          if (res) {
            this.signingList = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    // 分页查询慢病团队下拉列表
    getDiseaseTeamList () {
      this.teamId = '';
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {}
      }
      if (this.isWSY) {
        jsonStr.where.townshipHospUid = this.userInfo.organInfoList[0].uid;
      } else if (this.isYY || this.isWJJ) {
        jsonStr.where.townshipHospUid = this.hcId;
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/teams/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.teamData = res.data.list.map(item => {
              return {
                label: item.teamName,
                value: item.uid
              }
            })
          }
        })
    },
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
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getContractList(this.type);
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getContractList(this.type);
    }
  }
}
</script>
<style lang="less" scoped>
  .contract-list{
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
    .dropdown.dp{
      height: 60px !important;
    }
    .develop{
      cursor: pointer;
      span, i{
        color: #1890FF;
      }
    }
    .add{
      .form{
        border-bottom: 1px solid rgba(232,232,232,1);
      }
    }
  }
</style>
<style lang="less">
  .contract-list{
    .dropdown{
      transition: all .3s linear;
      .el-form-item__content{
        width: 200px !important;
      }
    }
    .el-dialog__wrapper .el-dialog__body{
      padding: 14px 30px 10px 26px;
    }
  }
</style>
