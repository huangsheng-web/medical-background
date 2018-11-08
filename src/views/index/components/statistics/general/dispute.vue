<template>
  <div class="sup-main my-sta clearfix">
    <div class="sup-bread">
      <i class="iconfont">&#xe63a;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
      </div>
    </div>
    <!--医疗纠纷统计-->
    <div class="sup-content-box clearfix">
      <div class="sup-content" v-show="sideFiveCurP === 0">
        <div class="sup-search">
          <span :class="{'active': condition === '1'}" @click="condition = '1'">本月</span>
          <span :class="{'active': condition === '2'}" @click="condition = '2'">上月</span>
          <span :class="{'active': condition === '3'}" @click="condition = '3'">最近三月</span>
          <el-select v-model="sideOneTimeType" @change="condition = sideOneTimeType" placeholder="请选择">
            <el-option
              v-for="item in timeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-show="condition === '4' || condition === '5' || condition === '6'" v-model="proYear" style="width: 120px;" placeholder="请选择">
            <el-option
              v-for="item in proYearList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-show="condition === '4'"  v-model="proMonth" style="width: 136px;" placeholder="请选择">
            <el-option
              v-for="item in proMonthList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-show="condition === '5'"  v-model="proQuarter" style="width: 136px;" placeholder="请选择">
            <el-option
              v-for="item in proQuarterList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            v-show="condition === '0'"
            v-model="visitTime"
            style="width: 350px"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button style="margin-left: 30px" v-show="condition === '4' || condition === '5' || condition === '6' || condition === '0'" @click.native="getDispute" icon="el-icon-search">统计</el-button>
        </div>
        <div class="sup-color-box clearfix">
          <div class="color-box-1" style="margin-bottom: 20px;">
            <p>全部纠纷 <span>  {{disputeData.medicalEthicsCount + disputeData.medicalEnvironmentCount + disputeData.adverseEventCount + disputeData.malpracticeCount + disputeData.otherCount | fmTenThousand}}</span></p>
            <p>累计： {{disputeData.totalMedicalEthics + disputeData.totalMedicalEnvironment + disputeData.totalAdverseEvent + disputeData.totalMalpractice + disputeData.totalOther | fmTenThousand}}</p>
          </div>
          <div class="color-box-2" style="margin-bottom: 20px;">
            <p>医德医风 <span>  {{disputeData.medicalEthicsCount | fmTenThousand}}</span></p>
            <p>累计： {{disputeData.totalMedicalEthics | fmTenThousand}}</p>
          </div>
          <div class="color-box-3" style="margin-right: 0;margin-bottom: 20px;">
            <p>就医环境 <span>  {{disputeData.medicalEnvironmentCount | fmTenThousand}}</span></p>
            <p>累计：{{disputeData.totalMedicalEnvironment | fmTenThousand}}</p>
          </div>
          <div class="color-box-4">
            <p>不良事件 <span>  {{disputeData.adverseEventCount | fmTenThousand}}</span></p>
            <p>累计：{{disputeData.totalAdverseEvent | fmTenThousand}}</p>
          </div>
          <div class="color-box-5" >
            <p>诊疗差错 <span>  {{disputeData.malpracticeCount | fmTenThousand}}</span></p>
            <p>累计：{{disputeData.totalMalpractice | fmTenThousand}}</p>
          </div>
          <div class="color-box-6" style="margin-right: 0">
            <p>其他 <span>  {{disputeData.otherCount | fmTenThousand}}</span></p>
            <p>累计：{{disputeData.totalOther | fmTenThousand}}</p>
          </div>
        </div>
        <div class="sup-reg-type">
          <p>增长趋势统计<span>（{{timeRate}}）</span></p>
          <g2-line :charData="serverData" :color="'#32C1DF-#FF7088-#6F94FF-#9A86FF-#FEBA24-#00C79A'" :id="'c1'"></g2-line>
        </div>
        <!--列表统计-->
        <div class="sup-reg-type">
          <p style="margin-top: 0;border-top: 1px dashed #999999;">列表统计<span>（{{timeRate}}）</span></p>
          <div class="sup-search" style="margin-bottom: 16px;">
            <span v-show="!isHospUser">选择医院:</span>
            <el-select v-show="!isHospUser" v-model="hospitalUid" style="width: 200px;margin-right: 30px;" @change="getRoomList" placeholder="请选择">
              <el-option
                v-for="item in hospitalList"
                :key="item.uid"
                :label="item.hospName"
                :value="item.uid">
              </el-option>
            </el-select>
            选择科室:
            <el-select v-model="roomUid" style="width: 200px;margin-right: 30px;" placeholder="请选择">
              <el-option
                v-for="item in roomList"
                :key="item.uid"
                :label="item.deptName"
                :value="item.uid">
              </el-option>
            </el-select>
            <el-button type="primary" @click="getDisputeColData" icon="el-icon-search">统计</el-button>
          </div>
          <el-table
            :data="disputeColDataList"
            key="tabel162"
            :show-overflow-tooltip="true"
            show-summary
            :summary-method="getSummaries3"
            stripe
            style="width: 100%;font-size: 12px">
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              width="63">
            </el-table-column>
            <el-table-column
              prop="displayName"
              width="100"
              :show-overflow-tooltip="true"
              :label="colDataType === 0 ? '医院名称' : (colDataType === 1 ? '科室名称' : '医生')">
            </el-table-column>
            <el-table-column
              prop="medicalEthicsCount"
              width="100"
              label="医德医风纠纷">
            </el-table-column>
            <el-table-column
              prop="medicalEnvironmentCount"
              label="就医环境纠纷"
              width="100">
            </el-table-column>
            <el-table-column
              prop="adverseEventCount"
              width="100"
              label="不良事件纠纷">
            </el-table-column>
            <el-table-column
              prop="malpracticeCount"
              width="100"
              label="诊疗差错纠纷">
            </el-table-column>
            <el-table-column
              prop="otherCount"
              width="90"
              label="其他纠纷">
            </el-table-column>
            <el-table-column
              prop="reportMediateCount"
              width="110"
              label="上报医调委纠纷">
            </el-table-column>
            <el-table-column
              prop="hopsFinishCount"
              width="100"
              label="医院结案纠纷">
            </el-table-column>
            <el-table-column
              prop="mediateFinishCount"
              width="110"
              label="医调委结案纠纷">
            </el-table-column>
            <el-table-column
              prop="disputeCount"
              width="90"
              label="纠纷合计">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {formatDate} from '@/utils/util.js';
import G2Line from '@/components/common/g2-line.vue';
import G2 from '@antv/g2';
import {View, DataSet} from '@antv/data-set'
export default {
  components: {
    G2Line
  },
  data () {
    return {
      showTeamName: '',
      isShow: true,
      isTeamShow: true,
      allTotal: {
        totalAppointment: null,
        totalAppointmentPrice: null,
        totalCancelAppointment: null,
        totalVisit: null,
        againAppointmentCountAll: null,
        againAppointmentPriceAll: null,
        askCountAll: null,
        replyCountAll: null,
        visitCountAll: null,
        total: null,
        totalAdverseEvent: null,
        totalHopsFinishCount: null,
        totalMalpractice: null,
        totalMediateFinishCount: null,
        totalMedicalEnvironment: null,
        totalMedicalEthics: null,
        totalOther: null,
        totalReportMediate: null
      },
      breadList: {
        '1': [
          {name: '医疗纠纷统计', sideType: 1, sideCurP: 0}
        ]
      },
      curRole: -1, // 当前角色；0卫计局1医院2卫生院3医调委
      sideType: 1,
      proMonth: '', // 搜索
      proMonthList: [
        {label: '1月份', value: '00'},
        {label: '2月份', value: '01'},
        {label: '3月份', value: '02'},
        {label: '4月份', value: '03'},
        {label: '5月份', value: '04'},
        {label: '6月份', value: '05'},
        {label: '7月份', value: '06'},
        {label: '8月份', value: '07'},
        {label: '9月份', value: '08'},
        {label: '10月份', value: '09'},
        {label: '11月份', value: '10'},
        {label: '12月份', value: '11'}
      ], // 搜索
      proYearList: [], // 搜索
      proYear: '', // 搜索
      proQuarter: '', // 搜索
      proQuarterList: [
        {label: '一季度', value: '1'},
        {label: '二季度', value: '2'},
        {label: '三季度', value: '3'},
        {label: '四季度', value: '4'}
      ], // 基础搜索
      serverData: [], // 图表原数据
      condition: '1', // 时间段条件1本月2上月3最近3月4月度5季度6年度0自定义
      timeRate: '', // 当前图表展示的时间区域
      hospitalList: [], // 医院列表-公用
      vHospList: [], // 乡镇卫生院列表-公用
      hospitalUid: '', // 医院uid
      roomUid: '', // 科室id
      roomList: [], // 科室列表
      colDataType: 0, // 列表统计当前类别，0医院，1科室，2医生
      sideOneTimeType: '',
      visitTime: [], // 时间段
      timeList: [
        {label: '月度', value: '4'},
        {label: '季度', value: '5'},
        {label: '年度', value: '6'},
        {label: '自定义', value: '0'}
      ],
      timeList1: [
        {label: '月度', value: '4'},
        {label: '季度', value: '5'},
        {label: '年度', value: '6'}
      ],
      pagination: { // 分页
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      },
      // 医疗纠纷统计
      disputeData: {}, // 纠纷图表详情
      disputeColDataList: [],
      sideFiveCurP: 0,
      isHospUser: false, // 是否为医院账号
      isVillageUser: false, // 是否为卫生院账号
      disputeAllList: [], // 医院账号下-总表列表
      hospRoomList: [], // 医院账号下-总表搜索
      hospRoomUid: '', // 医院账号下-总表搜索
      handleType: '', // 医院账号下-总表搜索
      handleTypeList: [
        {value: '1', label: '调解结案'},
        {value: '2', label: '司法结案'},
        {value: '3', label: '医院结案'}
      ], // 医院账号下-总表搜索
      insuranceType: '', // 医院账号下-总表搜索
      insuranceTypeList: [
        {value: '0', label: '保内'},
        {value: '1', label: '保外'}
      ], // 医院账号下-总表搜索
      disputeTimeRange: [], // 医院账号下-总表搜索
      hAuto: false // 自适应高度
    }
  },
  created () {
    this.getRole();
  },
  mounted () {
    this.getDispute();
    this.getDisputeColData();
    this.getCurYear();
    if (this.curRole === 0) {
      this.getAllHos();
      this.getVHospList();
    } else if (this.curRole === 3) {
      this.getAllHos();
    }
  },
  methods: {
    getRole () {
      this.isHospUser = false;
      this.isVillageUser = false;
      if (this.$store.state.token.roleList.some(x => x === '医调委')) {
        this.curRole = 3;
      }
      if (this.$store.state.token.roleList.some(x => x === '卫生院')) {
        this.curRole = 2;
        this.isVillageUser = true;
      }
      if (this.$store.state.token.roleList.some(x => x === '医院')) {
        this.curRole = 1;
        this.isHospUser = true;
      }
      if (this.$store.state.token.roleList.some(x => x === '卫计局')) {
        this.curRole = 0;
      }
      console.log(this.breadList, this.curRole)
    },
    indexMethod (index) {
      return index + 1 + this.pagination.pageSize * (this.pagination.pageNum - 1);
    },
    getSummaries3 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 2) {
          sums[index] = this.allTotal.totalMedicalEthics;
        }
        if (index === 3) {
          sums[index] = this.allTotal.totalMedicalEnvironment;
        }
        if (index === 4) {
          sums[index] = this.allTotal.totalAdverseEvent
        }
        if (index === 5) {
          sums[index] = this.allTotal.totalMalpractice;
        }
        if (index === 6) {
          sums[index] = this.allTotal.totalOther;
        }
        if (index === 7) {
          sums[index] = this.allTotal.totalReportMediate
        }
        if (index === 8) {
          sums[index] = this.allTotal.totalHopsFinishCount;
        }
        if (index === 9) {
          sums[index] = this.allTotal.totalMediateFinishCount;
        }
        if (index === 10) {
          sums[index] = this.allTotal.total;
        }
      });
      return sums;
    },
    getCurYear () {
      let y = new Date().getFullYear() - 2010;
      for (let i = 0; i <= y; i++) {
        let o = {
          label: 2010 + i,
          value: 2010 + i
        }
        this.proYearList.push(o)
      }
      this.proYearList.reverse();
    }, // 获取当前年份，
    breadTap (type, index, curP) {
      this.breadList[type].splice(index + 1);
      this.sideType = type;
    }, // 面包屑点击
    getLastDay (year, month) {
      console.log(year, month)
      var y = year;
      var m = month++;
      if (month > 12) {
        m -= 12;
        y++;
      }
      var d = new Date(y, m, 1);
      return (new Date(d.getTime() - 1000 * 60 * 60 * 24)).getDate();
    },
    getDateRate () {
      let t = '';
      let d = new Date();
      if (this.condition === '1') {
        t = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + '01' + '~' + d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() - 1);
      } else if (this.condition === '2') {
        t = d.getFullYear() + '-' + (d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth()) + '-' + '01' + '~' + d.getFullYear() + '-' + (d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth()) + '-' + this.getLastDay(d.getFullYear(), d.getMonth());
      } else if (this.condition === '3') {
        if (d.getMonth() <= 2) {
          t = d.getFullYear() + '-' + (d.getMonth() + 9) + '-' + d.getDate() + '~' + d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getDate();
        } else {
          t = d.getFullYear() + '-' + ((d.getMonth() - 2) < 10 ? '0' + (d.getMonth() - 2) : (d.getMonth() - 2)) + '-' + d.getDate() + '~' + d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() - 1);
        }
      } else if (this.condition === '4') {
        if (this.proYear === d.getFullYear() && (this.proMonth * 1) === d.getMonth()) {
          t = this.proYear + '-' + (((this.proMonth * 1) + 1) < 10 ? '0' + ((this.proMonth * 1) + 1) : ((this.proMonth * 1) + 1)) + '-' + '01' + '~' + this.proYear + '-' + (((this.proMonth * 1) + 1) < 10 ? '0' + ((this.proMonth * 1) + 1) : ((this.proMonth * 1) + 1)) + '-' + (d.getDate() - 1);
        } else {
          t = this.proYear + '-' + (((this.proMonth * 1) + 1) < 10 ? '0' + ((this.proMonth * 1) + 1) : ((this.proMonth * 1) + 1)) + '-' + '01' + '~' + this.proYear + '-' + (((this.proMonth * 1) + 1) < 10 ? '0' + ((this.proMonth * 1) + 1) : ((this.proMonth * 1) + 1)) + '-' + this.getLastDay(this.proYear, (this.proMonth * 1 + 1));
        }
      } else if (this.condition === '5') {
        if (this.proQuarter === '1') {
          t = this.proYear + '-' + '01' + '-' + '01' + '~' + this.proYear + '-' + '03' + '-' + '31'
        } else if (this.proQuarter === '2') {
          t = this.proYear + '-' + '04' + '-' + '01' + '~' + this.proYear + '-' + '06' + '-' + '31'
        } else if (this.proQuarter === '3') {
          t = this.proYear + '-' + '07' + '-' + '01' + '~' + this.proYear + '-' + '9' + '-' + '31'
        } else if (this.proQuarter === '4') {
          t = this.proYear + '-' + '10' + '-' + '01' + '~' + this.proYear + '-' + '12' + '-' + '31'
        }
      } else if (this.condition === '6') {
        t = this.proYear + '-' + '01' + '-' + '01' + '~' + this.proYear + '-' + '12' + '-' + '31'
      } else if (this.condition === '0') {
        t = formatDate(this.visitTime[0], 'yyyy-MM-dd') + '~' + formatDate(this.visitTime[1], 'yyyy-MM-dd');
      }
      this.timeRate = t;
    }, // 图表当前时间区域
    onPageSizeChange (size) {
      this.pagination.pageSize = size;
      this.getDisputeColData();
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getDisputeColData();
    },
    getAllHos (num) {
      let params = {};
      if (num) {
        params = {
          businessType: num
        }
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
      this.roomUid = '';
      let params = {
        where: {
          uid: uid
        }
      }
      if (uid) {
        this.axios.get('/hisServices/scheduling/queryDeptByHospital/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
          .then(res => {
            if (res) {
              this.roomList = res.data.list;
              this.roomList.splice(0, 0, {deptName: '全部', uid: null})
            }
          })
      } else {
        this.roomList = []
      }
    }, // 获取科室列表
    // 公众自助查询统计
    getSelfHelp () {
      this.serverData = [];
      let p = {
        where: {
          condition: this.condition
        }
      }
      if (this.condition === '4') {
        if (this.proYear && this.proMonth) {
          p['where']['time'] = this.proYear + '-' + (this.proMonth * 1 + 1);
        }
      }
      if (this.condition === '5') {
        if (this.proYear && this.proQuarter) {
          p['where']['time'] = this.proYear + '-' + this.proQuarter;
        }
      }
      if (this.condition === '6') {
        if (this.proYear) {
          p['where']['time'] = this.proYear;
        }
      }
      if (this.condition === '0') {
        if (this.visitTime.length) {
          p.where['startTime'] = formatDate(this.visitTime[0]);
          p.where['endTime'] = formatDate(this.visitTime[1]);
        };
      }
      this.axios.get('/hisServices/statistics/selfHelp/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.selfHelpData = res.data;
            res.data.lineChartData.forEach(x => {
              for (let i = 0; i < 5; i++) {
                let o = {};
                o.month = formatDate(x.statisticsDate, 'yyyy-MM-dd');
                if (i === 0) {
                  o.name = '健康记录查询人数';
                  o.num = x.healthRecordsCount;
                } else if (i === 1) {
                  o.name = '费用查询人次';
                  o.num = x.feeCount;
                } else if (i === 2) {
                  o.name = '用药查询人次';
                  o.num = x.drugsCount;
                } else if (i === 3) {
                  o.name = '化验结果报告查询人次';
                  o.num = x.testResultsCount;
                } else {
                  o.name = '检查文字报告查询人次';
                  o.num = x.checkTextCount;
                }
                this.serverData.push(o);
              }
            })
            this.getDateRate();
          }
        })
    },
    // 医疗纠纷统计
    getDispute () {
      this.getDisputeColData();
      this.getAllHos('2')
      this.serverData = [];
      let p = {
        where: {
          condition: this.condition
        }
      }
      if (this.condition === '4') {
        if (this.proYear && this.proMonth) {
          p['where']['time'] = this.proYear + '-' + (this.proMonth * 1 + 1);
        }
      }
      if (this.condition === '5') {
        if (this.proYear && this.proQuarter) {
          p['where']['time'] = this.proYear + '-' + this.proQuarter;
        }
      }
      if (this.condition === '6') {
        if (this.proYear) {
          p['where']['time'] = this.proYear;
        }
      }
      if (this.condition === '0') {
        if (this.visitTime.length) {
          p.where['startTime'] = formatDate(this.visitTime[0]);
          p.where['endTime'] = formatDate(this.visitTime[1]);
        };
      }
      if (this.isHospUser) {
        p.where['hospUid'] = this.$store.state.token.organInfoList[0].uid;
        this.colDataType = 1;
      }
      this.axios.get('/hisServices/statistics/dispute/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.disputeData = res.data;
            res.data.lineChartData.forEach(x => {
              for (let i = 0; i < 6; i++) {
                let o = {};
                o.month = formatDate(x.statisticsDate, 'yyyy-MM-dd');
                if (i === 0) {
                  o.name = '全部纠纷';
                  o.num = x.medicalEthicsCount + x.medicalEnvironmentCount + x.adverseEventCount + x.malpracticeCount + x.otherCount;
                } else if (i === 1) {
                  o.name = '医德医风';
                  o.num = x.medicalEthicsCount;
                } else if (i === 2) {
                  o.name = '就医环境';
                  o.num = x.medicalEnvironmentCount;
                } else if (i === 3) {
                  o.name = '不良事件';
                  o.num = x.adverseEventCount;
                } else if (i === 4) {
                  o.name = '诊疗差错';
                  o.num = x.malpracticeCount;
                } else {
                  o.name = '其他';
                  o.num = x.otherCount;
                }
                this.serverData.push(o);
              }
            })
            this.getDateRate();
          }
        })
    },
    getDisputeColData () {
      this.colDataType = 0;
      let p = {
        where: {
          condition: this.condition
        }
      }
      if (this.condition === '4') {
        if (this.proYear && this.proMonth) {
          p['where']['time'] = this.proYear + '-' + (this.proMonth * 1 + 1);
        }
      }
      if (this.condition === '5') {
        if (this.proYear && this.proQuarter) {
          p['where']['time'] = this.proYear + '-' + this.proQuarter;
        }
      }
      if (this.condition === '6') {
        if (this.proYear) {
          p['where']['time'] = this.proYear;
        }
      }
      if (this.condition === '0') {
        if (this.visitTime.length) {
          p.where['startTime'] = formatDate(this.visitTime[0]);
          p.where['endTime'] = formatDate(this.visitTime[1]);
        };
      }
      if (this.hospitalUid) {
        p.where['hospUid'] = this.hospitalUid;
        this.colDataType = 1;
      }
      if (this.isHospUser) {
        p.where['hospUid'] = this.$store.state.token.organInfoList[0].uid;
        this.colDataType = 1;
      }
      if (this.roomUid) {
        p.where['deptUid'] = this.roomUid;
        this.colDataType = 2;
      }
      this.axios.get('/hisServices/statistics/disputeList/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            if (res.data.pageInfo) {
              this.disputeColDataList = res.data.pageInfo.list;
            } else {
              this.disputeColDataList = [];
            };
            this.allTotal = {
              totalAppointment: res.data.totalAppointment ? res.data.totalAppointment : 0,
              totalAppointmentPrice: res.data.totalAppointmentPrice ? res.data.totalAppointmentPrice : 0,
              totalCancelAppointment: res.data.totalCancelAppointment ? res.data.totalCancelAppointment : 0,
              totalVisit: res.data.totalVisit ? res.data.totalVisit : 0,
              againAppointmentCountAll: res.data.againAppointmentCountAll ? res.data.againAppointmentCountAll : 0,
              againAppointmentPriceAll: res.data.againAppointmentPriceAll ? res.data.againAppointmentPriceAll : 0,
              askCountAll: res.data.askCountAll ? res.data.askCountAll : 0,
              replyCountAll: res.data.replyCountAll ? res.data.replyCountAll : 0,
              visitCountAll: res.data.visitCountAll ? res.data.visitCountAll : 0,
              total: res.data.total ? res.data.total : 0,
              totalAdverseEvent: res.data.totalAdverseEvent ? res.data.totalAdverseEvent : 0,
              totalHopsFinishCount: res.data.totalHopsFinishCount ? res.data.totalHopsFinishCount : 0,
              totalMalpractice: res.data.totalMalpractice ? res.data.totalMalpractice : 0,
              totalMediateFinishCount: res.data.totalMediateFinishCount ? res.data.totalMediateFinishCount : 0,
              totalMedicalEnvironment: res.data.totalMedicalEnvironment ? res.data.totalMedicalEnvironment : 0,
              totalMedicalEthics: res.data.totalMedicalEthics ? res.data.totalMedicalEthics : 0,
              totalOther: res.data.totalOther ? res.data.totalOther : 0,
              totalReportMediate: res.data.totalReportMediate ? res.data.totalReportMediate : 0
            }
          }
        })
    },
    showHospAllDispute () {
      this.sideFiveCurP = 1;
      this.breadList['1'].splice(1);
      this.breadList['1'].push({name: '处理汇总表', sideType: 1, sideCurP: 1});
      let params = {
        where: {
          uid: this.$store.state.token.organInfoList[0].uid
        }
      }
      this.axios.get('/hisServices/scheduling/queryDeptByHospital/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.hospRoomList = res.data.list;
          }
        })
    }, // 医院账号下-获取纠纷总表
    switchCurP (type) {
      this.sideFiveCurP = type;
      if (type === 1) {
        this.breadList['1'].splice(1);
        this.breadList['1'].push({name: '处理汇总表', sideType: 1, sideCurP: 1})
      } else {
        this.breadList['1'].splice(1);
        this.breadList['1'].push({name: '处理汇总表', sideType: 1, sideCurP: 2})
      }
    },
    getDisputeTable () {
      if (this.sideFiveCurP) {
        let params = {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          where: {
            hospUid: this.$store.state.token.organInfoList[0].uid,
            queryType: this.sideFiveCurP
          }
        }
        if (this.hospRoomUid) {
          params.where['deptUid'] = this.hospRoomUid;
        }
        if (this.handleType) {
          params.where['handleType'] = this.handleType;
        }
        if (this.insuranceType) {
          params.where['insuranceType'] = this.insuranceType;
        }
        if (this.disputeTimeRange.length) {
          params.where['startTime'] = formatDate(this.disputeTimeRange[0]);
          params.where['endTime'] = formatDate(this.disputeTimeRange[1]);
        };
        this.axios.get('/hisServices/statistics/disputeHandle/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
          .then(res => {
            if (res) {
              this.disputeAllList = res.data.list;
              this.pagination.pageNum = res.data.pageNum;
              this.pagination.total = res.data.total;
            }
          })
      }
    }, // 医院账号下-获取纠纷总表
    getVHospList () {
      // 获取卫计项目所有卫生院
      let p = {
        pageSize: 0,
        where: {
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.vHospList = res.data.list;
          }
        })
    } // 乡镇卫生院列表
  },
  watch: {
    condition (e) {
      this.proYear = '';
      this.proMonth = '';
      this.proQuarter = '';
      this.hospitalUid = '';
      this.roomUid = '';
      this.compareType = '';
      this.vHospUid = '';
      this.compareToValue = {
        value: ''
      };
      this.visitTime = [];
      this.pagination = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      }
      this.allTotal = {
        totalAppointment: null,
        totalAppointmentPrice: null,
        totalCancelAppointment: null,
        totalVisit: null,
        againAppointmentCountAll: null,
        againAppointmentPriceAll: null,
        askCountAll: null,
        replyCountAll: null,
        visitCountAll: null,
        total: null,
        totalAdverseEvent: null,
        totalHopsFinishCount: null,
        totalMalpractice: null,
        totalMediateFinishCount: null,
        totalMedicalEnvironment: null,
        totalMedicalEthics: null,
        totalOther: null,
        totalReportMediate: null
      }
      if (e === '1' || e === '2' || e === '3') {
        this.sideOneTimeType = '';
        this.getDispute();
        this.getDisputeColData();
        if (this.isHospUser) {
          this.getRoomList(this.$store.state.token.organInfoList[0].uid)
        }
      }
    },
    sideFiveCurP () {
      this.getDisputeTable();
    }
  }
}
</script>
<style scoped="scoped" lang="less">
  .sup-bread{
    padding-bottom: 20px;
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
  .is-inline{
    display: inline-block;
  }
</style>
<style lang="less">
  .my-sta{
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
        padding: 0px;
      }
    }
    .el-table {
      min-height: 0;
    }
    .sup-content{
      min-height:  770px;
      float: left;
      width: 1124px;
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
      .sup-search-s{
        position: relative;
        height: auto;
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
        .sup-age-box{
          width: 100%;
          margin-top: 20px;
          ul{
            width: 100%;
            li{
              float: left;
              width: 340px;
              height: 166px;
              margin-right: 20px;
              margin-bottom: 20px;
              border: 1px solid #E8E8E8;
              text-indent: 20px;
              >h5{
                font-weight: bold;
                color: #1890FF;
                line-height: 50px;
                height: 50px;
                border-bottom: 1px solid #E8E8E8;
              }
              >p{
                color: #666666;
                margin-top: 12px;
                >span{
                  display: inline-block;
                  float: right;
                  color: #FEA025;
                  font-weight: bold;
                  width: 68px;
                }
              }
            }
            li:nth-of-type(3n) {
              margin-right: 0;
            }
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
      position: static;
      margin-bottom: 30px;
    }
    .inner-pagination{
      position: static;
      margin-bottom: 30px;
    }
  }
</style>
