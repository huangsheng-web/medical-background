<template>
    <div class="sup-main my-sta clearfix">
      <div class="sup-sl">
        <el-menu
          v-if="curRole === 0"
          default-active="1"
          class="el-menu-vertical-demo"
          @select="sideSelect">
          <el-menu-item  index="1">
            <span slot="title">注册统计</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span slot="title">挂号统计</span>
          </el-menu-item>
          <el-menu-item index="3">
            <span slot="title">公众自助查询统计</span>
          </el-menu-item>
          <el-menu-item index="4">
            <span slot="title">医患沟通统计</span>
          </el-menu-item>
          <el-menu-item index="5">
            <span slot="title">医疗纠纷统计</span>
          </el-menu-item>
          <el-menu-item index="6">
            <span slot="title">财务监管统计</span>
          </el-menu-item>
          <el-menu-item index="7">
            <span slot="title">慢病管理统计</span>
          </el-menu-item>
        </el-menu>
        <el-menu
          v-if="curRole === 1"
          default-active="2"
          class="el-menu-vertical-demo"
          @select="sideSelect">
          <el-menu-item index="2">
            <span slot="title">挂号统计</span>
          </el-menu-item>
          <el-menu-item index="4">
            <span slot="title">医患沟通统计</span>
          </el-menu-item>
          <el-menu-item index="5">
            <span slot="title">医疗纠纷统计</span>
          </el-menu-item>
          <el-menu-item index="7">
            <span slot="title">慢病管理统计</span>
          </el-menu-item>
        </el-menu>
        <el-menu
          v-if="curRole === 2"
          default-active="7"
          class="el-menu-vertical-demo"
          @select="sideSelect">
          <el-menu-item index="7">
            <span slot="title">慢病管理统计</span>
          </el-menu-item>
        </el-menu>
        <el-menu
          v-if="curRole === 3"
          default-active="5"
          class="el-menu-vertical-demo"
          @select="sideSelect">
          <el-menu-item index="5">
            <span slot="title">医疗纠纷统计</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="sup-bread">
        <i class="iconfont" v-show="sideType === 1">&#xe69a;</i>
        <i class="iconfont" v-show="sideType === 2">&#xe69b;</i>
        <i class="iconfont" v-show="sideType === 3">&#xe69f;</i>
        <i class="iconfont" v-show="sideType === 4">&#xe6c2;</i>
        <i class="iconfont" v-show="sideType === 5">&#xe63a;</i>
        <i class="iconfont" v-show="sideType === 6">&#xe6b3;</i>
        <i class="iconfont" v-show="sideType === 7">&#xe6ba;</i>
        <div class="sup-bread-list">
          <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
        </div>
      </div>
      <!--注册统计-->
      <div class="sup-content-box clearfix" v-if="sideType === 1">
        <div class="sup-content">
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
            <el-button style="margin-left: 30px" v-show="condition === '4' || condition === '5' || condition === '6' || condition === '0'" @click.native="getRegister" icon="el-icon-search">统计</el-button>
          </div>
          <div class="sup-color-box clearfix">
            <div class="color-box-1">
              <p>注册人数 <span>  {{regData.totalRegisterData | fmTenThousand}}</span></p>
              <p>累计： {{regData.accTotalRegisterData | fmTenThousand}}</p>
            </div>
            <div class="color-box-2">
              <p>添加就诊人数 <span>  {{regData.totalPatientData | fmTenThousand}}</span></p>
              <p>累计： {{regData.accTotalPatientData | fmTenThousand}}</p>
            </div>
            <div class="color-box-3" style="margin-right: 0">
              <p>关联档案人数 <span>  {{regData.totalAssociatedFilesData | fmTenThousand}}</span></p>
              <p>累计：{{regData.accTotalAssociatedFilesData | fmTenThousand}}</p>
            </div>
          </div>
          <div class="sup-reg-type">
            <p>增长趋势统计<span>（{{timeRate}}）</span></p>
            <g2-line :charData="serverData" :color="'#32C1DF-#FF7088-#6F94FF'" :id="'c1'"></g2-line>
          </div>
        </div>
      </div>
      <!--挂号统计-->
      <div class="sup-content-box clearfix" v-if="sideType === 2">
        <div class="sup-content">
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
            <el-button style="margin-left: 30px" v-show="condition === '4' || condition === '5' || condition === '6' || condition === '0'" @click.native="getScheduling" icon="el-icon-search">统计</el-button>
          </div>
          <div class="sup-color-box clearfix">
            <div class="color-box-1" style="width: 250px;">
              <p>挂号人次 <span>  {{schedulingData.registerCount | fmTenThousand}}</span></p>
              <p>累计： {{schedulingData.totalRegister | fmTenThousand}}</p>
            </div>
            <div class="color-box-2" style="width: 250px;">
              <p>就诊人次 <span>  {{schedulingData.visitCount | fmTenThousand}}</span></p>
              <p>累计： {{schedulingData.totalVisit | fmTenThousand}}</p>
            </div>
            <div class="color-box-3" style="width: 250px;">
              <p>取消挂号人次 <span>  {{schedulingData.cancelRegisterCount | fmTenThousand}}</span></p>
              <p>累计：{{schedulingData.totalCancelRegister | fmTenThousand}}</p>
            </div>
            <div class="color-box-4" style="margin-right: 0;width: 250px;">
              <p>挂号总金额 <span>  {{schedulingData.registerAmountCount ? schedulingData.registerAmountCount : 0 | fmTenThousand}}</span></p>
              <p>累计：{{schedulingData.totalAmount ? schedulingData.totalAmount : 0 | fmTenThousand}}</p>
            </div>
          </div>
          <div class="sup-reg-type">
            <p>增长趋势统计<span>（{{timeRate}}）</span></p>
            <g2-line :charData="serverData" :color="'#32C1DF-#FF7088-#6F94FF-#9A86FF'" :id="'c1'"></g2-line>
          </div>
          <!--分类统计饼图-->
          <div class="sup-reg-type">
            <p style="margin-top: 0;border-top: 1px dashed #999999;">分类统计<span>（{{timeRate}}）</span></p>
            <div class="chart-round">
              <h5>取消挂号原因</h5>
              <p>-合计{{cancelAll}}-</p>
              <div id="b1"></div>
            </div>
            <div class="chart-round">
              <h5>支付方式</h5>
              <p>-合计{{payAll}}-</p>
              <div id="b2"></div>
            </div>
            <div class="chart-round">
              <h5>挂号方式</h5>
              <p>-合计{{regAll}}-</p>
              <div id="b3"></div>
            </div>
          </div>
          <!--列表统计-->
          <div class="sup-reg-type">
            <p style="margin-top: 0;border-top: 1px dashed #999999;">列表统计<span>（{{timeRate}}）</span></p>
            <div class="sup-search" style="margin-bottom: 16px;">
              <span v-show="!isHospUser">选择医院:</span>
              <el-select v-if="!isHospUser" @change="getRoomList(hospitalUid)" v-model="hospitalUid" style="width: 200px; margin-right: 30px;" placeholder="请选择">
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
              <el-button type="primary" @click="getRegColData" icon="el-icon-search">统计</el-button>
              <el-button style="float: right;" :disabled="!regColDataList.length" @click.native="printpage('f1')">打印</el-button>
            </div>
            <el-table
              :data="regColDataList"
              key="tabel18"
              show-summary
              :summary-method="getSummaries1"
              stripe
              id="f1"
              style="width: 100%;">
              <el-table-column
                type="index"
                label="序号"
                width="177">
              </el-table-column>
              <el-table-column
                prop="displayName"
                width="178"
                :label="colDataType === 0 ? '医院名称' : (colDataType === 1 ? '科室名称' : '医生')">
              </el-table-column>
              <el-table-column
                prop="appointmentCount"
                width="177"
                label="挂号人次">
              </el-table-column>
              <el-table-column
                prop="visitCount"
                label="就诊人次"
                width="177">
              </el-table-column>
              <el-table-column
                prop="cancelAppointmentCount"
                width="177"
                label="取消挂号人次">
              </el-table-column>
              <el-table-column
                prop="appointmentPrice"
                width="177"
                label="挂号总金额">
              </el-table-column>
            </el-table>
            <div  v-show="pagination.total > 10" class="pagination-box" >
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
      <!--公众自助查询统计-->
      <div class="sup-content-box clearfix" v-if="sideType === 3">
        <div class="sup-content">
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
            <el-button style="margin-left: 30px" v-show="condition === '4' || condition === '5' || condition === '6' || condition === '0'" @click.native="getSelfHelp" icon="el-icon-search">统计</el-button>
          </div>
          <div class="sup-color-box clearfix">
            <div class="color-box-1" style="margin-bottom: 20px;">
              <p>健康记录查询人次 <span>  {{selfHelpData.healthRecordsCount | fmTenThousand}}</span></p>
              <p>累计： {{selfHelpData.healthRecordsTotal | fmTenThousand}}</p>
            </div>
            <div class="color-box-2" style="margin-bottom: 20px;">
              <p>费用查询人次 <span>  {{selfHelpData.feeCount | fmTenThousand}}</span></p>
              <p>累计： {{selfHelpData.feeTotal | fmTenThousand}}</p>
            </div>
            <div class="color-box-3" style="margin-right: 0;margin-bottom: 20px;">
              <p>用药查询人次 <span>  {{selfHelpData.drugsCount | fmTenThousand}}</span></p>
              <p>累计：{{selfHelpData.drugsTotal | fmTenThousand}}</p>
            </div>
            <div class="color-box-4">
              <p>化验结果报告查询人次 <span>  {{selfHelpData.testResultsCount | fmTenThousand}}</span></p>
              <p>累计：{{selfHelpData.testResultTotal | fmTenThousand}}</p>
            </div>
            <div class="color-box-5" style="margin-right: 0">
              <p>检查文字报告查询人次 <span>  {{selfHelpData.checkTextCount | fmTenThousand}}</span></p>
              <p>累计：{{selfHelpData.checkTextTotal | fmTenThousand}}</p>
            </div>
          </div>
          <div class="sup-reg-type">
            <p>增长趋势统计<span>（{{timeRate}}）</span></p>
            <g2-line :charData="serverData" :color="'#32C1DF-#FF7088-#6F94FF-#9A86FF-#FEBA24'" :id="'c1'"></g2-line>
          </div>
        </div>
      </div>
      <!--医患沟通统计-->
      <div class="sup-content-box clearfix" v-if="sideType === 4">
        <div class="sup-content">
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
            <el-button style="margin-left: 30px" v-show="condition === '4' || condition === '5' || condition === '6' || condition === '0'" @click.native="getTreatment" icon="el-icon-search">统计</el-button>
          </div>
          <div class="sup-color-box clearfix">
            <div class="color-box-1" style="margin-bottom: 20px;">
              <p>就诊人次 <span>  {{treatmentData.visitCountSum | fmTenThousand}}</span></p>
              <p>累计： {{treatmentData.visitCountAll | fmTenThousand}}</p>
            </div>
            <div class="color-box-2" style="margin-bottom: 20px;">
              <p>咨询人次 <span>  {{treatmentData.askCountSum | fmTenThousand}}</span></p>
              <p>累计： {{treatmentData.askCountAll | fmTenThousand}}</p>
            </div>
            <div class="color-box-3" style="margin-right: 0;margin-bottom: 20px;">
              <p>回复人次 <span>  {{treatmentData.replyCountSum | fmTenThousand}}</span></p>
              <p>累计：{{treatmentData.replyCountAll | fmTenThousand}}</p>
            </div>
            <div class="color-box-4">
              <p>再次预约人次 <span>  {{treatmentData.againAppointmentCountSum | fmTenThousand}}</span></p>
              <p>累计：{{treatmentData.againAppointmentCountAll | fmTenThousand}}</p>
            </div>
            <div class="color-box-5" style="margin-right: 0">
              <p>再次预约金额 <span>  {{treatmentData.againAppointmentPriceSum | fmTenThousand}}</span></p>
              <p>累计：{{treatmentData.againAppointmentPriceAll | fmTenThousand}}</p>
            </div>
          </div>
          <div class="sup-reg-type">
            <p>增长趋势统计<span>（{{timeRate}}）</span></p>
            <g2-line :charData="serverData" :color="'#32C1DF-#FF7088-#6F94FF-#9A86FF-#FEBA24'" :id="'c1'"></g2-line>
          </div>
          <!--列表统计-->
          <div class="sup-reg-type">
            <p style="margin-top: 0;border-top: 1px dashed #999999;">列表统计<span>（{{timeRate}}）</span></p>
            <div class="sup-search" style="margin-bottom: 16px;">
              <span v-show="!isHospUser">选择医院:</span>
              <el-select v-if="!isHospUser" @change="getRoomList(hospitalUid)" v-model="hospitalUid" style="width: 200px; margin-right: 30px;" placeholder="请选择">
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
              <el-button type="primary" @click="getTreatmentColData" icon="el-icon-search">统计</el-button>
            </div>
            <el-table
              :data="treatmentColDataList"
              key="tabel12"
              show-summary
              :summary-method="getSummaries2"
              stripe
              style="width: 100%;">
              <el-table-column
                type="index"
                label="序号"
                width="151">
              </el-table-column>
              <el-table-column
                prop="displayName"
                width="157"
                :label="colDataType === 0 ? '医院名称' : (colDataType === 1 ? '科室名称' : '医生')">
              </el-table-column>
              <el-table-column
                prop="visitCountSum"
                width="151"
                label="就诊人次">
              </el-table-column>
              <el-table-column
                prop="askCountSum"
                label="咨询人次"
                width="151">
              </el-table-column>
              <el-table-column
                prop="replyCountSum"
                width="151"
                label="回复人次">
              </el-table-column>
              <el-table-column
                prop="againAppointmentCountSum"
                width="151"
                label="再次预约人次">
              </el-table-column>
              <el-table-column
                prop="againAppointmentPriceSum"
                width="151"
                label="再次预约金额">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!--医疗纠纷统计-->
      <div class="sup-content-box clearfix" v-if="sideType === 5">
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
              <el-button type="text" style="float: right;width: 100px;" v-show="isHospUser" @click.native="showHospAllDispute">医院处理汇总表</el-button>
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
        <!--纠纷汇总表-->
        <div class="sup-content" v-show="sideFiveCurP === 1">
          <div class="village-type">
            <span :class="{'active': sideFiveCurP === 1}" @click="switchCurP(1)">纠纷处理汇总表</span>
            <span :class="{'active': sideFiveCurP === 2}" @click="switchCurP(2)">投诉处理汇总表</span>
            <el-button @click.native="exportExc" style="float: right;">导出</el-button>
          </div>
          <div class="sup-search" style="position: relative;" :class="{'h-auto': hAuto}">
            科室：
            <el-select v-model="hospRoomUid" style="width: 200px; margin-right: 30px;" placeholder="请选择">
              <el-option
                label="全部"
                :value="null"
              ></el-option>
              <el-option
                v-for="item in hospRoomList"
                :key="item.uid"
                :label="item.deptName"
                :value="item.uid">
              </el-option>
            </el-select>
            处理途径:
            <el-select v-model="handleType" style="width: 200px; margin-right: 30px;" placeholder="请选择">
              <el-option
                label="全部"
                :value="null"
              ></el-option>
              <el-option
                v-for="item in handleTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            保险类别:
            <el-select v-model="insuranceType" style="width: 200px; margin-right: 30px;" placeholder="请选择">
              <el-option
                label="全部"
                :value="null"
              ></el-option>
              <el-option
                v-for="item in insuranceTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <br/>
            结案时间：
            <el-date-picker
              v-model="disputeTimeRange"
              style="width: 350px;margin: 16px 0;vertical-align: baseline;"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="text" style="position: absolute;right: 37px;top: 0;" @click.native="hAuto = !hAuto">{{!hAuto ? '展开' : '收起'}} <i class="iconfont" :class="{'change-rotate': hAuto}" style="transform: rotate(90deg);display: inline-block;-ms-transform: rotate(90deg);-moz-transform: rotate(90deg);-webkit-transform: rotate(90deg)">&#xe682;</i></el-button>
            <el-button style="position: absolute;right: 120px;top: 0;" @click="getDisputeTable" icon="el-icon-search">搜索</el-button>
          </div>
          <el-table
            :data="disputeAllList"
            key="tabel92"
            stripe
            style="width: 100%;height: 550px;">
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              prop="closeTime"
              label="结案时间"
              width="110">
              <template slot-scope="scope">
                {{scope.row.closeTime | moment}}
              </template>
            </el-table-column>
            <el-table-column
              prop="deptName"
              width="110"
              label="科室">
            </el-table-column>
            <el-table-column
              prop="patientName"
              width="110"
              label="患者姓名">
            </el-table-column>
            <el-table-column
              width="293"
              :show-overflow-tooltip="true"
              prop="handleCause"
              label="产生纠纷原因">
            </el-table-column>
            <el-table-column
              prop="handleType"
              width="110"
              label="处理途径">
            </el-table-column>
            <el-table-column
              prop="compensationMoney"
              width="120"
              label="赔偿金额（元）">
            </el-table-column>
            <el-table-column
              prop="insuranceType"
              width="110"
              label="保险类别">
            </el-table-column>
          </el-table>
          <div class="pagination-box">
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
        <!--投诉汇总表-->
        <div class="sup-content" v-show="sideFiveCurP === 2">
          <div class="village-type">
            <span :class="{'active': sideFiveCurP === 1}" @click="switchCurP(1)">纠纷处理汇总表</span>
            <span :class="{'active': sideFiveCurP === 2}" @click="switchCurP(2)">投诉处理汇总表</span>
            <el-button @click.native="exportExc" style="float: right;">导出</el-button>
          </div>
          <div class="sup-search" style="position: relative;">
            科室：
            <el-select v-model="hospRoomUid" style="width: 200px; margin-right: 30px;" placeholder="请选择">
              <el-option
                label="全部"
                :value="null"
              ></el-option>
              <el-option
                v-for="item in hospRoomList"
                :key="item.uid"
                :label="item.deptName"
                :value="item.uid">
              </el-option>
            </el-select>
            结案时间：
            <el-date-picker
              v-model="disputeTimeRange"
              style="width: 350px;vertical-align: baseline;"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button style="position: absolute;right: 120px;top: 0;" @click="getDisputeTable" icon="el-icon-search">搜索</el-button>
          </div>
          <el-table
            :data="disputeAllList"
            key="tabel52"
            stripe
            style="width: 100%;height: 550px;">
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              prop="closeTime"
              label="快速结案时间"
              width="110">
              <template slot-scope="scope">
                {{scope.row.closeTime | moment}}
              </template>
            </el-table-column>
            <el-table-column
              prop="deptName"
              width="110"
              label="科室">
            </el-table-column>
            <el-table-column
              prop="patientName"
              width="110"
              label="患者姓名">
            </el-table-column>
            <el-table-column
              width="293"
              prop="handleCause"
              :show-overflow-tooltip="true"
              label="产生纠纷原因">
            </el-table-column>
            <el-table-column
              prop="handleResult"
              width="340"
              :show-overflow-tooltip="true"
              label="处理结果">
            </el-table-column>
          </el-table>
          <div class="pagination-box">
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
      <!--财务监管统计-->
      <div class="sup-content-box clearfix" v-if="sideType === 6">
        <div class="sup-content">
          <div class="sup-search" style="margin-bottom: 16px;overflow: inherit;">
            乡镇卫生院:
            <el-select v-model="vHospUid" style="width: 200px;margin-right: 30px;" placeholder="请选择">
              <el-option
                label="全部"
                :value="null"
              >
              </el-option>
              <el-option
                v-for="item in vHospList"
                :key="item.uid"
                :label="item.name"
                :value="item.uid">
              </el-option>
            </el-select>
            逾期次数合计:
            <el-select v-model="compareType" style="width: 200px; margin-right: 30px;" placeholder="请选择">
              <el-option
                v-for="item in compareList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!--<el-input placeholder="请输入正整数"  style="margin-right: 30px;width: 200px;" v-model="compareToValue"></el-input>-->
            <el-form style="width: 200px;display: inline-block;" :model="compareToValue" class="demo-ruleForm">
              <el-form-item
                prop="value"
                :rules="[
                    {validator: validateNum, required: false}
                  ]"
              >
                <el-input type="value" style="width: 200px;height: 32px;" v-model="compareToValue.value" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <el-button @click="getOverdue" icon="el-icon-search">搜索</el-button>
          </div>
          <el-table
            :data="overdueColDataList"
            key="tabel144"
            stripe
            style="width: 100%;height: 550px;">
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              align="center"
              width="177">
            </el-table-column>
            <el-table-column
              prop="name"
              width="178"
              label="乡镇卫生院">
            </el-table-column>
            <el-table-column
              prop="projectOverdueCount"
              width="150"
              label="卫计项目逾期次数">
            </el-table-column>
            <el-table-column
              prop="serviceOverdueCount"
              label="基卫项目逾期次数"
              width="177">
            </el-table-column>
            <el-table-column
              prop="drugOverdueCount"
              width="177"
              label="基药项目逾期次数">
            </el-table-column>
            <el-table-column
              prop="total"
              width="177"
              label="逾期次数合计">
            </el-table-column>
          </el-table>
          <div v-show="pagination.total > 10" class="pagination-box" >
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
      <!--慢病管理统计-->
      <div class="sup-content-box clearfix" v-if="sideType === 7">
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
            <g2-fold :charData="serverData" :color="'#1890FF-#FEBC25'" :id="'c2'"></g2-fold>
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
import G2Line from '@/components/common/g2-line.vue';
import G2Fold from '@/components/common/g2-fold.vue';
import G2 from '@antv/g2';
import {View, DataSet} from '@antv/data-set'
export default {
  components: {
    G2Line,
    G2Fold
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
      breadList: {},
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
      // 注册统计
      regData: {}, // 注册统计详情
      // 挂号统计
      schedulingData: {}, // 挂号统计详情
      chartRound1: null, // 饼1
      chartRound2: null, // 饼2
      chartRound3: null, // 饼3
      regColDataList: [], // 挂号统计-列表统计列表
      cancelAll: 0,
      payAll: 0,
      regAll: 0,
      // 公众自助
      selfHelpData: {}, // 自助详情
      // 医患沟通统计
      treatmentData: {},
      treatmentColDataList: [],
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
      hAuto: false, // 自适应高度
      // 财务监管统计
      compareType: '', // '0'大于等于，'1'小于等于
      compareList: [
        {value: '0', label: '≥'},
        {value: '1', label: '≤'}
      ],
      compareToValue: {
        value: ''
      },
      overdueColDataList: [],
      vHospUid: '', // 乡镇卫生院uid-搜索
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
    this.getRole();
  },
  mounted () {
    switch (this.curRole) {
      case 0:
        this.getRegister();
        break;
      case 1:
        this.sideType = 2;
        this.getScheduling();
        this.getRegColData();
        this.getRoomList(this.$store.state.token.organInfoList[0].uid)
        break;
      case 2:
        this.sideType = 7;
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
        break;
      case 3:
        this.sideType = 5;
        this.getDispute();
        break;
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
    validateNum (rule, value, cb) {
      var reg = /^((\d*)|(0))$/;
      if (value === '') {
        return false;
      } else if (!reg.test(value)) {
        cb(new Error('必须是正整数'))
      }
    },
    exportExc () {
      let params = {
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
      this.axios.get('/hisServices/statistics/exportDisputeHandle/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))), {
        responseType: 'arraybuffer'
      }).then(res => {
        if (res) {
          let linkElement = document.createElement('a');
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          let url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute('download', '纠纷统计表.xls');
          let clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
          linkElement.dispatchEvent(clickEvent);
        }
      })
    }, // 导出excel
    indexMethod (index) {
      return index + 1 + this.pagination.pageSize * (this.pagination.pageNum - 1);
    },
    getSummaries1 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 2) {
          sums[index] = this.allTotal.totalAppointment;
        }
        if (index === 3) {
          sums[index] = this.allTotal.totalVisit;
        }
        if (index === 4) {
          sums[index] = this.allTotal.totalCancelAppointment
        }
        if (index === 5) {
          sums[index] = this.allTotal.totalAppointmentPrice;
        }
      });
      return sums;
    },
    getSummaries2 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 2) {
          sums[index] = this.allTotal.visitCountAll;
        }
        if (index === 3) {
          sums[index] = this.allTotal.askCountAll;
        }
        if (index === 4) {
          sums[index] = this.allTotal.replyCountAll
        }
        if (index === 5) {
          sums[index] = this.allTotal.againAppointmentCountAll;
        }
        if (index === 6) {
          sums[index] = this.allTotal.againAppointmentPriceAll;
        }
      });
      return sums;
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
    getRole () {
      this.isHospUser = false;
      this.isVillageUser = false;
      if (this.$store.state.token.roleList.some(x => x === '医调委')) {
        this.curRole = 3;
        this.breadList = {
          '5': [
            {name: '医疗纠纷统计', sideType: 5, sideCurP: 0}
          ]
        }
      }
      if (this.$store.state.token.roleList.some(x => x === '卫生院')) {
        this.curRole = 2;
        this.isVillageUser = true;
        this.breadList = {
          '7': [
            {name: '慢病管理统计', sideType: 7, sideCurP: 0}
          ]
        }
      }
      if (this.$store.state.token.roleList.some(x => x === '医院')) {
        this.curRole = 1;
        this.isHospUser = true;
        this.breadList = {
          '2': [
            {name: '挂号统计', sideType: 2, sideCurP: 0}
          ],
          '4': [
            {name: '医患沟通统计', sideType: 4, sideCurP: 0}
          ],
          '5': [
            {name: '医疗纠纷统计', sideType: 5, sideCurP: 0}
          ],
          '7': [
            {name: '慢病管理统计', sideType: 7, sideCurP: 0}
          ]
        }
      }
      if (this.$store.state.token.roleList.some(x => x === '卫计局')) {
        this.curRole = 0;
        this.breadList = {
          '1': [
            {name: '注册统计', sideType: 1, sideCurP: 0}
          ],
          '2': [
            {name: '挂号统计', sideType: 2, sideCurP: 0}
          ],
          '3': [
            {name: '公众自助查询统计', sideType: 3, sideCurP: 0}
          ],
          '4': [
            {name: '医患沟通统计', sideType: 4, sideCurP: 0}
          ],
          '5': [
            {name: '医疗纠纷统计', sideType: 5, sideCurP: 0}
          ],
          '6': [
            {name: '财务监管逾期统计', sideType: 6, sideCurP: 0}
          ],
          '7': [
            {name: '慢病管理统计', sideType: 7, sideCurP: 0}
          ]
        }
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
    resetData () {
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
      this.ncdHospUid = '';
      this.ncdVillageUid = '';
      this.ncdTeamUid = '';
    }, // 重置数据
    sideSelect (key) {
      this.condition = '1';
      this.resetData();
      this.sideType = parseInt(key);
      if (this.sideType === 1) {
        this.getRegister();
      } else if (this.sideType === 2) {
        this.getScheduling();
        this.getRegColData();
        if (this.isHospUser) {
          this.getRoomList(this.$store.state.token.organInfoList[0].uid)
        }
      } else if (this.sideType === 3) {
        this.getSelfHelp();
      } else if (this.sideType === 4) {
        this.getTreatment();
        this.getTreatmentColData();
      } else if (this.sideType === 5) {
        this.getDispute();
        this.getDisputeColData();
        this.sideFiveCurP = 0;
        if (this.isHospUser) {
          this.getRoomList(this.$store.state.token.organInfoList[0].uid)
        }
      } else if (this.sideType === 6) {
        this.getOverdue();
      } else if (this.sideType === 7) {
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
      }
    },
    breadTap (type, index, curP) {
      this.breadList[type].splice(index + 1);
      this.sideType = type;
      switch (type) {
        case 5:
          this.sideFiveCurP = curP;
          break;
      }
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
    printpage (myDiv) {
      var newstr = document.getElementById(myDiv).innerHTML;
      var wind = window.open('', 'newwindow', 'height=800, width=1100, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
      wind.document.body.innerHTML = newstr;
      wind.document.body.style.textAlign = 'center'
      wind.document.querySelector('.el-table__header thead tr th').style.textAlign = 'center';
      wind.document.querySelector('.el-table__header thead tr th').style.height = '40px';
      for (let i = 0; i < wind.document.getElementsByTagName('th').length; i++) {
        wind.document.getElementsByTagName('th')[i].style.borderLeft = '1px solid #E8E8E8'
        wind.document.getElementsByTagName('th')[i].style.borderTop = '1px solid #E8E8E8'
        if (i === 5) {
          wind.document.getElementsByTagName('th')[i].style.borderRight = '1px solid #E8E8E8'
        }
      }
      for (let i = 0; i < wind.document.getElementsByTagName('td').length; i++) {
        wind.document.getElementsByTagName('td')[i].style.textAlign = 'center'
        wind.document.getElementsByTagName('td')[i].style.borderLeft = '1px solid #E8E8E8'
        wind.document.getElementsByTagName('td')[i].style.borderTop = '1px solid #E8E8E8'
        wind.document.getElementsByTagName('td')[i].style.height = '40px';
        if (i >= (wind.document.getElementsByTagName('td').length - 6)) {
          wind.document.getElementsByTagName('td')[i].style.borderBottom = '1px solid #E8E8E8'
        }
        if ((i + 1) % 6 === 0) {
          wind.document.getElementsByTagName('td')[i].style.borderRight = '1px solid #E8E8E8'
        }
      }
      wind.document.querySelector('tbody').style.textAlign = 'center';
      var time = document.createElement('p');
      time.innerText = '统计时间：' + this.timeRate;
      time.style.textAlign = 'left';
      wind.document.body.insertBefore(time, wind.document.body.children[0])
      var title = document.createElement('h1');
      title.innerText = this.isHospUser ? (this.$store.state.token.organInfoList[0].organName + '挂号统计') : this.hospitalUid ? (this.hospitalList.find(x => x.uid === this.hospitalUid).hospName + '挂号统计') : '挂号统计'
      wind.document.body.insertBefore(title, wind.document.body.children[0])
      // wind.print();
      return false;
    }, // 打印表格
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
    // 注册统计
    getRegister () {
      this.getDateRate();
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
      this.axios.get('/hisServices/statistics/register/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.regData = res.data;
            if (res.data.registerStatisticsDataList.length) {
              res.data.registerStatisticsDataList.forEach(x => {
                for (let i = 0; i < 3; i++) {
                  let o = {};
                  o.month = formatDate(x.statisticsDate, 'yyyy-MM-dd');
                  if (i === 0) {
                    o.name = '注册人数';
                    o.num = x.userCount;
                  } else if (i === 1) {
                    o.name = '添加就诊人数';
                    o.num = x.patientCount;
                  } else {
                    o.name = '关联档案人数';
                    o.num = x.relationshipArchiveCount;
                  }
                  this.serverData.push(o);
                }
              });
            } else {
              console.log(this.timeRate.split('~'))
              this.timeRate.split('~').forEach(x => {
                for (let i = 0; i < 3; i++) {
                  let o = {};
                  o.month = x;
                  if (i === 0) {
                    o.name = '注册人数';
                    o.num = 0;
                  } else if (i === 1) {
                    o.name = '添加就诊人数';
                    o.num = 0;
                  } else {
                    o.name = '关联档案人数';
                    o.num = 0;
                  }
                  this.serverData.push(o);
                  console.log(this.serverData)
                }
              })
            }
          }
        })
    },
    // 挂号统计
    getScheduling () {
      this.getRegColData();
      this.getAllHos('1')
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
      }
      this.axios.get('/hisServices/statistics/scheduling/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.schedulingData = res.data;
            if (res.data.lineChartData) {
              res.data.lineChartData.forEach(x => {
                for (let i = 0; i < 4; i++) {
                  let o = {};
                  o.month = formatDate(x.statisticsDate, 'yyyy-MM-dd');
                  if (i === 0) {
                    o.name = '挂号人次';
                    o.num = x.appointmentCount;
                  } else if (i === 1) {
                    o.name = '就诊人次';
                    o.num = x.visitCount;
                  } else if (i === 2) {
                    o.name = '取消挂号人次';
                    o.num = x.cancelAppointmentCount;
                  } else {
                    o.name = '挂号总金额';
                    o.num = x.appointmentPrice;
                  }
                  this.serverData.push(o);
                }
              })
            } else {
              this.timeRate.split('~').forEach(z => {
                for (let i = 0; i < 4; i++) {
                  let o = {};
                  o.month = formatDate(z, 'yyyy-MM-dd');
                  if (i === 0) {
                    o.name = '挂号人次';
                    o.num = 0;
                  } else if (i === 1) {
                    o.name = '就诊人次';
                    o.num = 0;
                  } else if (i === 2) {
                    o.name = '取消挂号人次';
                    o.num = 0;
                  } else {
                    o.name = '挂号总金额';
                    o.num = 0;
                  }
                  this.serverData.push(o);
                }
              })
            }
            this.cancelAll = res.data.cancelTypeOtherHosp + res.data.cancelTypeOtherDoc + res.data.cancelTypeHaveThing + res.data.cancelTypeDiseaseBetter + res.data.cancelTypeOther;
            this.payAll = res.data.onlinePay + res.data.offlinePay;
            this.regAll = res.data.webScheduling + res.data.appScheduling;
            let cancelAllList = [];
            let payAllList = [];
            let regAllList = [];
            for (let i = 0; i < 5; i++) {
              let o = {};
              if (i === 0) {
                o.item = '选择其他医院就诊';
                o.count = res.data.cancelTypeOtherHosp;
                o.percent = (res.data.cancelTypeOtherHosp && res.data.cancelTypeOtherHosp !== 0) ? parseFloat((res.data.cancelTypeOtherHosp / this.cancelAll).toFixed(2)) : 0;
              } else if (i === 1) {
                o.item = '选择其他医生就诊';
                o.count = res.data.cancelTypeOtherDoc;
                o.percent = (res.data.cancelTypeOtherDoc && res.data.cancelTypeOtherDoc !== 0) ? parseFloat((res.data.cancelTypeOtherDoc / this.cancelAll).toFixed(2)) : 0;
              } else if (i === 2) {
                o.item = '临时有事不能就诊';
                o.count = res.data.cancelTypeHaveThing;
                o.percent = (res.data.cancelTypeHaveThing && res.data.cancelTypeHaveThing !== 0) ? parseFloat((res.data.cancelTypeHaveThing / this.cancelAll).toFixed(2)) : 0;
              } else if (i === 3) {
                o.item = '病情好转无需就诊';
                o.count = res.data.cancelTypeDiseaseBetter;
                o.percent = (res.data.cancelTypeDiseaseBetter && res.data.cancelTypeDiseaseBetter !== 0) ? parseFloat((res.data.cancelTypeDiseaseBetter / this.cancelAll).toFixed(2)) : 0;
              } else if (i === 4) {
                o.item = '其他';
                o.count = res.data.cancelTypeOther;
                o.percent = (res.data.cancelTypeOther && res.data.cancelTypeOther !== 0) ? parseFloat((res.data.cancelTypeOther / this.cancelAll).toFixed(2)) : 0;
              }
              cancelAllList.push(o);
            }
            for (let i = 0; i < 2; i++) {
              let o2 = {};
              let o3 = {};
              if (i === 0) {
                o2.item = '在线支付';
                o2.count = res.data.onlinePay;
                o2.percent = (res.data.onlinePay && res.data.onlinePay !== 0) ? parseFloat((res.data.onlinePay / this.payAll).toFixed(2)) : 0;
                o3.item = '网页';
                o3.count = res.data.webScheduling;
                o3.percent = (res.data.webScheduling && res.data.webScheduling !== 0) ? parseFloat((res.data.webScheduling / this.regAll).toFixed(2)) : 0;
              } else {
                o2.item = '到院支付';
                o2.count = res.data.offlinePay;
                o2.percent = (res.data.offlinePay && res.data.offlinePay !== 0) ? parseFloat((res.data.offlinePay / this.payAll).toFixed(2)) : 0;
                o3.item = '小程序';
                o3.count = res.data.appScheduling;
                o3.percent = (res.data.appScheduling && res.data.appScheduling !== 0) ? parseFloat((res.data.appScheduling / this.regAll).toFixed(2)) : 0;
              }
              payAllList.push(o2);
              regAllList.push(o3);
            }
            this.drawChart1(cancelAllList);
            this.drawChart2(payAllList);
            this.drawChart3(regAllList);
            this.getDateRate();
          }
        })
    },
    getRegColData () {
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
      this.axios.get('/hisServices/statistics/schedulingList/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            if (res.data.pageInfo) {
              this.regColDataList = res.data.pageInfo.list;
              this.pagination.pageNum = res.data.pageInfo.pageNum;
              this.pagination.total = res.data.pageInfo.total;
            } else {
              this.regColDataList = [];
            }
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
    }, // 获取挂号统计-列表数据
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
    drawChart1: function (data) {
      console.log(data)
      if (data.every(x => x.count === 0)) {
        data = [{item: '暂无数据', count: 0, percent: 1}]
      }
      this.chartRound1 && this.chartRound1.destroy();
      const ds = new DataSet();
      const dv = ds.createView().source(data);
      this.chartRound1 = new G2.Chart({
        container: 'b1',
        width: 288,
        height: 288
      });
      this.chartRound1.source(dv, {
        percent: {
          formatter: function formatter (val) {
            val = val * 100 + '%';
            return val;
          }
        }
      });
      this.chartRound1.coord('theta');
      this.chartRound1.tooltip({
        showTitle: false
      });
      if (data.every(x => x.count === 0)) {
        this.chartRound1.intervalStack().position('percent').color('item', '#f2f2f2').tooltip('item*count*percent', function (item, count, percent) {
          return {
            name: item
          };
        }).style({
          lineWidth: 1,
          stroke: '#fff'
        });
      } else {
        this.chartRound1.intervalStack().position('percent').color('item', '#1EDFDB-#FF6B88-#9A86FF-#48B4FD-#F7C24D').tooltip('item*count*percent', function (item, count, percent) {
          if (percent === 1) {
            percent = count + '人' + '/' + '100%'
          } else {
            percent = count + '人' + '/' + (percent + '').slice(2, 4) + '%'
          }
          return {
            name: item,
            value: percent
          };
        }).style({
          lineWidth: 1,
          stroke: '#fff'
        });
      }
      this.chartRound1.render();
    },
    drawChart2: function (data) {
      console.log(data)
      if (data.every(x => x.count === 0)) {
        data = [{item: '暂无数据', count: 0, percent: 1}]
      }
      this.chartRound2 && this.chartRound2.destroy();
      const ds = new DataSet();
      const dv = ds.createView().source(data);
      this.chartRound2 = new G2.Chart({
        container: 'b2',
        width: 288,
        height: 288
      });
      this.chartRound2.source(dv, {
        percent: {
          formatter: function formatter (val) {
            val = val * 100 + '%';
            return val;
          }
        }
      });
      this.chartRound2.coord('theta');
      this.chartRound2.tooltip({
        showTitle: false
      });
      if (data.every(x => x.count === 0)) {
        this.chartRound2.intervalStack().position('percent').color('item', '#f2f2f2').tooltip('item*count*percent', function (item, count, percent) {
          return {
            name: item
          };
        }).style({
          lineWidth: 1,
          stroke: '#fff'
        });
      } else {
        this.chartRound2.intervalStack().position('percent').color('item', '#F7C24D-#48B4FD').tooltip('item*count*percent', function (item, count, percent) {
          if (percent === 1) {
            percent = count + '人' + '/' + '100%'
          } else {
            percent = count + '人' + '/' + (percent + '').slice(2, 4) + '%'
          }
          return {
            name: item,
            value: percent
          };
        }).style({
          lineWidth: 1,
          stroke: '#fff'
        });
      }
      this.chartRound2.render();
    },
    drawChart3: function (data) {
      console.log(data)
      if (data.every(x => x.count === 0)) {
        data = [{item: '暂无数据', count: 0, percent: 1}]
      }
      this.chartRound3 && this.chartRound3.destroy();
      const ds = new DataSet();
      const dv = ds.createView().source(data);
      this.chartRound3 = new G2.Chart({
        container: 'b3',
        width: 288,
        height: 288
      });
      this.chartRound3.source(dv, {
        percent: {
          formatter: function formatter (val) {
            val = val * 100 + '%';
            return val;
          }
        }
      });
      this.chartRound3.coord('theta');
      this.chartRound3.tooltip({
        showTitle: false
      });
      if (data.every(x => x.count === 0)) {
        this.chartRound3.intervalStack().position('percent').color('item', '#f2f2f2').tooltip('item*count*percent', function (item, count, percent) {
          return {
            name: item
          };
        }).style({
          lineWidth: 1,
          stroke: '#fff'
        });
      } else {
        this.chartRound3.intervalStack().position('percent').color('item', '#F7C24D-#48B4FD').tooltip('item*count*percent', function (item, count, percent) {
          if (percent === 1) {
            percent = count + '人' + '/' + '100%'
          } else {
            percent = count + '人' + '/' + (percent + '').slice(2, 4) + '%'
          }
          return {
            name: item,
            value: percent
          };
        }).style({
          lineWidth: 1,
          stroke: '#fff'
        });
      }
      this.chartRound3.render();
    },
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
    // 医患沟通统计
    getTreatment () {
      this.getDisputeColData();
      this.getTreatmentColData();
      this.getAllHos('1')
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
      }
      this.axios.get('/hisServices/statistics/treatment/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.treatmentData = res.data;
            res.data.statisticsTreatmentList.forEach(x => {
              for (let i = 0; i < 5; i++) {
                let o = {};
                o.month = formatDate(x.statisticsDate, 'yyyy-MM-dd');
                if (i === 0) {
                  o.name = '就诊人次';
                  o.num = x.visitCount;
                } else if (i === 1) {
                  o.name = '咨询人次';
                  o.num = x.askCount;
                } else if (i === 2) {
                  o.name = '回复人次';
                  o.num = x.replyCount;
                } else if (i === 3) {
                  o.name = '再次预约人次';
                  o.num = x.againAppointmentCount;
                } else {
                  o.name = '再次预约金额';
                  o.num = x.againAppointmentPrice;
                }
                this.serverData.push(o);
              }
            })
            this.getDateRate();
          }
        })
    },
    getTreatmentColData () {
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
      this.axios.get('/hisServices/statistics/treatmentByWhere/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.treatmentColDataList = res.data.pageInfo.list;
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
      this.breadList['5'].splice(1);
      this.breadList['5'].push({name: '处理汇总表', sideType: 5, sideCurP: 1});
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
        this.breadList['5'].splice(1);
        this.breadList['5'].push({name: '处理汇总表', sideType: 5, sideCurP: 1})
      } else {
        this.breadList['5'].splice(1);
        this.breadList['5'].push({name: '处理汇总表', sideType: 5, sideCurP: 2})
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
    // 财务监管统计
    getOverdue () {
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {}
      }
      if (this.vHospUid) {
        params.where['hospitalUid'] = this.vHospUid;
      }
      if (this.compareType && this.compareToValue.value) {
        params.where['compareType'] = this.compareType;
        params.where['compareToValue'] = this.compareToValue.value;
      }
      this.axios.get('/hisServices/statistics/financialSupervision/overdue/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.overdueColDataList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          }
        })
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
        this.sideOneTimeType = '';
        if (this.sideType === 1) {
          this.getRegister();
        } else if (this.sideType === 2) {
          this.getScheduling();
          this.getRegColData();
        } else if (this.sideType === 3) {
          this.getSelfHelp();
        } else if (this.sideType === 4) {
          this.getTreatment();
          this.getTreatmentColData();
        } else if (this.sideType === 5) {
          this.getDispute();
          this.getDisputeColData();
          if (this.isHospUser) {
            this.getRoomList(this.$store.state.token.organInfoList[0].uid)
          }
        } else if (this.sideType === 7) {
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
    padding: 28px 0px;
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
  .is-inline{
    display: inline-block;
  }
</style>
<style lang="less">
  .my-sta{
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
        padding: 0px;
      }
    }
    .el-table {
      min-height: 0;
    }
    .sup-sl{
      width: 160px;
      float: left;
      min-height: 200px;
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
      min-height:  770px;
      float: left;
      width: 1124px;
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
