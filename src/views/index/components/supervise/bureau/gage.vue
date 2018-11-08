<template>
  <div class="my-sup-b clearfix">
    <div class="sup-bread">
      <i class="iconfont">&#xe696;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
      </div>
    </div>
    <!--卫计项目-->
    <div class="sup-content-box clearfix">
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
    <!--查看大图-->
    <div class="show-big-pic" v-show="showBigPic" @click="showBigPic = false">
      <img :src="bigPicUrl" alt="">
    </div>
    <!--分页-->
    <div class="pagination-box" v-if="pagination.total" v-show="sideOneCurP !== 2 && sideOneCurP !== 5">
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
      isAllEntry: false // 预算详情里是否全部已录入了预算，为true是可以发布项目
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
          this.sideThreeCurP = curP;
          if (curP === 5) {
            this.drugBudgetDetail(this.addDrugNewDetail, false);
          }
          break;
      }
    }, // 面包屑点击
    resetData () {
      this.exportProYear = [];
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
      if (this.sideOneCurP === 1) {
        this.getProList();
      } else if (this.sideOneCurP === 3) {
        this.budgetDetail(this.addNewDetail, false); // 预算详情
      } else if (this.sideOneCurP === 4) {
        this.executeDetail(this.addNewDetail, false); // 执行详情
      }
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      if (this.sideOneCurP === 1) {
        this.getProList();
      } else if (this.sideOneCurP === 3) {
        this.budgetDetail(this.addNewDetail, false); // 预算详情
      } else if (this.sideOneCurP === 4) {
        this.executeDetail(this.addNewDetail, false); // 执行详情
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
    // 公用
    cancelTip () {
      this.tipDialog = false;
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
