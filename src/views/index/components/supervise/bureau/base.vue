<template>
  <div class="sup-main my-sup-b clearfix">
    <div class="sup-bread">
      <i class="iconfont">&#xe65c;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
      </div>
    </div>
    <!--基础公卫-->
    <div class="sup-content-box clearfix">
      <div class="sup-content" v-show="sideTwoCurP === 1">
        <div class="sup-search">
          项目年度:
          <el-select v-model="proYear" style="width: 120px;" placeholder="请选择">
            <el-option
              label="全部"
              :value="null">
            </el-option>
            <el-option
              v-for="item in proYearList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          项目季度：
          <el-select v-model="baseQuarter" style="width: 160px;" placeholder="请选择">
            <el-option
              label="全部"
              :value="null">
            </el-option>
            <el-option
              v-for="item in baseQuarterList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          项目代码：
          <el-input v-model="quotaNum" style="width: 160px"></el-input>
          项目状态：
          <el-select v-model="proState" style="width: 120px" placeholder="请选择">
            <el-option
              label="全部"
              :value="null">
            </el-option>
            <el-option
              v-for="item in proStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="getBaseList" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="add-btn clearfix">
          <el-button :disabled="checkBaseAdd(baseList)" @click="addNewBase" type="primary" style="width: 64px;height: 32px;line-height: 32px;padding: 0;float: left;">新增</el-button>
          <el-button @click.native="exportDialog = true" style="width: 64px;height: 32px;line-height: 32px;padding: 0;float: right;">导出</el-button>
        </div>
        <el-table
          :data="baseList"
          key="tabel4"
          stripe
          :show-overflow-tooltip="true"
          style="width: 100%;">
          <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="year"
            label="项目年度"
            width="80">
          </el-table-column>
          <el-table-column
            prop="quarter"
            width="100"
            label="项目季度">
            <template slot-scope="scope">
              <p style="text-align: left" v-if="scope.row.quarter === '9'">年终考核</p>
              <p style="text-align: left" v-else>{{scope.row.quarter}} 季度</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="quotaNum"
            min-width="100"
            :show-overflow-tooltip="true"
            label="项目代码">
            <template slot-scope="scope">
              {{scope.row.quotaNum ? scope.row.quotaNum : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            width="100"
            label="项目状态">
            <template slot-scope="scope">
              <i v-if="scope.row.status === '1'" style="background-color:#1890FF;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.status === '2'" style="background-color:#67c23a;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.status === '3'" style="background-color:#EF5555;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.status === '0'" style="background-color:#FB8C00;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <span style="border: none;" :style="{'color': scope.row.status === '3' ? '#EF5555' : '#888888'}">{{proCurStates[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="appropriateTime"
            min-width="100"
            label="发放时间">
            <template slot-scope="scope">
              {{scope.row.appropriateTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="deadlineTime"
            label="截止时间">
            <template slot-scope="scope">
              {{scope.row.deadlineTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            min-width="140"
            :show-overflow-tooltip="true"
            label="预算总金额（元）">
          </el-table-column>
          <el-table-column
            min-width="100"
            label="完成时间">
            <template slot-scope="scope">
              <p v-if="scope.row.finishTime">{{scope.row.finishTime | moment}}</p>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            min-width="140"
            label="实发总金额（元）">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="300">
            <template slot-scope="scope">
              <span class="pay-online" @click="baseBudgetDetail(scope.row, true)">预算详情</span>
              <span  class="reg-again" @click="baseExecuteDetail(scope.row, true)" v-if="scope.row.status !== '0'">执行详情</span>
              <span  class="reg-again cant-tap" v-else>执行详情</span>
              <span  class="cancel-reg" @click="reviseBasePro(scope.row.uid)"  v-if="scope.row.status === '0'">修改</span>
              <span  class="cancel-reg cant-tap"  v-else>修改</span>
              <span  class="change-reg" @click="deleteBase(scope.row.uid)" v-if="scope.row.status === '0'">删除</span>
              <span  class="change-reg cant-tap"  v-else>删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--基础项目新增-->
      <div class="sup-content" v-if="sideTwoCurP === 2">
        <div class="sup-c2-t">
          <div class="sup-c2-t1">
            <div class="sup-c2t1-item">
              <span class="red-star">项目名称：</span>
              <el-input disabled v-model="addBaseNewDetail.name" style="width: 200px;height: 32px;"></el-input>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">项目年度：</span>
              <el-select @change="chooseBaseYear" v-model="addBaseNewDetail.year" style="width: 136px;" placeholder="请选择">
                <el-option
                  v-for="item in proYearList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">项目季度：</span>
              <el-select v-model="addBaseNewDetail.quarter" style="width: 136px;" placeholder="请选择">
                <el-option
                  v-for="item in baseCurQuarterList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">预算总金额：</span>
              <el-form :model="addBaseNewDetail" class="demo-ruleForm">
                <el-form-item
                  prop="budgetAmount"
                  :rules="[
                    {validator: validateNum, required: false}
                  ]"
                >
                  <el-input type="budgetAmount" style="width: 140px;height: 32px;" v-model="addBaseNewDetail.budgetAmount" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <i>元</i>
            </div>
            <div class="sup-c2t1-item">
              <span class="white-star">项目代码：</span>
              <el-input style="width: 200px;height: 32px;" v-model="addBaseNewDetail.quotaNum" ></el-input>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">发放时间：</span>
              <el-date-picker
                style="width: 140px;"
                @change="checkOtherDate"
                v-model="addBaseNewDetail.appropriateTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">截止时间：</span>
              <el-date-picker
                style="width: 140px;"
                v-model="addBaseNewDetail.deadlineTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="sup-c2-b">
          <p class="red-star">乡镇卫生院：<span>已选{{curBaseTownHospList.length ? curBaseTownHospList.length : 0}}个</span></p>
          <div class="">
            <el-transfer
              style="text-align: left; display: inline-block;"
              v-model="curBaseTownHospList"
              filterable
              :filter-method="filterMethod"
              :titles="['待选列表', '已选列表']"
              :button-texts="['取消', '选择']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              @change="supC2HandleChange"
              :data="townsBaseHospList">
              <span slot-scope="{ option }">
                <template v-if="!option.disabled">{{ option.name }}</template>
                <el-popover
                  v-else
                  placement="right-start"
                  popper-class="my-popper"
                  width="200"
                  style="height: 30px;padding: 0;"
                  trigger="hover"
                  content="没有村卫生室，所以不可选">
                  <span slot="reference">{{ option.name }}</span>
                </el-popover>
              </span>
            </el-transfer>
          </div>
          <div class="sup-c2-btn">
            <el-button type="primary" :disabled="addBaseNewDetail.budgetAmount === '' || addBaseNewDetail.quarter === '' || addBaseNewDetail.year === '' || addBaseNewDetail.appropriateTime === '' || addBaseNewDetail.deadlineTime === '' || !curBaseTownHospList.length" @click="saveUpdateBase" v-if="addBaseNewDetail.uid">保存</el-button>
            <el-button type="primary" :disabled="addBaseNewDetail.budgetAmount === '' || addBaseNewDetail.quarter === '' || addBaseNewDetail.year === '' || addBaseNewDetail.appropriateTime === '' || addBaseNewDetail.deadlineTime === '' || !curBaseTownHospList.length" @click="saveAddBase" v-else>保存</el-button>
            <el-button @click="supTwoCancel">取消</el-button>
          </div>
        </div>
      </div>
      <!--基础项目预算详情-->
      <div class="sup-content" v-show="sideTwoCurP === 3">
        <div class="sup-c3-detail">
          <span>项目年度：{{addBaseNewDetail.year}}</span>
          <span>项目季度：{{addBaseNewDetail.quarter === '9' ? '年终考核' : (addBaseNewDetail.quarter + '季度')}}</span>
          <span>项目代码：{{addBaseNewDetail.quotaNum}}</span>
          <span>预算总金额：{{addBaseNewDetail.budgetAmount}}元</span>
          <span>发放时间：{{addBaseNewDetail.appropriateTime | moment}}</span>
          <span>截止时间：{{addBaseNewDetail.deadlineTime | moment}}</span>
          <span>项目状态：<span :style="{'color': statusColor[addBaseNewDetail.status]}">{{proCurStates[addBaseNewDetail.status]}}</span></span>
        </div>
        <div class="sup-c3-search">
          乡镇卫生院：
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="baseHospitalExeUid"
            @focus="isDown = true"
            @blur="isDown = false"
            :fetch-suggestions="querySearch2"
            placeholder="请输入内容"
            @select="handleSelect">
            <i
              :class="{'is-down': isDown}"
              class="el-icon-arrow-down el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
          <el-button  icon="el-icon-search" @click.native="baseBudgetDetail(addBaseNewDetail, false)">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          <el-button type="primary" :disabled="baseIsAllEntry || addBaseNewDetail.status !== '0'" @click.native="budgetEntry">录入预算</el-button>
          <el-button :disabled="!baseIsAllEntry || addBaseNewDetail.status !== '0'" @click.native="releaseBaseBudget" >发布预算</el-button>
          <el-button  :disabled="addBaseNewDetail.status !== '0'" style="float: right;position: relative;">
            导入
            <input v-show="addBaseNewDetail.status === '0'" type="file" @change="importExc" style="overflow: hidden;opacity: 0;filter:Alpha(opacity=0);position: absolute;top: 0;left: 0;width: 100%;height: 100%;" id="baseImportExc" accept=".xls">
          </el-button>
          <el-button  :disabled="addBaseNewDetail.status !== '0'" @click.native="downloadExc(addBaseNewDetail.uid)" style="width: 122px;">下载导入模板</el-button>
        </div>
        <el-table
          :data="baseBudgetTownHospList"
          key="tabel5"
          stripe
          :show-overflow-tooltip="true"
          show-summary
          :summary-method="getSummaries3"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="100">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            label="乡镇卫生院"
            width="232">
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="176"
            label="预算总金额（元）">
            <template slot-scope="scope">
              {{scope.row.budgetAmount ? scope.row.budgetAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="hospBudgetAmount"
            width="176"
            label="卫生院预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.hospBudgetAmount ? scope.row.hospBudgetAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="doctorBudgetAmount"
            width="196"
            label="乡村医生预算总金额（元）">
            <template slot-scope="scope">
              {{scope.row.doctorBudgetAmount ? scope.row.doctorBudgetAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="176">
            <template slot-scope="scope">
              <span  class="cancel-reg" @click="reviseBudgetEntry(scope.row)" v-if="scope.row.budgetAmount && addBaseNewDetail.status === '0'">修改</span>
              <span  class="cant-tap" v-else>修改</span>
              <span  class="cancel-reg" @click="showVillageDetail(scope.row, true)" v-if="scope.row.budgetAmount">村卫生室详情</span>
              <span  class="cant-tap" v-else>村卫生室详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--基础项目预算详情里的村卫生室详情-->
      <div class="sup-content" v-show="sideTwoCurP === 4">
        <div class="sup-c3-detail">
          <span>项目年度：{{addBaseNewDetail.year}}</span>
          <span>项目季度：{{addBaseNewDetail.quarter === '9' ? '年终考核' : (addBaseNewDetail.quarter + '季度')}}</span>
          <span>项目代码：{{addBaseNewDetail.quotaNum ? addBaseNewDetail.quotaNum : '无'}}</span>
          <span>实施单位：{{curHospDetail.townshipHospName}}</span>
        </div>
        <div class="sup-c3-search">
          村卫生室：
          <el-select v-model="vHospitalExeUid" style="width: 200px;" placeholder="请选择">
            <el-option
              v-for="item in curVillageHospList"
              :key="item.clinicExeUid"
              :label="item.name"
              :value="item.clinicExeUid">
            </el-option>
          </el-select>
          <el-button  icon="el-icon-search" @click.native="showVillageDetail(curHospDetail, false)">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          <el-button type="primary" :disabled="baseVAllEntry" @click.native="villageEntry">录入预算</el-button><button style="display: none;"></button>
        </div>
        <el-table
          :data="villageHosPListData"
          key="tabel6"
          stripe
          show-summary
          :show-overflow-tooltip="true"
          :summary-method="getSummaries4"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            label="村卫生室名称"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageDoctorName"
            width="176"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="villageDoctorBankAccount"
            width="200"
            label="一卡通账号">
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="176"
            label="预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.budgetAmount ? scope.row.budgetAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="176">
            <template slot-scope="scope">
              <span style="padding: 0px;"  class="cancel-reg" @click="reviseVillageEntry(scope.row)" v-if="scope.row.budgetAmount && addBaseNewDetail.status === '0'">修改</span>
              <span style="padding: 0px;" class="cant-tap" v-else>修改</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--基础项目预算详情里的录入预算页-->
      <div class="sup-content" v-if="sideTwoCurP === 5">
        <div class="sup-c3-detail">
          <span>项目年度：{{addBaseNewDetail.year}}</span>
          <span>项目季度：{{addBaseNewDetail.quarter === '9' ? '年终考核' : (addBaseNewDetail.quarter  + '季度')}}</span>
          <span>项目代码：{{addBaseNewDetail.quotaNum ? addBaseNewDetail.quotaNum : '无'}}</span>
        </div>
        <div class="sup-c2-t">
          <div class="sup-c2-t1" style="margin-left: 0;">
            <p style="height: 16px;"></p>
            <div class="sup-c2t1-item">
              <span class="red-star">乡镇卫生院：</span>
              <el-select v-model="budgetEntryData.uid" v-if="!canSelectVillage" @change="chooseTownHosp" style="width: 200px;" placeholder="请选择">
                <el-option
                  v-for="item in baseEntryHospList"
                  :key="item.uid"
                  :label="item.name"
                  :value="item.uid">
                </el-option>
              </el-select>
              <el-input :disabled="true" v-model="budgetEntryData.townshipHospName"  style="width: 200px;height: 32px;" v-else></el-input>
            </div>
            <br>
            <div class="sup-c2t1-item">
              <span class="red-star">预算总金额：</span>
              <el-form :model="budgetEntryData" class="demo-ruleForm">
                <el-form-item
                  prop="budgetAmount"
                  :rules="[
                    {validator: validateNum, required: false}
                  ]"
                >
                  <el-input type="budgetAmount" style="width: 200px;height: 32px;" v-model="budgetEntryData.budgetAmount" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <i>元</i>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">卫生院预算总金额：</span>
              <el-form :model="budgetEntryData" class="demo-ruleForm">
                <el-form-item
                  prop="hospBudgetAmount"
                  :rules="[
                    {validator: validateNum, required: false}
                  ]"
                >
                  <el-input type="hospBudgetAmount" style="width: 200px;height: 32px;" v-model="budgetEntryData.hospBudgetAmount" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <i>元</i>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">乡村医生预算总金额：</span>
              <el-form :model="budgetEntryData" class="demo-ruleForm">
                <el-form-item
                  prop="doctorBudgetAmount"
                  :rules="[
                    {validator: validateNum, required: false}
                  ]"
                >
                  <el-input type="doctorBudgetAmount" style="width: 140px;height: 32px;" v-model="budgetEntryData.doctorBudgetAmount" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <i>元</i>
            </div>
          </div>
        </div>
        <div class="sup-c2-b">
          <p class="red-star">村卫生室：<span style="margin-left: 16px">已选{{villageHospSelected.length ? villageHospSelected.length : 0}}个</span></p>
          <div class="">
            <el-transfer
              style="text-align: left; display: inline-block;"
              v-model="villageHospSelected"
              filterable
              :titles="['待选列表', '已选列表']"
              :button-texts="['取消', '选择']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              @change="supC2HandleChange"
              :data="villageHospUnselect">
              <span slot-scope="{ option }">
                <template v-if="!option.disabled">{{ option.name }}</template>
                <el-popover
                  v-else
                  placement="right-start"
                  popper-class="my-popper"
                  width="200"
                  style="height: 30px;padding: 0;"
                  trigger="hover"
                  content="该村卫生室暂无村医，不可选择">
                  <span slot="reference">{{ option.name }}</span>
                </el-popover>
              </span>
            </el-transfer>
          </div>
          <div class="sup-c2-btn">
            <el-button type="primary" :disabled="!budgetEntryData.budgetAmount || !budgetEntryData.hospBudgetAmount || !budgetEntryData.doctorBudgetAmount || !villageHospSelected.length" @click="saveDudget(false)">保存</el-button>
            <el-button type="primary" v-if="!canSelectVillage" :disabled="!budgetEntryData.budgetAmount || !budgetEntryData.hospBudgetAmount || !budgetEntryData.doctorBudgetAmount || !villageHospSelected.length" @click="saveDudget(true)" style="width: 106px;">保存并新增</el-button>
            <el-button @click.native="cancelEntryBase">取消</el-button>
          </div>
        </div>
      </div>
      <!--基础项目执行详情-->
      <div class="sup-content" v-show="sideTwoCurP === 6">
        <div class="sup-c3-detail">
          <span>项目年度：{{addBaseNewDetail.year}}</span>
          <span>项目季度：{{addBaseNewDetail.quarter === '9' ? '年终考核' : (addBaseNewDetail.quarter + '季度')}}</span>
          <span>项目代码：{{addBaseNewDetail.quotaNum ? addBaseNewDetail.quotaNum : '无'}}</span>
          <span>预算总金额：{{addBaseNewDetail.budgetAmount}}元</span>
          <span>发放时间：{{addBaseNewDetail.appropriateTime | moment}}</span>
          <span>截止时间：{{addBaseNewDetail.deadlineTime | moment}}</span>
          <span>项目状态：<span :style="{'color': statusColor[addBaseNewDetail.status]}">{{proCurStates[addBaseNewDetail.status]}}</span></span>
        </div>
        <div class="sup-c3-search">
          乡镇卫生院：
          <el-autocomplete
            style="margin-right: 45px"
            popper-class="my-autocomplete"
            v-model="baseHospitalExeUid"
            @focus="isDown = true"
            @blur="isDown = false"
            :fetch-suggestions="querySearch2"
            placeholder="请输入内容"
            @select="handleSelect">
            <i
              :class="{'is-down': isDown}"
              class="el-icon-arrow-down el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
          状态：
          <el-select v-model="baseExecuteStatus" style="width: 200px;" placeholder="请选择">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              v-for="item in executeStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click.native="baseExecuteDetail(addBaseNewDetail, false)"  icon="el-icon-search">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          逾期能否提交：
          <el-radio-group v-model="baseIsSubmit" @change="baseIsSubmitUpdate">
            <el-radio label="0">不能</el-radio>
            <el-radio style="margin-right: 80px;" label="1">能</el-radio>
          </el-radio-group>
          能否修改：
          <el-radio-group v-model="baseIsChange" @change="baseIsChangeUpdate">
            <el-radio label="0">不能</el-radio>
            <el-radio label="1">能</el-radio>
          </el-radio-group>
        </div>
        <el-table
          :data="baseExecuteTownHospList"
          key="tabel7"
          stripe
          show-summary
          :show-overflow-tooltip="true"
          :summary-method="getSummaries7"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            min-width="116">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            :show-overflow-tooltip="true"
            label="乡镇卫生院"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="executeStatus"
            min-width="116"
            label="状态">
            <template slot-scope="scope">
              <i v-if="scope.row.executeStatus === '1'" style="background-color:#1890FF;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.executeStatus === '2'" style="background-color:#EF5555;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.executeStatus === '0'" style="background-color:#FB8C00;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <font  :style="{'color': scope.row.executeStatus === '2' ? '#EF5555' : 'rgba(102, 102, 102)'}">{{scope.row.executeStatus === '2' ? '已逾期' : scope.row.executeStatus === '0' ? '未提交' : '已提交'}}</font>
            </template>
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            min-width="150"
            label="预算总金额">
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            min-width="150"
            label="实发总金额">
            <template slot-scope="scope">
              {{scope.row.actualAmount ? scope.row.actualAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="hospBudgetAmount"
            min-width="150"
            label="卫生院预算金额">
            <template slot-scope="scope">
              {{scope.row.hospBudgetAmount ? scope.row.hospBudgetAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="hospActualAmount"
            min-width="150"
            label="卫生院实发金额">
            <template slot-scope="scope">
              {{scope.row.hospActualAmount ? scope.row.hospActualAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="doctorBudgetAmount"
            min-width="150"
            label="乡村医生预算总金额">
          </el-table-column>
          <el-table-column
            prop="doctorActualAmount"
            min-width="150"
            label="乡村医生实发总金额">
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            min-width="200">
            <template slot-scope="scope">
              <span  class="cancel-reg" @click="showExecuteVillageDetail(scope.row, true)" v-if="scope.row.executeStatus === '1'">村卫生室详情</span>
              <span  class="cant-tap" v-else>村卫生室详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--基础项目执行详情里的村卫生室详情-->
      <div class="sup-content" v-if="sideTwoCurP === 7">
        <div class="sup-c3-detail">
          <span>项目年度：{{addBaseNewDetail.year}}</span>
          <span>项目季度：{{addBaseNewDetail.quarter === '9' ? '年终考核' : (addBaseNewDetail.quarter + '季度')}}</span>
          <span>项目代码：{{addBaseNewDetail.quotaNum ? addBaseNewDetail.quotaNum : '无'}}</span>
          <span>实施单位：{{curHospDetail.townshipHospName}}</span>
        </div>
        <div class="sup-c3-search">
          村卫生室：
          <el-select v-model="vHospitalExeUid" style="width: 200px;" placeholder="请选择">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              v-for="item in curVillageHospList"
              :key="item.clinicExeUid"
              :label="item.name"
              :value="item.clinicExeUid">
            </el-option>
          </el-select>
          <el-button  icon="el-icon-search" @click.native="showExecuteVillageDetail(curHospDetail, false)">搜索</el-button>
        </div>
        <el-table
          :data="villageHosPListData"
          key="tabel8"
          stripe
          :show-overflow-tooltip="true"
          show-summary
          :summary-method="getSummaries2"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="106">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            label="村卫生室名称"
            width="246">
          </el-table-column>
          <el-table-column
            prop="villageDoctorName"
            width="156"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="villageDoctorBankAccount"
            width="196"
            label="一卡通账号">
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="176"
            label="预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.budgetAmount ? scope.row.budgetAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="176"
            label="实发金额（元）">
          </el-table-column>
          <el-table-column
            width="176"
            label="转账回执单">
            <template slot-scope="scope">
              <span v-if="scope.row.appendices[0]" @click="previewPictures(scope.row.appendices[0].fileFullPath, 'bigPic')" style="color: #1890FF">查看图片</span>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="description"
            width="176">
            <template slot-scope="scope">
              <p v-if="scope.row.description">{{scope.row.description}}</p>
              <p v-else>--</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--查看大图-->
    <div class="show-big-pic" v-show="showBigPic" @click="showBigPic = false">
      <img :src="bigPicUrl" alt="">
    </div>
    <!--分页-->
    <div class="pagination-box" v-if="pagination.total" v-show="sideTwoCurP !== 2 && sideTwoCurP !== 5">
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
    <!--基础项目录入村卫生室-->
    <el-dialog
      title="村卫生室预算"
      :visible.sync="villageEntryDialog"
      :close-on-click-modal="false"
      width="750px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <span>实施单位：</span>{{curHospDetail.townshipHospName}}
        </div>
        <div class="town-entry-row">
          <span class="red-star">村卫生室：</span>
          <el-select v-model="baseVillageUid" @change="baseChooseVillage" style="width: 200px;" v-if="!baseVillageEntryCanSelect" placeholder="请选择">
            <el-option
              v-for="item in baseVillageEntryList"
              :key="item.clinicExeUid"
              :label="item.name"
              :value="item.clinicExeUid">
            </el-option>
          </el-select>
          <el-input :disabled="true" v-model="baseCurVillageEntryName"  style="width: 200px;height: 32px;" v-else></el-input>
        </div>
        <div class="town-entry-row" v-for="item in baseVillageEntryData" :key="item.id">
          <span style="vertical-align: middle;" class="">村医姓名：</span><el-input disabled style="width: 100px;" v-model="item.villageDoctorName"></el-input>
          <span style="vertical-align: middle;" class="">一卡通账号：</span>
          <el-input disabled style="width: 170px;" v-model="item.villageDoctorBankAccount"></el-input>
          <span style="vertical-align: middle;" class="red-star">预算金额：</span>
          <el-form :model="item" class="demo-ruleForm">
            <el-form-item
              prop="budgetAmount"
              :rules="[
                    {validator: validateNum, required: false}
                  ]"
            >
              <el-input type="budgetAmount" style="width: 120px;height: 32px;" v-model="item.budgetAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isActive(baseVillageEntryData)"  @click.native="baseSaveVillageEntry(false)">保存</el-button>
        <el-button type="primary" :disabled="isActive(baseVillageEntryData)"  v-if="!baseVillageEntryCanSelect"  style="width: 106px" @click.native="baseSaveVillageEntry(true)">保存并新增</el-button>
        <el-button @click.native="villageEntryDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--提示框-->
    <el-dialog
      :visible.sync="tipDialog"
      width="330px"
      :close-on-click-modal="false"
      center>
      <div class="town-entry-box">
        <p>{{tipDialogMsg}}</p>
      </div>
      <span slot="footer" class="dialog-footer" >
        <el-button type="primary" @click.native="comfirmTip">确定</el-button>
        <el-button @click.native="cancelTip">取 消</el-button>
      </span>
    </el-dialog>
    <!--基卫项目导出-->
    <el-dialog
      title="基卫补助导出"
      :visible.sync="exportDialog"
      width="340px"
      :close-on-click-modal="false"
      center>
      <div class="town-entry-box">
        <span class="red-star">导出类型：</span>
        <el-select @change="chooseBaseType"  v-model="exportBaseParams.where.type" style="width: 200px;" placeholder="请选择">
          <el-option
            label="预算"
            value="1">
          </el-option>
          <el-option
            label="执行情况"
            value="2">
          </el-option>
        </el-select>
      </div>
      <div class="town-entry-box" style="margin: 16px;">
        <span class="red-star">项目年度：</span>
        <el-select @change="chooseBaseYear" v-model="exportBaseParams.where.year" style="width: 200px;" placeholder="请选择">
          <el-option
            v-for="item in exportProYear"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="town-entry-box">
        <span class="white-star">项目季度：</span>
        <el-select v-model="exportBaseParams.where.quarter" style="width: 200px;" placeholder="请选择">
          <el-option
            v-for="item in baseCurQuarterList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer" >
        <el-button :disabled="!exportBaseParams.where.year || !exportBaseParams.where.type" type="primary" @click.native="comfirmExportBase">确定</el-button>
        <el-button @click.native="exportDialog = false">取 消</el-button>
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
      tipDialog: false,
      tipDialogMsg: '',
      tipDialogUid: '',
      tipType: 0, // 0 逾期提交，1能否修改
      isDown: false, // 模糊搜索卫生院之类的，是否获取焦点，箭头向下
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
          {name: '基本公卫服务补助', sideType: 1, sideCurP: 1}
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
      proStateList: [
        {label: '未发布', value: '0'},
        {label: '进行中', value: '1'},
        {label: '已完成', value: '2'},
        {label: '已逾期', value: '3'}
      ],
      // 卫计项目
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
      baseAddBudgetType: 0 // 0新增，1修改
    }
  },
  mounted () {
    this.getCurYear();
    this.getBaseList();
  },
  methods: {
    supC2HandleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    filterMethod (query, item) {
      return item.name.indexOf(query) > -1;
    },
    checkOtherDate (e) {
      let d1 = new Date(e);
      let y = d1.getFullYear();
      let m = d1.getMonth() + 1;
      let da = d1.getDate();
      let d2 = new Date();
      let y1 = d2.getFullYear();
      let m1 = d2.getMonth() + 1;
      let da1 = d2.getDate();
      console.log(y, m, da, y1, m1, da1);
      console.log(y < y1)
      if (y < y1) {
        this.addNewDetail.appropriateTime = '';
        this.addBaseNewDetail.appropriateTime = '';
        this.$message({message: '预拨时间必须是将来的时间', type: 'warning'})
      } else if (y === y1) {
        if (m < m1) {
          this.addNewDetail.appropriateTime = '';
          this.addBaseNewDetail.appropriateTime = '';
          this.$message({message: '预拨时间必须是将来的时间', type: 'warning'})
        } else if (m === m1) {
          if (da < da1) {
            this.addNewDetail.appropriateTime = '';
            this.addBaseNewDetail.appropriateTime = '';
            this.$message({message: '预拨时间必须是将来的时间', type: 'warning'})
          }
        }
      }
    },
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
    importExc () {
      let formData = new FormData();
      formData.append('name', $('#baseImportExc').val())
      formData.append('file', $('#baseImportExc')[0].files[0]);
      this.axios.post('/hisServices/financialSupervision/importTownshipHospNew', formData)
        .then(res => {
          if (res) {
            this.baseBudgetDetail(this.addBaseNewDetail, false)
          }
        })
    }, // 导入Excel
    exportExc (type, proUid) {
      let params = {
        where: {
          type: type,
          projectId: proUid
        }
      }
      let excelName = this.exportBaseParams.where.type === '1' ? '溆浦县卫计项目投入监测资金预算明细表.xls' : '溆浦县卫计项目投入监测资金发放明细表.xls'
      this.axios.get('/hisServices/financialSupervision/exportProjectMonitor/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))), {
        responseType: 'arraybuffer'
      }).then(res => {
        if (res) {
          let linkElement = document.createElement('a');
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          let url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute('download', excelName);
          let clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
          linkElement.dispatchEvent(clickEvent);
        }
      })
    }, // 导出excel
    downloadExc (proUid) {
      let params = {
        where: {
          projectUid: proUid
        }
      }
      this.axios.get('/hisServices/financialSupervision/exportServiceDoctorBudge/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))), {
        responseType: 'arraybuffer'
      }).then(res => {
        if (res) {
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          let filename = '溆浦县卫计惠农补贴项目资金预算明细表.xls';
          if ('download' in document.createElement('a')) {
            const downloadElement = document.createElement('a');
            let href = '';
            href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = filename;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            if (window.URL) window.URL.revokeObjectURL(href);
            else window.webkitURL.revokeObjectURL(href);
            document.body.removeChild(downloadElement);
          } else {
            navigator.msSaveBlob(blob, filename);
          }
        }
      })
    }, // 下载导入模板
    comfirmExportBase () {
      this.exportDialog = false;
      let excelName = this.exportBaseParams.where.type === '1' ? '溆浦县卫计惠农补贴项目资金预算明细表.xls' : '溆浦县卫计惠农补贴项目资金发放明细表.xls'
      this.axios.get('/hisServices/financialSupervision/exportServiceTownshipHosp/' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.exportBaseParams))), {
        responseType: 'arraybuffer'
      }).then(res => {
        if (res) {
          let linkElement = document.createElement('a');
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          let url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute('download', excelName);
          let clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
          linkElement.dispatchEvent(clickEvent);
        }
      })
    }, // 导出基卫项目
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
      this.vHospitalExeUid = '';
      this.sideTwoCurP = curP;
      this.baseHospitalExeUid = '';
      this.getBaseList();
      if (curP === 3) {
        console.log(this.addBaseNewDetail)
        this.baseBudgetDetail(this.addBaseNewDetail, false)
      }
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
      if (this.sideTwoCurP === 1) {
        this.getBaseList();
      } else if (this.sideTwoCurP === 3) {
        this.baseBudgetDetail(this.addBaseNewDetail, false); // 预算详情
      } else if (this.sideTwoCurP === 4) {
        this.showVillageDetail(this.curHospDetail, false); // 预算村卫生室详情
      } else if (this.sideTwoCurP === 6) {
        this.baseExecuteDetail(this.addBaseNewDetail, false); // 执行详情
      } else if (this.sideTwoCurP === 7) {
        this.showExecuteVillageDetail(this.curHospDetail, false); // 执行详情村卫生室详情
      }
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      if (this.sideTwoCurP === 1) {
        this.getBaseList();
      } else if (this.sideTwoCurP === 3) {
        this.baseBudgetDetail(this.addBaseNewDetail, false); // 预算详情
      } else if (this.sideTwoCurP === 4) {
        this.showVillageDetail(this.curHospDetail, false); // 预算村卫生室详情
      } else if (this.sideTwoCurP === 6) {
        this.baseExecuteDetail(this.addBaseNewDetail, false); // 执行详情
      } else if (this.sideTwoCurP === 7) {
        this.showExecuteVillageDetail(this.curHospDetail, false); // 执行详情村卫生室详情
      }
    },
    getSummaries2 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (index === 1) {
          sums[index] = this.allTotal.totalClinicNum;
        }
        if (index === 2) {
          sums[index] = this.allTotal.totalDoctorNum;
        }
        if (index === 4) {
          sums[index] = this.allTotal.totalBudgetAmount;
        }
        if (index === 5) {
          sums[index] = this.allTotal.totalActualAmount;
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
        if (index === 1) {
          sums[index] = this.allTotal.totalNum;
        }
        if (index === 2) {
          sums[index] = this.allTotal.totalBudgetAmount;
        }
        if (index === 3) {
          sums[index] = this.allTotal.totalHospBudgetAmount;
        }
        if (index === 4) {
          sums[index] = this.allTotal.totalDoctorBudgetAmount;
        }
      });
      return sums;
    },
    getSummaries4 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 1) {
          sums[index] = this.allTotal.totalClinicNum;
        }
        if (index === 2) {
          sums[index] = this.allTotal.totalDoctorNum;
        }
        if (index === 4) {
          sums[index] = this.allTotal.totalBudgetAmount;
        }
      });
      return sums;
    },
    getSummaries7 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 1) {
          sums[index] = this.allTotal.totalNum;
        }
        if (index === 3) {
          sums[index] = this.allTotal.totalBudgetAmount;
        }
        if (index === 4) {
          sums[index] = this.allTotal.totalActualAmount;
        }
        if (index === 5) {
          sums[index] = this.allTotal.totalHospBudgetAmount;
        }
        if (index === 6) {
          sums[index] = this.allTotal.totalHospActualAmount;
        }
        if (index === 7) {
          sums[index] = this.allTotal.totalDoctorBudgetAmount;
        }
        if (index === 8) {
          sums[index] = this.allTotal.totalDoctorActualAmount;
        }
      });
      return sums;
    },
    handleSelect (item) {
      console.log(item);
    },
    // 基础公卫
    querySearch2 (queryString, cb) {
      var restaurants = this.curBaseTownHospList;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    getBaseList () {
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
        }
      }
      if (this.proYear) {
        params.where['year'] = this.proYear;
      }
      if (this.baseQuarter) {
        params.where['quarter'] = this.baseQuarter;
      }
      if (this.quotaNum) {
        params.where['quotaNum'] = this.quotaNum;
      }
      console.log(this.proState)
      if (this.proState) {
        params.where['status'] = this.proState;
      }
      this.axios.get('/hisServices/financialSupervision/serviceSubsidies/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.baseList = res.data.list;
            console.log(this.baseList)
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          }
        })
    }, // 获取基础公卫列表
    checkBaseAdd (arr) {
      return arr.some(x => x.status === '0' || x.status === '1' || x.status === '3')
    },
    addNewBase () {
      this.addBaseNewDetail = {
        name: '基础公卫服务补助', // 名称
        year: '', // 年度
        quotaNum: '', // 指标文号
        quarter: '', // 季度
        appropriateTime: '', // 预拨时间
        deadlineTime: '', // 截止时间
        budgetAmount: '', // 预算总金额
        requirements: '' // 要求
      }
      this.townsBaseHospList = [];
      this.curBaseTownHospList = [];
      this.sideTwoCurP = 2;
      this.breadList['1'].push({name: '新增项目', sideType: 1, sideCurP: 2})
      // 获取卫计项目所有卫生院
      let p = {
        pageSize: 0,
        where: {
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.townsBaseHospList = res.data.list;
            this.townsBaseHospList.map(y => { y.disabled = !y.isExistsVillageClinic })
            this.townsBaseHospList.map((x, index) => { x.key = index + 1 })
          }
        })
    },
    chooseBaseYear (e) {
      this.baseCurQuarterList = [];
      this.exportBaseParams.where.quarter = '';
      this.addBaseNewDetail.quarter = '';
      let params = {
        year: e
      }
      if (this.exportDialog) {
        params['isProjectQuarter'] = true;
      }
      this.axios.get('/hisServices/financialSupervision/serviceSubsidy/quarters', {params})
        .then(res => {
          if (res) {
            res.data.forEach(x => {
              this.baseCurQuarterList.push(this.baseQuarterList.find(y => y.value === x))
            })
          }
        })
    },
    supTwoCancel () {
      this.breadList['1'].splice(1);
      this.sideTwoCurP = 1;
    }, // 取消
    reviseBasePro (uid) {
      this.baseCurQuarterList = [];
      this.curBaseTownHospList = [];
      this.townsBaseHospList = [];
      this.sideTwoCurP = 2;
      this.breadList['1'].push({name: '修改项目', sideType: 1, sideCurP: 2})
      let params = {
        uid: uid
      }
      // 获取该卫计项目的详情，填入addNewDetail
      this.axios.get('/hisServices/financialSupervision/serviceSubsidy', {params})
        .then(res => {
          if (res) {
            this.addBaseNewDetail = res.data;
            this.axios.get('/hisServices/financialSupervision/serviceSubsidy/quarters', {params: {year: res.data.year}})
              .then(res1 => {
                if (res1) {
                  res1.data.forEach(x => {
                    this.baseCurQuarterList.push(this.baseQuarterList.find(y => y.value === x))
                  })
                }
              })
          }
        })
      // 获取该卫计项目所有卫生院
      let p = {
        pageSize: 0,
        where: {
          projectUid: uid,
          status: '2'
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.townsBaseHospList = res.data.list;
            this.townsBaseHospList.map((x, index) => { x.key = index + 1 })
            this.townsBaseHospList.map(y => { y.disabled = !y.isExistsVillageClinic })
            console.log(this.addBaseNewDetail)
            res.data.list.forEach((item, index) => { if (item.isSelected === true) { this.curBaseTownHospList.push(index + 1) } })
          }
        })
    }, // 修改基础公卫项目
    saveUpdateBase () {
      this.addBaseNewDetail.status = null;
      this.addBaseNewDetail.updateType = null;
      this.addBaseNewDetail.overdueType = null;
      this.addBaseNewDetail.hospList = [];
      this.curBaseTownHospList.forEach(x => {
        let o = {
          townshipHospUid: this.townsBaseHospList[x - 1].uid,
          townshipHospName: this.townsBaseHospList[x - 1].name
        }
        this.addBaseNewDetail.hospList.push(o);
      })
      this.axios.put('/hisServices/financialSupervision/serviceSubsidy', this.addBaseNewDetail)
        .then(res => {
          if (res) {
            this.$message.success('修改成功');
            this.sideTwoCurP = 1;
            this.breadList['1'].splice(1, 1);
            this.getBaseList();
          }
        })
    }, // 修改项目
    saveAddBase () {
      this.addBaseNewDetail.hospList = [];
      this.curBaseTownHospList.forEach(x => {
        let o = {
          townshipHospUid: this.townsBaseHospList[x - 1].uid,
          townshipHospName: this.townsBaseHospList[x - 1].name
        }
        this.addBaseNewDetail.hospList.push(o)
      })
      this.axios.post('/hisServices/financialSupervision/serviceSubsidy', this.addBaseNewDetail)
        .then(res => {
          if (res) {
            this.$message.success('新增成功');
            this.sideTwoCurP = 1;
            this.breadList['1'].splice(1, 1);
            this.getBaseList();
          }
        })
    }, // 保存新增项目
    baseBudgetDetail (item, addBread) {
      this.baseHospitalExeUid = '';
      this.sideTwoCurP = 3;
      if (addBread) {
        this.breadList['1'].push({name: '预算详情', sideType: 1, sideCurP: 3})
      }
      this.addBaseNewDetail = item;
      // 获取该卫计项目选择的卫生院
      let p = {
        pageSize: 0,
        where: {
          projectUid: item.uid,
          status: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.curBaseTownHospList = res.data.list;
            this.curBaseTownHospList.map(x => {
              x.value = x.name;
            })
            this.curBaseTownHospList.splice(0, 0, {value: '全部卫生院', hospitalExeUid: ''})
          }
        })
      // 获取该项目卫生院预算详情
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
          projectUid: item.uid,
          detailType: '0'
        }
      }
      let hospitalExeUid = '';
      if (this.curBaseTownHospList.some(m => m.value === this.baseHospitalExeUid)) {
        hospitalExeUid = this.curBaseTownHospList.find(m => m.value === this.baseHospitalExeUid).hospitalExeUid;
      }
      if (hospitalExeUid) {
        params.where['hospitalExeUid'] = hospitalExeUid;
      }
      this.axios.get('/hisServices/financialSupervision/serviceTownshipHosps/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.baseBudgetTownHospList = res.data.page.list;
            this.baseIsAllEntry = res.data.allEntry;
            this.pagination.pageNum = res.data.page.pageNum;
            this.pagination.total = res.data.page.total;
            this.allTotal = {
              totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
              totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
              totalDoctorActualAmount: res.data.totalDoctorActualAmount ? res.data.totalDoctorActualAmount : null,
              totalDoctorBudgetAmount: res.data.totalDoctorBudgetAmount ? res.data.totalDoctorBudgetAmount : null,
              totalHospActualAmount: res.data.totalHospActualAmount ? res.data.totalHospActualAmount : null,
              totalHospBudgetAmount: res.data.totalHospBudgetAmount ? res.data.totalHospBudgetAmount : null,
              totalNum: res.data.totalNum ? res.data.totalNum : null,
              totalVillageClinic: res.data.totalVillageClinic ? res.data.totalVillageClinic : null,
              totalTownshipHosp: res.data.totalTownshipHosp ? res.data.totalTownshipHosp : null,
              totalDocActualAmount: res.data.totalDocActualAmount ? res.data.totalDocActualAmount : null,
              totalDocBudgetAmount: res.data.totalDocBudgetAmount ? res.data.totalDocBudgetAmount : null,
              totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
              totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
            }
          }
        })
    }, // 基础预算详情
    baseExecuteDetail (item, addBread) {
      this.baseHospitalExeUid = '';
      this.baseIsSubmit = item.overdueType;
      this.baseIsChange = item.updateType;
      this.sideTwoCurP = 6;
      if (addBread) {
        this.breadList['1'].push({name: '执行详情', sideType: 1, sideCurP: 6})
      }
      this.addBaseNewDetail = item;
      // 获取该卫计项目选择的卫生院
      let p = {
        pageSize: 0,
        where: {
          projectUid: item.uid,
          status: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.curBaseTownHospList = res.data.list;
            this.curBaseTownHospList.map(x => {
              x.value = x.name;
            })
            this.curBaseTownHospList.splice(0, 0, {value: '全部卫生院', hospitalExeUid: ''})
          }
        })
      // 获取该项目卫生院预算详情
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
          projectUid: item.uid,
          detailType: '1'
        }
      }
      let hospitalExeUid = '';
      if (this.curBaseTownHospList.some(m => m.value === this.baseHospitalExeUid)) {
        hospitalExeUid = this.curBaseTownHospList.find(m => m.value === this.baseHospitalExeUid).hospitalExeUid;
      }
      if (hospitalExeUid) {
        params.where['hospitalExeUid'] = hospitalExeUid;
      }
      if (this.baseExecuteStatus) {
        params.where['executeStatus'] = this.baseExecuteStatus;
      }
      this.axios.get('/hisServices/financialSupervision/serviceTownshipHosps/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.baseExecuteTownHospList = res.data.page.list;
            this.pagination.pageNum = res.data.page.pageNum;
            this.pagination.total = res.data.page.total;
            this.allTotal = {
              totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
              totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
              totalDoctorActualAmount: res.data.totalDoctorActualAmount ? res.data.totalDoctorActualAmount : null,
              totalDoctorBudgetAmount: res.data.totalDoctorBudgetAmount ? res.data.totalDoctorBudgetAmount : null,
              totalHospActualAmount: res.data.totalHospActualAmount ? res.data.totalHospActualAmount : null,
              totalHospBudgetAmount: res.data.totalHospBudgetAmount ? res.data.totalHospBudgetAmount : null,
              totalNum: res.data.totalNum ? res.data.totalNum : null,
              totalVillageClinic: res.data.totalVillageClinic ? res.data.totalVillageClinic : null,
              totalTownshipHosp: res.data.totalTownshipHosp ? res.data.totalTownshipHosp : null,
              totalDocActualAmount: res.data.totalDocActualAmount ? res.data.totalDocActualAmount : null,
              totalDocBudgetAmount: res.data.totalDocBudgetAmount ? res.data.totalDocBudgetAmount : null,
              totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
              totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
            }
          }
        })
    }, // 基础执行详情
    showVillageDetail (item, addBread) {
      console.log(item)
      this.curHospDetail = item;
      this.sideTwoCurP = 4;
      if (addBread) {
        this.breadList['1'].splice(2, this.breadList['1'].length, {name: '村卫生室详情', sideType: 1, sideCurP: 4})
      }
      // 获取该基础项目选择的村卫生室
      let p = {
        pageSize: 0,
        where: {
          hospitalExeUid: item.uid,
          status: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.curVillageHospList = res.data.list;
          }
        })
      // 获取该基础项目未选择的村卫生室
      let p1 = {
        pageSize: 0,
        where: {
          hospitalExeUid: item.uid,
          status: '0'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
        .then(res => {
          if (res) {
            this.baseVillageEntryList = res.data.list;
          }
        })
      // 获取该项目村卫生室预算详情
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
          hospitalExeUid: item.uid,
          detailType: '0'
        }
      }
      if (this.vHospitalExeUid) {
        params.where['clinicExeUid'] = this.vHospitalExeUid;
      }
      this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.baseVAllEntry = res.data.allEnter;
            this.villageHosPListData = res.data.page.list;
            this.pagination.pageNum = res.data.page.pageNum;
            this.pagination.total = res.data.page.total;
            this.allTotal = {
              totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
              totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
              totalDoctorActualAmount: res.data.totalDoctorActualAmount ? res.data.totalDoctorActualAmount : null,
              totalDoctorBudgetAmount: res.data.totalDoctorBudgetAmount ? res.data.totalDoctorBudgetAmount : null,
              totalHospActualAmount: res.data.totalHospActualAmount ? res.data.totalHospActualAmount : null,
              totalHospBudgetAmount: res.data.totalHospBudgetAmount ? res.data.totalHospBudgetAmount : null,
              totalNum: res.data.totalNum ? res.data.totalNum : null,
              totalVillageClinic: res.data.totalVillageClinic ? res.data.totalVillageClinic : null,
              totalTownshipHosp: res.data.totalTownshipHosp ? res.data.totalTownshipHosp : null,
              totalDocActualAmount: res.data.totalDocActualAmount ? res.data.totalDocActualAmount : null,
              totalDocBudgetAmount: res.data.totalDocBudgetAmount ? res.data.totalDocBudgetAmount : null,
              totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
              totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
            }
          }
        })
      console.log('aa')
    }, // 预算详情村卫生室详情
    showExecuteVillageDetail (item, addBread) {
      this.curHospDetail = item;
      this.sideTwoCurP = 7;
      if (addBread) {
        this.breadList['1'].splice(2, this.breadList['1'].length, {name: '村卫生室详情', sideType: 1, sideCurP: 7})
      }
      // 获取该基础项目选择的村卫生室
      let p = {
        where: {
          hospitalExeUid: item.uid,
          status: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.curVillageHospList = res.data.list;
          }
        })
      // 获取该项目村卫生室预算详情
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
          hospitalExeUid: item.uid,
          detailType: '1'
        }
      }
      if (this.vHospitalExeUid) {
        params.where['clinicExeUid'] = this.vHospitalExeUid;
      }
      this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.villageHosPListData = res.data.page.list;
            this.pagination.pageNum = res.data.page.pageNum;
            this.pagination.total = res.data.page.total;
            this.allTotal = {
              totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
              totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
              totalDoctorActualAmount: res.data.totalDoctorActualAmount ? res.data.totalDoctorActualAmount : null,
              totalDoctorBudgetAmount: res.data.totalDoctorBudgetAmount ? res.data.totalDoctorBudgetAmount : null,
              totalHospActualAmount: res.data.totalHospActualAmount ? res.data.totalHospActualAmount : null,
              totalHospBudgetAmount: res.data.totalHospBudgetAmount ? res.data.totalHospBudgetAmount : null,
              totalNum: res.data.totalNum ? res.data.totalNum : null,
              totalVillageClinic: res.data.totalVillageClinic ? res.data.totalVillageClinic : null,
              totalTownshipHosp: res.data.totalTownshipHosp ? res.data.totalTownshipHosp : null,
              totalDocActualAmount: res.data.totalDocActualAmount ? res.data.totalDocActualAmount : null,
              totalDocBudgetAmount: res.data.totalDocBudgetAmount ? res.data.totalDocBudgetAmount : null,
              totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
              totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
            }
          }
        })
    }, // 执行详情村卫生室详情
    switchBaseProSubmit (type) {
      let params = {
        overdueType: type,
        uid: this.addBaseNewDetail.uid
      }
      this.axios.put('/hisServices/financialSupervision/serviceSubsidy', params)
        .then(res => {
          if (res) {
            this.$message.success('设置成功');
            this.tipDialog = false;
          }
        })
    },
    switchBaseProChange (type) {
      let params = {
        updateType: type,
        uid: this.addBaseNewDetail.uid
      }
      this.axios.put('/hisServices/financialSupervision/serviceSubsidy', params)
        .then(res => {
          if (res) {
            this.$message.success('设置成功');
            this.tipDialog = false;
          }
        })
    },
    villageEntry () {
      this.villageEntryDialog = true;
      this.baseVillageEntryCanSelect = false;
      this.baseVillageUid = '';
      this.baseVillageEntryData = [];
    },
    reviseVillageEntry (item) {
      console.log(item)
      this.baseVillageEntryData = [];
      this.villageEntryDialog = true;
      this.baseVillageEntryCanSelect = true;
      this.baseCurVillageEntryName = item.villageClinicName;
      this.baseVillageEntryData.push(item);
    },
    budgetEntry () {
      this.baseAddBudgetType = 0;
      this.villageHospUnselect = [];
      this.villageHospSelected = [];
      this.budgetEntryData = {
        uid: '',
        hospitalExeUid: '',
        budgetAmount: '',
        hospBudgetAmount: '',
        doctorBudgetAmount: ''
      }; // 录入预算的数据
      this.canSelectVillage = false;
      this.sideTwoCurP = 5;
      this.breadList['1'].splice(2, this.breadList['1'].length, {name: '录入预算', sideType: 1, sideCurP: 5})
      // 获取该卫计项目未选择的卫生院
      let p1 = {
        where: {
          projectUid: this.addBaseNewDetail.uid,
          status: '0'
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
        .then(res => {
          if (res) {
            this.baseEntryHospList = res.data.list;
          }
        })
    },
    reviseBudgetEntry (item) {
      console.log(item)
      this.villageHospUnselect = [];
      this.villageHospSelected = [];
      this.baseAddBudgetType = 1;
      this.budgetEntryData = item;
      this.budgetEntryData.hospitalExeUid = item.uid;
      this.canSelectVillage = true;
      this.sideTwoCurP = 5;
      this.breadList['1'].splice(2, this.breadList['1'].length, {name: '修改预算', sideType: 1, sideCurP: 5});
      // 获取该基础项目未录入的村卫生室
      let p = {
        pageSize: 0,
        where: {
          hospitalExeUid: item.uid,
          status: '2'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.villageHospUnselect = res.data.list;
            this.villageHospUnselect.map(y => { y.disabled = !y.isExistsVillageDoctor })
            this.villageHospUnselect.map((x, index) => { x.key = index + 1 })
            res.data.list.forEach((item, index) => { if (item.isSelected === true) { this.villageHospSelected.push(index + 1) } })
          }
        })
      let p1 = {
        pageSize: 0,
        where: {
          hospitalExeUid: item.uid,
          status: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
        .then(res => {
          if (res) {
            this.budgetEntryData.clinicExecutes = res.data.list;
            this.budgetEntryData.clinicExecutes.forEach(x => { x.uid = x.clinicExeUid })
            console.log(this.budgetEntryData.clinicExecutes)
          }
        })
    },
    chooseTownHosp (e) {
      let uid = this.baseEntryHospList.find(x => x.uid === e).uid;
      this.budgetEntryData.hospitalExeUid = this.baseEntryHospList.find(x => x.uid === e).hospitalExeUid
      let p = {
        pageSize: 0,
        where: {
          hospitalUid: uid
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.villageHospUnselect = res.data.list;
            this.villageHospUnselect.map(y => { y.disabled = !y.isExistsVillageDoctor })
            this.villageHospUnselect.map((x, index) => { x.key = index + 1 })
            res.data.list.forEach((item, index) => { if (item.isSelected === true) { this.villageHospSelected.push(index + 1) } })
          }
        })
    },
    saveDudget (boolean) {
      this.budgetEntryData.clinicExecutes = [];
      this.villageHospSelected.forEach(x => {
        let o = {
          villageClinicUid: this.villageHospUnselect[x - 1].uid,
          villageClinicName: this.villageHospUnselect[x - 1].name
        }
        this.budgetEntryData.clinicExecutes.push(o);
      })
      let params = {};
      if (this.baseAddBudgetType === 1) {
        let { budgetAmount, clinicExecutes, doctorBudgetAmount, hospBudgetAmount, uid, hospitalExeUid } = this.budgetEntryData;
        params = { budgetAmount, clinicExecutes, doctorBudgetAmount, hospBudgetAmount, uid, hospitalExeUid };
      } else {
        params = this.budgetEntryData;
      }
      this.axios.put('/hisServices/financialSupervision/serviceTownshipHosp', params)
        .then(res => {
          if (res) {
            this.$message.success('新增成功');
            if (boolean) {
              this.budgetEntry();
            } else {
              this.sideTwoCurP = 3;
              this.breadList['1'].splice(2, 1);
              this.baseBudgetDetail(this.addBaseNewDetail, false);
            }
          }
        })
    }, // 保存预算
    cancelEntryBase () {
      this.sideTwoCurP = 3;
      this.breadList['1'].splice(2, 1);
      this.baseBudgetDetail(this.addBaseNewDetail, false);
    }, // 保存并新增预算
    deleteBase (uid) {
      this.tipDialog = true;
      this.tipType = 3;
      this.tipDialogMsg = '是否确认删除'
      this.tipDialogUid = uid;
    }, // 删除基础项目
    baseChooseVillage (e) {
      let params = {
        pageSize: 0,
        where: {
          detailType: '0',
          hospitalExeUid: this.curHospDetail.uid,
          clinicExeUid: e
        }
      }
      this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.baseVillageEntryData = res.data.page.list;
          }
        })
    }, // 基础服务-录入村卫生室，当前卫生室
    baseSaveVillageEntry (boolean) {
      // this.baseVillageEntryData.map(x => { x.uid = this.baseVillageUid })]
      let params = [];
      this.baseVillageEntryData.map(x => {
        let {uid, budgetAmount} = x;
        params.push({uid, budgetAmount});
      })
      this.axios.put('/hisServices/financialSupervision/doctorExecutes', params)
        .then(res => {
          if (res) {
            if (boolean) {
            } else {
              this.villageEntryDialog = false;
            }
            this.baseVillageEntryData = [];
            this.showVillageDetail(this.curHospDetail, false);
            this.baseVillageUid = '';
            // 获取该基础项目未选择的村卫生室
            let p1 = {
              pageSize: 0,
              where: {
                hospitalExeUid: this.curHospDetail.uid,
                status: '0'
              }
            }
            this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
              .then(res => {
                if (res) {
                  this.baseVillageEntryList = res.data.list;
                }
              })
            // 更新村医数据
            // 获取该基础项目选择的村卫生室
            let p = {
              where: {
                hospitalExeUid: this.curHospDetail.uid,
                status: '1'
              }
            }
            this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
              .then(res => {
                if (res) {
                  this.curVillageHospList = res.data.list;
                }
              })
          }
        })
    }, // 基础服务-录入村卫生室，村医数据
    releaseBaseBudget () {
      let params = {
        uid: this.addBaseNewDetail.uid,
        status: '1'
      }
      this.axios.put('/hisServices/financialSupervision/serviceSubsidy', params)
        .then(res => {
          if (res) {
            this.$message.success('发布成功');
            this.sideTwoCurP = 1;
            this.breadList['1'].splice(1, 1);
            this.getBaseList();
          }
        })
    },
    isActive (list) {
      let b = true;
      if (list.length) {
        console.log(list.every(x => x.budgetAmount !== 0))
        if (list.every(x => x.budgetAmount !== 0)) {
          b = false;
        }
      } else {
        b = true
      }
      return b;
    },
    // 公用
    cancelTip () {
      this.tipDialog = false;
      if (this.tipType === 1) {
        if (this.baseIsSubmit === '0') {
          this.baseIsSubmit = '1'
        } else {
          this.baseIsSubmit = '0'
        }
      } else if (this.tipType === 0) {
        if (this.baseIsChange === '0') {
          this.baseIsChange = '1'
        } else {
          this.baseIsChange = '0'
        }
      }
    },
    comfirmTip () {
      if (this.sideType === 1) {
        if (this.tipType === 1) {
          this.switchProSubmit(this.isSubmit);
        } else if (this.tipType === 0) {
          this.switchProChange(this.isChange)
        } else {
          let params = {
            uid: this.tipDialogUid
          }
          this.axios.delete('/hisServices/financialSupervision/projectMonitor', {params})
            .then(res => {
              if (res) {
                this.$message.success('删除成功')
                this.getProList();
                this.tipDialog = false;
              }
            })
        }
      } else if (this.sideType === 2) {
        if (this.tipType === 1) {
          this.switchBaseProSubmit(this.baseIsSubmit);
        } else if (this.tipType === 0) {
          this.switchBaseProChange(this.baseIsChange)
        } else {
          let params = {
            uid: this.tipDialogUid
          }
          this.axios.delete('/hisServices/financialSupervision/serviceSubsidy', {params})
            .then(res => {
              if (res) {
                this.$message.success('删除成功')
                this.getBaseList();
                this.tipDialog = false;
              }
            })
        }
      } else if (this.sideType === 3) {
        if (this.tipType === 1) {
          this.switchDrugProSubmit(this.drugIsSubmit);
        } else if (this.tipType === 0) {
          this.switchDrugProChange(this.drugIsChange)
        } else {
          let params = {
            uid: this.tipDialogUid
          }
          this.axios.delete('/hisServices/financialSupervision/systemSubsidy', {params})
            .then(res => {
              if (res) {
                this.$message.success('删除成功')
                this.getDruggeryList();
                this.tipDialog = false;
              }
            })
        }
      } else if (this.sideType === 4) {
        if (this.tipType === 1) {
          this.switchDrugVProSubmit(this.drugVIsSubmit);
        } else if (this.tipType === 0) {
          this.switchDrugVProChange(this.drugVIsChange)
        } else {
          let params = {
            uid: this.tipDialogUid
          }
          this.axios.delete('/hisServices/financialSupervision/systemSubsidy', {params})
            .then(res => {
              if (res) {
                this.$message.success('删除成功')
                this.getDruggeryList();
                this.tipDialog = false;
              }
            })
        }
      }
    }, // 提示弹窗确认
    baseIsSubmitUpdate () {
      this.tipType = 1;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    },
    baseIsChangeUpdate () {
      this.tipType = 0;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    }
  },
  watch: {
    exportDialog (e) {
      if (!e) {
        this.exportBaseParams = {
          where: {
            type: '',
            year: '',
            quarter: '',
            month: ''
          }
        }
      }
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
    .sup-bread{
      padding-b
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
