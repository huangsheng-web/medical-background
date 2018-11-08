<template>
  <div class="sup-main my-sup-b clearfix">
    <div class="sup-bread">
      <i class="iconfont">&#xe699;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
      </div>
    </div>
    <!--村医卡号维护-->
    <div class="sup-content-box clearfix">
      <div class="sup-content" v-show="sideFourCurP === 1">
        <div class="village-type">
          <span :class="{'active': villageType === 0}" @click="villageType = 0">村医列表</span>
          <span :class="{'active': villageType === 1}" @click="villageType = 1">待审核</span>
          <span :class="{'active': villageType === 2}" @click="villageType = 2">审核不通过</span>
        </div>
        <div class="sup-search">
          乡镇卫生院:
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="villageHos"
            @focus="isDown = true"
            @blur="isDown = false"
            :fetch-suggestions="querySearch4"
            placeholder="请输入内容"
            @select="getDrugVillageList">
            <i
              :class="{'is-down': isDown}"
              class="el-icon-arrow-down el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
          村卫生室:
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="villageRoom"
            @focus="isDown1 = true"
            @blur="isDown1 = false"
            :fetch-suggestions="querySearch5"
            placeholder="请输入内容"
            @select="handleSelect">
            <i
              :class="{'is-down': isDown1}"
              class="el-icon-arrow-down el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
          <el-button @click="getVillageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="villageCardNoList"
          key="tabel17"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="176">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            label="乡镇卫生院"
            min-width="176">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            min-width="176"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="name"
            width="176"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="bankAccount"
            min-width="176"
            :show-overflow-tooltip="true"
            label="一卡通账号">
          </el-table-column>
          <el-table-column
            prop="status"
            width="176"
            label="状态">
            <template slot-scope="scope">
              <p v-if="scope.row.status === '3' || scope.row.status === '5' || scope.row.status === '6' || scope.row.status === '8'" >已审核</p>
              <p v-else>{{villageStatus[scope.row.status]}}</p>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="sup-content" v-show="sideFourCurP === 2">
        <div class="village-type">
          <span :class="{'active': villageType === 0}" @click="villageType = 0">村医列表</span>
          <span :class="{'active': villageType === 1}" @click="villageType = 1">待审核</span>
          <span :class="{'active': villageType === 2}" @click="villageType = 2">审核不通过</span>
        </div>
        <div class="sup-search">
          乡镇卫生院:
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="villageHos"
            @focus="isDown = true"
            @blur="isDown = false"
            :fetch-suggestions="querySearch4"
            placeholder="请输入内容"
            @select="getDrugVillageList">
            <i
              :class="{'is-down': isDown}"
              class="el-icon-arrow-down el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
          村卫生室:
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="villageRoom"
            @focus="isDown1 = true"
            @blur="isDown1 = false"
            :fetch-suggestions="querySearch5"
            placeholder="请输入内容"
            @select="handleSelect">
            <i
              :class="{'is-down': isDown1}"
              class="el-icon-arrow-down el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
          <el-button @click="getVillageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="villageCardNoList"
          key="tabel18"
          stripe
          :show-overflow-tooltip="true"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="150">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            label="乡镇卫生院"
            width="156">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            width="150"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="name"
            width="150"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="operationType"
            width="150"
            label="操作类别">
            <template slot-scope="scope">
              {{oType[scope.row.operationType]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="submitTime"
            width="150"
            label="提交时间">
            <template slot-scope="scope">
              {{scope.row.submitTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <span class="pay-online" @click="villageExamine(scope.row, 1)">审核</span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="sup-content" v-show="sideFourCurP === 3">
        <div class="village-type">
          <span :class="{'active': villageType === 0}" @click="villageType = 0">村医列表</span>
          <span :class="{'active': villageType === 1}" @click="villageType = 1">待审核</span>
          <span :class="{'active': villageType === 2}" @click="villageType = 2">审核不通过</span>
        </div>
        <div class="sup-search">
          乡镇卫生院:
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="villageHos"
            @focus="isDown = true"
            @blur="isDown = false"
            :fetch-suggestions="querySearch4"
            placeholder="请输入内容"
            @select="getDrugVillageList">
            <i
              :class="{'is-down': isDown}"
              class="el-icon-arrow-down el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
          村卫生室:
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="villageRoom"
            @focus="isDown1 = true"
            @blur="isDown1 = false"
            :fetch-suggestions="querySearch5"
            placeholder="请输入内容"
            @select="handleSelect">
            <i
              :class="{'is-down': isDown1}"
              class="el-icon-arrow-down el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
          <el-button @click="getVillageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="villageCardNoList"
          key="tabel18"
          stripe
          :show-overflow-tooltip="true"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="132">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            label="乡镇卫生院"
            width="132">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            width="132"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="name"
            width="132"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="operationType"
            width="132"
            label="操作类别">
            <template slot-scope="scope">
              {{oType[scope.row.operationType]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="submitTime"
            width="132"
            label="提交时间">
            <template slot-scope="scope">
              {{scope.row.submitTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="reviewTime"
            width="132"
            label="审核时间">
            <template slot-scope="scope">
              {{scope.row.submitTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="132">
            <template slot-scope="scope">
              <span class="pay-online" @click="villageExamine(scope.row, 2)">查看</span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
    </div>
    <!--查看大图-->
    <div class="show-big-pic" v-show="showBigPic" @click="showBigPic = false">
      <img :src="bigPicUrl" alt="">
    </div>
    <!--分页-->
    <div class="pagination-box" v-if="pagination.total">
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
    <!--村医卡号维护-->
    <el-dialog
      :title="vCardNoDialogType === 2 ? '查看村医信息': vDocCardNoData.operationType === '0' ? '新增村医审核' : vDocCardNoData.operationType === '1' ? '修改村医审核' : '删除村医审核'"
      :visible.sync="villageCardNoDialog"
      width="750px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <div class="has-color">
            <span>村卫生室:{{vDocCardNoData.villageClinicName}}</span><span>村医姓名:{{vDocCardNoData.name}}</span><span  style="margin-right: 0">一卡通账号:{{vDocCardNoData.bankAccount}}</span>
            <p v-show="vDocCardNoData.operationType !== '1'">备注：{{vDocCardNoData.description}}</p>
          </div>
        </div>
        <div class="town-entry-row" v-show="vDocCardNoData.operationType === '1'">
          <div class="has-color">
            <h5>【提交信息】</h5>
            <span>村卫生室:{{vDocCardNoData.villageClinicName}}</span><span>村医姓名:{{vDocCardNoData.name}}</span><span style="margin-right: 0">一卡通账号:{{vDocCardNoData.newBankAccount}}</span>
            <p>备注：{{vDocCardNoData.description}}</p>
          </div>
        </div>
        <div class="town-entry-row" v-show="vCardNoDialogType === 1">
          <p style="margin-bottom: 14px;"><el-radio v-model="vCardradio" label="1">通过</el-radio></p>
          <p><el-radio v-model="vCardradio" label="2">不通过</el-radio><el-input style="width: 595px;margin-left: 10px;" v-model="vCardMes" placeholder="请填写不通过原因"></el-input></p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="vCardNoDialogType === 1 || vCardMes === ''">
        <el-button type="primary" v-if="vCardradio === 0" disabled>确定</el-button>
        <el-button type="primary" v-if="vCardradio === '1'" @click="confirmVCardInfo">确定</el-button>
        <el-button type="primary" v-if="vCardradio === '2'" :disabled="!vCardMes" @click="confirmVCardInfo">确定</el-button>
        <el-button @click="villageCardNoDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ElementUI from 'element-ui'
export default {
  data () {
    return {
      exportProYear: [],
      exportBaseParams: {
        where: {
          type: '',
          year: '',
          quarter: '',
          month: ''
        }
      },
      exportDialog: false,
      exportDrugDialog: false,
      exportDrugVDialog: false,
      tipDialog: false,
      tipDialogMsg: '',
      tipDialogUid: '',
      tipType: 0, // 0 逾期提交，1能否修改
      isDown: false, // 模糊搜索卫生院之类的，是否获取焦点，箭头向下
      isDown1: false,
      allTotal: {
        totalActualAmount: null,
        totalBudgetAmount: null,
        totalDoctorActualAmount: null,
        totalDoctorBudgetAmount: null,
        totalHospActualAmount: null,
        totalHospBudgetAmount: null,
        totalVillageClinic: null,
        totalNum: null,
        totalTownshipHosp: null,
        totalDocActualAmount: null,
        totalDocBudgetAmount: null,
        totalClinicNum: null,
        totalDoctorNum: null
      },
      breadList: {
        '1': [
          {name: '卫计项目投入监测', sideType: 1, sideCurP: 1}
        ],
        '2': [
          {name: '基本公卫服务补助', sideType: 2, sideCurP: 1}
        ],
        '3': [
          {name: '基本药物制度补助-卫生院补助', sideType: 3, sideCurP: 1}
        ],
        '4': [
          {name: '基本药物制度补助-村卫生室补助', sideType: 4, sideCurP: 1}
        ],
        '5': [
          {name: '村医卡号维护', sideType: 5, sideCurP: 1}
        ]
      },
      sideType: 1,
      pagination: { // 分页
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      },
      showBigPic: false, // 查看大图
      bigPicUrl: '',
      quotaNum: '', // 搜索
      proState: '', // 搜索
      proYearList: [], // 搜索
      proYear: '', // 搜索
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
      proStateList: [
        {label: '未发布', value: '0'},
        {label: '进行中', value: '1'},
        {label: '已完成', value: '2'},
        {label: '已逾期', value: '3'}
      ],
      // 卫计项目
      curTownUnentryHosp: [],
      sideOneCurP: 1, // 1卫计项目列表，2新增卫计项目，3卫计项目预算详情，4卫计项目执行详情,5卫计项目卫生院预算详情
      proName: '', // 卫计搜索
      statusColor: {
        '0': '#FB8C00',
        '1': '#1890FF',
        '2': '#1890FF',
        '3': '#EF5555'
      },
      proCurStates: {
        '0': '未发布',
        '1': '进行中',
        '2': '已完成',
        '3': '已逾期'
      }, // 后台数据项目状态
      proList: [], // 卫计列表
      addNewDetail: {
        name: '', // 名称
        year: '', // 年度
        quotaNum: '', // 指标文号
        appropriateTime: '', // 预拨时间
        deadlineTime: '', // 截止时间
        budgetAmount: '', // 预算总金额
        requirements: '' // 要求
      }, // 卫计新增详情
      townsHospList: [],
      curTownHospList: [],
      hospitalExeUid: '', // 预算/执行详情当前搜索卫生院
      executeStatus: '', // 执行详情搜索状态
      totalInfo: {
        totalNum: 0,
        totalBudgetAmount: 0,
        totalActualAmount: 0
      }, // 预算详情，执行详情里的总额等数据,tabel最底部一行数据
      executeStatusList: [
        {label: '未提交', value: '0'},
        {label: '已提交', value: '1'}
      ], // 执行详情搜索状态列表
      townHospEntryDialog: false, // 录入乡镇卫生院预算
      townHospEntryData: {
        uid: '',
        hospList: [],
        budgetAmount: '',
        deadlineTime: '',
        requirements: ''
      }, // 乡镇卫生院录入预算
      budgetTownHospList: [], // 预算详情卫生院列表
      executeTownHospList: [], // 执行详情卫生院列表
      townHospEntryCanSelect: false, // 修改预算，-录入预算是true
      isChange: '0', // 能否修改 默认不能
      isSubmit: '0', // 能否提交 默认不能
      townHospDetail: {}, // 执行详情中，卫生院详情
      isAllEntry: false, // 预算详情里是否全部已录入了预算，为true是可以发布项目
      // 基础公卫
      sideTwoCurP: 1,
      baseYearList: [], // 基础公卫搜索
      baseQuarter: '', // 基础公卫搜索
      baseCurQuarterList: [],
      baseQuarterList: [
        {label: '1季度', value: '1'},
        {label: '2季度', value: '2'},
        {label: '年终考核', value: '9'}
      ], // 基础搜索
      baseList: [], // 基础公卫列表
      baseHospitalExeUid: '', // 基础，预算、执行详情当前搜索卫生院
      addBaseNewDetail: {
        name: '基础公卫服务补助', // 名称
        year: '', // 年度
        quotaNum: '', // 指标文号
        appropriateTime: '', // 预拨时间
        deadlineTime: '', // 截止时间
        quarter: '', // 项目季度
        budgetAmount: '', // 预算总金额
        requirements: '' // 要求
      }, // 基础公卫新增详情
      townsBaseHospList: [],
      curBaseTownHospList: [],
      addBaseYear: '',
      addBaseQuarter: '',
      baseExpectTime: '',
      baseEndTime: '',
      curHospDetail: {}, // 当前卫生院详情
      curVillageHospList: [], // 当前预算，执行的村卫生室列表
      villageHosPListData: [], // 预算，执行的村卫生室分页列表数据；
      vHospitalExeUid: '', // 当前选中村卫生室
      villageEntryDialog: false,
      canSelectVillage: false, // 是否禁用录入预算卫生院下拉
      budgetEntryData: {
        uid: '',
        hospitalExeUid: '',
        budgetAmount: '',
        hospBudgetAmount: '',
        doctorBudgetAmount: ''
      }, // 录入预算的数据
      baseEntryHospList: [], // 录入预算卫生院下拉列表
      villageHospUnselect: [], // 录入预算村卫生室列表
      villageHospSelected: [], // 录入预算村卫生室已选择的。
      baseExecuteStatus: '', // 基础 执行详情中的搜索状态
      baseIsChange: '0', // 能否修改 默认不能
      baseIsSubmit: '0', // 能否提交 默认不能
      baseBudgetTownHospList: [], // 预算详情卫生院列表
      baseExecuteTownHospList: [], // 执行详情卫生院列表
      baseTownHospEntryCanSelect: false, // 修改预算，-录入预算是true
      baseIsAllEntry: false, // 全部都已录入预算
      baseVAllEntry: false, // 预算-村卫生室全部录入预算
      baseVillageEntryData: [], // 基础服务-预算详情-村卫生室详情-录入村卫生室预算
      baseVillageEntryList: [], // 基础服务-预算详情-村卫生室详情-录入村卫生室Liebiao
      baseVillageUid: '', // 基础服务-预算详情-村卫生室详情-录入村卫生室下拉当前选择卫生室
      baseVillageEntryCanSelect: false,
      baseCurVillageEntryName: '', // 修改村卫生室详情里，村医预算
      baseAddBudgetType: 0, // 0新增，1修改
      // 基本药物
      sideThreeCurP: 1,
      drugType: 1, // 1为卫生院药物补助，0为村卫生室药物补助
      drugList: [], // 基础药物补助列表
      drugCurMonth: {
        '00': '1月份',
        '01': '2月份',
        '02': '3月份',
        '03': '4月份',
        '04': '5月份',
        '05': '6月份',
        '06': '7月份',
        '07': '8月份',
        '08': '9月份',
        '09': '10月份',
        '10': '11月份',
        '11': '12月份'
      },
      drugCurMonthList: [],
      drugMonthList: [
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
      ],
      addDrugNewDetail: {
        name: '基本药物制度补助', // 名称
        year: '', // 年度
        month: '', // 月份
        quarter: '', // 季度
        appropriateTime: '', // 预拨时间
        deadlineTime: '', // 截止时间
        quotaNum: '1201', // 项目代码
        budgetAmount: '', // 预算总金额
        requirements: '' // 要求
      }, // 药物补助新增详情
      drugBudgetTownHospList: [], // 卫生院预算详情卫生院列表
      drugExecuteTownHospList: [], // 卫生院执行详情卫生院列表
      drugTownIsAllEntry: false, // 卫生院全部都已录入预算
      drugBudgetVillageList: [], // 村卫生室预算详情卫生院列表
      drugExecuteVillageList: [], // 村卫生室执行详情卫生院列表
      drugVillageIsAllEntry: false, // 村卫生室全部都已录入预算
      townsDrugHospList: [], // 药物补助乡镇卫生院列表
      curDrugTownHospList: [], // 已选择的乡镇卫生院
      drugHospitalExeUid: '',
      drugExecuteStatus: '',
      drugTownHospEntryDialog: false,
      drugIsChange: '0', // 能否修改 默认不能
      drugIsSubmit: '0', // 能否提交 默认不能
      drugVIsChange: '0', // 能否修改 默认不能
      drugVIsSubmit: '0', // 能否提交 默认不能
      drugCanSelect: false, // 卫生院-录入预算-卫生院是否下拉
      drugEntryData: {
        uid: '', // 卫生院执行id
        projectUid: '', // 项目id
        budgetAmount: '',
        operationType: 0 // 0位录入，或修改录入
      }, // 录入预算的数据
      drugEntryHospList: [], // 录入预算卫生院下拉列表
      drugVillageUnselect: [], // 录入预算村卫生室列表
      drugVillageSelected: [], // 录入预算村卫生室已选择的。
      curDrugHospDetail: {}, // 当前卫生院详情
      curDrugVillageHospList: [], // 村卫生室，预算村卫生室列表
      drugVillageHosPListData: [], // 村卫生室，预算村卫生室分页列表数据；
      drugExecuteVList: [], // 村卫生室，执行详情卫生院列表
      dHospitalExeUid: '',
      drugAddBudgetType: 0, // 0，新增，1，修改
      drugVillageEntryDialog: false,
      drugVillageEntryCanSelect: false,
      drugVillageUid: '',
      drugVillageEntryData: [],
      drugVillageEntryList: [],
      // 村医卡号
      sideFourCurP: 1,
      villageCardNoList: [], // 村医卡考列表
      villageType: 0, // 0村医列表，1待审核，2审核不通过
      villageHos: '',
      villageRoom: '',
      villageHosList: [], // 乡镇卫生院列表
      villageRoomList: [], // 村卫生室列表
      villageStatus: {
        '0': '新增待审核',
        '1': '修改待审核',
        '2': '删除待审核',
        '3': '新增审核通过',
        '4': '新增审核不通过',
        '5': '修改审核通过',
        '6': '修改审核不通过',
        '7': '删除审核通过',
        '8': '删除审核不通过'
      },
      oType: {
        '0': '新增',
        '1': '修改',
        '2': '删除'
      },
      villageCardNoDialog: false,
      vCardNoDialogType: 1, // 1审核村医，2查看
      vDocCardNoData: {}, // 查看的村医卡号数据
      vCardradio: 0,
      vCardMes: ''
    }
  },
  mounted () {
    this.getCurYear();
    this.getVillageList();
    this.getDrugHospList();
  },
  methods: {
    chooseBaseType (e) {
      let params = {
        exportType: (parseInt(e) - 1) + ''
      }
      this.axios.get('/hisServices/financialSupervision/serviceSubsidy/years', {params})
        .then(res => {
          if (res && res.data.length) {
            console.log(res)
            res.data.forEach(x => {
              let o = {
                label: x,
                value: x
              }
              this.exportProYear.push(o)
            })
          } else {
            this.exportProYear = []
          }
        })
    },
    chooseDrugType (e) {
      let params = {
        exportType: (parseInt(e) - 1) + ''
      }
      this.axios.get('/hisServices/financialSupervision/systemSubsidy/years', {params})
        .then(res => {
          if (res && res.data.length) {
            console.log(res)
            res.data.forEach(x => {
              let o = {
                label: x,
                value: x
              }
              this.exportProYear.push(o)
            })
          } else {
            this.exportProYear = []
          }
        })
    },
    // 预览图片公共方法
    newPicView (imgs, _ziv) {
      // 使用方法
      let ziv;
      if (_ziv) {
        ziv = _ziv;
      } else {
        ziv = new ZxImageView(this.config, imgs);
      }
      if (ziv.$img.height) {
        ziv.view(0);
      } else {
        setTimeout(() => {
          this.newPicView(imgs, ziv)
        }, 300)
      }
    },
    previewPictures (data, id) {
      if (id === 'bigPic') {
        let imgs2 = [{
          url: data,
          angle: 0
        }]
        this.newPicView(imgs2)
      } else {
        let imgs = data.map(value => value.fileFullPath);
        // 图片数组2
        let imgs2 = []
        // 获取图片列表容器
        let $el = document.getElementById(id);
        let html = '';
        // 创建img dom
        imgs.forEach(function (src) {
          // 拼接html结构
          html += '<div class="item" style=" float: left;display: flex;align-items: center;justify-content: center;width: 82px;height: 115px;overflow: hidden;box-sizing: border-box;border: 1px solid #f1f1f1;margin: 5px;cursor: pointer;" data-angle="' + 0 + '"><img src="' + src + '" style="width: 100%;height: auto;"></div>';
          // 生成imgs2数组
          imgs2.push({
            url: src,
            angle: 0
          })
        })
        // 将图片添加至图片容器中
        $el.innerHTML = html;
        // 使用方法
        let ziv = new ZxImageView(this.config, imgs2);
        // console.log(ziv);
        // 查看第几张
        let $images = $el.querySelectorAll('.item');
        for (let i = 0; i < $images.length; i++) {
          (function (index) {
            $images[i].addEventListener('click', function () {
              ziv.view(index);
            })
          }(i))
        }
      }
    },
    validateNum (rule, value, cb) {
      var reg = /^((\d*)|(0))([.]\d{0,2})?$/;
      console.log(reg.test(value), value)
      if (value === '') {
        return false;
      } else if (!reg.test(value)) {
        cb(new Error('必须是正数，精确到小数点后两位'))
      }
    },
    validateNum1 (rule, value, cb) {
      var reg = /^((\d*)|(0))$/;
      console.log(reg.test(value), value)
      if (value === '') {
        return false;
      } else if (!reg.test(value)) {
        cb(new Error('账号必须为数字'))
      }
    },
    indexMethod (index) {
      return index + 1 + this.pagination.pageSize * (this.pagination.pageNum - 1);
    },
    breadTap (type, index, curP) {
      this.pagination.pageNum = 1;
      this.breadList[type].splice(index + 1);
      this.sideType = type;
      console.log(type, curP)
    }, // 面包屑点击
    getCurYear () {
      let y = new Date().getFullYear() - 2010;
      for (let i = 0; i <= y; i++) {
        let o = {
          label: 2010 + i + '',
          value: 2010 + i + ''
        }
        this.proYearList.push(o)
      }
      this.proYearList.reverse();
    }, // 获取当前年份，
    showPic (url) {
      this.bigPicUrl = url;
      this.showBigPic = true;
    },
    // 分页
    onPageSizeChange (size) {
      this.pagination.pageSize = size;
      this.getVillageList();
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getVillageList();
    },
    handleSelect (item) {
      console.log(item);
    },
    // 村医卡号
    querySearch4 (queryString, cb) {
      var restaurants = this.villageHosList;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearch5 (queryString, cb) {
      var restaurants = this.villageRoomList;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    getVillageList () {
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
          dateType: this.villageType
        }
      }
      let hospitalUid = '';
      if (this.villageHosList.some(m => m.value === this.villageHos)) {
        hospitalUid = this.villageHosList.find(m => m.value === this.villageHos).uid;
      }
      if (hospitalUid) {
        params.where['townshipHospUid'] = hospitalUid;
      }
      let villageUid = '';
      if (this.villageRoomList.some(m => m.value === this.villageRoom)) {
        villageUid = this.villageRoomList.find(m => m.value === this.villageRoom).uid;
      }
      if (villageUid) {
        params.where['villageClinicUId'] = villageUid;
      }
      this.axios.get('/hisServices/financialSupervision/villageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.villageCardNoList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          }
        })
    }, // 村医卡号列表
    getDrugHospList () {
      // 获取卫生院下拉列表，村卫生室下拉列表
      // 获取卫计项目所有卫生院
      let p = {
        pageSize: 0,
        where: {
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.villageHosList = res.data.list;
            this.villageHosList.map(x => {
              x.value = x.name;
            })
            this.villageHosList.splice(0, 0, {value: '全部卫生院', uid: ''})
          }
        })
    }, // 获取卫生院，
    getDrugVillageList () {
      this.villageRoomList = [];
      this.villageRoom = '';
      let p = {
        pageSize: 0,
        where: {
        }
      }
      let hospitalUid = '';
      if (this.villageHosList.some(m => m.value === this.villageHos)) {
        hospitalUid = this.villageHosList.find(m => m.value === this.villageHos).uid;
      }
      if (hospitalUid) {
        p.where['hospitalUid'] = hospitalUid;
        this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
          .then(res => {
            if (res) {
              this.villageRoomList = res.data.list;
              this.villageRoomList.map(x => {
                x.value = x.name;
              })
              this.villageRoomList.splice(0, 0, {value: '全部卫生室', uid: ''})
            }
          })
      }
    }, // 村卫生室下拉
    villageExamine (item, num) {
      this.vDocCardNoData = item;
      this.vCardNoDialogType = num;
      this.villageCardNoDialog = true;
      this.vCardMes = '';
      this.vCardradio = 0;
    }, // 审核，查看村医卡号详情
    confirmVCardInfo () {
      let params = {
        uid: this.vDocCardNoData.uid,
        auditType: this.vCardradio - 1,
        operationType: this.vDocCardNoData.operationType
      }
      if (this.vCardradio === '2') {
        params['reason'] = this.vCardMes
      }
      this.axios.put('/hisServices/financialSupervision/auditVillageDoctor', params)
        .then(res => {
          if (res) {
            this.villageCardNoDialog = false;
            this.getVillageList();
          }
        })
    }
  },
  watch: {
    villageType (e) {
      this.sideFourCurP = e + 1;
      this.villageHos = '';
      this.villageRoom = '';
      this.villageRoomList = [];
      this.getVillageList();
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
  .red-star{
    &:before{
      content: '*';
      color: #FF0000;
    }
  }
  .white-star{
    &:before{
      content: '*';
      color: #FFFFFF;
    }
  }
  button{
    width: 64px;
    height:32px;
    line-height: 32px;
    padding: 0;
    text-align: center;
  }
  .town-entry-box{
    .town-entry-row{
      margin-bottom: 16px;
      >span{
        width: 92px;
        display: inline-block;
        text-align: right;
        vertical-align: top;
      }
      >textarea{
        vertical-align: top;
        width: 260px;
        resize: none;
        height: 60px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        border-color: #e8e8e8;
        text-indent: 10px;
        padding: 4px 0;
        line-height: 20px;
      }
      >.has-color{
        width: 690px;
        height: auto;
        background: #FAFAFA;
        padding: 16px;
        span{
          font-size: 14px;
          color: #999999;
          margin-right: 60px;
        }
        h5{
          color: #333333;
          margin-bottom: 15px;
        }
        p{
          margin-top: 15px;
          color: #999999;
        }
      }
    }
  }
  .show-big-pic{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(102, 102, 102, .6);
    z-index: 999999;
    img{
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
  }
  .is-down{
    transition: .5s all;
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform:rotate(180deg);
  }
</style>
<style lang="less">
  .my-sup-b{
    .el-form{
      display: inline-block;
      >div{
        display: inline;
        .el-form-item__content{
          line-height: 32px;
        }
      }
    }
    input{
      height: 32px!important;
      line-height: 32px;
    }
    .el-input__icon{
      line-height: 32px;
    }
    .el-table {
      min-height: 0;
    }
    .sup-content{
      min-height:  770px;
      float: left;
      width: calc(100% - 160px);
      .sup-search{
        width: 100%;
        height: 48px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e8e8e8;
        >div{
          margin-right: 30px;
          &:last-child{
            margin-right: 0;
          }
        }
        >button{
          width: 64px;
          height:32px;
          line-height: 32px;
          padding: 0;
          text-align: center;
        }
      }
      .add-btn{
        height: 64px;
        padding-top: 16px;
      }
      .village-type{
        height: 48px;
        margin-bottom: 16px;
        border-bottom: 1px solid #E8E8E8;
        span{
          display: block;
          float: left;
          width: 120px;
          height: 32px;
          text-align: center;
          line-height: 32px;
          border-top: 1px solid #e8e8e8;
          border-bottom: 1px solid #e8e8e8;
          border-left: 1px solid #e8e8e8;
          color: #333333;
          font-size: 14px;
          cursor: pointer;
          &:hover{
            border: 1px solid #1890FF;
            color: #1890FF;
          }
          &:first-child{
            -webkit-border-radius: 4px 0 0 4px;
            -moz-border-radius: 4px 0 0 4px;
            border-radius: 4px 0 0 4px;
            &:hover{
              border: 1px solid #1890FF;
              color: #1890FF;
            }
          }
          &:last-child{
            border-right: 1px solid #e8e8e8;
            -webkit-border-radius: 0 4px 4px 0;
            -moz-border-radius: 0 4px 4px 0;
            border-radius: 0 4px 4px 0;
            &:hover{
              border: 1px solid #1890FF;
              color: #1890FF;
            }
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
          &:hover{
            border: none!important;
            color: #FFFFFF!important;
          }
        }
      }
      .el-table{
        &:before{
          height:0;
        }
        td{
          .cell{
            span{
              cursor: pointer;
              color: #1890FF;
              padding: 0 8px;
              border-left: 1px solid #E9E9E9;
              &:first-child{
                border-left: none;
              }
            }
            .cant-tap{
              color: #999999;
            }
          }
        }
        thead{
          tr{
            position: relative;
            .el-table_1_column_11{
              /*position: absolute;*/
              width: 300px;
              right: 0;
            }
          }
        }
        tbody{
          tr{
            position: relative;
            .el-table_1_column_11{
              /*position: absolute;*/
              width: 300px;
              right: 0;
            }
          }
        }
      }
      /*卫计项目*/
      .sup-c2-t1{
        margin-left: 15px;
        max-width: 1120px;
        .sup-c2t1-item{
          display: inline-block;
          margin-right: 30px;
          position: relative;
          margin-bottom: 16px;
          >span{
            text-align: right;
            font-size: 14px;
            color: #333333;
          }
          >i{
            font-style: normal;
            color: #CCCCCC;
            font-size: 14px;
            display: block;
            position: absolute;
            right: 22px;
            top: 6px;
          }
        }
      }
      .sup-c2-t2{
        margin-left: 15px;
        margin-bottom: 16px;
        >span{
          display: inline-block;
          vertical-align: top;
        }
        >textarea{
          width: 960px;
          resize: none;
          height: 140px;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          border-color: #e8e8e8;
          text-indent: 10px;
          padding: 4px 0;
          line-height: 20px;
        }
        >.textarea{
          display: inline-block;
          width: 960px;
          height: 140px;
          background: #f5f5f5;
          border-radius: 4px;
          text-indent: 12px;
          border: 1px solid #e8e8e8;
          color: #cccccc;
        }
        >.sup-c5-piclist{
          display: inline-block;
          width: 960px;
          height: auto;
          >ul{
            width: 960px;
            height: auto;
            li{
              float: left;
              width: 100px;
              height: 100px;
              margin-right: 16px;
              -webkit-border-radius: 4px;
              -moz-border-radius: 4px;
              border-radius: 4px;
              position: relative;
              img{
                width: 100%;
                height: 100%;
              }
              >i{
                display: block;
                position: absolute;
                font-size: 20px;
                bottom: 0;
                right: 0;
                width: 32px;
                height: 32px;
                background: rgba(102, 102, 102, .6);
                text-align: center;
                line-height: 32px;
                color: #ffffff;
                cursor: pointer;
              }
            }
          }
        }
      }
      .sup-c2-b{
        margin-top: 26px;
        margin-left: 1px;
        >p{
          font-size: 14px;
          color: #333333;
          span{
            color: #1890FF;
            margin-left: 2px;
          }
        }
        >div{
          margin-top: 26px;
          padding-left: 94px;
          .el-transfer{
            .el-transfer-panel{
              width: 300px;
              .el-transfer-panel__header{
                .el-checkbox{
                  .el-checkbox__label{
                    font-weight: bold;
                  }
                }
              }
            }
            .el-transfer__buttons{
              width: 146px;
              height: 74px;
              position: relative;
              button{
                padding: 0;
                width: 86px;
                height: 32px;
                line-height: 32px;
                position: absolute;
                &:first-child{
                  bottom: 0px;
                  margin-bottom: 0;
                }
                &:last-child{
                }
              }
            }
          }
        }
        .sup-c2-btn{
          margin-top: 30px;
          padding-left: 424px;
          button{
            width: 64px;
            height: 32px;
            line-height: 32px;
            padding: 0;
          }
        }
      }
      .sup-c3-detail{
        color: #666666;
        font-size: 14px;
        border-bottom: 1px solid #e8e8e8;
        span{
          display: inline-block;
          margin-right: 20px;
          margin-bottom: 14px;
          &:last-child{
            margin-right: 0;
          }
        }
      }
      .sup-c3-search{
        padding: 16px 0;
        border-bottom: 1px dashed #e8e8e8;
        button{
          margin-left: 30px;
        }
      }
      .sup-c3-btn{
        padding: 16px 0;
        width: 1056px;
        button{
          &:last-child{
            float: right;
          }
        }
        >div{
          display: inline-block;
          margin-left: 30px;
          color: #000000;
          font-size: 14px;
          line-height: 32px;
          font-family: "Microsoft YaHei";
          >span{
            display: inline-block;
            width:200px;
            height:32px;
            background:rgba(245,245,245,1);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            text-indent: 12px;
            border: 1px solid #e8e8e8;
            color: #cccccc;
            span{
              float: right;
              margin-right:  12px;
            }
            i{
              float: right;
              display: block;
              width: 30px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              text-indent: 0;
              border-left: 1px solid #e8e8e8;
            }
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
