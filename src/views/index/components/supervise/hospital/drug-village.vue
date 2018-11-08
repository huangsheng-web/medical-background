<template>
  <div class="sup-main my-sup-h clearfix">
    <div class="sup-bread">
      <i class="iconfont">&#xe698;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
      </div>
    </div>
    <!--基础药物-村卫生室-->
    <div class="sup-content-box clearfix">
      <!--待处理-->
      <div class="sup-content" v-if="sideFourCurP === 0">
        <div class="village-type" style="border-bottom: none;">
          <span :class="{'active': sideFourCurP === 0}" @click="sideFourCurP = 0">待处理</span>
          <span :class="{'active': sideFourCurP === 1}" @click="sideFourCurP = 1">已处理</span>
        </div>
        <template v-if="proDrugVDoctorList.length">
          <div class="sup-c3-detail">
            <span>项目年度：{{proDrugVDetail.year}}</span>
            <span  v-if="proDrugVDetail.quarter === '9'">项目季度：年终考核</span>
            <span v-else-if="proDrugVDetail.quarter">项目季度：{{proDrugVDetail.quarter}} 季度</span>
            <span>项目代码：{{proDrugVDetail.quotaNum}}</span>
            <span>预算总金额：{{proDrugVDetail.budgetAmount}}</span>
            <span>财政预计拨付时间：{{proDrugVDetail.appropriateTime | moment}}</span>
            <span>截止时间：{{proDrugVDetail.deadlineTime | moment}}</span>
            <span>状态：<b style="border: none;font-weight: normal;" :style="{'color': proDrugVDetail.stauts === '3' ? '#EF5555' : '#FB8C00'}">{{proDrugVDetail.status === '3' ? '已逾期' : '未提交'}}</b></span>
          </div>
          <div class="sup-search"  style="margin-top: 20px;">
            村卫生室：
            <el-select v-model="drugVillageAllUid" style="width: 200px;" placeholder="请选择">
              <el-option
                label="全部"
                value="">
              </el-option>
              <el-option
                v-for="item in drugVillageAllEntryList"
                :key="item.clinicExeUid"
                :label="item.name"
                :value="item.clinicExeUid">
              </el-option>
            </el-select>
            <el-button @click.native="getDrugVList" icon="el-icon-search">搜索</el-button>
          </div>
          <div class="sup-c3-btn">
            <el-button type="primary" @click.native="drugHandle">处理</el-button>
            <el-button :disabled="!drugCanSubmit || proDrugVDetail.status === '0'" @click.native="submitDrug">提交</el-button>
            <el-button style="display: none;"></el-button>
          </div>
          <el-table
            :data="proDrugVDoctorList"
            key="tabel78"
            stripe
            show-summary
            :summary-method="getSummaries1"
            style="width: 100%;">
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              width="50">
            </el-table-column>
            <el-table-column
              prop="villageClinicName"
              min-width="176"
              :show-overflow-tooltip="true"
              label="村卫生室">
            </el-table-column>
            <el-table-column
              prop="villageDoctorName"
              width="80"
              label="村医姓名">
            </el-table-column>
            <el-table-column
              prop="villageDoctorBankAccount"
              min-width="196"
              :show-overflow-tooltip="true"
              label="一卡通账号">
            </el-table-column>
            <el-table-column
              prop="budgetAmount"
              min-width="126"
              label="预算金额（元）">
            </el-table-column>
            <el-table-column
              prop="actualAmount"
              min-width="126"
              label="实发金额（元）">
            </el-table-column>
            <el-table-column
              prop="description"
              min-width="176"
              label="备注">
              <template slot-scope="scope">
                <p v-if="scope.row.description">{{scope.row.description}}</p>
                <p v-else>--</p>
              </template>
            </el-table-column>
            <el-table-column
              width="176"
              label="操作">
              <template slot-scope="scope">
                <span class="pay-online" v-if="scope.row.appendices[0]"  @click="previewPictures(scope.row.appendices[0].fileFullPath, 'bigPic')">转账回执单</span>
                <span  class="cant-tap" v-else>转账回执单</span>
                <span  class="cancel-reg" @click="reviseDrugVillageEntry(scope.row)" v-if="scope.row.actualAmount">修改</span>
                <span  class="cant-tap" v-else>修改</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-else>
          <div class="not-content">
            <img src="../../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无待处理项目</p>
          </div>
        </template>
      </div>
      <!--已处理-->
      <div class="sup-content" v-show="sideFourCurP === 1">
        <div class="village-type">
          <span :class="{'active': sideFourCurP === 0}" @click="sideFourCurP = 0">待处理</span>
          <span :class="{'active': sideFourCurP === 1}" @click="sideFourCurP = 1">已处理</span>
        </div>
        <div class="sup-search">
          项目年度：
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
          项目季度:
          <el-select v-model="baseQuarter" style="width: 136px;" placeholder="请选择">
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
          项目代码:
          <el-input style="width: 200px" v-model="quotaNum"></el-input>
          <el-button @click="getDrugVList" icon="el-icon-search">搜索</el-button>
          <el-button @click.native="exportDrugVDialog = true" style="width: 64px;height: 32px;line-height: 32px;padding: 0;float: right;">导出</el-button>
        </div>
        <el-table
          :data="proDrugVList"
          key="tabel9"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="100">
          </el-table-column>
          <el-table-column
            prop="year"
            width="100"
            label="项目年度">
          </el-table-column>
          <el-table-column
            prop="quarter"
            width="100"
            label="项目季度">
            <template slot-scope="scope">
              {{scope.row.quarter === '9' ? '年终考核' : (scope.row.quarter + '季度')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="quotaNum"
            width="100"
            label="项目代码">
          </el-table-column>
          <el-table-column
            width="100"
            prop="appropriateTime"
            label="发放时间">
            <template slot-scope="scope">
              {{scope.row.appropriateTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            prop="deadlineTime"
            label="截止时间">
            <template slot-scope="scope">
              {{scope.row.deadlineTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="113"
            label="预算总金额（元）">
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="113"
            label="实发总金额（元）">
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="153"
            label="卫生院预算总金额（元）">
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="153"
            label="卫生院实发总金额（元）">
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="153"
            label="乡村医生预算总金额（元）">
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="153"
            label="乡村医生实发总金额（元）">
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="200">
            <template slot-scope="scope">
              <span class="pay-online" @click="showDrugVillageDetail(scope.row)">村卫生室详情</span>
              <span  class="cancel-reg" @click="reviseDrug(scope.row)" v-if="scope.row.updateType === '1'">修改</span>
              <span  class="cant-tap" v-else>修改</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--村卫生室详情-->
      <div class="sup-content" v-show="sideFourCurP === 2">
        <div class="sup-c3-detail">
          <span>项目年度：{{proDrugDoneDetial.year}}</span>
          <span>项目季度：{{proDrugDoneDetial.quarter === '9' ? '年终考核' : (proDrugDoneDetial.quarter + '季度')}}</span>
          <span>项目代码：{{proDrugDoneDetial.quotaNum}}</span>
        </div>
        <div class="sup-search"  style="margin-top: 20px;">
          村卫生室：
          <el-select v-model="drugVillageUid" style="width: 200px;"  placeholder="请选择">
            <el-option
              v-for="item in drugVillageEntryList"
              :key="item.clinicExeUid"
              :label="item.name"
              :value="item.clinicExeUid">
            </el-option>
          </el-select>
          <el-button @click="searchDrugVDoctorList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="proDrugVDoctorList"
          key="tabel567"
          stripe
          show-summary
          :summary-method="getSummaries1"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            min-width="176"
            :show-overflow-tooltip="true"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="villageDoctorName"
            width="176"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="villageDoctorBankAccount"
            min-width="176"
            :show-overflow-tooltip="true"
            label="一卡通账号">
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            min-width="176"
            label="预算金额（元）">
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            min-width="176"
            label="实发金额（元）">
          </el-table-column>
          <el-table-column
            prop="description"
            min-width="176"
            label="备注">
            <template slot-scope="scope">
              <p v-if="scope.row.description">{{scope.row.description}}</p>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <el-table-column
            width="176"
            label="操作">
            <template slot-scope="scope">
              <span class="pay-online" v-if="scope.row.appendices[0]" @click="previewPictures(scope.row.appendices[0].fileFullPath, 'bigPic')">转账回执单</span>
              <span  class="cant-tap" v-else>转账回执单</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--村卫生室修改-->
      <div class="sup-content" v-show="sideFourCurP === 3">
        <div class="sup-c3-detail">
          <span>项目年度：{{proDrugDoneDetial.year}}</span>
          <span >项目季度：{{proDrugDoneDetial.quarter === '9' ? '年终考核' : (proDrugDoneDetial.quarter + '季度')}}</span>
          <span>项目代码：{{proDrugDoneDetial.quotaNum}}</span>
          <span>预算总金额：{{proDrugDoneDetial.budgetAmount}}</span>
          <span>财政预计拨付时间：{{proDrugDoneDetial.appropriateTime | moment}}</span>
          <span>截止时间：{{proDrugDoneDetial.deadlineTime | moment}}</span>
          <span>状态：<b style="color: #67c23a">已提交</b></span>
        </div>
        <div class="sup-c3-btn">
          <el-button @click.native="submitUpdateDrug">提交</el-button>
          <el-button style="display: none;"></el-button>
        </div>
        <el-table
          :data="proDrugVDoctorList"
          key="tabel78"
          stripe
          show-summary
          :summary-method="getSummaries1"
          style="width: 100%;">
          <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            width="176"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="villageDoctorName"
            width="176"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="villageDoctorBankAccount"
            width="180"
            label="一卡通账号">
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="176"
            label="预算金额（元）">
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="176"
            label="实发金额（元）">
          </el-table-column>
          <el-table-column
            prop="description"
            width="176"
            label="备注">
            <template slot-scope="scope">
              <p v-if="scope.row.description">{{scope.row.description}}</p>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <el-table-column
            width="176"
            label="操作">
            <template slot-scope="scope">
              <span class="pay-online" v-if="scope.row.appendices[0]"  @click="showPic(scope.row.appendices[0].fileFullPath ? scope.row.appendices[0].fileFullPath : scope.row.appendices[0].newFileName)">转账回执单</span>
              <span  class="cant-tap" v-else>转账回执单</span>
              <span  class="cancel-reg" @click="reviseDrugVillageEntry(scope.row)" v-if="scope.row.actualAmount">修改</span>
              <span  class="cant-tap" v-else>修改</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box" v-show="!hideP"   >
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
    <!--查看大图-->
    <div class="show-big-pic" v-show="showBigPic" @click="showBigPic = false">
      <img :src="bigPicUrl" alt="">
    </div>
    <el-dialog
      title="修改村卫生室执行情况"
      :visible.sync="villageUpdateEntryDialog"
      :close-on-click-modal="false"
      width="750px"
      center>
      <div class="town-entry-box"  v-for="(hItem, hIndex) in proBaseVDoctorList" v-if="hIndex === curUpdateIndex" :key="hItem.id">
        <div class="town-entry-row">
          <span class="red-star">村卫生室：</span>
          <el-input :disabled="true" v-model="baseCurVillageEntryName"  style="width: 200px;height: 32px;"></el-input>
        </div>
        <div class="town-entry-row" v-for="(item, index) in baseVillageEntryData" :key="item.id">
          <span style="vertical-align: middle;" class="">村医姓名：</span><el-input disabled style="width: 100px;margin-bottom: 16px;" v-model="item.villageDoctorName"></el-input>
          <span style="vertical-align: middle;" class="">一卡通账号：</span><el-input disabled style="width: 170px;" v-model="item.villageDoctorBankAccount"></el-input>
          <span style="vertical-align: middle;" class="red-star">实发金额：</span>
          <el-form :model="item" class="demo-ruleForm">
            <el-form-item
              prop="actualAmount"
              :rules="[
                    {validator: validateNum, required: false}
                  ]"
            >
              <el-input type="actualAmount" style="width: 120px;height: 32px;" v-model="item.actualAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <span style="vertical-align: middle;" class="white-star">备注：</span><el-input style="width: 580px;" v-model="item.description"></el-input>
          <div class="town-entry-pic">
            <p class="red-star">转账回执单：<span style="color: #999999;">(请上传银行转账电子回执单)</span></p>
            <span v-for="item in item.appendices" :key="item.id">
                <img :src="item.thumbnailFullPath ? item.thumbnailFullPath : item.thumbnailPath" alt="">
                <i class="del-icon el-icon-delete" @click="delBasePic(index)"></i>
              </span>
            <el-upload
              :limit="1"
              :disabled="noUpload"
              ref="picUploadB2"
              :show-file-list="showUploadPic"
              :action="$store.state.fileUploadUrl + '/api/network/upload/new'"
              :data="{projectType: 1}"
              list-type="picture-card"
              :on-exceed="uploadPicExceed"
              :before-upload="beforeAvatarUpload1"
              :on-success="uploadSucess1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1">
              <i  style="display: block; width: 100%; height: 100%; line-height: 146px;" class="el-icon-plus" @click="changeUploadIndex(item, index)"></i>
            </el-upload>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isActive(baseVillageEntryData)"  @click.native="baseSaveVillageEntry(false)">保存</el-button>
        <el-button @click.native="cancel1">取 消</el-button>
      </span>
    </el-dialog>
    <!--药物村卫生室处理弹窗-->
    <el-dialog
      title="村卫生室预算"
      :visible.sync="drugVillageEntryDialog"
      :close-on-click-modal="false"
      width="750px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <span class="red-star">村卫生室：</span><el-select v-model="drugVillageUid" @change="drugChooseVillage" style="width: 200px;" v-if="!drugVillageEntryCanSelect" placeholder="请选择">
          <el-option
            v-for="item in drugVillageEntryList"
            :key="item.clinicExeUid"
            :label="item.name"
            :value="item.clinicExeUid">
          </el-option>
        </el-select>
          <el-input :disabled="true" v-model="drugCurVillageEntryName"  style="width: 200px;height: 32px;" v-else></el-input>
        </div>
        <div class="town-entry-row" v-for="(item, index) in drugVillageEntryData" :key="item.id">
          <span style="vertical-align: middle;" class="">村医姓名：</span><el-input disabled style="width: 100px;margin-bottom: 16px;" v-model="item.villageDoctorName"></el-input>
          <span style="vertical-align: middle;" class="">一卡通账号：</span><el-input disabled style="width: 170px;" v-model="item.villageDoctorBankAccount"></el-input>
          <span style="vertical-align: middle;" class="red-star">实发金额：</span>
          <el-form :model="item" class="demo-ruleForm">
            <el-form-item
              prop="actualAmount"
              :rules="[
                    {validator: validateNum, required: false}
                  ]"
            >
              <el-input type="actualAmount" style="width: 120px;height: 32px;" v-model="item.actualAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <span style="vertical-align: middle;" class="white-star">备注：</span><el-input style="width: 580px;" v-model="item.description"></el-input>
          <div class="town-entry-pic">
            <p class="red-star">转账回执单：<span style="color: #999999;">(请上传银行转账电子回执单)</span></p>
            <span v-for="item in item.appendices" :key="item.id">
                <img :src="item.thumbnailFullPath ? item.thumbnailFullPath : item.thumbnailPath" alt="">
                <i class="del-icon el-icon-delete" @click="delDrugPic(index)"></i>
              </span>
            <el-upload
              ref="picUploadV1"
              :limit="1"
              :disabled="noUpload"
              :show-file-list="showUploadPic"
              :action="$store.state.fileUploadUrl + '/api/network/upload/new'"
              :data="{projectType: 1}"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload2"
              :on-exceed="uploadPicExceed"
              :on-success="uploadSucess2"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove2">
              <i style="display: block; width: 100%; height: 100%; line-height: 146px;" class="el-icon-plus" @click="changeUploadIndex1(item, index)"></i>
            </el-upload>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isActive1(drugVillageEntryData)"  @click.native="drugSaveVillageEntry(false)">保存</el-button>
        <el-button type="primary" :disabled="isActive1(drugVillageEntryData)"  @click.native="drugSaveVillageEntry(true)"  v-if="!drugVillageEntryCanSelect" style="width: 106px">保存并新增</el-button>
        <el-button @click.native="cancel2">取 消</el-button>
      </span>
    </el-dialog>
    <!--药物村卫生室修改处理弹窗-->
    <el-dialog
      title="村卫生室预算"
      :visible.sync="drugVillageUpdateEntryDialog"
      :close-on-click-modal="false"
      width="750px"
      center>
      <div class="town-entry-box"  v-for="(hItem, hIndex) in proDrugVDoctorList" v-if="hIndex === curDrugUpdateIndex" :key="hItem.id">
        <div class="town-entry-row">
          <span class="red-star">村卫生室：</span>
          <el-input :disabled="true" v-model="drugCurVillageEntryName"  style="width: 200px;height: 32px;"></el-input>
        </div>
        <div class="town-entry-row" v-for="(item, index) in drugVillageEntryData" :key="item.id">
          <span style="vertical-align: middle;" class="">村医姓名：</span><el-input disabled style="width: 100px;margin-bottom: 16px;" v-model="item.villageDoctorName"></el-input>
          <span style="vertical-align: middle;" class="">一卡通账号：</span><el-input disabled style="width: 170px;" v-model="item.villageDoctorBankAccount"></el-input>
          <span style="vertical-align: middle;" class="red-star">实发金额：</span>
          <el-form :model="item" class="demo-ruleForm">
            <el-form-item
              prop="actualAmount"
              :rules="[
                    {validator: validateNum, required: false}
                  ]"
            >
              <el-input type="actualAmount" style="width: 120px;height: 32px;" v-model="item.actualAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <span style="vertical-align: middle;" class="white-star">备注：</span><el-input style="width: 580px;" v-model="item.description"></el-input>
          <div class="town-entry-pic">
            <p class="red-star">转账回执单：<span style="color: #999999;">(请上传银行转账电子回执单)</span></p>
            <span v-for="item in item.appendices" :key="item.id">
                <img :src="item.thumbnailFullPath ? item.thumbnailFullPath : item.thumbnailPath" alt="">
                <i class="del-icon el-icon-delete" @click="delDrugPic(index)"></i>
              </span>
            <el-upload
              :limit="1"
              ref="picUploadV2"
              :disabled="noUpload"
              :show-file-list="showUploadPic"
              :action="$store.state.fileUploadUrl + '/api/network/upload/new'"
              :data="{projectType: 1}"
              list-type="picture-card"
              :on-exceed="uploadPicExceed"
              :before-upload="beforeAvatarUpload2"
              :on-success="uploadSucess2"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove2">
              <i  style="display: block; width: 100%; height: 100%; line-height: 146px;" class="el-icon-plus" @click="changeUploadIndex1(item, index)"></i>
            </el-upload>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isActive1(drugVillageEntryData)"  @click.native="drugSaveVillageEntry(false)">保存</el-button>
        <el-button @click.native="cancel2">取 消</el-button>
      </span>
    </el-dialog>
    <!--基药-卫生室项目导出-->
    <el-dialog
      title="基药补助—村卫生室补助导出"
      :visible.sync="exportDrugVDialog"
      width="340px"
      :close-on-click-modal="false"
      center>
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
export default {
  data () {
    return {
      myFile: {
        description: '',
        actualAmount: 0,
        appendices: []
      },
      exportProYear: [],
      operationType: null,
      allTotal: {
        totalActualAmount: null,
        totalBudgetAmount: null,
        totalClinicNum: null,
        totalDoctorNum: null
      },
      hideP: false,
      exportBaseParams: {
        where: {
          type: '2',
          year: '',
          quarter: '',
          month: '',
          townshipHospUid: this.$store.state.token.organInfoList[0].uid
        }
      },
      baseCurQuarterList: [],
      exportDialog: false,
      exportDrugDialog: false,
      exportDrugVDialog: false,
      drugCurMonthList: [],
      breadList: {
        '1': [
          {name: '基本药物制度补助-村卫生室补助', sideType: 1, sideCurP: 0}
        ]
      },
      sideType: 1,
      showBigPic: false, // 查看大图
      bigPicUrl: '',
      pagination: { // 分页
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      },
      proCurStates: {
        '0': '未发布',
        '1': '进行中',
        '2': '已完成',
        '3': '已逾期'
      }, // 后台数据项目状态
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
      quotaNum: '', // 文号，代码
      // 卫计项目
      sideOneCurP: 0, // 0待处理，1已处理
      proName: '', // 卫计项目名称
      proGageList: [], // 卫计项目列表
      proGageDetail: {}, // 卫计项目详情
      commentImgList: [], // 处理项目上传图片
      proGageHandleData: {
        uid: '',
        actualAmount: '',
        hospArriveTime: '',
        finishSituation: '',
        description: '',
        appendices: []
      }, // 处理卫计项目的数据
      canRevisePro: false,
      // 基础公卫
      isUploading: false,
      noUpload: true,
      showUploadPic: false,
      updateVillageData: [],
      sideTwoCurP: 0,
      proBaseList: [],
      proBaseVDoctorList: [],
      proBaseDetail: {
        serviceTownshipHosp: {}
      },
      proBaseDoneDetial: {
        serviceTownshipHosp: {}
      },
      baseUpdateActual: {
        hospitalExeUid: '',
        actualAmount: '',
        hospActualAmount: '',
        doctorActualAmount: ''
      }, // 待处理更新 实发金额
      baseQuarter: '', // 基础公卫搜索
      baseQuarterList: [
        {label: '1季度', value: '1'},
        {label: '2季度', value: '2'},
        {label: '年终考核', value: '9'}
      ], // 基础搜索
      villageEntryDialog: false,
      villageUpdateEntryDialog: false,
      curUpdateIndex: 0,
      baseVillageEntryList: [],
      baseVillageEntryData: [],
      baseVillageUid: '',
      baseVillageEntryCanSelect: false,
      curUploadPicIndex: -1,
      baseVDoctorBankPic: 0, // 处理卫生室村医上传的图片个数
      baseCurVillageEntryName: '',
      baseCanSubmit: false,
      // 基础药物-卫生院
      sideThreeCurP: 0,
      proDrugHospList: [],
      proDrugHospDetail: {},
      proDrugHospDoctorList: [],
      proDrugHospQuarter: '',
      proDrugHandleData: {
        actualAmount: '',
        hospArriveTime: '',
        description: ''
      },
      curDrugUploadPicIndex: -1,
      drugVDoctorBankPic: 0, // 处理卫生室村医上传的图片个数
      // 基础药物-村卫生室
      sideFourCurP: 0,
      curDrugUpdateIndex: 0,
      drugVillageUpdateEntryDialog: false,
      updateDrugVillageData: [],
      proDrugVList: [],
      proDrugVDetail: {},
      drugVillageEntryList: [],
      drugVillageEntryData: [],
      drugVillageEntryDialog: false,
      drugVillageEntryCanSelect: false,
      drugVillageUid: '',
      drugVillageAllEntryList: [],
      drugVillageAllUid: '',
      proDrugDoneDetial: {},
      proDrugVQuarter: '',
      proDrugVDoctorList: [],
      drugCurVillageEntryName: '',
      drugCanSubmit: false,
      // 村医卡号
      sideFiveCurP: 0,
      villageHos: '',
      villageRoom: '',
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
      villageCardNoList: [],
      vCardNoEntryDialog: false,
      villageHosList: [], // 乡镇卫生院列表
      villageRoomList: [], // 村卫生室列表
      villageType: 0, // 0村医列表，1待审核，2审核不通过
      oVType: 0, // 0为新增，1为修改，重新提交
      villageEntryCanSelect: false,
      villageEntryList: [],
      curVillageEntryName: '',
      villageEntryData: {
        nametownshipHospUid: this.$store.state.token.organInfoList[0].uid,
        villageClinicUid: '',
        name: '',
        bankAccount: '',
        description: ''
      },
      delVillageCardNoDialog: false,
      vDelUid: '', // 准备删除的村医id
      vDelDescription: '' // 删除村医备注
    }
  },
  mounted () {
    this.getDrugVList();
    this.getCurYear();
  },
  methods: {
    chooseDrugType (e) {
      let params = {
        exportType: (parseInt(e) - 1) + '',
        townshipHospUid: this.$store.state.token.organInfoList[0].uid
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
    cancel2 () {
      this.drugVillageEntryDialog = false;
      this.drugVillageUpdateEntryDialog = false;
      if (!this.drugVillageEntryCanSelect && this.drugVillageUid) {
        this.proDrugVDoctorList.filter(y => y.villageClinicExecuteUid === this.drugVillageUid).map(x => {
          x.appendices = [];
        })
      } else {
        if (this.sideFourCurP === 3) {
          this.drugVillageEntryData.forEach((u, index) => {
            if (u.commentImgList && u.commentImgList.length) {
              this.$refs.picUploadV2[index].clearFiles();
            }
          })
        } else {
          this.drugVillageEntryData.forEach((u, index) => {
            if (u.commentImgList && u.commentImgList.length) {
              this.$refs.picUploadV1[index].clearFiles();
            }
          })
        }
        for (let p in this.myFile) {
          this.proDrugVDoctorList[this.curDrugUpdateIndex][p] = this.myFile[p]
        }
        this.myFile = {
          description: '',
          actualAmount: 0,
          appendices: []
        };
      }
    },
    isActive (list) {
      let b = true;
      if (list.length) {
        console.log(list)
        if (list.every(x => x.actualAmount !== null)) {
          if (this.baseVillageEntryData.length === this.baseVDoctorBankPic) {
            b = false;
          } else {
            b = true;
          }
        }
      } else {
        b = true
      }
      return b;
    },
    copy (obj, objChild) {
      let newObj = objChild || {};
      for (let p in obj) {
        let toStr = Object.prototype.toString;
        if (typeof obj[p] !== 'object' || obj[p] === null) {
          newObj[p] = obj[p];
        } else {
          newObj[p] = toStr.call(obj[p]) === '[object Object]' ? {} : [];
          this.copy(obj[p], newObj[p])
        }
      }
      return newObj;
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
    comfirmExportDrugV () {
      delete this.exportBaseParams.where.month;
      this.exportBaseParams.where.year += ''
      this.exportDrugDialog = false;
      this.axios.get('/hisServices/financialSupervision/exportDrugDoctor/' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.exportBaseParams))), {
        responseType: 'arraybuffer'
      }).then(res => {
        if (res) {
          let linkElement = document.createElement('a');
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          let url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute('download', '溆浦县卫计惠农补贴项目资金发放明细表.xls.xls');
          let clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
          linkElement.dispatchEvent(clickEvent);
        }
      })
    }, // 导出基础药物-卫生室
    chooseDrugYear (e) {
      this.baseCurQuarterList = [];
      this.drugCurMonthList = [];
      this.exportBaseParams.where.quarter = '';
      this.exportBaseParams.where.month = '';
      let params = {
        year: e
      }
      console.log(this.sideType)
      if (this.exportDrugVDialog) {
        params['isProjectQuarter'] = true;
      }
      this.axios.get('/hisServices/financialSupervision/systemSubsidy/quarters', {params})
        .then(res => {
          if (res) {
            res.data.forEach(x => {
              this.baseCurQuarterList.push(this.baseQuarterList.find(y => y.value === x))
              console.log(this.baseCurQuarterList, res.data)
            })
          }
        })
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
    showPic (url) {
      this.bigPicUrl = url;
      this.showBigPic = true;
    },
    getSummaries1 (param) {
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
          sums[index] = this.allTotal.totalBudgetAmount
        }
        if (index === 5) {
          sums[index] = this.allTotal.totalActualAmount;
        }
      });
      return sums;
    },
    // 分页
    onPageSizeChange (size) {
      this.pagination.pageSize = size;
      if (this.sideFourCurP === 0 || this.sideFourCurP === 1) {
        this.getDrugVList();
      } else if (this.sideFourCurP === 2) {
        this.showDrugVillageDetail(this.proDrugDoneDetial, true)
      } else if (this.sideFourCurP === 3) {
        this.reviseDrug(this.proDrugDoneDetial, true)
      }
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      if (this.sideFourCurP === 0 || this.sideFourCurP === 1) {
        this.getDrugVList();
      } else if (this.sideFourCurP === 2) {
        this.showDrugVillageDetail(this.proDrugDoneDetial, true)
      } else if (this.sideFourCurP === 3) {
        this.reviseDrug(this.proDrugDoneDetial, true)
      }
    },
    breadTap (type, index, curP) {
      this.breadList[type].splice(index + 1);
      this.sideType = type;
      this.sideFourCurP = 1;
      console.log(type, curP)
    }, // 面包屑点击
    // 基础药物-村卫生室
    getDrugVList () {
      this.proDrugVDoctorList = [];
      let params1 = {
        pageNum: this.pagination.pageNum,
        where: {
          executeStatus: this.sideFourCurP + '',
          townshipHospUid: this.$store.state.token.organInfoList[0].uid
        }
      }
      if (this.sideFourCurP === 1) {
        if (this.proYear) {
          params1.where['year'] = this.proYear;
        }
        if (this.baseQuarter) {
          params1.where['quarter'] = this.baseQuarter;
        }
        if (this.quotaNum) {
          params1.where['quotaNum'] = this.quotaNum;
        }
      } else {
        // 放待处理的筛选条件
      }
      this.axios.get('/hisServices/financialSupervision/townshipHosps/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params1))))
        .then(res => {
          if (res) {
            if (this.sideFourCurP === 0) {
              if (res.data && res.data.length) {
                this.proDrugVDetail = res.data[0];
                // 获取该基础项目已选择的村卫生室
                let p1 = {
                  where: {
                    hospitalExeUid: this.proDrugVDetail.uid,
                    status: '1'
                  }
                }
                this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
                  .then(res => {
                    if (res) {
                      this.drugVillageAllEntryList = res.data.list;
                    }
                  })
                let params = {
                  pageNum: 1,
                  pageSize: this.pagination.pageSize,
                  where: {
                    hospitalExeUid: res.data[0].uid,
                    detailType: '1'
                  }
                }
                if (this.drugVillageAllUid) {
                  params.where['clinicExeUid'] = this.drugVillageAllUid;
                }
                this.axios.get('/hisServices/financialSupervision/drugVillageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
                  .then(res => {
                    if (res) {
                      this.drugCanSubmit = res.data.allEntery;
                      this.proDrugVDoctorList = res.data.page.list;
                      this.pagination.pageNum = res.data.page.pageNum;
                      this.pagination.total = res.data.page.total;
                      this.allTotal = {
                        totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
                        totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
                        totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
                        totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
                      }
                    }
                  })
              } else {
                this.hideP = true;
              }
            } else {
              this.hideP = false;
              this.proDrugVList = res.data.list;
              this.pagination.pageNum = res.data.pageNum;
              this.pagination.total = res.data.total;
              this.allTotal = {
                totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
                totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
                totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
                totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
              }
            }
          }
        })
    },
    showDrugVillageDetail (item, bread) {
      console.log(item)
      this.proDrugDoneDetial = item;
      this.sideFourCurP = 2;
      if (!bread) {
        this.breadList['1'].push({name: '村卫生室详情', sideType: 1, sideCurP: 2})
      }
      // 获取该基础项目已经选择的村卫生室
      let p1 = {
        where: {
          hospitalExeUid: item.uid,
          status: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
        .then(res => {
          if (res) {
            this.drugVillageEntryList = res.data.list;
          }
        })
      let params = {
        pageNum: 1,
        pageSize: this.pagination.pageSize,
        where: {
          hospitalExeUid: item.uid,
          detailType: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/drugVillageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.proDrugVDoctorList = res.data.page.list;
            this.pagination.pageNum = res.data.page.pageNum;
            this.pagination.total = res.data.page.total;
            this.allTotal = {
              totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
              totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
              totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
              totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
            }
          }
        })
    }, // 村卫生室详情
    searchDrugVDoctorList () {
      let params = {
        pageNum: 1,
        pageSize: this.pagination.pageSize,
        where: {
          hospitalExeUid: this.proDrugDoneDetial.uid,
          detailType: '1'
        }
      }
      if (this.drugVillageUid) {
        params.where['clinicExeUid'] = this.drugVillageUid
      }
      this.axios.get('/hisServices/financialSupervision/drugVillageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.proDrugVDoctorList = res.data.page.list;
            this.pagination.pageNum = res.data.page.pageNum;
            this.pagination.total = res.data.page.total;
            this.allTotal = {
              totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
              totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
              totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
              totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
            }
          }
        })
    }, // 搜索村医列表
    drugHandle () {
      console.log(this.proDrugVDetail)
      this.noUpload = false;
      this.showUploadPic = true;
      this.drugVDoctorBankPic = 0;
      this.drugVillageEntryDialog = true;
      this.drugVillageEntryCanSelect = false;
      this.drugVillageUid = '';
      this.drugVillageEntryData = [];
      // 获取该基础项目未选择的村卫生室
      let p1 = {
        where: {
          hospitalExeUid: this.proDrugVDetail.uid,
          status: '3'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
        .then(res => {
          if (res) {
            this.drugVillageEntryList = res.data.list;
          }
        })
    }, // 处理项目
    delDrugPic (index) {
      this.isUploading = false;
      this.noUpload = false;
      this.showUploadPic = true;
      if (this.drugVDoctorBankPic > 0) {
        this.drugVDoctorBankPic -= 1;
      } else {
        this.drugVDoctorBankPic = 0;
      }
      this.drugVillageEntryData[index].appendices.splice(0, 1);
    },
    drugChooseVillage (e) {
      console.log('change')
      let params = {
        pageSize: 0,
        where: {
          detailType: '0',
          hospitalExeUid: this.proDrugVDetail.uid,
          clinicExeUid: e
        }
      }
      this.axios.get('/hisServices/financialSupervision/drugVillageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.drugVillageEntryData = res.data.page.list;
          }
        })
    },
    drugSaveVillageEntry (boolean) {
      if (!boolean) {
        this.drugVillageEntryDialog = false;
      }
      let params = [];
      console.log(this.drugVillageEntryData)
      if (this.sideFourCurP === 3) {
        this.drugVillageUpdateEntryDialog = false;
        this.updateDrugVillageData = [];
        this.proDrugVDoctorList.forEach(x => {
          if (x.commentImgList && x.commentImgList.length > 0) {
            x.appendices = [];
            for (let i = 0; i < x.commentImgList.length; i++) {
              if (x.commentImgList[i].response) {
                let oRes = x.commentImgList[i].response.data;
                if (oRes) {
                  x.appendices.push({
                    cname: oRes.fileName, // 附件名称 ,
                    // desci: '', // 备注 ,
                    filePathName: oRes.fileName, // 附件保存名称 ,
                    fileType: '', // 文件类型 ,
                    imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
                    imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
                    imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
                    // otherFlag: '', // 其他标识 ,
                    path: oRes.fileFullPath, // 附件路径 ,
                    fileFullPath: oRes.fileFullPath,
                    thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
                    thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
                    // uid: '' //  附件标识
                  });
                }
              }
            }
          }
          let {uid, actualAmount, appendices, description} = x;
          this.updateDrugVillageData.push({uid, actualAmount, appendices, description});
        })
        console.log(this.updateDrugVillageData)
      } else {
        this.drugVillageEntryData.forEach(x => {
          x.appendices = [];
          if (x.commentImgList && x.commentImgList.length > 0) {
            for (let i = 0; i < x.commentImgList.length; i++) {
              if (x.commentImgList[i].response) {
                let oRes = x.commentImgList[i].response.data;
                if (oRes) {
                  x.appendices.push({
                    cname: oRes.fileName, // 附件名称 ,
                    // desci: '', // 备注 ,
                    filePathName: oRes.fileName, // 附件保存名称 ,
                    fileType: '', // 文件类型 ,
                    imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
                    imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
                    imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
                    // otherFlag: '', // 其他标识 ,
                    path: oRes.fileFullPath, // 附件路径 ,
                    fileFullPath: oRes.fileFullPath,
                    thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
                    thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
                    // uid: '' //  附件标识
                  });
                }
              }
            }
          }
          let {uid, actualAmount, appendices, description} = x;
          params.push({uid, actualAmount, appendices, description});
        })
        this.axios.put('/hisServices/financialSupervision/drugVillageDoctors', params)
          .then(res => {
            if (res) {
              this.drugVillageUid = '';
              this.noUpload = false;
              this.showUploadPic = true;
              this.drugVillageAllUid = '';
              this.drugVDoctorBankPic = 0;
              this.drugVillageEntryData = [];
              let p1 = {
                where: {
                  hospitalExeUid: this.proDrugVDetail.uid,
                  status: '3'
                }
              }
              this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
                .then(res => {
                  if (res) {
                    this.drugVillageEntryList = res.data.list;
                  }
                })
              // 更新村医数据
              this.getDrugVList();
            } else {
              this.drugVillageEntryDialog = false;
            }
          })
      }
    },
    handleRemove2 (file, fileList) {
      this.isUploading = false;
      if (this.drugVDoctorBankPic > 0) {
        this.drugVDoctorBankPic -= 1;
      } else {
        this.drugVDoctorBankPic = 0;
      }
      this.isActive1(this.drugVillageEntryData)
      // console.log('this.commentImgList', this.commentImgList.length)
      // console.log(file, fileList);
    },
    handlePictureCardPreview (file) {
      this.showPic(file.url)
    },
    uploadPicExceed (files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后再上传！');
    },
    beforeAvatarUpload2 (file) {
      if (this.isUploading) {
        this.$message.error('请等待其他回执单上传完毕');
        return false;
      }
      this.isUploading = true;
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error('只能上传 JPG / PNG 格式图片!');
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 100MB!');
      }
      return isJPG && isLt;
    },
    uploadSucess2 (response, file, fileList) {
      this.isUploading = false;
      this.updateDrugVillageData = [];
      if (this.sideFourCurP !== 0 || this.drugVillageEntryCanSelect) {
        this.showUploadPic = false;
      }
      if (this.drugVillageEntryCanSelect) {
        this.noUpload = true;
      }
      this.drugVDoctorBankPic += 1;
      this.drugVillageEntryData[this.curDrugUploadPicIndex]['commentImgList'] = fileList;
      this.proDrugVDoctorList[this.curDrugUpdateIndex]['commentImgList'] = fileList;
      this.proDrugVDoctorList.forEach(x => {
        // x.appendices = [];
        if (x.commentImgList && x.commentImgList.length > 0) {
          for (let i = 0; i < x.commentImgList.length; i++) {
            if (x.commentImgList[i].response) {
              let oRes = x.commentImgList[i].response.data;
              if (oRes) {
                x.appendices.push({
                  cname: oRes.fileName, // 附件名称 ,
                  // desci: '', // 备注 ,
                  filePathName: oRes.fileName, // 附件保存名称 ,
                  fileType: '', // 文件类型 ,
                  imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
                  imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
                  imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
                  // otherFlag: '', // 其他标识 ,
                  path: oRes.fileFullPath, // 附件路径 ,
                  fileFullPath: oRes.fileFullPath,
                  thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
                  thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
                  // uid: '' //  附件标识
                });
              }
            }
          }
        }
        let {uid, actualAmount, appendices, description} = x;
        this.updateDrugVillageData.push({uid, actualAmount, appendices, description})
      })
      console.log(this.updateDrugVillageData)
      this.isActive1(this.drugVillageEntryData)
    },
    changeUploadIndex1 (item, index) {
      if (this.isUploading) return;
      this.curDrugUploadPicIndex = index;
      this.curDrugUpdateIndex = this.proDrugVDoctorList.indexOf(this.proDrugVDoctorList.find(x => x.uid === item.uid));
      console.log(this.proDrugVDoctorList)
    },
    isActive1 (list) {
      let b = true;
      if (list.length) {
        if (list.every(x => x.actualAmount)) {
          if (this.drugVillageEntryData.length === this.drugVDoctorBankPic) {
            b = false;
          } else {
            b = true;
          }
        } else {
          console.log('sjfsl')
        }
      } else {
        b = true
      }
      return b;
    },
    reviseDrug (item, bread) {
      console.log(item)
      this.updateDrugVillageData = [];
      this.proDrugDoneDetial = item;
      this.sideFourCurP = 3;
      if (!bread) {
        this.breadList['1'].push({name: '修改', sideType: 1, sideCurP: 3})
      }
      let params = {
        pageNum: 1,
        pageSize: this.pagination.pageSize,
        where: {
          hospitalExeUid: item.uid,
          detailType: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/drugVillageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.proDrugVDoctorList = res.data.page.list;
            this.pagination.pageNum = res.data.page.pageNum;
            this.pagination.total = res.data.page.total;
            this.allTotal = {
              totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
              totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
              totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
              totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
            }
          }
        })
    }, // 修改村卫生室，已处理
    reviseDrugVillageEntry (item) {
      console.log(item)
      this.myFile.description = item.description;
      this.myFile.actualAmount = item.actualAmount;
      this.myFile.appendices[0] = this.copy(item.appendices[0]);
      this.noUpload = true;
      this.showUploadPic = false;
      item.commentImgList = [];
      this.curDrugUpdateIndex = this.proDrugVDoctorList.indexOf(item)
      this.drugVillageEntryData = [];
      if (item.appendices.length) {
        this.drugVDoctorBankPic = 1;
      } else {
        this.drugVDoctorBankPic = 0;
      }
      if (this.sideFourCurP === 3) {
        this.drugVillageUpdateEntryDialog = true;
      } else {
        this.drugVillageEntryDialog = true;
      }
      this.drugVillageEntryCanSelect = true;
      this.drugCurVillageEntryName = item.villageClinicName;
      this.drugVillageEntryData.push(item);
    },
    submitDrug () {
      let params = {
        uid: this.proDrugVDetail.uid,
        projectUid: this.proDrugVDetail.projectUid,
        operationType: '3'
      }
      this.axios.put('/hisServices/financialSupervision/systemTownshipHosp', params)
        .then(res => {
          if (res) {
            console.log(res)
            // 更新村医数据
            this.sideFourCurP = 1;
            this.proDrugVDetail = {}
            this.proDrugVDoctorList = [];
          }
        })
    },
    submitUpdateDrug () {
      this.axios.put('/hisServices/financialSupervision/drugVillageDoctors', this.updateDrugVillageData)
        .then(res => {
          if (res) {
            console.log(res)
            this.sideFourCurP = 1;
            this.breadList['1'].splice(1)
            // 更新村医数据
            this.proDrugVDetail = {
              serviceTownshipHosp: {}
            }
            this.proDrugVDoctorList = [];
          }
        })
    }
  },
  watch: {
    exportDrugVDialog (e) {
      if (!e) {
        this.exportBaseParams = {
          where: {
            type: '2',
            year: '',
            quarter: '',
            month: ''
          }
        }
      } else {
        this.chooseDrugType(2)
      }
    },
    sideFourCurP (e) {
      if (e === 0 || e === 1) {
        this.quotaNum = '';
        this.proYear = '';
        this.proName = '';
        this.drugVillageUid = '';
        this.getDrugVList();
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
      .town-entry-pic{
        >p{
          line-height: 46px;
        }
        >div{
          display: inline-block;
        }
        >span{
          display: inline-block;
          width: 148px;
          height: 148px;
          margin-right: 16px;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          position: relative;
          vertical-align: top;
          img{
            width: 100%;
            height: 100%;
          }
          >.del-icon{
            display: none;
            position: absolute;
            font-size: 20px;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: rgba(102, 102, 102, .6);
            text-align: center;
            line-height: 32px;
            color: #ffffff;
            cursor: pointer;
            line-height: 148px;
          }
          &:hover{
            .del-icon{
              display: block;
            }
          }
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
</style>
<style lang="less">
  .my-sup-h{
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
          >div{
            display: inline-block;
            vertical-align: text-bottom;
          }
          >span{
            display: inline-block;
            width: 148px;
            height: 148px;
            margin-right: 16px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            position: relative;
            vertical-align: top;
            img{
              width: 100%;
              height: 100%;
            }
            >.del-icon{
              display: none;
              position: absolute;
              font-size: 20px;
              bottom: 0;
              right: 0;
              width: 100%;
              height: 100%;
              background: rgba(102, 102, 102, .6);
              text-align: center;
              line-height: 32px;
              color: #ffffff;
              cursor: pointer;
              line-height: 148px;
            }
            &:hover{
              .del-icon{
                display: block;
              }
            }
          }
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
