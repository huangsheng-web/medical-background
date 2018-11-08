<template>
  <div class="sup-main my-sup-b clearfix">
    <div class="sup-bread">
      <i class="iconfont">&#xe698;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
      </div>
    </div>
    <!--卫生院补助--> <!--村卫生室补助-->
    <div class="sup-content-box clearfix">
      <!--卫生院和村卫生室共用列表-->
      <div class="sup-content" v-show="sideThreeCurP === 1">
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
          <template v-if="sideType === 3">
            项目月份：
            <el-select v-model="proMonth" style="width: 120px;" placeholder="请选择">
              <el-option
                label="全部"
                :value="null">
              </el-option>
              <el-option
                v-for="item in proMonthList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            项目季度：
            <el-select v-model="baseQuarter" style="width: 140px;" placeholder="请选择">
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
          </template>
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
          <el-button @click="getDruggeryList" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="add-btn clearfix">
          <el-button @click.native="addNewDrug" :disabled="checkBaseAdd(drugList)" type="primary" style="width: 64px;height: 32px;line-height: 32px;padding: 0;float: left;">新增</el-button>
          <el-button @click.native="exportDrug" style="width: 64px;height: 32px;line-height: 32px;padding: 0;float: right;">导出</el-button>
        </div>
        <el-table
          :data="drugList"
          key="tabel9"
          :show-overflow-tooltip="true"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="50">
          </el-table-column>
          <el-table-column
            prop="year"
            label="项目年度"
            width="100">
          </el-table-column>
          <template v-if="drugType === 1">
            <el-table-column
              prop="month"
              width="100"
              label="项目月份">
              <template slot-scope="scope">
                {{drugCurMonth[scope.row.month]}}
              </template>
            </el-table-column>
          </template>
          <template v-if="drugType === 0">
            <el-table-column
              prop="quarter"
              width="100"
              label="项目季度">
              <template slot-scope="scope">
                {{scope.row.quarter === '9' ? '年终考核' : (scope.row.quarter + '季度')}}
              </template>
            </el-table-column>
          </template>
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
            label="操作"
            fixed="right"
            width="300">
            <template slot-scope="scope">
              <span class="pay-online" @click="drugBudgetDetail(scope.row, true)">预算详情</span>
              <span  class="reg-again" @click="drugExecuteDetail(scope.row, true)" v-if="scope.row.status !== '0'">执行详情</span>
              <span  class="reg-again cant-tap" v-else>执行详情</span>
              <span  class="cancel-reg" @click="reviseDrugPro(scope.row.uid)"  v-if="scope.row.status === '0'">修改</span>
              <span  class="cancel-reg cant-tap"  v-else>修改</span>
              <span  class="change-reg" @click="deleteDrug(scope.row.uid)" v-if="scope.row.status === '0'">删除</span>
              <span  class="change-reg cant-tap"  v-else>删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--卫生院和村卫生室共用新增药物补助-->
      <div class="sup-content" v-if="sideThreeCurP === 2">
        <div class="sup-c2-t">
          <div class="sup-c2-t1">
            <div class="sup-c2t1-item">
              <span class="red-star">项目名称：</span>
              <el-input disabled  v-model="addDrugNewDetail.name" style="width: 200px;height: 32px;"></el-input>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">项目年度：</span>
              <el-select @change="chooseDrugYear"  v-model="addDrugNewDetail.year" style="width: 140px;" placeholder="请选择">
                <el-option
                  v-for="item in proYearList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="sup-c2t1-item" v-show="drugType === 1">
              <span class="red-star">项目月份：</span>
              <el-select v-model="addDrugNewDetail.month" style="width: 140px;" placeholder="请选择">
                <el-option
                  v-for="item in drugCurMonthList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="sup-c2t1-item" v-show="drugType === 0">
              <span class="red-star">项目季度：</span>
              <el-select v-model="addDrugNewDetail.quarter" style="width: 140px;" placeholder="请选择">
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
              <el-form :model="addDrugNewDetail" class="demo-ruleForm">
                <el-form-item
                  prop="budgetAmount"
                  :rules="[
                    {validator: validateNum, required: false}
                  ]"
                >
                  <el-input type="budgetAmount" style="width: 140px;height: 32px;" v-model="addDrugNewDetail.budgetAmount" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <i>元</i>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">项目代码：</span>
              <el-input style="width: 200px;height: 32px;" v-model.number="addDrugNewDetail.quotaNum"></el-input>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">发放时间：</span>
              <el-date-picker
                style="width: 140px;"
                v-model="addDrugNewDetail.appropriateTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">截止时间：</span>
              <el-date-picker
                style="width: 140px;"
                v-model="addDrugNewDetail.deadlineTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="sup-c2-b">
          <p class="red-star">乡镇卫生院：<span>已选{{curDrugTownHospList.length ? curDrugTownHospList.length : 0}}个</span></p>
          <div class="">
            <el-transfer
              style="text-align: left; display: inline-block;"
              v-model="curDrugTownHospList"
              filterable
              :filter-method="filterMethod"
              :titles="['待选列表', '已选列表']"
              :button-texts="['取消', '选择']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              @change="supC2HandleChange"
              :data="townsDrugHospList">
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
            <el-button type="primary" @click.native="saveUpdateDrug" v-if="addDrugNewDetail.uid">保存</el-button>
            <el-button type="primary" :disable="addDrugNewDetail.year === '' || addDrugNewDetail.quotaNum || addDrugNewDetail.appropriateTime || addDrugNewDetail.deadlineTime === '' || addDrugNewDetail.budgetAmount === '' || !curDrugTownHospList.length" @click.native="saveAddDrug" v-else>保存</el-button>
            <el-button @click="supThreeCancel">取消</el-button>
          </div>
        </div>
      </div>
      <!--卫生院药物补助，预算详情-->
      <div class="sup-content" v-show="sideThreeCurP === 3">
        <div class="sup-c3-detail">
          <span>项目年度：{{addDrugNewDetail.year}}</span>
          <span>项目月份：{{drugCurMonth[addDrugNewDetail.month]}}</span>
          <span>项目代码：{{addDrugNewDetail.quotaNum}}</span>
          <span>预算总金额：{{addDrugNewDetail.budgetAmount}}元</span>
          <span>发放时间：{{addDrugNewDetail.appropriateTime | moment}}</span>
          <span>截止时间：{{addDrugNewDetail.deadlineTime | moment}}</span>
          <span>项目状态：<span :style="{'color': statusColor[addDrugNewDetail.status]}">{{proCurStates[addDrugNewDetail.status]}}</span></span>
        </div>
        <div class="sup-c3-search">
          乡镇卫生院：
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="drugHospitalExeUid"
            @focus="isDown = true"
            @blur="isDown = false"
            :fetch-suggestions="querySearch3"
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
          <el-button  icon="el-icon-search" @click.native="drugBudgetDetail(addDrugNewDetail, false)">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          <el-button :disabled="addDrugNewDetail.status !== '0'" type="primary" @click.native="drugBudgetEntry">录入预算</el-button>
          <el-button @click.native="releaseDrugHospBudget"  :disabled="!drugTownIsAllEntry || addDrugNewDetail.status !== '0'">发布预算</el-button>
          <el-button :disabled="addDrugNewDetail.status !== '0'" style="float: right;position: relative;">
            导入
            <input v-show="addDrugNewDetail.status === '0'" type="file" @change="importExcDrug" style="overflow: hidden;opacity: 0;filter:Alpha(opacity=0);position: absolute;top: 0;left: 0;width: 100%;height: 100%;" id="drugImportExc" accept=".xls">
          </el-button>
          <el-button :disabled="addDrugNewDetail.status !== '0'" @click.native="downloadDrugExc(addDrugNewDetail.uid, 1)"  style="width: 122px;">下载导入模板</el-button>
        </div>
        <el-table
          :data="drugBudgetTownHospList"
          key="tabel10"
          :show-overflow-tooltip="true"
          stripe
          show-summary
          :summary-method="getSummaries5"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="264">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            label="乡镇卫生院"
            :show-overflow-tooltip="true"
            width="264">
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="264"
            label="卫生院预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.budgetAmount ? scope.row.budgetAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="264">
            <template slot-scope="scope">
              <span  class="cancel-reg" @click="reviseDrugEntry(scope.row)" v-if="addDrugNewDetail.status === '0' && scope.row.entryStatus === '1'">修改</span>
              <span  class="cant-tap" v-else>修改</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--卫生院药物补助，执行详情-->
      <div class="sup-content" v-show="sideThreeCurP === 4">
        <div class="sup-c3-detail">
          <span>项目年度：{{addDrugNewDetail.year}}</span>
          <span>项目月份：{{drugCurMonth[addDrugNewDetail.month]}}</span>
          <span>项目代码：{{addDrugNewDetail.quotaNum}}</span>
          <span>预算总金额：{{addDrugNewDetail.budgetAmount}}元</span>
          <span>发放时间：{{addDrugNewDetail.appropriateTime | moment}}</span>
          <span>截止时间：{{addDrugNewDetail.deadlineTime | moment}}</span>
          <span>项目状态：<span :style="{'color': statusColor[addDrugNewDetail.status]}">{{proCurStates[addDrugNewDetail.status]}}</span></span>
        </div>
        <div class="sup-c3-search">
          乡镇卫生院：
          <el-autocomplete
            style="margin-right: 45px"
            popper-class="my-autocomplete"
            v-model="drugHospitalExeUid"
            @focus="isDown = true"
            @blur="isDown = false"
            :fetch-suggestions="querySearch3"
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
          <el-select v-model="drugExecuteStatus" style="width: 200px;" placeholder="请选择">
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
          <el-button @click.native="drugExecuteDetail(addDrugNewDetail, false)"  icon="el-icon-search">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          逾期能否提交：
          <el-radio-group v-model="drugIsSubmit" @change="drugIsSubmitUpdate">
            <el-radio label="0">不能</el-radio>
            <el-radio style="margin-right: 80px;" label="1">能</el-radio>
          </el-radio-group>
          能否修改：
          <el-radio-group v-model="drugIsChange" @change="drugIsChangeUpdate">
            <el-radio label="0">不能</el-radio>
            <el-radio label="1">能</el-radio>
          </el-radio-group>
        </div>
        <el-table
          :data="drugExecuteTownHospList"
          key="tabel11"
          stripe
          :show-overflow-tooltip="true"
          show-summary
          :summary-method="getSummaries6"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="116">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            :show-overflow-tooltip="true"
            label="乡镇卫生院"
            width="220">
          </el-table-column>
          <el-table-column
            prop="executeStatus"
            width="96"
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
            width="160"
            label="卫生院预算金额（元）">
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="160"
            label="卫生院实发金额（元）">
            <template slot-scope="scope">
              {{scope.row.actualAmount ? scope.row.actualAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="hospArriveTime"
            width="150"
            label="到账时间">
            <template slot-scope="scope">
              {{scope.row.hospArriveTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            width="150"
            :show-overflow-tooltip="true"
            label="备注">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--查看大图-->
    <div class="show-big-pic" v-show="showBigPic" @click="showBigPic = false">
      <img :src="bigPicUrl" alt="">
    </div>
    <!--分页-->
    <div class="pagination-box" v-if="pagination.total" v-show="sideThreeCurP !== 2 && sideThreeCurP !== 6">
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
    <!--药物补助录入预算-->
    <el-dialog
      title="卫生院预算"
      :visible.sync="drugTownHospEntryDialog"
      :close-on-click-modal="false"
      width="416px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <span class="red-star">乡镇卫生院：</span>
          <el-select v-model="drugEntryData.uid" v-if="!drugCanSelect" style="width: 200px;" placeholder="请选择">
            <el-option
              v-for="item in drugEntryHospList"
              :key="item.hospitalExeUid"
              :label="item.name"
              :value="item.hospitalExeUid">
            </el-option>
          </el-select>
          <el-input :disabled="true" v-model="drugEntryData.townshipHospName"  style="width: 200px;height: 32px;" v-else></el-input>
        </div>
        <div class="town-entry-row">
          <span class="red-star">预算金额：</span>
          <el-form :model="drugEntryData" class="demo-ruleForm">
            <el-form-item
              prop="budgetAmount"
              :rules="[
                    {validator: validateNum, required: false}
                  ]"
            >
              <el-input type="budgetAmount" style="width: 200px;height: 32px;" v-model="drugEntryData.budgetAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!drugEntryData.budgetAmount || !drugEntryData.uid" @click="saveDrugTownHospBudget(false)">保存</el-button>
        <el-button type="primary" :disabled="!drugEntryData.budgetAmount || !drugEntryData.uid"  v-if="!drugCanSelect"  style="width: 106px" @click="saveDrugTownHospBudget(true)">保存并新增</el-button>
        <el-button @click="drugTownHospEntryDialog = false">取 消</el-button>
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
    <!--基药-卫生院项目导出-->
    <el-dialog
      title="基药补助—卫生院补助导出"
      :visible.sync="exportDrugDialog"
      width="340px"
      :close-on-click-modal="false"
      center>
      <div class="town-entry-box">
        <span class="red-star">导出类型：</span>
        <el-select @change="chooseDrugType" v-model="exportBaseParams.where.type" style="width: 200px;" placeholder="请选择">
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
      <div class="town-entry-box" style="margin: 16px 0;">
        <span class="red-star">项目年度：</span>
        <el-select @change="chooseDrugYear" v-model="exportBaseParams.where.year" style="width: 200px;" placeholder="请选择">
          <el-option
            v-for="item in exportProYear"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="town-entry-box">
        <span class="white-star">项目月份：</span>
        <el-select v-model="exportBaseParams.where.month" style="width: 200px;" placeholder="请选择">
          <el-option
            v-for="item in drugCurMonthList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer" >
        <el-button :disabled="!exportBaseParams.where.year || !exportBaseParams.where.type" type="primary" @click.native="comfirmExportDrug">确定</el-button>
        <el-button @click.native="exportDrugDialog = false">取 消</el-button>
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
          {name: '基本药物制度补助-卫生院补助', sideType: 1, sideCurP: 1}
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
    this.getDruggeryList();
  },
  methods: {
    supC2HandleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    filterMethod (query, item) {
      return item.name.indexOf(query) > -1;
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
    isOutTime (e) {
      let d1 = new Date(e);
      let y = d1.getFullYear();
      let m = d1.getMonth() + 1;
      let da = d1.getDate();
      let d2 = new Date();
      let y1 = d2.getFullYear();
      let m1 = d2.getMonth() + 1;
      let da1 = d2.getDate();
      if (y < y1) {
        return true
      } else if (y === y1) {
        if (m < m1) {
          return true
        } else if (m === m1) {
          if (da < da1) {
            return true
          }
        }
      }
    },
    exportDrug () {
      if (this.sideType === 3) {
        this.exportDrugDialog = true;
      } else {
        this.exportDrugVDialog = true;
      }
    },
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
    comfirmExportDrug () {
      this.exportDrugDialog = false;
      let excelName = this.exportBaseParams.where.type === '1' ? '溆浦县卫计惠农补贴项目资金预算明细表.xls' : '溆浦县卫计惠农补贴项目资金发放明细表.xls'
      this.axios.get('/hisServices/financialSupervision/exportDrugTownshipHosp/' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.exportBaseParams))), {
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
    }, // 导出基础药物-卫生院
    comfirmExportDrugV () {
      this.exportDrugDialog = false;
      let excelName = this.exportBaseParams.where.type === '1' ? '溆浦县卫计惠农补贴项目资金预算明细表.xls' : '溆浦县卫计惠农补贴项目资金发放明细表.xls'
      this.axios.get('/hisServices/financialSupervision/exportDrugDoctor/' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.exportBaseParams))), {
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
    }, // 导出基础药物-卫生室
    downloadDrugExc (proUid, type) {
      let params = {
        where: {
          projectUid: proUid
        }
      };
      let url = '';
      if (type === 1) {
        url = '/hisServices/financialSupervision/exportDrugTownshipHospTemplate/'
      } else {
        url = '/hisServices/financialSupervision/exportDrugDoctorTemplate/'
      }
      this.axios.get(url + encodeURIComponent(encodeURIComponent(JSON.stringify(params))), {
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
    }, // 下载基药-卫生院，卫生室模板
    importExcDrug () {
      let formData = new FormData();
      formData.append('name', $('#drugImportExc').val())
      formData.append('file', $('#drugImportExc')[0].files[0]);
      this.axios.post('/hisServices/financialSupervision/importSystemTownshipHosp', formData)
        .then(res => {
          if (res) {
            this.drugBudgetDetail(this.addDrugNewDetail, false)
          }
        })
    }, // 导入基药卫生院
    importExcDrugV () {
      let formData = new FormData();
      formData.append('name', $('#drugVImportExc').val())
      formData.append('file', $('#drugVImportExc')[0].files[0]);
      this.axios.post('/hisServices/financialSupervision/importDrugVillageClinic', formData)
        .then(res => {
          if (res) {
            this.drugBudgetDetail(this.addDrugNewDetail, false)
          }
        })
    }, // 导入基药卫生室
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
      this.drugHospitalExeUid = '';
      this.sideThreeCurP = curP;
      this.getDruggeryList();
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
      if (this.sideThreeCurP === 1) {
        this.getDruggeryList();
      } else if (this.sideThreeCurP === 3) {
        this.drugBudgetDetail(this.addDrugNewDetail, false); // 卫生院预算详情
      } else if (this.sideThreeCurP === 4) {
        this.drugExecuteDetail(this.addDrugNewDetail, false); // 卫生院执行详情
      }
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      if (this.sideThreeCurP === 1) {
        this.getDruggeryList();
      } else if (this.sideThreeCurP === 3) {
        this.drugBudgetDetail(this.addDrugNewDetail, false); // 卫生院预算详情
      } else if (this.sideThreeCurP === 4) {
        this.drugExecuteDetail(this.addDrugNewDetail, false); // 卫生院执行详情
      }
    },
    getSummaries5 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 1) {
          sums[index] = this.allTotal.totalTownshipHosp;
        }
        if (index === 2) {
          sums[index] = this.allTotal.totalHospBudgetAmount;
        }
      });
      return sums;
    },
    getSummaries6 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (index === 1) {
          sums[index] = this.allTotal.totalTownshipHosp;
        }
        if (index === 3) {
          sums[index] = this.allTotal.totalHospBudgetAmount;
        }
        if (index === 4) {
          sums[index] = this.allTotal.totalHospActualAmount;
        }
      });
      return sums;
    },
    handleSelect (item) {
      console.log(item);
    },
    // 基础药物
    checkBaseAdd (arr) {
      return arr.some(x => x.status === '0' || x.status === '1' || x.status === '3')
    },
    querySearch3 (queryString, cb) {
      var restaurants = this.curDrugTownHospList;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    chooseDrugYear (e) {
      this.baseCurQuarterList = [];
      this.drugCurMonthList = [];
      this.exportBaseParams.where.quarter = '';
      this.exportBaseParams.where.month = '';
      let params = {
        year: e
      }
      if (this.drugType === 0) { // 0季度
        this.addDrugNewDetail.quarter = '';
        if (this.exportDrugVDialog) {
          params['isProjectQuarter'] = true;
        }
        this.axios.get('/hisServices/financialSupervision/systemSubsidy/quarters', {params})
          .then(res => {
            if (res) {
              res.data.forEach(x => {
                this.baseCurQuarterList.push(this.baseQuarterList.find(y => y.value === x))
              })
            }
          })
      } else {
        this.addDrugNewDetail.month = '';
        if (this.exportDrugDialog) {
          params['isProjectMonth'] = true;
        }
        this.axios.get('/hisServices/financialSupervision/systemSubsidy/months', {params})
          .then(res => {
            if (res) {
              res.data.forEach(x => {
                this.drugCurMonthList.push(this.drugMonthList.find(y => y.value === x))
              })
            }
          })
      }
    },
    getDruggeryList () {
      let params = {
        pageNum: this.pagination.pageNum,
        where: {
          type: this.drugType
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
      if (this.proMonth) {
        params.where['month'] = this.proMonth;
      }
      if (this.proState) {
        params.where['status'] = this.proState;
      }
      this.axios.get('/hisServices/financialSupervision/systemSubsidys/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.drugList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
            this.pagination.pageSize = res.data.pageSize;
          }
        })
    }, // 基础药物列表
    drugBudgetDetail (item, addBread) {
      if (addBread) {
        this.drugHospitalExeUid = '';
        this.breadList['1'].push({name: '预算详情', sideType: 1, sideCurP: 3})
        this.sideThreeCurP = 3;
      }
      this.addDrugNewDetail = item;
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
            this.curDrugTownHospList = res.data.list;
            this.curDrugTownHospList.map(x => {
              x.value = x.name;
            })
            this.curDrugTownHospList.splice(0, 0, {value: '全部卫生院', hospitalExeUid: ''})
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
      if (this.curDrugTownHospList.some(m => m.value === this.drugHospitalExeUid)) {
        hospitalExeUid = this.curDrugTownHospList.find(m => m.value === this.drugHospitalExeUid).hospitalExeUid;
      }
      if (hospitalExeUid) {
        params.where['hospitalExeUid'] = hospitalExeUid;
      }
      this.axios.get('/hisServices/financialSupervision/systemTownshipHosps/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.drugBudgetTownHospList = res.data.page.list;
            this.drugTownIsAllEntry = res.data.allEntry;
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
    }, // 药物补助预算详情
    drugExecuteDetail (item, addBread) {
      if (addBread) {
        this.drugIsSubmit = item.overdueType;
        this.drugIsChange = item.updateType;
        console.log('卫生院')
        this.breadList['1'].push({name: '执行详情', sideType: 1, sideCurP: 4})
        this.sideThreeCurP = 4;
      }
      this.addDrugNewDetail = item;
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
            this.curDrugTownHospList = res.data.list;
            this.curDrugTownHospList.map(x => {
              x.value = x.name;
            })
            this.curDrugTownHospList.splice(0, 0, {value: '全部卫生院', hospitalExeUid: ''})
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
      if (this.curDrugTownHospList.some(m => m.value === this.drugHospitalExeUid)) {
        hospitalExeUid = this.curDrugTownHospList.find(m => m.value === this.drugHospitalExeUid).hospitalExeUid;
      }
      if (hospitalExeUid) {
        params.where['hospitalExeUid'] = hospitalExeUid;
      }
      if (this.drugExecuteStatus) {
        params.where['executeStatus'] = this.drugExecuteStatus;
      }
      this.axios.get('/hisServices/financialSupervision/systemTownshipHosps/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.drugExecuteTownHospList = res.data.page.list;
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
    }, // 药物补助执行详情
    switchDrugProSubmit (type) {
      let params = {
        overdueType: type,
        operationType: '2',
        uid: this.addDrugNewDetail.uid
      }
      this.axios.put('/hisServices/financialSupervision/systemSubsidy', params)
        .then(res => {
          if (res) {
            this.$message.success('设置成功');
            this.tipDialog = false;
          }
        })
    },
    switchDrugProChange (type) {
      let params = {
        updateType: type,
        operationType: '3',
        uid: this.addDrugNewDetail.uid
      }
      this.axios.put('/hisServices/financialSupervision/systemSubsidy', params)
        .then(res => {
          if (res) {
            this.$message.success('设置成功');
            this.tipDialog = false;
          }
        })
    },
    switchDrugVProSubmit (type) {
      let params = {
        overdueType: type,
        operationType: '2',
        uid: this.addDrugNewDetail.uid
      }
      this.axios.put('/hisServices/financialSupervision/systemSubsidy', params)
        .then(res => {
          if (res) {
            this.$message.success('设置成功');
            this.tipDialog = false;
          }
        })
    },
    switchDrugVProChange (type) {
      let params = {
        updateType: type,
        operationType: '3',
        uid: this.addDrugNewDetail.uid
      }
      this.axios.put('/hisServices/financialSupervision/systemSubsidy', params)
        .then(res => {
          if (res) {
            this.$message.success('设置成功');
            this.tipDialog = false;
          }
        })
    },
    addNewDrug () {
      this.addDrugNewDetail = {
        name: '基本药物制度补助', // 名称
        year: '', // 年度
        quotaNum: '1201', // 指标文号
        month: '', // 月份
        quarter: '',
        appropriateTime: '', // 预拨时间
        deadlineTime: '', // 截止时间
        budgetAmount: '', // 预算总金额
        requirements: '' // 要求
      }
      this.townsDrugHospList = [];
      this.curDrugTownHospList = [];
      this.sideThreeCurP = 2;
      console.log(this.drugType)
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
            this.townsDrugHospList = res.data.list;
            this.townsDrugHospList.map(y => { y.disabled = !y.isExistsVillageClinic })
            this.townsDrugHospList.map((x, index) => { x.key = index + 1 })
          }
        })
    },
    reviseDrugPro (uid) {
      this.baseCurQuarterList = [];
      this.drugCurMonthList = [];
      this.sideThreeCurP = 2;
      this.townsDrugHospList = [];
      this.curDrugTownHospList = [];
      this.breadList['1'].push({name: '修改项目', sideType: 1, sideCurP: 2})
      let params = {
        uid: uid
      }
      // 获取该卫计项目的详情，填入addNewDetail
      this.axios.get('/hisServices/financialSupervision/systemSubsidy', {params})
        .then(res => {
          if (res) {
            this.addDrugNewDetail = res.data;
            let params = {
              year: res.data.year
            }
            if (this.drugType === 0) { // 0季度
              this.axios.get('/hisServices/financialSupervision/systemSubsidy/quarters', {params})
                .then(res => {
                  if (res) {
                    res.data.forEach(x => {
                      this.baseCurQuarterList.push(this.baseQuarterList.find(y => y.value === x))
                    })
                  }
                })
            } else {
              this.axios.get('/hisServices/financialSupervision/systemSubsidy/months', {params})
                .then(res => {
                  if (res) {
                    res.data.forEach(x => {
                      this.drugCurMonthList.push(this.drugMonthList.find(y => y.value === x))
                    })
                  }
                })
            }
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
            this.townsDrugHospList = res.data.list;
            this.townsDrugHospList.map((x, index) => { x.key = index + 1 })
            this.townsDrugHospList.map(y => { y.disabled = !y.isExistsVillageClinic })
            res.data.list.forEach((item, index) => { if (item.isSelected === true) { this.curDrugTownHospList.push(index + 1) } })
          }
        })
    }, // 修改药物补助项目
    supThreeCancel () {
      this.breadList['1'].splice(1);
      this.sideThreeCurP = 1;
    },
    saveUpdateDrug () {
      this.addDrugNewDetail.status = null;
      this.addDrugNewDetail.updateType = null;
      this.addDrugNewDetail.overdueType = null;
      this.addDrugNewDetail.drugTownshipHospList = [];
      this.curDrugTownHospList.forEach(x => {
        let o = {
          townshipHospUid: this.townsDrugHospList[x - 1].uid,
          townshipHospName: this.townsDrugHospList[x - 1].name
        }
        this.addDrugNewDetail.drugTownshipHospList.push(o);
      })
      this.addDrugNewDetail.systemSubsidyType = this.drugType;
      this.addDrugNewDetail.operationType = 0;
      this.axios.put('/hisServices/financialSupervision/systemSubsidy', this.addDrugNewDetail)
        .then(res => {
          if (res) {
            this.$message.success('修改成功');
            this.sideThreeCurP = 1;
            this.breadList['1'].splice(1);
            this.getDruggeryList();
          }
        })
    },
    saveAddDrug () {
      this.addDrugNewDetail.townshipHospList = [];
      this.curDrugTownHospList.forEach(x => {
        let o = {
          uid: this.townsDrugHospList[x - 1].uid,
          name: this.townsDrugHospList[x - 1].name
        }
        this.addDrugNewDetail.townshipHospList.push(o)
      })
      this.addDrugNewDetail.systemSubsidyType = this.drugType;
      this.axios.post('/hisServices/financialSupervision/systemSubsidy', this.addDrugNewDetail)
        .then(res => {
          if (res) {
            this.$message.success('新增成功');
            this.sideThreeCurP = 1;
            this.breadList['1'].splice(1);
            this.getDruggeryList();
          }
        })
    },
    drugBudgetEntry () {
      this.drugEntryData = {
        uid: '',
        budgetAmount: '',
        projectUid: '',
        operationType: '0'
      }; // 录入预算的数据
      this.drugTownHospEntryDialog = true;
      this.drugCanSelect = false;
      // 获取该卫计项目未选择的卫生院
      let p1 = {
        where: {
          projectUid: this.addDrugNewDetail.uid,
          status: '0'
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
        .then(res => {
          if (res) {
            this.drugEntryHospList = res.data.list;
          }
        })
    }, // 药物录入预算
    drugChooseTownHCosp (e) {
      let uid = this.drugEntryHospList.find(x => x.uid === e).uid;
      this.drugEntryData.townshipHospExecuteUid = this.drugEntryHospList.find(x => x.uid === e).hospitalExeUid
      this.drugEntryData.townshipHospUid = this.drugEntryHospList.find(x => x.uid === e).uid;
      this.drugEntryData.townshipHospName = this.drugEntryHospList.find(x => x.uid === e).name;
      let p = {
        pageSize: 0,
        where: {
          hospitalUid: uid
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.drugVillageUnselect = res.data.list;
            this.drugVillageUnselect.map((x, index) => { x.key = index + 1 })
            this.drugVillageUnselect.map(y => { y.disabled = !y.isExistsVillageDoctor })
            res.data.list.forEach((item, index) => { if (item.isSelected === true) { this.drugVillageSelected.push(index + 1) } })
          }
        })
    },
    reviseDrugEntry (item) {
      this.drugEntryData = item;
      this.drugEntryData.operationType = '0';
      this.drugTownHospEntryDialog = true;
      this.drugCanSelect = true;
    }, // 修改药物录入预算
    deleteDrug (uid) {
      this.tipDialog = true;
      this.tipType = 3;
      this.tipDialogMsg = '是否确认删除'
      this.tipDialogUid = uid;
    },
    saveDrugTownHospBudget (boolean) {
      this.drugEntryData.projectUid = this.addDrugNewDetail.uid;
      this.axios.put('/hisServices/financialSupervision/systemTownshipHosp', this.drugEntryData)
        .then(res => {
          if (res) {
            // 获取该项目卫生院预算详情
            let params = {
              pageNum: this.pagination.pageNum,
              pageSize: this.pagination.pageSize,
              where: {
                projectUid: this.addDrugNewDetail.uid,
                detailType: '0'
              }
            }
            if (this.drugHospitalExeUid) {
              params.where['hospitalUid'] = this.drugHospitalExeUid;
            }
            this.axios.get('/hisServices/financialSupervision/systemTownshipHosps/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
              .then(res => {
                if (res) {
                  this.drugBudgetTownHospList = res.data.page.list;
                  this.drugTownIsAllEntry = res.data.allEntry;
                  this.pagination.pageNum = res.data.page.pageNum;
                  this.pagination.total = res.data.page.total;
                }
              })
            if (boolean) {
              this.drugBudgetEntry();
            } else {
              this.drugTownHospEntryDialog = false;
            }
          }
        })
    }, // 保存卫生院录入预算
    releaseDrugHospBudget () {
      let params = {
        uid: this.addDrugNewDetail.uid,
        operationType: '1'
      }
      this.axios.put('/hisServices/financialSupervision/systemSubsidy', params)
        .then(res => {
          if (res) {
            this.$message.success('发布成功');
            this.sideThreeCurP = 1;
            this.breadList['1'].splice(1, 1);
            this.getDruggeryList();
          }
        })
    }, // 发布卫生院药物预算
    drugVBudgetEntry () {
      this.drugVillageEntryDialog = true;
      this.drugVillageEntryCanSelect = false;
      this.drugVillageUid = '';
      this.drugVillageEntryData = [];
    },
    reviseDrugVBudgetEntry (item) {
      console.log(item)
      this.drugVillageEntryData = [];
      this.drugVillageEntryDialog = true;
      this.drugVillageEntryCanSelect = true;
      this.drugCurVillageEntryName = item.villageClinicName;
      this.drugVillageEntryData.push(item);
    },
    drugSaveVillageEntry (boolean) {
      // this.baseVillageEntryData.map(x => { x.uid = this.baseVillageUid })]
      let params = [];
      this.drugVillageEntryData.map(x => {
        let {uid, budgetAmount} = x;
        params.push({uid, budgetAmount});
      })
      this.axios.put('/hisServices/financialSupervision/drugVillageDoctors', params)
        .then(res => {
          if (res) {
            if (boolean) {
              this.drugVBudgetEntry();
            } else {
              this.drugVillageEntryDialog = false;
            }
            this.drugVillageEntryData = [];
            // 更新村医数据
            let params = {
              pageNum: this.pagination.pageNum,
              pageSize: this.pagination.pageSize,
              where: {
                hospitalExeUid: this.curDrugHospDetail.uid,
                detailType: '0'
              }
            }
            this.axios.get('/hisServices/financialSupervision/drugVillageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
              .then(res => {
                if (res) {
                  this.drugVillageHosPListData = res.data.page.list;
                  this.pagination.pageNum = res.data.page.pageNum;
                  this.pagination.total = res.data.page.total;
                }
              })
            // 获取该基础项目未选择的村卫生室
            let p1 = {
              where: {
                hospitalExeUid: this.curDrugHospDetail.uid,
                status: '0'
              }
            }
            this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
              .then(res => {
                if (res) {
                  this.drugVillageEntryList = res.data.list;
                }
              })
          }
        })
    }, // 药物-录入村卫生室，村医数据
    drugChooseVillage (e) {
      let params = {
        pageSize: 0,
        where: {
          detailType: '0',
          hospitalExeUid: this.curDrugHospDetail.uid,
          clinicExeUid: e
        }
      }
      this.axios.get('/hisServices/financialSupervision/drugVillageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.drugVillageEntryData = res.data.page.list;
          }
        })
    }, // 药物-录入村卫生室，当前卫生室
    // 公用
    cancelTip () {
      this.tipDialog = false;
      if (this.tipType === 1) {
        if (this.drugIsSubmit === '0') {
          this.drugIsSubmit = '1'
        } else {
          this.drugIsSubmit = '0'
        }
      } else if (this.tipType === 0) {
        if (this.drugIsChange === '0') {
          this.drugIsChange = '1'
        } else {
          this.drugIsChange = '0'
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
    drugIsSubmitUpdate () {
      this.tipType = 1;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    },
    drugIsChangeUpdate () {
      this.tipType = 0;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    }
  },
  watch: {
    exportDrugDialog (e) {
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
