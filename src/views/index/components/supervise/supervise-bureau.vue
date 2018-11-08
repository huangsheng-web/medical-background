<template>
  <div class="sup-main my-sup-b clearfix">
    <div class="sup-sl">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @select="sideSelect">
        <el-menu-item index="1">
          <span slot="title">卫计项目投入监测</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">基本公卫服务补助</span>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">
            <span>基本药物制度补助</span>
          </template>
          <el-menu-item index="3">卫生院补助</el-menu-item>
          <el-menu-item index="4">村卫生室补助</el-menu-item>
        </el-submenu>
        <el-menu-item index="5">
          <span slot="title">村医卡号维护</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="sup-bread">
      <i class="iconfont" v-show="sideType === 1">&#xe696;</i>
      <i class="iconfont" v-show="sideType === 2">&#xe65c;</i>
      <i class="iconfont" v-show="sideType === 3 || sideType === 4">&#xe698;</i>
      <i class="iconfont" v-show="sideType === 5">&#xe699;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
      </div>
    </div>
    <!--卫计项目-->
    <div class="sup-content-box clearfix" v-show="sideType === 1">
      <!--卫计项目列表-->
      <div class="sup-content" v-show="sideOneCurP === 1">
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
          项目名称：
          <el-input v-model="proName" style="width: 160px"></el-input>
          指标文号：
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
          <el-button @click="getProList" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="add-btn">
          <el-button type="primary" @click="addNewPro" style="width: 64px;height: 32px;line-height: 32px;padding: 0;">新增</el-button>
        </div>
        <el-table
          :data="proList"
          key="tabel1"
          stripe
          :show-overflow-tooltip="true"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            :show-overflow-tooltip="true"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="year"
            width="100"
            label="项目年度">
          </el-table-column>
          <el-table-column
            prop="quotaNum"
            min-width="100"
            :show-overflow-tooltip="true"
            label="指标文号">
          </el-table-column>
          <el-table-column
            prop="status"
            min-width="100"
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
            min-width="180"
            label="财政预计拨付时间">
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
            min-width="180"
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
            min-width="180"
            label="实发总金额（元）">
            <template slot-scope="scope">
              <p v-if="scope.row.actualAmount">{{scope.row.actualAmount}}</p>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="300">
            <template slot-scope="scope">
              <span class="pay-online" @click="budgetDetail(scope.row, true)">预算详情</span>
              <span  class="reg-again" @click="executeDetail(scope.row, true)" v-if="scope.row.status !== '0'">执行详情</span>
              <span  class="reg-again cant-tap" v-else>执行详情</span>
              <span  class="cancel-reg" @click="revisePro(scope.row.uid)"  v-if="scope.row.status === '0'">修改</span>
              <span  class="cancel-reg cant-tap"  v-else>修改</span>
              <span  class="change-reg" @click="deletePro(scope.row.uid)" v-if="scope.row.status === '0'">删除</span>
              <span  class="change-reg cant-tap"  v-else>删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--卫计项目新增-->
      <div class="sup-content" v-show="sideOneCurP === 2">
        <div class="sup-c2-t">
          <div class="sup-c2-t1">
            <div class="sup-c2t1-item">
              <span class="red-star">项目名称：</span>
              <el-input v-model="addNewDetail.name" maxlength="25" style="width: 200px;height: 32px;"></el-input>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">预算总金额：</span>
              <el-form :model="addNewDetail" class="demo-ruleForm">
                <el-form-item
                  prop="budgetAmount"
                  :rules="[
                    {validator: validateNum, required: false}
                  ]"
                >
                  <el-input type="budgetAmount" style="width: 242px;height: 32px;" v-model="addNewDetail.budgetAmount" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <i>元</i>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">指标文号：</span>
              <el-input v-model="addNewDetail.quotaNum" style="width: 200px;height: 32px;"></el-input>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">项目年度：</span>
              <el-select v-model="addNewDetail.year" style="width: 200px;" placeholder="请选择">
                <el-option
                  v-for="item in proYearList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">财政预计拨付时间：</span>
              <el-date-picker
                style="width: 200px;"
                @change="checkOtherDate"
                v-model="addNewDetail.appropriateTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="sup-c2t1-item">
              <span class="red-star">截止时间：</span>
              <el-date-picker
                style="width: 200px;"
                v-model="addNewDetail.deadlineTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="sup-c2-t2">
            <span class="red-star">项目要求：</span>
            <textarea  v-model="addNewDetail.requirements"  name="" id="" cols="30" rows="10"></textarea>
          </div>
        </div>
        <div class="sup-c2-b">
          <p class="red-star">乡镇卫生院：<span>已选{{curTownHospList.length ? curTownHospList.length : 0}}个</span></p>
          <div class="">
            <el-transfer
              style="text-align: left; display: inline-block;"
              v-model="curTownHospList"
              filterable
              :filter-method="filterMethod"
              :titles="['待选列表', '已选列表']"
              :button-texts="['取消', '选择']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              @change="supC2HandleChange"
              :data="townsHospList">
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
            <el-button type="primary"  :disabled="addNewDetail.name === '' || addNewDetail.budgetAmount === '' || addNewDetail.quotaNum === '' || addNewDetail.year === '' || addNewDetail.appropriateTime === '' || addNewDetail.deadlineTime === '' || addNewDetail.requirements === '' || !curTownHospList.length" @click="saveUpdatePro" v-if="addNewDetail.uid">保存</el-button>
            <el-button type="primary"  :disabled="addNewDetail.name === '' || addNewDetail.budgetAmount === '' || addNewDetail.quotaNum === '' || addNewDetail.year === '' || addNewDetail.appropriateTime === '' || addNewDetail.deadlineTime === '' || addNewDetail.requirements === '' || !curTownHospList.length" @click="saveAddPro" v-else>保存</el-button>
            <el-button @click="supOneCancel">取消</el-button>
          </div>
        </div>
      </div>
      <!--卫计项目预算详情-->
      <div class="sup-content" v-show="sideOneCurP === 3">
        <div class="sup-c3-detail">
          <span>项目名称：{{addNewDetail.name}}</span>
          <span>指标文号：{{addNewDetail.quotaNum}}</span>
          <span>预算总金额：{{addNewDetail.budgetAmount}}元</span>
          <span>财政预计拨付时间：{{addNewDetail.appropriateTime | moment}}</span>
          <span>截止时间：{{addNewDetail.deadlineTime | moment}}</span>
          <span>项目状态：<span :style="{'color': statusColor[addNewDetail.status]}">{{proCurStates[addNewDetail.status]}}</span></span>
        </div>
        <div class="sup-c3-search">
          乡镇卫生院：
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="hospitalExeUid"
            @focus="isDown = true"
            @blur="isDown = false"
            :fetch-suggestions="querySearch1"
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
          <el-button  icon="el-icon-search" @click.native="budgetDetail(addNewDetail, false)">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          <el-button type="primary" :disabled="addNewDetail.status !== '0'" @click.native="townHospEntry">录入预算</el-button>
          <el-button @click.native="releaseBudget" :disabled="!isAllEntry || addNewDetail.status !== '0'">发布预算</el-button>
          <el-button @click.native="exportExc('1', addNewDetail.uid)" :disabled="addNewDetail.status === '0'">导出</el-button>
        </div>
        <el-table
          :data="budgetTownHospList"
          key="tabel2"
          stripe
          :show-overflow-tooltip="true"
          show-summary
          :summary-method="getSummaries1"
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
            :show-overflow-tooltip="true"
            width="176">
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
            prop="requirements"
            width="252"
            :show-overflow-tooltip="true"
            label="项目要求">
          </el-table-column>
          <el-table-column
            prop="deadlineTime"
            width="176"
            label="截止时间">
            <template slot-scope="scope">
              {{scope.row.deadlineTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="176">
            <template slot-scope="scope">
              <span style="padding: 0;" class="cancel-reg" @click="reviseTownHospEntry(scope.row)" v-if="addNewDetail.status === '0' && scope.row.entryStatus !== '0'">修改</span>
              <span style="padding: 0;" class="cant-tap" v-else>修改</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--卫计项目执行详情-->
      <div class="sup-content" v-show="sideOneCurP === 4">
        <div class="sup-c3-detail">
          <span>项目名称：{{addNewDetail.name}}</span>
          <span>指标文号：{{addNewDetail.quotaNum}}</span>
          <span>预算总金额：{{addNewDetail.budgetAmount}}</span>
          <span>财政预计拨付时间：{{addNewDetail.appropriateTime | moment}}</span>
          <span>截止时间：{{addNewDetail.deadlineTime | moment}}</span>
          <span>项目状态：<span :style="{'color': statusColor[addNewDetail.status]}">{{proCurStates[addNewDetail.status]}}</span></span>
        </div>
        <div class="sup-c3-search">
          乡镇卫生院：
          <el-autocomplete
            style="margin-right: 45px"
            popper-class="my-autocomplete"
            v-model="hospitalExeUid"
            @focus="isDown = true"
            @blur="isDown = false"
            :fetch-suggestions="querySearch1"
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
          <el-select v-model="executeStatus" style="width: 200px;" placeholder="请选择">
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
          <el-button @click.native="executeDetail(addNewDetail, false)"  icon="el-icon-search">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          逾期能否提交：
          <el-radio-group  v-model="isSubmit" @change="isSubmitUpdate">
            <el-radio label="0">不能</el-radio>
            <el-radio style="margin-right: 80px;" label="1">能</el-radio>
          </el-radio-group>
          能否修改：
          <el-radio-group  v-model="isChange" @change="isChangeUpdate">
            <el-radio style="margin-left: 0;" label="0">不能</el-radio>
            <el-radio label="1">能</el-radio>
          </el-radio-group>
          <el-button :disabled="addNewDetail.status !== '2'" @click.native="exportExc('2', addNewDetail.uid)">导出</el-button>
        </div>
        <el-table
          :data="executeTownHospList"
          stripe
          show-summary
          :show-overflow-tooltip="true"
          :summary-method="getSummaries2"
          key="tabel3"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="116">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            label="乡镇卫生院"
            :show-overflow-tooltip="true"
            width="120">
          </el-table-column>
          <el-table-column
            prop="executeStatus"
            width="116"
            label="状态">
            <template slot-scope="scope">
              <i v-if="scope.row.executeStatus === '1'" style="background-color:#1890FF;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.executeStatus === '2'" style="background-color:#EF5555;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.executeStatus === '0'" style="background-color:#FB8C00;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <font  :style="{'color': scope.row.executeStatus === '2' ? '#EF5555' : 'rgba(102, 102, 102)'}">{{scope.row.executeStatus === '2' ? '已逾期' : scope.row.executeStatus === '0' ? '未提交' : '已提交'}}</font>
            </template>
          </el-table-column>
          <el-table-column
            prop="deadlineTime"
            width="116"
            label="截止时间">
            <template slot-scope="scope">
              {{scope.row.deadlineTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="120"
            label="预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.budgetAmount ? scope.row.budgetAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="120"
            label="实发金额（元）">
            <template slot-scope="scope">
              {{scope.row.actualAmount ? scope.row.actualAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="hospArriveTime"
            width="116"
            label="到账时间">
            <template slot-scope="scope">
              {{scope.row.hospArriveTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="finishSituation"
            width="116"
            :show-overflow-tooltip="true"
            label="项目完成情况">
          </el-table-column>
          <el-table-column
            label="操作"
            width="116">
            <template slot-scope="scope">
              <span  class="cancel-reg" @click="showHospDetail(scope.row.uid)" v-if="scope.row.executeStatus === '1'">查看详情</span>
              <span  class="cant-tap" v-else>查看详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--卫计项目卫生院执行详情-->
      <div class="sup-content" v-show="sideOneCurP === 5">
        <div class="sup-c3-detail">
          <span>项目名称：{{townHospDetail.projectName}}</span>
          <span>实施单位：{{townHospDetail.townshipHospName}}</span>
          <span>预算金额：{{townHospDetail.budgetAmount}}元</span>
          <span>截止时间：{{townHospDetail.deadlineTime | moment}}</span><br>
          <span>项目要求：{{townHospDetail.requirements}}</span>
        </div>
        <div class="sup-c3-btn">
          <div>
            实发金额：<span>{{townHospDetail.actualAmount}} <span>元</span></span>
          </div>
          <div>
            到账时间：<span>{{townHospDetail.hospArriveTime | moment}} <i class="el-icon-date"></i></span>
          </div>
        </div>
        <div class="sup-c2-t2" style="margin-left: 0">
          <span >项目完成情况：</span>
          <div class="textarea">{{townHospDetail.finishSituation}}</div>
        </div>
        <div class="sup-c2-t2" style="margin-left: 28px">
          <span >项目现场：</span>
          <div class="sup-c5-piclist" id="proE">
            <!--<ul class="clearfix">-->
              <!--<li v-for="item in townHospDetail.appendices" :key="item.id">-->
                <!--<img :src="item.thumbnailPath" alt="">-->
                <!--<i class="iconfont" @click="showPic(item.fileFullPath)">&#xe689;</i>-->
              <!--</li>-->
            <!--</ul>-->
          </div>
        </div>
        <div class="sup-c2-t2" style="margin-left: 54px">
          <span >备注：</span>
          <div class="textarea">{{townHospDetail.description}}</div>
        </div>
      </div>
    </div>
    <!--基础公卫-->
    <div class="sup-content-box clearfix" v-show="sideType === 2">
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
    <!--卫生院补助--> <!--村卫生室补助-->
    <div class="sup-content-box clearfix" v-show="sideType === 3 || sideType === 4">
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
      <!--村卫生室药物补助，预算详情-->
      <div class="sup-content" v-show="sideThreeCurP === 5">
        <div class="sup-c3-detail">
          <span>项目年度：{{addDrugNewDetail.year}}</span>
          <span>项目季度：{{addDrugNewDetail.quarter === '9' ? '年终考核' : (addDrugNewDetail.quarter + '季度')}}</span>
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
          <el-button type="primary" :disabled="addDrugNewDetail.status !== '0'" style="width: 106px;" @click.native="drugVillageEntry">选择村卫生室</el-button>
          <el-button :disabled="!drugTownIsAllEntry || addDrugNewDetail.status !== '0'" @click.native="releaseDrugBudget">发布预算</el-button>
          <el-button :disabled="addDrugNewDetail.status !== '0'" style="float: right;position: relative;">
            导入
            <input v-show="addDrugNewDetail.status === '0'" type="file" @change="importExcDrugV" style="overflow: hidden;opacity: 0;filter:Alpha(opacity=0);position: absolute;top: 0;left: 0;width: 100%;height: 100%;" id="drugVImportExc" accept=".xls">
          </el-button>
          <el-button :disabled="addDrugNewDetail.status !== '0'" @click.native="downloadDrugExc(addDrugNewDetail.uid, 2)"  style="width: 122px;">下载导入模板</el-button>
        </div>
        <el-table
          :data="drugBudgetTownHospList"
          key="tabel12"
          stripe
          show-summary
          :show-overflow-tooltip="true"
          :summary-method="getSummaries8"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="211">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            label="乡镇卫生院"
            :show-overflow-tooltip="true"
            width="211">
          </el-table-column>
          <el-table-column
            prop="villageClinicNum"
            label="村卫生室个数"
            width="211">
          </el-table-column>
          <el-table-column
            prop="docBudgetAmount"
            width="211"
            label="乡村医生预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.docBudgetAmount ? scope.row.docBudgetAmount : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="212">
            <template slot-scope="scope">
              <span  class="cancel-reg" @click="reviseDrugVillageEntry(scope.row)" v-if="scope.row.villageClinicNum && addDrugNewDetail.status === '0'">修改</span>
              <span  class="cant-tap" v-else>修改</span>
              <span  class="cancel-reg" v-if="scope.row.villageClinicNum" @click="drugVillageDetial(scope.row, true)">村卫生室详情</span>
              <span  class="cant-tap" v-else>村卫生室详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--村卫生室药物补助，预算-录入村卫生室-->
      <div class="sup-content" v-show="sideThreeCurP === 6">
        <div class="sup-c3-detail">
          <span>项目年度：{{addDrugNewDetail.year}}</span>
          <span>项目季度：{{addDrugNewDetail.quarter === '9' ? '年终考核' : (addDrugNewDetail.quarter + '季度')}}</span>
          <span>项目代码：{{addDrugNewDetail.quotaNum}}</span>
        </div>
        <div class="sup-c2-t">
          <div class="sup-c2-t1" style="margin-left: 0;">
            <p style="height: 16px;"></p>
            <div class="sup-c2t1-item">
              <span class="red-star">乡镇卫生院：</span>
              <el-select v-model="drugEntryData.uid" v-if="!drugCanSelect" @change="drugChooseTownHCosp" style="width: 200px;" placeholder="请选择">
                <el-option
                  v-for="item in drugEntryHospList"
                  :key="item.uid"
                  :label="item.name"
                  :value="item.uid">
                </el-option>
              </el-select>
              <el-input :disabled="true" v-model="drugEntryData.townshipHospName"  style="width: 200px;height: 32px;" v-else></el-input>
            </div>
          </div>
        </div>
        <div class="sup-c2-b">
          <p class="red-star">村卫生室：<span style="margin-left: 16px">已选{{drugVillageSelected.length ? drugVillageSelected.length : 0}}个</span></p>
          <div class="">
            <el-transfer
              style="text-align: left; display: inline-block;"
              v-model="drugVillageSelected"
              filterable
              :titles="['待选列表', '已选列表']"
              :button-texts="['取消', '选择']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              @change="supC2HandleChange"
              :data="drugVillageUnselect">
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
            <el-button type="primary" :disabled="!drugEntryData.uid || !drugVillageSelected.length" @click.native="saveDrugDudget(false)">保存</el-button>
            <el-button type="primary"  v-if="!drugCanSelect" :disabled="!drugEntryData.uid || !drugVillageSelected.length"  @click.native="saveDrugDudget(true)" style="width: 106px;">保存并新增</el-button>
            <el-button @click.native="cancelDrugBV">取消</el-button>
          </div>
        </div>
      </div>
      <!--村卫生室药物补助，预算-村卫生室详情-->
      <div class="sup-content" v-show="sideThreeCurP === 7">
        <div class="sup-c3-detail">
          <span>项目年度：{{addDrugNewDetail.year}}</span>
          <span>项目季度：{{addDrugNewDetail.quarter === '9' ? '年终考核' : (addDrugNewDetail.quarter + '季度')}}</span>
          <span>项目代码：{{addDrugNewDetail.quotaNum}}</span>
          <span>实施单位：{{curDrugHospDetail.townshipHospName}}</span>
        </div>
        <div class="sup-c3-search">
          村卫生室：
          <el-select v-model="dHospitalExeUid" style="width: 200px;" placeholder="请选择">
            <el-option
              v-for="item in curDrugVillageHospList"
              :key="item.clinicExeUid"
              :label="item.name"
              :value="item.clinicExeUid">
            </el-option>
          </el-select>
          <el-button  icon="el-icon-search" @click.native="drugVillageDetial(curDrugHospDetail, false)">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          <el-button type="primary" @click.native="drugVBudgetEntry">录入预算</el-button><button style="display: none;"></button>
        </div>
        <el-table
          :data="drugVillageHosPListData"
          key="tabel13"
          stripe
          show-summary
          :summary-method="getSummaries10"
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
            :show-overflow-tooltip="true"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageDoctorName"
            width="176"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="villageDoctorBankAccount"
            width="176"
            :show-overflow-tooltip="true"
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
              <span  class="cancel-reg" @click="reviseDrugVBudgetEntry(scope.row)" v-if="scope.row.budgetAmount && addDrugNewDetail.status === '0'">修改</span>
              <span  class="cant-tap" v-else>修改</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--村卫生室药物补助，执行详情-->
      <div class="sup-content" v-show="sideThreeCurP === 8">
        <div class="sup-c3-detail">
          <span>项目年度：{{addDrugNewDetail.year}}</span>
          <span>项目季度：{{addDrugNewDetail.quarter === '9' ? '年终考核' : (addDrugNewDetail.quarter + '季度')}}</span>
          <span>项目代码：{{addDrugNewDetail.quotaNum ? addDrugNewDetail.quotaNum : '无'}}</span>
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
          <el-radio-group v-model="drugVIsSubmit" @change="drugVIsSubmitUpdate">
            <el-radio label="0">不能</el-radio>
            <el-radio style="margin-right: 80px;"  v-model="drugVIsSubmit" label="1">能</el-radio>
          </el-radio-group>
          能否修改：
          <el-radio-group v-model="drugVIsChange" @change="drugVIsChangeUpdate">
            <el-radio label="0">不能</el-radio>
            <el-radio label="1">能</el-radio>
          </el-radio-group>
        </div>
        <el-table
          :data="drugExecuteTownHospList"
          key="tabel14"
          stripe
          :show-overflow-tooltip="true"
          show-summary
          :summary-method="getSummaries9"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="116">
          </el-table-column>
          <el-table-column
            prop="townshipHospName"
            label="乡镇卫生院"
            :show-overflow-tooltip="true"
            width="120">
          </el-table-column>
          <el-table-column
            prop="executeStatus"
            width="116"
            label="状态">
            <template  slot-scope="scope">
              <i v-if="scope.row.executeStatus === '1'" style="background-color:#1890FF;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.executeStatus === '2'" style="background-color:#EF5555;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.executeStatus === '0'" style="background-color:#FB8C00;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <font  :style="{'color': scope.row.executeStatus === '2' ? '#EF5555' : 'rgba(102, 102, 102)'}">{{scope.row.executeStatus === '2' ? '已逾期' : scope.row.executeStatus === '0' ? '未提交' : '已提交'}}</font>
            </template>
          </el-table-column>
          <el-table-column
            prop="villageClinicNum"
            width="150"
            label="村卫生室个数">
          </el-table-column>
          <el-table-column
            prop="docBudgetAmount"
            width="150"
            label="乡村预算金额（元）">
          </el-table-column>
          <el-table-column
            prop="docActualAmount"
            width="180"
            label="乡村医生实发金额（元）">
          </el-table-column>
          <el-table-column
            width="150"
            label="操作">
            <template  slot-scope="scope">
              <span  class="cancel-reg" @click="drugExecuteVillageDetial(scope.row, true)" v-if="scope.row.executeStatus === '1'">村卫生室详情</span>
              <span  class="cant-tap" v-else>村卫生室详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--村卫生室药物补助，执行-村卫生室详情-->
      <div class="sup-content" v-show="sideThreeCurP === 9">
        <div class="sup-c3-detail">
          <span>项目年度：{{addDrugNewDetail.year}}</span>
          <span>项目季度：{{addDrugNewDetail.quarter === '9' ? '年终考核' : (addDrugNewDetail.quarter + '季度')}}</span>
          <span>项目代码：{{addDrugNewDetail.quotaNum}}</span>
          <span>实施单位：{{curDrugHospDetail.townshipHospName}}</span>
        </div>
        <div class="sup-c3-search">
          村卫生室：
          <el-select v-model="dHospitalExeUid" style="width: 200px;" placeholder="请选择">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              v-for="item in curDrugVillageHospList"
              :key="item.clinicExeUid"
              :label="item.name"
              :value="item.clinicExeUid">
            </el-option>
          </el-select>
          <el-button  icon="el-icon-search" @click.native="drugExecuteVillageDetial(curDrugHospDetail, false)">搜索</el-button>
        </div>
        <el-table
          :data="drugVillageHosPListData"
          key="tabel15"
          :show-overflow-tooltip="true"
          stripe
          show-summary
          :summary-method="getSummaries11"
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
            :show-overflow-tooltip="true"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageDoctorName"
            width="176"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="villageDoctorBankAccount"
            width="176"
            :show-overflow-tooltip="true"
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
              <span v-if="scope.row.appendices.length" @click="previewPictures(scope.row.appendices[0].fileFullPath, 'bigPic')" style="color: #1890FF">查看图片</span>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            :show-overflow-tooltip="true"
            width="150"
            label="备注">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--村医卡号维护-->
    <div class="sup-content-box clearfix" v-show="sideType === 5">
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
            <img src="../../../../assets/img/not.png" alt="">
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
            <img src="../../../../assets/img/not.png" alt="">
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
            <img src="../../../../assets/img/not.png" alt="">
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
    <div class="pagination-box" v-if="pagination.total" v-show="sideOneCurP !== 2 && sideOneCurP !== 5 && sideTwoCurP !== 2 && sideTwoCurP !== 5 && sideThreeCurP !== 2 && sideThreeCurP !== 6">
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
    <!--卫计项目录入预算dialog-->
    <el-dialog
      title="乡镇卫生院预算"
      :visible.sync="townHospEntryDialog"
      :close-on-click-modal="false"
      width="416px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <span>项目名称：</span>
          <el-input style="width: 260px; height: 32px;" disabled v-model="addNewDetail.name"></el-input>
        </div>
        <div class="town-entry-row">
          <span class="red-star">乡镇卫生院：</span>
          <el-select filterable  v-model="townHospEntryData.uid" style="width: 260px;" v-if="!townHospEntryCanSelect" placeholder="请选择">
            <el-option
              v-for="item in curTownUnentryHosp"
              :key="item.hospitalExeUid"
              :label="item.name"
              :value="item.hospitalExeUid">
            </el-option>
          </el-select>
          <el-input :disabled="true" v-model="townHospEntryData.townshipHospName"  style="width: 260px;height: 32px;" v-else></el-input>
        </div>
        <div class="town-entry-row">
          <span class="red-star">预算金额：</span>
          <el-form :model="townHospEntryData" class="demo-ruleForm">
            <el-form-item
              prop="budgetAmount"
              :rules="[
                    {validator: validateNum, required: false}
                  ]"
            >
              <el-input type="budgetAmount" style="width: 260px;height: 32px;" v-model="townHospEntryData.budgetAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="town-entry-row">
          <span class="red-star">截止时间：</span>
          <el-date-picker
            style="width: 260px;"
            v-model="townHospEntryData.deadlineTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="town-entry-row">
          <span class="red-star">项目要求：</span>
          <textarea  v-model="townHospEntryData.requirements"  name=""  cols="30" rows="10"></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!townHospEntryData.requirements || !townHospEntryData.deadlineTime || !townHospEntryData.budgetAmount || !townHospEntryData.uid" @click="saveTownHospEntry(false)">保存</el-button>
        <el-button type="primary" v-if="!townHospEntryCanSelect"  :disabled="!townHospEntryData.requirements || !townHospEntryData.deadlineTime || !townHospEntryData.budgetAmount || !townHospEntryData.uid" style="width: 106px" @click="saveTownHospEntry(true)">保存并新增</el-button>
        <el-button @click="townHospEntryDialog = false">取 消</el-button>
      </span>
    </el-dialog>
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
    <!--药物村卫生室录入预算-->
    <el-dialog
      title="村卫生室预算"
      :visible.sync="drugVillageEntryDialog"
      :close-on-click-modal="false"
      width="750px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <span>实施单位：</span>{{curDrugHospDetail.townshipHospName}}
        </div>
        <div class="town-entry-row">
          <span class="red-star">村卫生室：</span>
          <el-select v-model="drugVillageUid" @change="drugChooseVillage" style="width: 200px;" v-if="!drugVillageEntryCanSelect" placeholder="请选择">
            <el-option
              v-for="item in drugVillageEntryList"
              :key="item.clinicExeUid"
              :label="item.name"
              :value="item.clinicExeUid">
            </el-option>
          </el-select>
          <el-input :disabled="true" v-model="drugCurVillageEntryName"  style="width: 200px;height: 32px;" v-else></el-input>
        </div>
        <div class="town-entry-row" v-for="item in drugVillageEntryData" :key="item.id">
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
        <el-button type="primary" :disabled="isActive(drugVillageEntryData)"  @click.native="drugSaveVillageEntry(false)">保存</el-button>
        <el-button type="primary" v-if="!drugVillageEntryCanSelect"  :disabled="isActive(drugVillageEntryData)"  style="width: 106px" @click.native="drugSaveVillageEntry(true)">保存并新增</el-button>
        <el-button @click.native="drugVillageEntryDialog = false">取 消</el-button>
      </span>
    </el-dialog>
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
      <div class="town-entry-box" style="margin: 16px 0;">
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
    <!--基药-卫生室项目导出-->
    <el-dialog
      title="基药补助—村卫生室补助导出"
      :visible.sync="exportDrugVDialog"
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
        <el-button :disabled="!exportBaseParams.where.year || !exportBaseParams.where.type" type="primary" @click.native="comfirmExportDrugV">确定</el-button>
        <el-button @click.native="exportDrugVDialog = false">取 消</el-button>
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
    this.getProList();
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
    sideSelect (key) {
      this.resetData();
      this.sideType = parseInt(key);
      if (this.sideType === 1) {
        this.getProList();
      } else if (this.sideType === 2) {
        this.getBaseList();
      } else if (this.sideType === 3 || this.sideType === 4) {
        if (this.sideType === 3) {
          this.drugType = 1;
        } else {
          this.drugType = 0;
        }
        this.getDruggeryList()
      } else if (this.sideType === 5) {
        this.getVillageList();
        this.getDrugHospList();
      }
    }, // 侧边栏点击
    breadTap (type, index, curP) {
      this.pagination.pageNum = 1;
      this.breadList[type].splice(index + 1);
      this.sideType = type;
      console.log(type, curP)
      switch (type) {
        case 1:
          this.hospitalExeUid = '';
          this.sideOneCurP = curP;
          this.getProList();
          break;
        case 2:
          this.vHospitalExeUid = '';
          this.sideTwoCurP = curP;
          this.baseHospitalExeUid = '';
          this.getBaseList();
          if (curP === 3) {
            console.log(this.addBaseNewDetail)
            this.baseBudgetDetail(this.addBaseNewDetail, false)
          }
          break;
        case 3:
          this.drugHospitalExeUid = '';
          this.sideThreeCurP = curP;
          this.getDruggeryList();
          break;
        case 4:
          this.drugHospitalExeUid = '';
          this.dHospitalExeUid = '';
          this.sideThreeCurP = curP;
          if (curP === 5) {
            this.drugBudgetDetail(this.addDrugNewDetail, false);
          }
          break;
      }
    }, // 面包屑点击
    resetData () {
      this.exportProYear = [];
      this.dHospitalExeUid = '';
      this.pagination.pageNum = 1;
      this.quotaNum = '';
      this.proMonth = '';
      this.baseQuarter = '';
      this.proState = '';
      this.hideP = false;
      this.proYear = '';
      this.proName = '';
      this.addBaseQuarter = '';
      this.drugType = 1;
      this.breadList = {
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
      }
      this.sideOneCurP = 1;
      this.vHospitalExeUid = '';
      this.sideTwoCurP = 1;
      this.sideThreeCurP = 1;
      this.allTotal = {
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
      }
      this.baseHospitalExeUid = '';
      this.drugHospitalExeUid = '';
      this.hospitalExeUid = '';
    },
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
      switch (this.sideType) {
        case 1:
          if (this.sideOneCurP === 1) {
            this.getProList();
          } else if (this.sideOneCurP === 3) {
            this.budgetDetail(this.addNewDetail, false); // 预算详情
          } else if (this.sideOneCurP === 4) {
            this.executeDetail(this.addNewDetail, false); // 执行详情
          }
          break;
        case 2:
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
          break;
        case 3:
          if (this.sideThreeCurP === 1) {
            this.getDruggeryList();
          } else if (this.sideThreeCurP === 3) {
            this.drugBudgetDetail(this.addDrugNewDetail, false); // 卫生院预算详情
          } else if (this.sideThreeCurP === 4) {
            this.drugExecuteDetail(this.addDrugNewDetail, false); // 卫生院执行详情
          } else if (this.sideThreeCurP === 5) {
            this.drugBudgetDetail(this.addDrugNewDetail, false); // 村卫生室预算详情
          } else if (this.sideThreeCurP === 7) {
            this.drugVillageDetial(this.curDrugHospDetail, false); // 村卫生室预算-村卫生室详情
          } else if (this.sideThreeCurP === 8) {
            this.drugExecuteDetail(this.addDrugNewDetail, false); // 村卫生室执行详情
          } else if (this.sideThreeCurP === 9) {
            this.drugVillageDetial(this.curDrugHospDetail, false); // 村卫生室执行详情-村卫生室详情
          }
          break;
        case 4:
          if (this.sideThreeCurP === 1) {
            this.getDruggeryList();
          } else if (this.sideThreeCurP === 3) {
            this.drugBudgetDetail(this.addDrugNewDetail, false); // 卫生院预算详情
          } else if (this.sideThreeCurP === 4) {
            this.drugExecuteDetail(this.addDrugNewDetail, false); // 卫生院执行详情
          } else if (this.sideThreeCurP === 5) {
            this.drugBudgetDetail(this.addDrugNewDetail, false); // 村卫生室预算详情
          } else if (this.sideThreeCurP === 7) {
            this.drugVillageDetial(this.curDrugHospDetail, false); // 村卫生室预算-村卫生室详情
          } else if (this.sideThreeCurP === 8) {
            this.drugExecuteDetail(this.addDrugNewDetail, false); // 村卫生室执行详情
          } else if (this.sideThreeCurP === 9) {
            this.drugVillageDetial(this.curDrugHospDetail, false); // 村卫生室执行详情-村卫生室详情
          }
          break;
        case 5:
          this.getVillageList();
          break;
      }
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      switch (this.sideType) {
        case 1:
          if (this.sideOneCurP === 1) {
            this.getProList();
          } else if (this.sideOneCurP === 3) {
            this.budgetDetail(this.addNewDetail, false); // 预算详情
          } else if (this.sideOneCurP === 4) {
            this.executeDetail(this.addNewDetail, false); // 执行详情
          }
          break;
        case 2:
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
          break;
        case 3:
          if (this.sideThreeCurP === 1) {
            this.getDruggeryList();
          } else if (this.sideThreeCurP === 3) {
            this.drugBudgetDetail(this.addDrugNewDetail, false); // 卫生院预算详情
          } else if (this.sideThreeCurP === 4) {
            this.drugExecuteDetail(this.addDrugNewDetail, false); // 卫生院执行详情
          } else if (this.sideThreeCurP === 5) {
            this.drugBudgetDetail(this.addDrugNewDetail, false); // 村卫生室预算详情
          } else if (this.sideThreeCurP === 7) {
            this.drugVillageDetial(this.curDrugHospDetail, false); // 村卫生室预算-村卫生室详情
          } else if (this.sideThreeCurP === 8) {
            this.drugExecuteDetail(this.addDrugNewDetail, false); // 村卫生室执行详情
          } else if (this.sideThreeCurP === 9) {
            this.drugVillageDetial(this.curDrugHospDetail, false); // 村卫生室执行详情-村卫生室详情
          }
          break;
        case 4:
          if (this.sideThreeCurP === 1) {
            this.getDruggeryList();
          } else if (this.sideThreeCurP === 3) {
            this.drugBudgetDetail(this.addDrugNewDetail, false); // 卫生院预算详情
          } else if (this.sideThreeCurP === 4) {
            this.drugExecuteDetail(this.addDrugNewDetail, false); // 卫生院执行详情
          } else if (this.sideThreeCurP === 5) {
            this.drugBudgetDetail(this.addDrugNewDetail, false); // 村卫生室预算详情
          } else if (this.sideThreeCurP === 7) {
            this.drugVillageDetial(this.curDrugHospDetail, false); // 村卫生室预算-村卫生室详情
          } else if (this.sideThreeCurP === 8) {
            this.drugExecuteDetail(this.addDrugNewDetail, false); // 村卫生室执行详情
          } else if (this.sideThreeCurP === 9) {
            this.drugVillageDetial(this.curDrugHospDetail, false); // 村卫生室执行详情-村卫生室详情
          }
          break;
        case 5:
          this.getVillageList();
          break;
      }
    },
    getSummaries1 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (index === 1) {
          sums[index] = this.allTotal.totalNum;
        }
        if (index === 2) {
          sums[index] = this.allTotal.totalBudgetAmount;
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
    getSummaries8 (param) {
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
          sums[index] = this.allTotal.totalVillageClinic;
        }
        if (index === 3) {
          sums[index] = this.allTotal.totalDocBudgetAmount;
        }
      });
      return sums;
    },
    getSummaries9 (param) {
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
        if (index === 3) {
          sums[index] = this.allTotal.totalVillageClinic;
        }
        if (index === 4) {
          sums[index] = this.allTotal.totalDocBudgetAmount;
        }
        if (index === 5) {
          sums[index] = this.allTotal.totalDocActualAmount;
        }
      });
      return sums;
    },
    getSummaries10 (param) {
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
    getSummaries11 (param) {
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
        if (index === 5) {
          sums[index] = this.allTotal.totalActualAmount;
        }
      });
      return sums;
    },
    handleSelect (item) {
      console.log(item);
    },
    // 卫计项目
    querySearch1 (queryString, cb) {
      var restaurants = this.curTownHospList;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    getProList () {
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
        }
      }
      if (this.proYear) {
        params.where['year'] = this.proYear;
      }
      if (this.proName) {
        params.where['name'] = this.proName;
      }
      if (this.quotaNum) {
        params.where['quotaNum'] = this.quotaNum;
      }
      if (this.proState) {
        params.where['status'] = this.proState;
      }
      this.axios.get('/hisServices/financialSupervision/projectMonitors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.proList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          }
        })
    }, // 获取卫计项目列表
    revisePro (uid) {
      this.townsHospList = [];
      this.curTownHospList = [];
      this.sideOneCurP = 2;
      this.breadList['1'].push({name: '修改项目', sideType: 1, sideCurP: 2})
      let params = {
        uid: uid
      }
      // 获取该卫计项目的详情，填入addNewDetail
      this.axios.get('/hisServices/financialSupervision/projectMonitor', {params})
        .then(res => {
          if (res) {
            this.addNewDetail = res.data;
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
            this.townsHospList = res.data.list;
            this.townsHospList.map(y => { y.disabled = !y.isExistsVillageClinic })
            this.townsHospList.map((x, index) => { x.key = index + 1 })
            console.log(this.addNewDetail)
            res.data.list.forEach((item, index) => { if (item.isSelected === true) { this.curTownHospList.push(index + 1) } })
          }
        })
    }, // 修改卫计项目
    addNewPro () {
      this.addNewDetail = {
        name: '', // 名称
        year: '', // 年度
        quotaNum: '', // 指标文号
        appropriateTime: '', // 预拨时间
        deadlineTime: '', // 截止时间
        budgetAmount: '', // 预算总金额
        requirements: '' // 要求
      }
      this.townsHospList = [];
      this.curTownHospList = [];
      this.sideOneCurP = 2;
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
            this.townsHospList = res.data.list;
            this.townsHospList.map(y => { y.disabled = !y.isExistsVillageClinic })
            this.townsHospList.map((x, index) => { x.key = index + 1 })
          }
        })
    }, // 新增卫计项目
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
    saveUpdatePro () {
      this.addNewDetail.status = null;
      this.addNewDetail.updateType = null;
      this.addNewDetail.overdueType = null;
      this.addNewDetail.hospList = [];
      this.curTownHospList.forEach(x => {
        let o = {
          townshipHospUid: this.townsHospList[x - 1].uid,
          townshipHospName: this.townsHospList[x - 1].name
        }
        this.addNewDetail.hospList.push(o);
      })
      this.axios.put('/hisServices/financialSupervision/projectMonitor', this.addNewDetail)
        .then(res => {
          if (res) {
            this.$message.success('修改成功');
            this.sideOneCurP = 1;
            this.breadList['1'].splice(1, 1);
            this.getProList();
          }
        })
    }, // 修改项目
    saveAddPro () {
      this.addNewDetail.hospList = [];
      this.curTownHospList.forEach(x => {
        let o = {
          townshipHospUid: this.townsHospList[x - 1].uid,
          townshipHospName: this.townsHospList[x - 1].name
        }
        this.addNewDetail.hospList.push(o)
      })
      this.axios.post('/hisServices/financialSupervision/projectMonitor', this.addNewDetail)
        .then(res => {
          if (res) {
            this.$message.success('新增成功');
            this.sideOneCurP = 1;
            this.breadList['1'].splice(1, 1);
            this.getProList();
          }
        })
    }, // 保存新增项目
    supOneCancel () {
      this.breadList['1'].splice(1);
      this.sideOneCurP = 1;
    }, // 取消
    filterMethod (query, item) {
      return item.name.indexOf(query) > -1;
    },
    supC2HandleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    budgetDetail (item, addBread) {
      this.addNewDetail = {};
      item.hospList = null;
      this.sideOneCurP = 3;
      if (addBread) {
        this.breadList['1'].push({name: '预算详情', sideType: 1, sideCurP: 3});
        this.hospitalExeUid = '';
      }
      this.addNewDetail = item;
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
            this.curTownHospList = res.data.list;
            this.curTownHospList.map(x => {
              x.value = x.name;
            })
            this.curTownHospList.splice(0, 0, {value: '全部卫生院', hospitalExeUid: ''})
          }
        })
      // 获取该卫计项目未录入的卫生院
      let p4 = {
        pageSize: 0,
        where: {
          projectUid: item.uid,
          status: '0'
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p4))))
        .then(res => {
          if (res) {
            this.curTownUnentryHosp = res.data.list;
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
      if (this.curTownHospList.some(m => m.value === this.hospitalExeUid)) {
        hospitalExeUid = this.curTownHospList.find(m => m.value === this.hospitalExeUid).hospitalExeUid;
      }
      if (hospitalExeUid) {
        params.where['hospitalExeUid'] = hospitalExeUid;
      }
      this.axios.get('/hisServices/financialSupervision/projectTownshipHosps/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.budgetTownHospList = res.data.page.list;
            this.isAllEntry = res.data.allEntry;
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
    }, // 预算详情
    executeDetail (item, addBread) {
      this.isSubmit = item.overdueType;
      this.isChange = item.updateType;
      this.sideOneCurP = 4;
      if (addBread) {
        this.breadList['1'].push({name: '执行详情', sideType: 1, sideCurP: 4})
        this.hospitalExeUid = '';
      }
      this.addNewDetail = item;
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
            this.curTownHospList = res.data.list;
            this.curTownHospList.map(x => {
              x.value = x.name;
            })
            this.curTownHospList.splice(0, 0, {value: '全部卫生院', hospitalExeUid: ''})
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
      if (this.curTownHospList.some(m => m.value === this.hospitalExeUid)) {
        hospitalExeUid = this.curTownHospList.find(m => m.value === this.hospitalExeUid).hospitalExeUid;
      }
      if (hospitalExeUid) {
        params.where['hospitalExeUid'] = hospitalExeUid;
      }
      if (this.executeStatus) {
        params.where['executeStatus'] = this.executeStatus;
      }
      this.axios.get('/hisServices/financialSupervision/projectTownshipHosps/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.executeTownHospList = res.data.page.list;
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
    }, // 执行详情
    switchProSubmit (type) {
      let params = {
        overdueType: type,
        uid: this.addNewDetail.uid
      }
      this.axios.put('/hisServices/financialSupervision/projectMonitor', params)
        .then(res => {
          if (res) {
            this.$message.success('设置成功');
            this.tipDialog = false;
          }
        })
    },
    switchProChange (type) {
      let params = {
        updateType: type,
        uid: this.addNewDetail.uid
      }
      this.axios.put('/hisServices/financialSupervision/projectMonitor', params)
        .then(res => {
          if (res) {
            this.$message.success('设置成功');
            this.tipDialog = false;
          }
        })
    },
    showHospDetail (uid) {
      this.sideOneCurP = 5;
      this.breadList['1'].push({name: '卫生院详情', sideType: 1, sideCurP: 5})
      let params = {
        uid: uid
      }
      this.axios.get('/hisServices/financialSupervision/projectTownshipHosp', {params})
        .then(res => {
          if (res) {
            this.townHospDetail = res.data;
            this.previewPictures(res.data.appendices, 'proE')
          }
        })
    }, // 查看执行详情里卫生院详情
    townHospEntry () {
      this.townHospEntryCanSelect = false;
      this.townHospEntryDialog = true;
      this.townHospEntryData.uid = '';
      this.townHospEntryData.requirements = this.addNewDetail.requirements;
      this.townHospEntryData.deadlineTime = this.addNewDetail.deadlineTime;
      this.townHospEntryData.budgetAmount = '';
      this.townHospEntryData.hospList = this.budgetTownHospList.filter(x => x.entryStatus === '0');
    },
    saveTownHospEntry (boolean) {
      let { uid, budgetAmount, deadlineTime, requirements } = this.townHospEntryData;
      let params = { uid, budgetAmount, deadlineTime, requirements };
      this.axios.put('/hisServices/financialSupervision/projectTownshipHosp', params)
        .then(res => {
          if (res) {
            this.budgetDetail(this.addNewDetail, false)
            if (boolean) {
              this.townHospEntry();
            } else {
              this.townHospEntryDialog = false;
            }
          }
        })
    }, // 保存卫计预算-录入预算
    reviseTownHospEntry (item) {
      this.townHospEntryData.townshipHospName = item.townshipHospName;
      this.townHospEntryData.requirements = item.requirements;
      this.townHospEntryData.deadlineTime = item.deadlineTime;
      this.townHospEntryData.budgetAmount = item.budgetAmount;
      this.townHospEntryData.uid = item.uid;
      this.townHospEntryDialog = true;
      this.townHospEntryCanSelect = true;
    },
    releaseBudget () {
      let params = {
        uid: this.addNewDetail.uid,
        status: '1'
      }
      this.axios.put('/hisServices/financialSupervision/projectMonitor', params)
        .then(res => {
          if (res) {
            this.$message.success('发布成功');
            this.sideOneCurP = 1;
            this.breadList['1'].splice(1, 1);
            this.getProList();
          }
        })
    }, // 发布预算
    deletePro (uid) {
      this.tipDialog = true;
      this.tipType = 3;
      this.tipDialogMsg = '是否确认删除'
      this.tipDialogUid = uid;
    }, // 删除公卫
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
      this.breadList['2'].push({name: '新增项目', sideType: 2, sideCurP: 2})
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
      this.breadList['2'].splice(1);
      this.sideTwoCurP = 1;
    }, // 取消
    reviseBasePro (uid) {
      this.baseCurQuarterList = [];
      this.curBaseTownHospList = [];
      this.townsBaseHospList = [];
      this.sideTwoCurP = 2;
      this.breadList['2'].push({name: '修改项目', sideType: 2, sideCurP: 2})
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
            this.breadList['2'].splice(1, 1);
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
            this.breadList['2'].splice(1, 1);
            this.getBaseList();
          }
        })
    }, // 保存新增项目
    baseBudgetDetail (item, addBread) {
      this.baseHospitalExeUid = '';
      this.sideTwoCurP = 3;
      if (addBread) {
        this.breadList['2'].push({name: '预算详情', sideType: 2, sideCurP: 3})
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
        this.breadList['2'].push({name: '执行详情', sideType: 2, sideCurP: 6})
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
        this.breadList['2'].splice(2, this.breadList['2'].length, {name: '村卫生室详情', sideType: 2, sideCurP: 4})
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
        this.breadList['2'].splice(2, this.breadList['2'].length, {name: '村卫生室详情', sideType: 2, sideCurP: 7})
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
      this.breadList['2'].splice(2, this.breadList['2'].length, {name: '录入预算', sideType: 2, sideCurP: 5})
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
      this.breadList['2'].splice(2, this.breadList['2'].length, {name: '修改预算', sideType: 2, sideCurP: 5});
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
              this.breadList['2'].splice(2, 1);
              this.baseBudgetDetail(this.addBaseNewDetail, false);
            }
          }
        })
    }, // 保存预算
    cancelEntryBase () {
      this.sideTwoCurP = 3;
      this.breadList['2'].splice(2, 1);
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
            this.breadList['2'].splice(1, 1);
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
    // 基础药物
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
        if (this.drugType === 1) {
          this.breadList['3'].push({name: '预算详情', sideType: 3, sideCurP: 3})
          this.sideThreeCurP = 3;
        } else {
          this.breadList['4'].push({name: '预算详情', sideType: 4, sideCurP: 5})
          this.sideThreeCurP = 5;
        }
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
        if (this.drugType === 1) {
          this.drugIsSubmit = item.overdueType;
          this.drugIsChange = item.updateType;
          console.log('卫生院')
          this.breadList['3'].push({name: '执行详情', sideType: 3, sideCurP: 4})
          this.sideThreeCurP = 4;
        } else {
          this.drugVIsSubmit = item.overdueType;
          this.drugVIsChange = item.updateType;
          this.breadList['4'].push({name: '执行详情', sideType: 4, sideCurP: 8})
          this.sideThreeCurP = 8;
        }
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
      if (this.drugType === 1) {
        this.breadList['3'].push({name: '新增项目', sideType: 3, sideCurP: 2})
      } else {
        this.breadList['4'].push({name: '新增项目', sideType: 4, sideCurP: 2})
      }
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
      if (this.drugType === 1) {
        this.breadList['3'].push({name: '修改项目', sideType: 3, sideCurP: 2})
      } else {
        this.breadList['4'].push({name: '修改项目', sideType: 4, sideCurP: 2})
      }
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
      if (this.sideType === 3) {
        this.breadList['3'].splice(1);
      } else {
        this.breadList['4'].splice(1);
      }
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
            if (this.sideType === 3) {
              this.breadList['3'].splice(1);
            } else {
              this.breadList['4'].splice(1);
            }
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
            if (this.sideType === 3) {
              this.breadList['3'].splice(1);
            } else {
              this.breadList['4'].splice(1);
            }
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
    drugVillageEntry () {
      this.drugAddBudgetType = 0;
      this.drugEntryData = {
        hospitalExeUid: '',
        budgetAmount: ''
      };
      this.drugCanSelect = false;
      this.sideThreeCurP = 6;
      this.drugVillageUnselect = [];
      this.drugVillageSelected = [];
      this.breadList['4'].push({name: '选择村卫生室', sideType: 4, sideCurP: 6})
      // 获取该卫计项目选择的卫生院
      let p = {
        where: {
          projectUid: this.addDrugNewDetail.uid,
          status: '3'
        }
      }
      this.axios.get('/hisServices/financialSupervision/townshipHospitals/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.drugEntryHospList = res.data.list;
          }
        })
    }, // 选择村卫生室
    reviseDrugVillageEntry (item) {
      console.log(item)
      this.drugAddBudgetType = 1;
      this.drugEntryData = item;
      this.drugEntryData.townshipHospExecuteUid = item.uid;
      this.drugCanSelect = true;
      this.sideThreeCurP = 6;
      this.breadList['4'].push({name: '修改村卫生室', sideType: 4, sideCurP: 6})
      // 获取该卫计项目未录入
      let p = {
        where: {
          hospitalExeUid: item.uid,
          status: '2'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.drugVillageUnselect = res.data.list;
            this.drugVillageUnselect.map((x, index) => { x.key = index + 1 })
            res.data.list.forEach((item, index) => { if (item.isSelected === true) { this.drugVillageSelected.push(index + 1) } })
          }
        })
    }, // 修改村卫生室
    saveDrugDudget (boolean) {
      this.drugVillageSelected = Array.from(new Set(this.drugVillageSelected));
      this.drugEntryData.projectUid = this.addDrugNewDetail.uid
      this.drugEntryData.drugVillageClinicList = [];
      this.drugVillageSelected.forEach(x => {
        let o = {
          villageClinicUid: this.drugVillageUnselect[x - 1].uid,
          villageClinicName: this.drugVillageUnselect[x - 1].name
        }
        this.drugEntryData.drugVillageClinicList.push(o);
      })
      if (this.drugAddBudgetType === 1) {
        this.axios.put('/hisServices/financialSupervision/drugVillageClinics', this.drugEntryData)
          .then(res => {
            if (res) {
              this.$message.success('修改成功');
              this.drugVillageEntry();
              this.sideThreeCurP = 5;
              this.breadList['4'].splice(2)
              this.drugBudgetDetail(this.addDrugNewDetail, false);
            }
          })
      } else {
        this.axios.post('/hisServices/financialSupervision/drugVillageClinics', this.drugEntryData)
          .then(res => {
            if (res) {
              this.$message.success('新增成功');
              if (boolean) {
                this.drugVillageEntry();
              } else {
                this.sideThreeCurP = 5;
                this.breadList['4'].splice(2)
              }
              this.drugBudgetDetail(this.addDrugNewDetail, false);
            }
          })
      }
    },
    drugVillageDetial (item, addBread) {
      console.log(item)
      this.curDrugHospDetail = item;
      this.sideThreeCurP = 7;
      if (addBread) {
        this.breadList['4'].splice(2, this.breadList['2'].length, {name: '村卫生室详情', sideType: 4, sideCurP: 7})
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
            this.curDrugVillageHospList = res.data.list;
          }
        })
      // 获取该基础项目未选择的村卫生室
      let p1 = {
        where: {
          hospitalExeUid: item.uid,
          status: '0'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
        .then(res => {
          if (res) {
            this.drugVillageEntryList = res.data.list;
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
      if (this.dHospitalExeUid) {
        params.where['clinicExeUid'] = this.dHospitalExeUid;
      }
      this.axios.get('/hisServices/financialSupervision/drugVillageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.drugVillageHosPListData = res.data.page.list;
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
    }, // 村卫生室详情
    drugExecuteVillageDetial (item, addBread) {
      console.log(item)
      this.curDrugHospDetail = item;
      this.sideThreeCurP = 9;
      if (addBread) {
        this.breadList['4'].splice(2, this.breadList['2'].length, {name: '村卫生室详情', sideType: 4, sideCurP: 9})
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
            this.curDrugVillageHospList = res.data.list;
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
      if (this.dHospitalExeUid) {
        params.where['clinicExeUid'] = this.dHospitalExeUid;
      }
      this.axios.get('/hisServices/financialSupervision/drugVillageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.drugVillageHosPListData = res.data.page.list;
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
    }, // 执行详情里的村卫生室详情
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
            this.breadList['3'].splice(1, 1);
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
    releaseDrugBudget () {
      let params = {
        uid: this.addDrugNewDetail.uid,
        operationType: '1'
      }
      this.axios.put('/hisServices/financialSupervision/systemSubsidy', params)
        .then(res => {
          if (res) {
            this.$message.success('发布成功');
            this.sideThreeCurP = 1;
            this.breadList['4'].splice(1, 1);
            this.getDruggeryList();
          }
        })
    },
    cancelDrugBV () {
      this.breadList['4'].splice(this.breadList['4'].length - 1)
      this.sideThreeCurP = 5;
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
    },
    // 公用
    cancelTip () {
      this.tipDialog = false;
      if (this.sideType === 1) {
        if (this.tipType === 1) {
          if (this.isSubmit === '0') {
            this.isSubmit = '1'
          } else {
            this.isSubmit = '0'
          }
        } else if (this.tipType === 0) {
          if (this.isChange === '0') {
            this.isChange = '1'
          } else {
            this.isChange = '0'
          }
        }
      } else if (this.sideType === 2) {
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
      } else if (this.sideType === 3) {
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
      } else if (this.sideType === 4) {
        if (this.tipType === 1) {
          if (this.drugVIsSubmit === '0') {
            this.drugVIsSubmit = '1'
          } else {
            this.drugVIsSubmit = '0'
          }
        } else if (this.tipType === 0) {
          if (this.drugVIsChange === '0') {
            this.drugVIsChange = '1'
          } else {
            this.drugVIsChange = '0'
          }
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
    isSubmitUpdate () {
      this.tipType = 1;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    },
    isChangeUpdate () {
      this.tipType = 0;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    },
    baseIsSubmitUpdate () {
      this.tipType = 1;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    },
    baseIsChangeUpdate () {
      this.tipType = 0;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    },
    drugIsSubmitUpdate () {
      this.tipType = 1;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    },
    drugIsChangeUpdate () {
      this.tipType = 0;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    },
    drugVIsSubmitUpdate () {
      this.tipType = 1;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    },
    drugVIsChangeUpdate (e) {
      this.tipType = 0;
      this.tipDialog = true;
      this.tipDialogMsg = '是否确认修改'
    }
  },
  watch: {
    villageType (e) {
      this.sideFourCurP = e + 1;
      this.villageHos = '';
      this.villageRoom = '';
      this.villageRoomList = [];
      this.getVillageList();
    },
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
    },
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
    },
    exportDrugVDialog (e) {
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
    padding: 28px 30px;
    float: left;
    border-left: 1px solid #e8e8e8;
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
    padding-top: 90px;
    position: relative;
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
        .el-submenu{
          line-height: 40px;
          .el-submenu__title{
            height: 40px;
            line-height: 40px;
          }
          .el-menu--inline{
            padding-top: 0;
          }
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
      width: calc(100% - 160px);
      padding: 0 30px 80px 30px;
      border-left: solid 1px #e8e8e8;
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
