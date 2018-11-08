<template>
  <div class="sup-main my-reg clearfix">
    <div class="sup-sl">
      <el-menu
        default-active="2"
        @select="sideSelect"
        class="el-menu-vertical-demo">
        <el-menu-item  index="2">
          <span slot="title">未就诊</span>
        </el-menu-item>
        <el-menu-item index="1">
          <span slot="title">已就诊</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span slot="title">已取消</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="sup-bread">
      <i class="iconfont">&#xe6c4;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span>{{item.name}}</span></span>
      </div>
    </div>
    <div class="sup-content-box clearfix">
      <div class="sup-content" >
        <div class="sup-search" style="position: relative;" :class="{'h-auto': hAuto}">
          医院：
          <el-select v-if="!isHospUser" @change="getRoomList(hospUid)" v-model="hospUid" style="width: 200px; margin-right: 30px;" placeholder="请选择">
            <el-option
              v-for="item in hospitalList"
              :key="item.uid"
              :label="item.hospName"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-input v-if="isHospUser" style="width: 200px; margin-right: 30px;" disabled v-model="$store.state.token.organInfoList[0].organName"></el-input>
          科室:
          <el-select @change="getDocList(hospRoomUid)" v-model="hospRoomUid" style="width: 228px; margin-right: 30px;" placeholder="请选择">
            <el-option
              v-for="item in hospRoomList"
              :key="item.uid"
              :label="item.deptName"
              :value="item.uid">
            </el-option>
          </el-select>
          医生:
          <el-select v-model="docName" style="width: 228px; margin-right: 30px;" placeholder="请选择">
            <el-option
              v-for="item in docList"
              :key="item.uid"
              :label="item.docName"
              :value="item.uid">
            </el-option>
          </el-select>
          <br/>
          支付方式:
          <el-select v-model="payType" style="width: 182px; margin-right: 30px;" placeholder="请选择">
            <el-option
              v-for="item in payList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          身份证号:
          <el-input v-model="personCardNo" style="width: 200px; margin-right: 30px;"></el-input>
          就诊人姓名:
          <el-input v-model="personName" style="width: 187px; margin-right: 30px;margin-top: 16px;"></el-input>
          <br/>
          手机号:
          <el-input v-model="personPhone" style="width: 200px; margin-right: 30px;"></el-input>
          <template v-if="sideType === 3">
            取消原因:
            <el-select v-model="cancelType" style="width: 200px; margin-right: 30px;" placeholder="请选择">
              <el-option
                v-for="item in cancelList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          就诊时间：
          <el-date-picker
            v-model="visitTime"
            style="width: 350px;margin: 16px 0;vertical-align: baseline;"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="text" style="position: absolute;right: 37px;top: 0;" @click.native="hAuto = !hAuto">{{!hAuto ? '展开' : '收起'}} <i class="iconfont" :class="{'change-rotate': hAuto}" style="transform: rotate(90deg);display: inline-block;-ms-transform: rotate(90deg);-moz-transform: rotate(90deg);-webkit-transform: rotate(90deg)">&#xe682;</i></el-button>
          <el-button style="position: absolute;right: 120px;top: 0;" @click="getResList" icon="el-icon-search" size="small">搜索</el-button>
        </div>
        <el-table
          :data="regList"
          key="tabel92"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            align="center"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="挂号科室"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="docName"
            min-width="110"
            label="挂号医生">
            <template slot-scope="scope">
              {{scope.row.docName ? scope.row.docName : '暂无'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="patientName"
            min-width="110"
            label="就诊人姓名">
          </el-table-column>
          <el-table-column
            min-width="170"
            prop="patientIdcard"
            label="身份证号">
          </el-table-column>
          <el-table-column
            prop="patientTelephone"
            min-width="120"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="schedulDay"
            min-width="200"
            label="就诊时间">
            <template slot-scope="scope">
              {{scope.row.schedulDay}} {{scope.row.schedulHour}}
            </template>
          </el-table-column>
          <el-table-column
            prop="schedulingType"
            min-width="110"
            label="挂号类型">
            <template slot-scope="scope">
              {{scope.row.schedulingType === '3' ? '专家号' : '普通号'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            min-width="120"
            label="挂号金额（元）">
          </el-table-column>
          <el-table-column
            prop="payType"
            min-width="80"
            label="支付方式">
            <template slot-scope="scope">
              {{scope.row.payType === '2' ? '到院支付' : '在线支付'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="schedulingMode"
            min-width="80"
            label="挂号方式">
            <template slot-scope="scope">
              {{scope.row.schedulingMode === '1' ? '网页' : '小程序'}}
            </template>
          </el-table-column>
          <template v-if="sideType === 3">
            <el-table-column
              prop="cancelRemarks"
              min-width="100"
              :show-overflow-tooltip="true"
              label="取消原因">
              <template slot-scope="scope">
                {{cancelMarks[scope.row.cancelRemarks]}}
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div style="position: static;" class="pagination-box">
          <el-pagination
            background
            @size-change="onPageSizeChange"
            @current-change="onPageChange"
            :current-page.sync="pagination.pageNum"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 20]"
            layout="total, prev, pager, next, sizes, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {formatDate} from '@/utils/util.js';
export default {
  data () {
    return {
      breadList: {
        '2': [
          {name: '未就诊', sideType: 2, sideCurP: 0}
        ],
        '1': [
          {name: '已就诊', sideType: 1, sideCurP: 0}
        ],
        '3': [
          {name: '已取消', sideType: 3, sideCurP: 0}
        ]},
      curRole: -1, // 当前角色；0卫计局1医院2卫生院3医调委
      sideType: 2,
      pagination: { // 分页
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      },
      sideFiveCurP: 0,
      visitTime: [],
      hospUid: '',
      hospRoomUid: '',
      docName: '',
      payType: '',
      cancelType: null,
      personName: '',
      personPhone: '',
      personCardNo: '',
      regList: [],
      schedulingType: {
        '1': '科室预约号',
        '2': '医生普通号',
        '3': '医生专家号',
        '4': '其他'
      },
      hospitalList: [], // 医院
      hospRoomList: [], // 科室
      docList: [], // 医生
      payList: [
        {label: '全部', value: '0'},
        {label: '在线支付', value: '1'},
        {label: '到院支付', value: '2'}
      ], // 支付方式
      cancelList: [
        {label: '全部', value: '0'},
        {label: '选择其他医院就诊', value: '1'},
        {label: '选择其他医生就诊', value: '2'},
        {label: '临时有事,不能就诊', value: '3'},
        {label: '病情好转无需就诊', value: '4'},
        {label: '其他原因', value: '5'}
      ], // 取消原因
      cancelMarks: {
        '1': '选择其他医院就诊',
        '2': '选择其他医生就诊',
        '3': '临时有事,不能就诊',
        '4': '病情好转无需就诊',
        '5': '其他原因'
      },
      isHospUser: false, // 是否为医院账号
      hAuto: false // 自适应高度
    }
  },
  created () {
    this.getRole();
  },
  mounted () {
    console.log(this.$store.state.token)
    if (this.curRole === 0) {
      this.getAllHos();
    } else {
      if (this.$store.state.token.organInfoList.length) {
        this.getRoomList(this.$store.state.token.organInfoList[0].uid)
      }
    }
    this.getResList();
  },
  methods: {
    indexMethod (index) {
      return index + 1 + this.pagination.pageSize * (this.pagination.pageNum - 1);
    },
    getRole () {
      this.isHospUser = false;
      if (this.$store.state.token.roleList.some(x => x === '医院')) {
        this.curRole = 1;
        this.isHospUser = true;
      }
      if (this.$store.state.token.roleList.some(x => x === '卫计局')) {
        this.curRole = 0;
      }
      console.log(this.breadList)
    },
    sideSelect (key) {
      this.resetData();
      this.sideType = parseInt(key);
      this.getResList();
    },
    resetData () {
      if (this.curRole === 0) {
        this.hospUid = '';
      }
      this.hAuto = false;
      this.hospRoomUid = '';
      this.docName = '';
      this.payType = '';
      this.cancelType = '';
      this.personName = '';
      this.personPhone = '';
      this.personCardNo = '';
      this.visitTime = [];
      this.pagination = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      }
    }, // 重置数据
    getResList () {
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
          visit: this.sideType
        }
      }
      if (this.hospUid) {
        params.where['hospUid'] = this.hospUid;
      }
      if (this.hospRoomUid) {
        params.where['deptUid'] = this.hospRoomUid;
      }
      if (this.docName) {
        params.where['docName'] = this.docName;
      }
      if (parseInt(this.payType)) {
        params.where['payType'] = this.payType;
      }
      if (this.personName) {
        params.where['patientName'] = this.personName;
      }
      if (this.personCardNo) {
        params.where['patientIdcard'] = this.personCardNo;
      }
      if (this.personPhone) {
        params.where['patientTelephone'] = this.personPhone;
      }
      if (parseInt(this.cancelType)) {
        params.where['cancelRemarks'] = this.cancelType;
      }
      if (this.isHospUser) {
        params.where['hospUid'] = this.$store.state.token.organInfoList[0].uid;
      }
      if (this.visitTime && this.visitTime.length) {
        params.where['appoStartTime'] = formatDate(this.visitTime[0]);
        params.where['appoEndTime'] = formatDate(this.visitTime[1]);
      };
      this.axios.get('/hisServices/scheduling/schedulingList/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.regList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          }
        })
    }, // 获取列表
    onPageSizeChange (size) {
      this.pagination.pageSize = size;
      this.getResList();
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getResList();
    },
    getAllHos () {
      let params = {
        businessType: '1'
      }
      this.axios.get('/hisServices/scheduling/queryHospitalList', {params})
        .then(res => {
          if (res) {
            this.hospitalList = res.data;
            this.hospitalList.splice(0, 0, {hospName: '全部', uid: 0})
          }
        })
    }, // 获取医院列表
    getRoomList (uid) {
      this.hospRoomUid = '';
      let params = {
        where: {
          uid: uid
        }
      }
      if (uid) {
        this.axios.get('/hisServices/scheduling/queryDeptByHospital/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
          .then(res => {
            if (res) {
              this.hospRoomList = res.data.list;
              this.hospRoomList.splice(0, 0, {deptName: '全部', uid: 0})
            }
          })
      }
    }, // 获取科室列表
    getDocList (uid) {
      let params = {
        pageSize: 0,
        where: {
          deptUid: uid
        }
      }
      if (uid) {
        this.axios.get('/hisServices/scheduling/queryDoctorList/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
          .then(res => {
            if (res) {
              this.docList = res.data.list;
            }
          })
      }
    } // 获取医生列表
  },
  watch: {
    hospRoomUid (e) {
      this.docName = '';
    }
  }
}
</script>
<style scoped="scoped" lang="less">
  .sup-bread{
    padding: 20px 0px;
    padding-left: 30px;
    /*margin-left: 160px;*/
    border-left: solid 1px #e8e8e8;
    > i{
      display: inline-block;
      vertical-align: middle;
    }
    >.sup-bread-list{
      display: inline-block;
      vertical-align: middle;
      >span{
        span{
          cursor: pointer;
          font-size: 14px;
          color: #666666;
        }
        &:last-child{
          span{
            color: #333333;
            font-weight: bold;
          }
        }
      }
    }
  }
  button{
    width: 64px;
    height:32px;
    line-height: 32px;
    padding: 0;
    text-align: center;
  }
  .change-rotate{
    transform: rotate(-90deg) !important;
    -moz-transform: rotate(-90deg) !important;
    -webkit-transform: rotate(-90deg) !important;
    -ms-transform: rotate(-90deg) !important;
  }
</style>
<style lang="less">
  .my-reg{
    padding-top: 90px;
    position: relative;
    input{
      height: 32px;
      line-height: 32px;
    }
    .el-input__icon{
      line-height: 32px;
    }
    .el-date-editor{
      height: 32px;
      padding-top: 0;
      padding-bottom: 0;
      vertical-align: bottom;
      .el-range-input{
        height: 30px;
      }
      .el-range-separator{
        line-height: 30px;
      }
    }
    .sup-sl{
      width: 160px;
      float: left;
      .el-submenu__icon-arrow{
        right: 10px!important;
        margin-top: -5px;
      }
      .el-submenu {
        .el-menu-item{
          padding: 0!important;
          text-align: center;
          min-width: 0;
        }
        .is-active{
          background: #E6F7FF!important;
          color: #1890FF;
          border-right: 2px solid #1890FF;
        }
      }
      .el-menu{
        padding-top: 20px;
        border-right: none;
        .el-menu-item{
          height:40px;
          line-height: 40px;
        }
        >.is-active:not(.is-opened){
          background: #E6F7FF!important;
          color: #1890FF;
          border-right: 2px solid #1890FF;
          font-weight: bold;
        }
      }
    }
    .sup-content{
      min-height:  730px;
      float: left;
      width: calc(100% - 160px);
      padding: 0 30px 30px 30px;
      border-left: solid 1px #e8e8e8;
      .sup-search{
        height: 46px;
        overflow: hidden;
        >span{
          display: inline-block;
          padding: 0 16px;
          height: 32px;
          -webkit-border-radius: 2px;
          -moz-border-radius: 2px;
          border-radius: 2px;
          color: #333333;
          line-height: 32px;
          cursor: pointer;
        }
        >.active{
          background: #1890FF;
          color: #ffffff;
        }
        margin-right: 16px;
      }
      >.h-auto{
        height: auto;
      }
      .sup-color-box{
        margin-top: 20px;
        padding-bottom: 20px;
        border-bottom: 1px dashed #999999;
        >div{
          float: left;
          width: 340px;
          height: 110px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          border-radius: 10px;
          margin-right: 20px;
          >p{
            margin-top: 12px;
            text-align: center;
            color: #ffffff;
            font-size: 16px;
            font-weight: bold;
            span{
              font-size: 34px;
              font-weight: normal;
            }
            &:last-child{
              font-weight: normal;
            }
          }
        }
        >.color-box-1{
          background: linear-gradient(180deg, rgba(30, 223, 219, 1), rgba(52, 190, 224, 1));
        }
        >.color-box-2{
          background: linear-gradient(180deg,rgba(255,151,139,1),rgba(255,107,136,1));
        }
        >.color-box-3{
          background: linear-gradient(0deg,rgba(117,143,255,1),rgba(72,180,253,1));
        }
        >.color-box-4{
          background: linear-gradient(0deg,rgba(154,134,255,1),rgba(204,174,255,1));
        }
        >.color-box-5{
          background: linear-gradient(0deg,rgba(254,186,36,1),rgba(254,209,53,1));
        }
        >.color-box-6{
          background: linear-gradient(0deg,rgba(111,225,199,1),rgba(0,199,154,1));
        }
        >.color-box-7{
          background: linear-gradient(0deg,rgba(198,102,255,1),rgba(251,156,235,1));
        }
        >.color-box-8{
          background: linear-gradient(0deg,rgba(98,214,58,1),rgba(186,231,65,1));
        }
      }
      .sup-reg-type {
        >p{
          line-height: 60px;
          color: #333333;
          font-weight: bold;
          &:before{
            content: '';
            display: inline-block;
            width: 10px;
            height: 10px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            background: #1890FF;
            margin-right: 8px;
          }
          >span{
            font-weight: normal;
            color: #666666;
          }
        }
        .g2-tooltip{
          background: rgba(0, 0, 0, .7) !important;
          color: #FFFFFF!important;
        }
        >.chart-round{
          display: inline-block;
          width: 33%;
          text-align: center;
          >h5{
            text-indent: 52px;
            color: #333333;
            font-weight: bold;
          }
          >p{
            text-indent: 52px;
            color: #1890FF;
            font-weight: bold;
          }
        }
      }
      .village-type{
        height: 48px;
        margin-bottom: 16px;
        border-bottom: 1px solid #E8E8E8;
        >span{
          display: block;
          float: left;
          width: 120px;
          height: 32px;
          text-align: center;
          line-height: 32px;
          border-top: 1px solid #e8e8e8;
          border-bottom: 1px solid #e8e8e8;
          border-left: 1px solid #e8e8e8;
          border-right: 1px solid #e8e8e8;
          color: #333333;
          font-size: 14px;
          cursor: pointer;
          &:first-child{
            -webkit-border-radius: 4px 0 0 4px;
            -moz-border-radius: 4px 0 0 4px;
            border-radius: 4px 0 0 4px;
          }
          &:last-child{
            border-right: 1px solid #e8e8e8;
            -webkit-border-radius: 0 4px 4px 0;
            -moz-border-radius: 0 4px 4px 0;
            border-radius: 0 4px 4px 0;
          }
        }
        .active{
          background: #1890FF;
          color: #ffffff;
          position: relative;
          border: none;
          &:after{
            content: '';
            display: block;
            width: 12px;
            height: 12px;
            background: #1890FF;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
            position: absolute;
            bottom: -6px;
            left: 54px;
          }
        }
      }
    }
    .pagination-box{
      position: absolute;
      bottom: 20px;
      right: 30px;
    }
  }
</style>
