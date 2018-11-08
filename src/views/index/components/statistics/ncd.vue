<template>
  <div class="sup-main my-sta clearfix">
    <div class="sup-bread">
      <i class="iconfont">&#xe6ba;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
      </div>
    </div>
    <!--慢病管理统计-->
    <div class="sup-content-box clearfix">
      <div class="sup-content">
        <div class="sup-search sup-search-s">
          <span style="margin-bottom: 16px;" :class="{'active': condition === '1'}" @click="condition = '1'">本月</span>
          <span :class="{'active': condition === '2'}" @click="condition = '2'">上月</span>
          <span :class="{'active': condition === '3'}" @click="condition = '3'">最近三月</span>
          <el-select style="margin-right: 30px;width: 150px;" v-model="sideOneTimeType" @change="condition = sideOneTimeType" placeholder="请选择">
            <el-option
              v-for="item in timeList1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="is-inline">
            <div v-show="curRole === 0" style="min-width: 200px;"></div>
            <el-select v-show="condition === '4' || condition === '5' || condition === '6'" v-model="proYear" style="width: 120px;margin-right: 30px;" placeholder="请选择年份">
              <el-option
                v-for="item in proYearList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-show="condition === '4'"  v-model="proMonth" style="width: 136px;margin-right: 30px;" placeholder="请选择月份">
              <el-option
                v-for="item in proMonthList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-show="condition === '5'"  v-model="proQuarter" style="width: 136px;margin-right: 30px;" placeholder="请选择季度">
              <el-option
                v-for="item in proQuarterList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="display: inline-block;" v-show="curRole === 0">
            医院：
            <el-select @change="chooseH" v-model="ncdHospUid"  style="width: 136px;margin-right: 30px;" placeholder="请选择">
              <el-option
                :value="null"
                label="全部"
              >
              </el-option>
              <el-option
                v-for="item in hospitalList"
                :key="item.uid"
                :label="item.hospName"
                :value="item.uid">
              </el-option>
            </el-select>
            卫生院：
            <el-select  v-model="ncdVillageUid" @change="chooseV" style="width: 136px;margin-right: 30px;" placeholder="请选择">
              <el-option
                :value="null"
                label="全部"
              >
              </el-option>
              <el-option
                v-for="item in vHospList"
                :key="item.uid"
                :label="item.name"
                :value="item.uid">
              </el-option>
            </el-select>
          </div>
          团队名称：
          <el-select  v-model="ncdTeamUid" style="width: 136px;margin-right: 30px;" placeholder="请选择">
            <el-option
              :value="null"
              label="全部"
            >
            </el-option>
            <el-option
              v-for="item in ncdTeamList"
              :key="item.uid"
              :label="item.teamName"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-button style="position: absolute;right: 0;top: 0;"  @click.native="getNcd" icon="el-icon-search">统计</el-button>
        </div>
        <div class="sup-color-box clearfix">
          <div class="color-box-1" style="margin-bottom: 20px;width: 250px">
            <p>签约人次 <span>  {{ncdData.signedCount | fmTenThousand}}</span></p>
            <p>累计： {{ncdData.accSignedCount | fmTenThousand}}</p>
          </div>
          <div class="color-box-2" style="margin-bottom: 20px;width: 250px">
            <p>复签人次 <span>  {{ncdData.signedRepeatCount | fmTenThousand}}</span></p>
            <p>累计： {{ncdData.accSignedRepeatCount | fmTenThousand}}</p>
          </div>
          <div class="color-box-3" style="margin-bottom: 20px;width: 250px">
            <p>签约总金额 <span>  {{ncdData.signedPrice | fmTenThousand}}</span></p>
            <p>累计：{{ncdData.accSignedPrice | fmTenThousand}}</p>
          </div>
          <div class="color-box-4" style="margin-bottom: 20px;width: 250px;margin-right: 0px;">
            <p>实收总金额 <span>  {{ncdData.payPrice | fmTenThousand}}</span></p>
            <p>累计：{{ncdData.accPayPrice | fmTenThousand}}</p>
          </div>
          <div class="color-box-5" style="width: 250px;">
            <p>结案人次 <span>  {{ncdData.closeCaseCount | fmTenThousand}}</span></p>
            <p>累计：{{ncdData.accCloseCaseCount | fmTenThousand}}</p>
          </div>
          <div class="color-box-6" style="width: 250px">
            <p>家庭医生数 <span>  {{ncdData.createTeamMemberCount | fmTenThousand}}</span></p>
            <p>累计：{{ncdData.accCreateTeamMemberCount | fmTenThousand}}</p>
          </div>
          <div class="color-box-7" style="width: 250px" v-if="isTeamShow">
            <p>团队数 <span>  {{ncdData.createTeamCount | fmTenThousand}}</span></p>
            <p>累计：{{ncdData.accCreateTeamCount | fmTenThousand}}</p>
          </div>
          <div class="color-box-8" style="width: 250px;margin-right: 0px;"  v-if="isShow">
            <p>开通家庭医生机构数 <span>  {{ncdData.openDocHospCount | fmTenThousand}}</span></p>
            <p>累计：{{ncdData.accOpenDocHospCount | fmTenThousand}}</p>
          </div>
        </div>
        <div class="sup-reg-type">
          <p>人员类别统计<span>（{{timeRate}}{{showTeamName}}）</span></p>
          <div is="gFlod" :charData="serverData" :color="'#1890FF-#FEBC25'" :id="'c2'"></div>
        </div>
        <!--服务包签约统计-->
        <div class="sup-reg-type">
          <p style="margin-top: 0;border-top: 1px dashed #999999;">服务包签约统计<span>（{{timeRate}}{{showTeamName}}）</span></p>
          <el-table
            :data="ncdServiceData.list"
            key="tabel1245"
            stripe
            style="width: 100%;">
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              width="105">
            </el-table-column>
            <el-table-column
              prop="packName"
              width="325"
              label="服务包名称">
              <template slot-scope="scope">
                {{scope.row.packName}}({{scope.row.packYear}})
              </template>
            </el-table-column>
            <el-table-column
              prop="packStatus"
              width="140"
              label="状态">
              <template slot-scope="scope">
                {{scope.row.packStatus === '2' ? '已上线' : '已下线'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="signedCount"
              width="226"
              label="签约人次">
            </el-table-column>
            <el-table-column
              prop="signedRepeatCount"
              width="266"
              label="其中复签人次">
            </el-table-column>
          </el-table>
          <div v-show="ncdServiceData.total > 10" class="pagination-box inner-pagination">
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
        <!--签约情况统计-->
        <div class="sup-reg-type" v-if="curRole === 0">
          <p style="margin-top: 0;border-top: 1px dashed #999999;">签约情况统计</p>
          <span >截止年度:</span>
          <el-select v-model="ncdYear" style="width: 200px;margin-right: 30px;" placeholder="请选择">
            <el-option
              v-for="item in proYearList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button :disabled="!ncdYear" style="margin-left: 30px" @click.native="getAgeUser" icon="el-icon-search">统计</el-button>
          <div class="sup-age-box">
            <ul class="clearfix">
              <li>
                <h5>儿童签约情况</h5>
                <p>辖区内0-6岁儿童数(人)<span>{{parseInt(ncdSignData.signedChildrenNum) ? ncdSignData.signedChildrenNum : '--' | fmTenThousand }}</span></p>
                <p>0-6岁儿童签约数(人)<span>{{parseInt(ncdSignData.signedChildrenCount) ? ncdSignData.signedChildrenCount : '--' | fmTenThousand}}</span></p>
                <p>0-6岁儿童签约率(%)<span>{{parseInt(ncdSignData.signedChildrenPercent) ? ncdSignData.signedChildrenPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>老年人签约情况</h5>
                <p>辖区内65岁及以上常住居民数(人)<span>{{parseInt(ncdSignData.signedAgedNum) ? ncdSignData.signedAgedNum : '--' | fmTenThousand}}</span></p>
                <p>65岁及以上常住居民签约数(人)<span>{{parseInt(ncdSignData.signedAgedCount) ? ncdSignData.signedAgedCount : '--' | fmTenThousand}}</span></p>
                <p>65岁及以上常住居民签约率(%)<span>{{parseInt(ncdSignData.signedAgedPercent) ? ncdSignData.signedAgedPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>孕产妇签约情况</h5>
                <p>孕产妇建册数(人)<span>{{parseInt(ncdSignData.signedMaternalNum) ? ncdSignData.signedMaternalNum : '--' | fmTenThousand}}</span></p>
                <p>孕产妇签约数(人)<span>{{parseInt(ncdSignData.signedMaternalCount) ? ncdSignData.signedMaternalCount : '--' | fmTenThousand}}</span></p>
                <p>孕产妇签约率(%)<span>{{parseInt(ncdSignData.signedMaternalPercent) ? ncdSignData.signedMaternalPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>高血压患者签约情况</h5>
                <p>辖区内已管理的高血压患者数(人)<span>{{parseInt(ncdSignData.signedHypertensionNum) ? ncdSignData.signedHypertensionNum : '--' | fmTenThousand}}</span></p>
                <p>高血压患者签约数(人)<span>{{parseInt(ncdSignData.signedHypertensionCount) ? ncdSignData.signedHypertensionCount : '--' | fmTenThousand}}</span></p>
                <p>高血压患者签约率(%)<span>{{parseInt(ncdSignData.signedHypertensionPercent) ? ncdSignData.signedHypertensionPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>糖尿病患者签约情况</h5>
                <p>辖区内已管理的糖尿病患者数(人)<span>{{parseInt(ncdSignData.signedDiabetesNum) ? ncdSignData.signedDiabetesNum : '--' | fmTenThousand}}</span></p>
                <p>糖尿病患者签约数(人)<span>{{parseInt(ncdSignData.signedDiabetesCount) ? ncdSignData.signedDiabetesCount : '--' | fmTenThousand}}</span></p>
                <p>糖尿病患者签约率(%)<span>{{parseInt(ncdSignData.signedDiabetesPercent) ? ncdSignData.signedDiabetesPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>结核病患者签约情况</h5>
                <p>辖区内已管理的肺结核病患者数(人)<span>{{parseInt(ncdSignData.signedTbNum) ? ncdSignData.signedTbNum : '--' | fmTenThousand}}</span></p>
                <p>肺结核患者签约数(人)<span>{{parseInt(ncdSignData.signedTbCount) ? ncdSignData.signedTbCount : '--' | fmTenThousand}}</span></p>
                <p>肺结核患者签约率(%)<span>{{parseInt(ncdSignData.signedTbPercent) ? ncdSignData.signedTbPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>严重精神障碍患者签约情况</h5>
                <p>辖区内规范管理的严重精神障碍患者(人)<span>{{parseInt(ncdSignData.signedAlleosisNum) ? ncdSignData.signedAlleosisNum : '--' | fmTenThousand}}</span></p>
                <p>严重精神障碍患者签约数(人)<span>{{parseInt(ncdSignData.signedAlleosisCount) ? ncdSignData.signedAlleosisCount : '--' | fmTenThousand}}</span></p>
                <p>严重精神障碍患者签约率(%)<span>{{parseInt(ncdSignData.signedAlleosisPercent) ? ncdSignData.signedAlleosisPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>残疾人签约情况</h5>
                <p>辖区内残疾人数(人)<span>{{parseInt(ncdSignData.signedDisabledNum) ? ncdSignData.signedDisabledNum : '--' | fmTenThousand}}</span></p>
                <p>残疾人签约数(人)<span>{{parseInt(ncdSignData.signedDisabledCount) ? ncdSignData.signedDisabledCount : '--' | fmTenThousand}}</span></p>
                <p>残疾人签约率(%)<span>{{parseInt(ncdSignData.signedDisabledPercent) ? ncdSignData.signedDisabledPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>农村建档立卡贫困人签约情况</h5>
                <p>农村建档立卡贫困人口数(人)<span>{{parseInt(ncdSignData.signedCardNum) ? ncdSignData.signedCardNum : '--' | fmTenThousand}}</span></p>
                <p>建档立卡贫困人口签约数(人)<span>{{parseInt(ncdSignData.signedCardCount) ? ncdSignData.signedCardCount : '--' | fmTenThousand}}</span></p>
                <p>建档立卡贫困人口签约率(%)<span>{{parseInt(ncdSignData.signedCardPercent) ? ncdSignData.signedCardPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>计划生育特殊家庭签约情况</h5>
                <p>辖区内计划生育特殊家庭人数(人)<span>{{parseInt(ncdSignData.signedFamilyNum) ? ncdSignData.signedFamilyNum : '--' | fmTenThousand}}</span></p>
                <p>计划生育特殊家庭自愿签约数(人)<span>{{parseInt(ncdSignData.signedFamilyCount) ? ncdSignData.signedFamilyCount : '--' | fmTenThousand}}</span></p>
                <p>计划生育特殊家庭自愿签约率(%)<span>{{parseInt(ncdSignData.signedFamilyPercent) ? ncdSignData.signedFamilyPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>城乡低保五保人口</h5>
                <p>城乡低保五保人口数(人)<span>{{parseInt(ncdSignData.signedFiveNum) ? ncdSignData.signedFiveNum : '--' | fmTenThousand}}</span></p>
                <p>城乡低保五保人口签约数(人)<span>{{parseInt(ncdSignData.signedFiveCount) ? ncdSignData.signedFiveCount : '--' | fmTenThousand}}</span></p>
                <p>城乡低保五保人口签约率(%)<span>{{parseInt(ncdSignData.signedFivePercent) ? ncdSignData.signedFivePercent : '--'}}</span></p>
              </li>
              <li>
                <h5>重点人群签约情况</h5>
                <p>重点人群数(人)<span>{{parseInt(ncdSignData.signedCrowdNum) ? ncdSignData.signedCrowdNum : '--' | fmTenThousand}}</span></p>
                <p>重点人群签约数(人)<span>{{parseInt(ncdSignData.signedCrowdCount) ? ncdSignData.signedCrowdCount : '--' | fmTenThousand}}</span></p>
                <p>重点人群签约率(%)<span>{{parseInt(ncdSignData.signedCrowdPercent) ? ncdSignData.signedCrowdPercent : '--'}}</span></p>
              </li>
              <li>
                <h5>其他重点人群签约情况</h5>
                <p>其他重点人群数(人)<span>{{parseInt(ncdSignData.signedOtherCrowdNum) ? ncdSignData.signedOtherCrowdNum : '--' | fmTenThousand}}</span></p>
                <p>其他重点人群签约数(人)<span>{{parseInt(ncdSignData.signedOtherCrowdCount) ? ncdSignData.signedOtherCrowdCount : '--' | fmTenThousand}}</span></p>
                <p>其他重点人群签约率(%)<span>{{parseInt(ncdSignData.signedOtherCrowdPercent) ? ncdSignData.signedOtherCrowdPercent : '--'}}</span></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {formatDate} from '@/utils/util.js';
import gFlod from '@/components/common/g2-fold.vue';
import G2 from '@antv/g2';
import {View, DataSet} from '@antv/data-set'
export default {
  components: {
    gFlod
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
          {name: '慢病管理统计', sideType: 1, sideCurP: 0}
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
      // 慢病统计
      ncdData: {}, // 慢病管理统计数据
      ncdServiceData: {}, // 慢病服务包数据
      ncdPersonData: {}, // 慢病人员类别数据
      ncdSignData: {}, // 慢病签约数据
      ncdHospUid: '', // 慢病医院id
      ncdVillageUid: '', // 慢病卫生院id
      ncdTeamUid: '', // 慢病团队id
      ncdTeamList: [], // 团队列表
      ncdYear: '' // 截止年度
    }
  },
  created () {
    console.log(',ad', gFlod)
    this.getRole();
  },
  mounted () {
    this.getNcd();
    if (this.curRole === 0) {
      this.axios.get('/hisServices/scheduling/queryHospitalList', {params: {businessType: '1'}})
        .then(res => {
          if (res) {
            this.hospitalList = res.data;
          }
        })
      let params = {
        pageSize: 0,
        where: {}
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.vHospList = res.data.list;
          }
        })
      let params1 = {
        pageSize: 0,
        where: {
          type: '0'
        }
      }
      this.getTeams(params1);
    } else if (this.curRole === 1) {
      let params = {
        pageSize: 0,
        where: {
          type: '0',
          hospUid: this.$store.state.token.organInfoList[0].uid
        }
      }
      this.getTeams(params);
    } else if (this.curRole === 2) {
      let params = {
        pageSize: 0,
        where: {
          type: '0',
          townshipHospUid: this.$store.state.token.organInfoList[0].uid
        }
      }
      this.getTeams(params);
    }
    this.getCurYear();
    if (this.curRole === 0) {
      this.getAllHos();
      this.getVHospList();
    } else if (this.curRole === 3) {
      this.getAllHos();
    }
  },
  methods: {
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
    indexMethod (index) {
      return index + 1 + this.pagination.pageSize * (this.pagination.pageNum - 1);
    },
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
      if (this.sideType === 6) {
        this.getOverdue();
      } else if (this.sideType === 5) {
        this.getDisputeColData();
      } else if (this.sideType === 7) {
        let p = {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          where: {
            condition: this.condition,
            type: this.isHospUser ? '4' : this.isVillageUser ? '3' : '0',
            userUid: this.$store.state.token.uid
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
        if (this.ncdHospUid) {
          p.where['hospUid'] = this.ncdHospUid;
        }
        if (this.ncdVillageUid) {
          p.where['townHospUid'] = this.ncdVillageUid;
        }
        if (this.ncdTeamUid) {
          p.where['teamUid'] = this.ncdTeamUid;
        }
        if (this.isHospUser) {
          p.where['hospUid'] = this.$store.state.token.organInfoList[0].uid;
        }
        if (this.isVillageUser) {
          p.where['townHospUid'] = this.$store.state.token.organInfoList[0].uid;
        }
        this.axios.get('/hisServices/statistics/statisticsChronicPack/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
          .then(res => {
            if (res) {
              this.ncdServiceData = res.data;
              this.pagination.pageNum = res.data.pageNum;
              this.pagination.total = res.data.total;
            }
          })
      }
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      if (this.sideType === 6) {
        this.getOverdue();
      } else if (this.sideType === 5) {
        if (this.sideFiveCurP === 0) {
          this.getDisputeColData();
        } else {
          this.getDisputeTable();
        }
      } else if (this.sideType === 7) {
        let p = {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          where: {
            condition: this.condition,
            type: this.isHospUser ? '4' : this.isVillageUser ? '3' : '0',
            userUid: this.$store.state.token.uid
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
        if (this.ncdHospUid) {
          p.where['hospUid'] = this.ncdHospUid;
        }
        if (this.ncdVillageUid) {
          p.where['townHospUid'] = this.ncdVillageUid;
        }
        if (this.ncdTeamUid) {
          p.where['teamUid'] = this.ncdTeamUid;
        }
        if (this.isHospUser) {
          p.where['hospUid'] = this.$store.state.token.organInfoList[0].uid;
        }
        if (this.isVillageUser) {
          p.where['townHospUid'] = this.$store.state.token.organInfoList[0].uid;
        }
        this.axios.get('/hisServices/statistics/statisticsChronicPack/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
          .then(res => {
            if (res) {
              this.ncdServiceData = res.data;
              this.pagination.pageNum = res.data.pageNum;
              this.pagination.total = res.data.total;
            }
          })
      }
    },
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
    }, // 乡镇卫生院列表
    // 慢病统计
    getNcd () {
      this.isTeamShow = true;
      this.showTeamName = '';
      if (this.isHospUser || this.isVillageUser) {
        this.isShow = false;
      } else {
        if (this.ncdTeamUid || this.ncdVillageUid || this.ncdHospUid) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      }
      if (this.ncdTeamUid) {
        this.isTeamShow = false;
        this.showTeamName += '；' + this.ncdTeamList.find(x => x.uid === this.ncdTeamUid).teamName;
      }
      this.serverData = [];
      this.getDateRate();
      let p = {
        where: {
          condition: this.condition,
          type: this.isHospUser ? '4' : this.isVillageUser ? '3' : '0',
          userUid: this.$store.state.token.uid
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
      if (this.ncdHospUid) {
        p.where['hospUid'] = this.ncdHospUid;
      }
      if (this.ncdVillageUid) {
        p.where['townHospUid'] = this.ncdVillageUid;
      }
      if (this.ncdTeamUid) {
        p.where['teamUid'] = this.ncdTeamUid;
      }
      if (this.isHospUser) {
        p.where['hospUid'] = this.$store.state.token.organInfoList[0].uid;
      }
      if (this.isVillageUser) {
        p.where['townHospUid'] = this.$store.state.token.organInfoList[0].uid;
      }
      this.axios.get('/hisServices/statistics/statisticsChronicTeam/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.ncdData = res.data;
          }
        })
      this.axios.get('/hisServices/statistics/statisticsChronicPack/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.ncdServiceData = res.data;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          }
        })
      this.axios.get('/hisServices/statistics/statisticsChronicUser/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.ncdPersonData = res.data;
            for (let i = 0; i < 2; i++) {
              let o = {};
              if (i === 0) {
                o['name'] = '首签人次';
                o['儿童'] = res.data.signedChildrenCount ? res.data.signedChildrenCount - res.data.signedRepeatChildrenCount : 0;
                o['老年人'] = res.data.signedAgedCount ? res.data.signedAgedCount - res.data.signedRepeatAgedCount : 0;
                o['孕产妇'] = res.data.signedMaternalCount ? res.data.signedMaternalCount - res.data.signedRepeatMaternalCount : 0;
                o['高血压'] = res.data.signedHypertensionCount ? res.data.signedHypertensionCount - res.data.signedRepeatHypertensioCount : 0;
                o['糖尿病'] = res.data.signedDiabetesCount ? res.data.signedDiabetesCount - res.data.signedRepeatDiabetesCount : 0;
                o['结核病'] = res.data.signedTbCount ? res.data.signedTbCount - res.data.signedRepeatTbCount : 0;
                o['严重精神障碍'] = res.data.signedAlleosisCount ? res.data.signedAlleosisCount - res.data.signedRepeatAlleosisCount : 0;
                o['残疾人'] = res.data.signedDisabledCount ? res.data.signedDisabledCount - res.data.signedRepeatDisabledCount : 0;
                o['农村建档立卡贫困人'] = res.data.signedCardCount ? res.data.signedCardCount - res.data.signedRepeatCardCount : 0;
                o['计划生育特殊家庭'] = res.data.signedFamilyCount ? res.data.signedFamilyCount - res.data.signedRepeatFamilyCount : 0;
                o['城乡低保五保人口'] = res.data.signedFiveCount ? res.data.signedFiveCount - res.data.signedRepeatFiveCount : 0;
                o['重点人群'] = res.data.signedCrowdCount ? res.data.signedCrowdCount - res.data.signedRepeatCrowdCount : 0;
                o['其他重点人群'] = res.data.signedOtherCrowdCount ? res.data.signedOtherCrowdCount - res.data.signedRepeatOtherCrowdCount : 0;
              } else {
                o['name'] = '复签人次';
                o['儿童'] = res.data.signedRepeatChildrenCount ? res.data.signedRepeatChildrenCount : 0;
                o['老年人'] = res.data.signedRepeatAgedCount ? res.data.signedRepeatAgedCount : 0;
                o['孕产妇'] = res.data.signedRepeatMaternalCount ? res.data.signedRepeatMaternalCount : 0;
                o['高血压'] = res.data.signedRepeatHypertensioCount ? res.data.signedRepeatHypertensioCount : 0;
                o['糖尿病'] = res.data.signedRepeatDiabetesCount ? res.data.signedRepeatDiabetesCount : 0;
                o['结核病'] = res.data.signedRepeatTbCount ? res.data.signedRepeatTbCount : 0;
                o['严重精神障碍'] = res.data.signedRepeatAlleosisCount ? res.data.signedRepeatAlleosisCount : 0;
                o['残疾人'] = res.data.signedRepeatDisabledCount ? res.data.signedRepeatDisabledCount : 0;
                o['农村建档立卡贫困人'] = res.data.signedRepeatCardCount ? res.data.signedRepeatCardCount : 0;
                o['计划生育特殊家庭'] = res.data.signedRepeatFamilyCount ? res.data.signedRepeatFamilyCount : 0;
                o['城乡低保五保人口'] = res.data.signedRepeatFiveCount ? res.data.signedRepeatFiveCount : 0;
                o['重点人群'] = res.data.signedRepeatCrowdCount ? res.data.signedRepeatCrowdCount : 0;
                o['其他重点人群'] = res.data.signedRepeatOtherCrowdCount ? res.data.signedRepeatOtherCrowdCount : 0;
              }
              this.serverData.push(o);
            }
            console.log(this.serverData)
          }
        })
    },
    getTeams (params) {
      this.ncdTeamList = []
      if (this.isHospUser) {
        params.where['guideStatus'] = '1';
        this.axios.get('/hisServices/chronic/teamGuides/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
          .then(res => {
            if (res) {
              res.data.list.forEach(m => {
                this.ncdTeamList.push(m.team)
              })
            }
          })
      } else {
        this.axios.get('/hisServices/chronic/teams/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
          .then(res => {
            if (res) {
              this.ncdTeamList = res.data.list;
            }
          })
      }
    },
    getAgeUser () {
      let params = {
        year: this.ncdYear
      }
      this.axios.get('/hisServices/statistics/chronicStatisticsByYear/', {params})
        .then(res => {
          if (res) {
            this.ncdSignData = res.data;
          } else {
            this.ncdSignData = {};
          }
        })
    },
    chooseH () {
      this.ncdTeamUid = '';
      this.ncdVillageUid = '';
      let params = {
        pageSize: 0,
        where: {
          hospUid: this.ncdHospUid
        }
      }
      if (this.ncdHospUid) {
        this.getTeams(params);
      }
    },
    chooseV () {
      this.ncdTeamUid = '';
      this.ncdHospUid = '';
      let params = {
        pageSize: 0,
        where: {
          townshipHospUid: this.ncdVillageUid
        }
      }
      if (this.ncdVillageUid) {
        this.getTeams(params);
      }
    }
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
        this.getNcd();
        if (this.curRole === 0) {
          this.axios.get('/hisServices/scheduling/queryHospitalList', {params: {businessType: '1'}})
            .then(res => {
              if (res) {
                this.hospitalList = res.data;
              }
            })
          let params = {
            pageSize: 0,
            where: {}
          }
          this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
            .then(res => {
              if (res) {
                this.vHospList = res.data.list;
              }
            })
        } else if (this.curRole === 1) {
          let params = {
            pageSize: 0,
            where: {
              hospUid: this.$store.state.token.organInfoList[0].uid
            }
          }
          this.getTeams(params);
        } else if (this.curRole === 2) {
          let params = {
            pageSize: 0,
            where: {
              townshipHospUid: this.$store.state.token.organInfoList[0].uid
            }
          }
          this.getTeams(params);
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
