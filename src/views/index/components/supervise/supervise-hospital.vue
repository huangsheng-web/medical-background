<template>
  <div class="sup-main my-sup-h clearfix">
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
        <el-submenu index="6">
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
    <div class="sup-content-box clearfix" v-if="sideType === 1">
      <!--待处理-->
      <div class="sup-content" v-show="sideOneCurP === 0">
        <div class="village-type">
          <span :class="{'active': sideOneCurP === 0}" @click="sideOneCurP = 0">待处理</span>
          <span :class="{'active': sideOneCurP === 1}" @click="sideOneCurP = 1">已处理</span>
        </div>
        <div class="sup-search">
          项目名称:
          <el-input style="width: 200px" v-model="proName"></el-input>
          指标文号:
          <el-input style="width: 200px" v-model="quotaNum"></el-input>
          <el-button @click.native="getGageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="proGageList"
          key="tabel1"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            :show-overflow-tooltip="true"
            min-width="160">
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
            min-width="100"
            prop="executeStatus"
            label="状态">
            <template slot-scope="scope">
              <i v-if="scope.row.status === '1'" style="background-color:#FB8C00;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.status === '2'" style="background-color:#67c23a;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.status === '3'" style="background-color:#EF5555;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.status === '0'" style="background-color:#1890FF;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <span style="border: none;" :style="{'color': scope.row.projectTownshipHosp.executeStatus === '2' ? '#EF5555' : '#888888'}">{{scope.row.projectTownshipHosp.executeStatus === '2' ? '已逾期' : '未提交'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="appropriateTime"
            min-width="150"
            label="财政预计拨付时间">
            <template slot-scope="scope">
              {{scope.row.appropriateTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="scope.row.projectTownshipHosp.deadlineTime"
            label="截止时间">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.deadlineTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="scope.row.projectTownshipHosp.requirements"
            min-width="160"
            :show-overflow-tooltip="true"
            label="项目要求">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.requirements}}
            </template>
          </el-table-column>
          <el-table-column
            prop="scope.row.projectTownshipHosp.budgetAmount"
            min-width="140"
            label="预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.budgetAmount}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="80">
            <template slot-scope="scope">
              <span  class="cancel-reg" @click="handlePro(scope.row)"  v-if="scope.row.status !== '3' || scope.row.overdueType === '1'">处理</span>
              <span  class="cancel-reg cant-tap"  v-else>处理</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--已处理-->
      <div class="sup-content" v-show="sideOneCurP === 1">
        <div class="village-type">
          <span :class="{'active': sideOneCurP === 0}" @click="sideOneCurP = 0">待处理</span>
          <span :class="{'active': sideOneCurP === 1}" @click="sideOneCurP = 1">已处理</span>
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
          项目名称:
          <el-input style="width: 200px" v-model="proName"></el-input>
          指标文号:
          <el-input style="width: 200px" v-model="quotaNum"></el-input>
          <el-button @click="getGageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="proGageList"
          key="tabel2"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            :show-overflow-tooltip="true"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="year"
            width="100"
            label="项目年度">
          </el-table-column>
          <el-table-column
            prop="quotaNum"
            :show-overflow-tooltip="true"
            min-width="100"
            label="指标文号">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="deadlineTime"
            label="截止时间">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.deadlineTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            min-width="103"
            label="预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.budgetAmount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            min-width="103"
            label="实发金额（元）">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.actualAmount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="finishSituation"
            min-width="200"
            :show-overflow-tooltip="true"
            label="项目完成情况">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.finishSituation}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <span class="pay-online" @click="showProDetail(scope.row)">查看详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--处理页-->
      <div class="sup-content" v-if="sideOneCurP === 2">
        <div class="sup-c3-detail">
          <span>项目名称：{{proGageDetail.name}}</span>
          <span>指标文号：{{proGageDetail.quotaNum}}</span>
          <span>财政预计拨付时间：{{proGageDetail.appropriateTime | moment}}</span>
          <span>预算金额：{{proGageDetail.projectTownshipHosp.budgetAmount}}</span>
          <span>截止时间：{{proGageDetail.projectTownshipHosp.deadlineTime | moment}}</span><br>
          <span>项目要求：{{proGageDetail.projectTownshipHosp.requirements}}</span>
        </div>
        <div class="sup-c3-btn">
          <div>
            <i class="red-star" style="padding-right: 2px;font-style: normal;"> </i>实发金额：
            <el-form :model="proGageHandleData" class="demo-ruleForm">
              <el-form-item
                prop="actualAmount"
                :rules="[
                    {validator: validateNum, required: false}
                  ]"
              >
                <el-input type="actualAmount" style="width: 200px;height: 32px;" v-model="proGageHandleData.actualAmount" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <i class="red-star" style="padding-right: 2px;font-style: normal;"></i>到账时间：
            <el-date-picker
              style="width: 200px;"
              v-model="proGageHandleData.hospArriveTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="sup-c2-t2" style="margin-left: 0;">
          <span class="red-star" >项目完成情况：</span>
          <textarea  v-model="proGageHandleData.finishSituation"  name=""  cols="30" rows="10"></textarea>
        </div>
        <div class="sup-c2-t2">
          <span class="red-star" style="width: 100px;text-align: right">项目现场：</span>
          <div class="sup-c5-piclist">
            <el-upload
              ref="gageUpload"
              multiple
              :action="$store.state.fileUploadUrl + '/api/network/upload/new'"
              :data="{projectType: 1}"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSucess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <div class="sup-c2-t2">
          <span style="width: 100px;text-align: right;">备注：</span>
          <textarea  v-model="proGageHandleData.description"  name=""  cols="30" rows="10"></textarea>
        </div>
        <div class="sup-c2-b">
          <div class="sup-c2-btn">
            <el-button type="primary" :disabled="!proGageHandleData.actualAmount || !proGageHandleData.hospArriveTime || !proGageHandleData.finishSituation || !commentImgList.length" @click="sendGagePro">提交</el-button>
            <el-button @click="cancelGagePro">取消</el-button>
          </div>
        </div>
      </div>
      <!--详情页-->
      <div class="sup-content" v-show="sideOneCurP === 3">
        <div class="sup-c3-detail">
          <span>项目名称：{{proGageDetail.projectName}}</span>
          <span>实施单位：{{proGageDetail.townshipHospName}}</span>
          <span>预算金额：{{proGageDetail.budgetAmount}}</span>
          <span>截止时间：{{proGageDetail.deadlineTime | moment}}</span><br>
          <span>项目要求：{{proGageDetail.requirements}}</span>
        </div>
        <div v-show="!canRevisePro">
          <div class="sup-c3-btn">
            <div>
              实发金额：<span>{{proGageDetail.actualAmount}} <span>元</span></span>
            </div>
            <div>
              到账时间：<span>{{proGageDetail.hospArriveTime | moment}} <i class="el-icon-date"></i></span>
            </div>
          </div>
          <div class="sup-c2-t2" style="margin-left: 0">
            <span >项目完成情况：</span>
            <div class="textarea">{{proGageDetail.finishSituation}}</div>
          </div>
          <div class="sup-c2-t2" style="margin-left: 28px">
            <span >项目现场：</span>
            <div class="sup-c5-piclist" id="proE">
              <!--<ul class="clearfix">-->
                <!--<li v-for="item in proGageDetail.appendices" :key="item.id">-->
                  <!--<img :src="item.thumbnailFullPath ? item.thumbnailFullPath : item.thumbnailPath" alt="">-->
                  <!--<i class="iconfont" @click="showPic(item.fileFullPath)">&#xe689;</i>-->
                <!--</li>-->
              <!--</ul>-->
            </div>
          </div>
          <div class="sup-c2-t2" style="margin-left: 54px">
            <span >备注：</span>
            <div class="textarea">{{proGageDetail.description}}</div>
          </div>
          <div class="sup-c2-b">
            <div class="sup-c2-btn">
              <el-button type="primary" :disabled="proGageDetail.updateType === '0'" @click="reviseGagePro">修改</el-button>
            </div>
          </div>
        </div>
        <div v-show="canRevisePro">
          <div class="sup-c3-btn">
            <div>
              <i class="red-star" style="padding-right: 2px;font-style: normal;"> </i>实发金额：
              <el-input style="width: 200px;" v-model="proGageHandleData.actualAmount"></el-input>
            </div>
            <div>
              <i class="red-star" style="padding-right: 2px;font-style: normal;"></i>到账时间：
              <el-date-picker
                style="width: 200px;"
                v-model="proGageHandleData.hospArriveTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="sup-c2-t2" style="margin-left: 0;">
            <span class="red-star" >项目完成情况：</span>
            <textarea  v-model="proGageHandleData.finishSituation"  name=""  cols="30" rows="10"></textarea>
          </div>
          <div class="sup-c2-t2">
            <span class="red-star" style="width: 100px;text-align: right">项目现场：</span>
            <div class="sup-c5-piclist">
              <span v-for="(item, index) in proGageHandleData.appendices" :key="item.id">
                <img :src="item.thumbnailFullPath ? item.thumbnailFullPath : item.thumbnailPath" alt="">
                <i class="del-icon el-icon-delete" @click="delPic(index)"></i>
              </span>
              <el-upload
                multiple
                ref="gageUpload1"
                :action="$store.state.fileUploadUrl + '/api/network/upload/new'"
                :data="{projectType: 1}"
                list-type="picture-card"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSucess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <div class="sup-c2-t2">
            <span style="width: 100px;text-align: right;">备注：</span>
            <textarea  v-model="proGageHandleData.description"  name=""  cols="30" rows="10"></textarea>
          </div>
          <div class="sup-c2-b">
            <div class="sup-c2-btn">
              <el-button type="primary" :disabled="!proGageHandleData.actualAmount || !proGageHandleData.hospArriveTime || !proGageHandleData.finishSituation" @click="sendGagePro">保存</el-button>
              <el-button @click="cancelPro">取消</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box" v-show="sideOneCurP !== 3 && sideOneCurP !== 2">
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
    <!--基础服务-->
    <div class="sup-content-box clearfix" v-if="sideType === 2">
      <!--待处理-->
      <div class="sup-content" v-if="sideTwoCurP === 0">
        <div class="village-type" style="border-bottom: none;">
          <span :class="{'active': sideTwoCurP === 0}" @click="sideTwoCurP = 0">待处理</span>
          <span :class="{'active': sideTwoCurP === 1}" @click="sideTwoCurP = 1">已处理</span>
        </div>
        <template v-if="proBaseDetail.year">
          <div class="sup-c3-detail">
            <span>项目年度：{{proBaseDetail.year}}</span>
            <span>项目季度：{{proBaseDetail.quarter === '9' ? '年终考核' : (proBaseDetail.quarter + '季度')}}</span>
            <span>项目代码：{{proBaseDetail.quotaNum ? proBaseDetail.quotaNum : '无'}}</span>
            <span>预算总金额：{{proBaseDetail.serviceTownshipHosp.budgetAmount}}</span>
            <span>发放时间：{{proBaseDetail.appropriateTime | moment}}</span>
            <span>截止时间：{{proBaseDetail.deadlineTime | moment}}</span>
            <span>状态：<b style="border: none;font-weight: normal;" :style="{'color': proBaseDetail.serviceTownshipHosp.executeStatus === '2' ? '#EF5555' : '#FB8C00'}">{{proBaseDetail.serviceTownshipHosp.executeStatus === '2' ? '已逾期' : '未提交'}}</b></span>
          </div>
          <div class="sup-search"  style="margin-top: 20px;">
            实发总金额:
            <el-form :model="baseUpdateActual" class="demo-ruleForm">
              <el-form-item
                prop="actualAmount"
                :rules="[
                    {validator: validateNum, required: false}
                  ]"
              >
                <el-input type="actualAmount" style="width: 200px;height: 32px;" v-model="baseUpdateActual.actualAmount" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            卫生院实发金额:
            <el-form :model="baseUpdateActual" class="demo-ruleForm">
              <el-form-item
                prop="hospActualAmount"
                :rules="[
                     {validator: validateNum, required: false}
                  ]"
              >
                <el-input type="hospActualAmount" style="width: 200px;height: 32px;" v-model="baseUpdateActual.hospActualAmount" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            乡村医生实发总金额:
            <el-form :model="baseUpdateActual" class="demo-ruleForm">
              <el-form-item
                prop="doctorActualAmount"
                :rules="[
                    {validator: validateNum, required: false}
                  ]"
              >
                <el-input type="doctorActualAmount" style="width: 200px;height: 32px;" v-model="baseUpdateActual.doctorActualAmount" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <el-button :disabled="!baseUpdateActual.actualAmount || !baseUpdateActual.hospActualAmount || !baseUpdateActual.doctorActualAmount" @click.native="updateBaseActual" icon="el-icon-search">确定</el-button>
          </div>
          <div class="sup-c3-btn">
            <el-button type="primary" @click.native="baseHandle">处理</el-button>
            <el-button :disabled="!baseCanSubmit || proBaseDetail.status === '0'" @click.native="submitBase">提交</el-button>
            <el-button style="display: none;"></el-button>
          </div>
          <el-table
            :data="proBaseVDoctorList"
            key="tabel4"
            stripe
            show-summary
            :summary-method="getSummaries1"
            style="width: 100%;">
            <el-table-column
              type="index"
              label="序号"
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
              width="106"
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
              min-width="136"
              label="预算金额（元）">
            </el-table-column>
            <el-table-column
              prop="actualAmount"
              min-width="136"
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
              width="166"
              label="操作">
              <template slot-scope="scope">
                <span class="pay-online" v-if="scope.row.appendices[0]" @click="showPic(scope.row.appendices[0].fileFullPath)">转账回执单</span>
                <span  class="cant-tap" v-else>转账回执单</span>
                <span  class="cancel-reg" @click="reviseVillageEntry(scope.row)" v-if="scope.row.actualAmount">修改</span>
                <span  class="cant-tap" v-else>修改</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-else>
          <div class="not-content">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无待处理项目</p>
          </div>
        </template>
      </div>
      <!--已处理-->
      <div class="sup-content" v-show="sideTwoCurP === 1">
        <div class="village-type">
          <span :class="{'active': sideTwoCurP === 0}" @click="sideTwoCurP = 0">待处理</span>
          <span :class="{'active': sideTwoCurP === 1}" @click="sideTwoCurP = 1">已处理</span>
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
          <el-button @click="getBaseList" icon="el-icon-search">搜索</el-button>
          <el-button @click.native="exportDialog = true" style="width: 64px;height: 32px;line-height: 32px;padding: 0;float: right;">导出</el-button>
        </div>
        <el-table
          :data="proBaseList"
          key="tabel5"
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
            :show-overflow-tooltip="true"
            label="项目代码">
            <template slot-scope="scope">
              {{scope.row.quotaNum ? scope.row.quotaNum : '--'}}
            </template>
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
            <template slot-scope="scope">
              {{scope.row.serviceTownshipHosp.budgetAmount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="113"
            label="实发总金额（元）">
            <template slot-scope="scope">
              {{scope.row.serviceTownshipHosp.actualAmount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="153"
            label="卫生院预算总金额（元）">
            <template slot-scope="scope">
              {{scope.row.serviceTownshipHosp.hospBudgetAmount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="153"
            label="卫生院实发总金额（元）">
            <template slot-scope="scope">
              {{scope.row.serviceTownshipHosp.hospActualAmount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            width="153"
            label="乡村医生预算总金额（元）">
            <template slot-scope="scope">
              {{scope.row.serviceTownshipHosp.doctorBudgetAmount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            width="153"
            label="乡村医生实发总金额（元）">
            <template slot-scope="scope">
              {{scope.row.serviceTownshipHosp.doctorActualAmount}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="200">
            <template slot-scope="scope">
              <span class="pay-online" @click="showVillageDetail(scope.row)">村卫生室详情</span>
              <span  class="cancel-reg" @click="reviseBase(scope.row)" v-if="scope.row.updateType === '1'">修改</span>
              <span  class="cant-tap" v-else>修改</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--村卫生室详情-->
      <div class="sup-content" v-show="sideTwoCurP === 2">
        <div class="sup-c3-detail">
          <span>项目年度：{{proBaseDoneDetial.year}}</span>
          <span>项目季度：{{proBaseDoneDetial.quarter === '9' ? '年终考核' : (proBaseDoneDetial.quarter + '季度')}}</span>
          <span>项目代码：{{proBaseDoneDetial.quotaNum ? proBaseDoneDetial.quotaNum : '无'}}</span>
        </div>
        <div class="sup-search"  style="margin-top: 20px;">
          村卫生室：
          <el-select v-model="baseVillageUid" style="width: 200px;"  placeholder="请选择">
            <el-option
              v-for="item in baseVillageEntryList"
              :key="item.clinicExeUid"
              :label="item.name"
              :value="item.clinicExeUid">
            </el-option>
          </el-select>
          <el-button @click="searchVDoctorList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="proBaseVDoctorList"
          key="tabel567"
          stripe
          show-summary
          :summary-method="getSummaries1"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            width="176"
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
            width="176"
            :show-overflow-tooltip="true"
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
              <span class="pay-online" @click="previewPictures(scope.row.appendices[0].fileFullPath, 'bigPic')">转账回执单</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--修改执行详情-->
      <div class="sup-content" v-show="sideTwoCurP === 3">
        <div class="sup-c3-detail">
          <span>项目年度：{{proBaseDoneDetial.year}}</span>
          <span>项目季度：{{proBaseDoneDetial.quarter === '9' ? '年终考核' : (proBaseDoneDetial.quarter + '季度')}}</span>
          <span>项目代码：{{proBaseDoneDetial.quotaNum}}</span>
          <span>预算总金额：{{proBaseDoneDetial.budgetAmount}}</span>
          <span>发放时间：{{proBaseDoneDetial.appropriateTime | moment}}</span>
          <span>截止时间：{{proBaseDoneDetial.deadlineTime | moment}}</span>
          <span v-if="proBaseDoneDetial.serviceTownshipHosp">状态：<b style="color: #67c23a">已提交</b></span>
        </div>
        <div class="sup-search"  style="margin-top: 20px;">
          实发总金额:
          <el-form :model="baseUpdateActual" class="demo-ruleForm">
            <el-form-item
              prop="actualAmount"
              :rules="[
                    {validator: validateNum, required: false}
                  ]"
            >
              <el-input type="actualAmount" style="width: 200px;height: 32px;" v-model="baseUpdateActual.actualAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          卫生院实发金额:
          <el-form :model="baseUpdateActual" class="demo-ruleForm">
            <el-form-item
              prop="hospActualAmount"
              :rules="[
                   {validator: validateNum, required: false}
                  ]"
            >
              <el-input type="hospActualAmount" style="width: 200px;height: 32px;" v-model="baseUpdateActual.hospActualAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          乡村医生实发总金额:
          <el-form :model="baseUpdateActual" class="demo-ruleForm">
            <el-form-item
              prop="doctorActualAmount"
              :rules="[
                    {validator: validateNum, required: false}
                  ]"
            >
              <el-input type="doctorActualAmount" style="width: 200px;height: 32px;" v-model="baseUpdateActual.doctorActualAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="sup-c3-btn">
          <el-button @click.native="submitUpdateBase">提交</el-button>
          <el-button style="display: none;"></el-button>
        </div>
        <el-table
          :data="proBaseVDoctorList"
          key="tabel54"
          stripe
          show-summary
          :summary-method="getSummaries1"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            width="176"
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
            width="176"
            :show-overflow-tooltip="true"
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
              <span class="pay-online" v-if="scope.row.appendices[0]" @click="showPic(scope.row.appendices[0].fileFullPath ? scope.row.appendices[0].fileFullPath : scope.row.appendices[0].newFileName)">转账回执单</span>
              <span  class="cant-tap" v-else>转账回执单</span>
              <span  class="cancel-reg" @click="reviseVillageEntry(scope.row)" v-if="scope.row.actualAmount">修改</span>
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
    <!--基础药物-卫生院-->
    <div class="sup-content-box clearfix" v-if="sideType === 3">
      <!--待处理-->
      <div class="sup-content" v-show="sideThreeCurP === 0">
        <div class="village-type" style="border-bottom: none;">
          <span :class="{'active': sideThreeCurP === 0}" @click="sideThreeCurP = 0">待处理</span>
          <span :class="{'active': sideThreeCurP === 1}" @click="sideThreeCurP = 1">已处理</span>
        </div>
        <template v-if="proDrugHospDetail.status && proDrugHospDetail.status !== '0'">
          <div class="sup-c3-detail">
            <span>项目年份：{{proDrugHospDetail.year}}</span>
            <span>项目月份：{{parseInt(proDrugHospDetail.month) + 1}}月份</span>
            <span>项目代码：{{proDrugHospDetail.quotaNum}}</span>
            <span>卫生院预算金额：{{proDrugHospDetail.budgetAmount}}</span>
            <span>发放时间：{{proDrugHospDetail.appropriateTime | moment}}</span>
            <span>截止时间：{{proDrugHospDetail.deadlineTime | moment}}</span>
            <span>状态：<b style="border: none;font-weight: normal;" :style="{'color': proDrugHospDetail.status === '3' ? '#EF5555' : '#FB8C00'}">{{proDrugHospDetail.status === '3' ? '已逾期' : '未提交'}}</b></span>
          </div>
          <div class="sup-c3-btn">
            <div>
              <i class="red-star" style="padding-right: 2px;font-style: normal;"> </i>卫生院实发金额：
              <el-form :model="proDrugHandleData" class="demo-ruleForm">
                <el-form-item
                  prop="actualAmount"
                  :rules="[
                     {validator: validateNum, required: false}
                  ]"
                >
                  <el-input type="actualAmount" style="width: 200px;height: 32px;" v-model="proDrugHandleData.actualAmount" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <i class="red-star" style="padding-right: 2px;font-style: normal;"></i>到账时间：
              <el-date-picker
                style="width: 200px;"
                v-model="proDrugHandleData.hospArriveTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="sup-c2-t2">
            <span style="width: 100px;text-align: right;">备注：</span>
            <textarea  v-model="proDrugHandleData.description"  name=""  cols="30" rows="10"></textarea>
          </div>
          <div class="sup-c2-b">
            <div class="sup-c2-btn">
              <el-button type="primary" v-if="proDrugHospDetail.overdueType === '1'" :disabled="!proDrugHandleData.actualAmount || !proDrugHandleData.hospArriveTime" @click.native="submitDrugHosp">提交</el-button>
              <el-button type="primary" v-else :disabled="!proDrugHandleData.actualAmount || !proDrugHandleData.hospArriveTime || isOutTime(proDrugHospDetail.deadlineTime)" @click.native="submitDrugHosp">提交</el-button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="not-content">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无待处理项目</p>
          </div>
        </template>
      </div>
      <!--已处理-->
      <div class="sup-content" v-show="sideThreeCurP === 1">
        <div class="village-type">
          <span :class="{'active': sideThreeCurP === 0}" @click="sideThreeCurP = 0">待处理</span>
          <span :class="{'active': sideThreeCurP === 1}" @click="sideThreeCurP = 1">已处理</span>
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
          项目月份:
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
          项目代码:
          <el-input style="width: 200px" v-model="quotaNum"></el-input>
          <el-button @click="getDrugHList" icon="el-icon-search">搜索</el-button>
          <el-button @click.native="exportDrugDialog = true" style="width: 64px;height: 32px;line-height: 32px;padding: 0;float: right;">导出</el-button>
        </div>
        <el-table
          :data="proDrugHospList"
          key="tabel543"
          stripe
          :show-overflow-tooltip="true"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            min-width="50">
          </el-table-column>
          <el-table-column
            prop="year"
            min-width="80"
            label="项目年度">
          </el-table-column>
          <el-table-column
            prop="month"
            min-width="80"
            label="项目月份">
            <template slot-scope="scope">
              {{parseInt(scope.row.month) + 1}}月
            </template>
          </el-table-column>
          <el-table-column
            prop="quotaNum"
            min-width="100"
            label="项目代码">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="appropriateTime"
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
            prop="actualAmount"
            min-width="140"
            label="实发总金额（元）">
          </el-table-column>
          <el-table-column
            prop="description"
            min-width="103"
            :show-overflow-tooltip="true"
            label="备注">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="100">
            <template slot-scope="scope">
              <span  class="cancel-reg" @click="reviseDrugH(scope.row)" v-if="scope.row.updateType === '1'">修改</span>
              <span  class="cant-tap" v-else>修改</span>
            </template>
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
      <!--修改-->
      <div class="sup-content" v-if="sideThreeCurP === 2">
        <div class="sup-c3-detail">
          <span>项目年份：{{proDrugHospDetail.year}}</span>
          <span>项目月份：{{parseInt(proDrugHospDetail.month) + 1}}月份</span>
          <span>项目代码：{{proDrugHospDetail.quotaNum}}</span>
          <span>卫生院预算金额：{{proDrugHospDetail.budgetAmount}}</span>
          <span>发放时间：{{proDrugHospDetail.appropriateTime | moment}}</span>
          <span>截止时间：{{proDrugHospDetail.deadlineTime | moment}}</span>
          <span>状态：<b style="color: #67c23a">已提交</b></span>
        </div>
        <div class="sup-c3-btn">
          <div>
            <i class="red-star" style="padding-right: 2px;font-style: normal;"> </i>卫生院实发金额：
            <el-form :model="proDrugHandleData" class="demo-ruleForm">
              <el-form-item
                prop="actualAmount"
                :rules="[
                    {validator: validateNum, required: false}
                  ]"
              >
                <el-input type="actualAmount" style="width: 200px;height: 32px;" v-model="proDrugHandleData.actualAmount" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <i class="red-star" style="padding-right: 2px;font-style: normal;"></i>到账时间：
            <el-date-picker
              style="width: 200px;"
              v-model="proDrugHandleData.hospArriveTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="sup-c2-t2">
          <span style="width: 100px;text-align: right;">备注：</span>
          <textarea  v-model="proDrugHandleData.description"  name=""  cols="30" rows="10"></textarea>
        </div>
        <div class="sup-c2-b">
          <div class="sup-c2-btn">
            <el-button type="primary" :disabled="!proDrugHandleData.actualAmount || !proDrugHandleData.hospArriveTime" @click.native="submitDrugHosp">提交</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--基础药物-村卫生室-->
    <div class="sup-content-box clearfix" v-if="sideType === 4">
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
            <img src="../../../../assets/img/not.png" alt="">
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
    <!--村医卡号维护-->
    <div class="sup-content-box clearfix" v-if="sideType === 5">
      <div class="sup-content" v-show="sideFiveCurP === 0">
        <div class="village-type">
          <span :class="{'active': villageType === 0}" @click="villageType = 0">村医列表</span>
          <span :class="{'active': villageType === 1}" @click="villageType = 1">待审核</span>
          <span :class="{'active': villageType === 2}" @click="villageType = 2">审核不通过</span>
        </div>
        <div class="sup-search">
          村卫生室:
          <el-select v-model="villageRoom" style="width: 200px;" placeholder="请选择">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              v-for="item in villageRoomList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-button @click="getVillageList" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          <el-button type="primary" @click.native="addVCardNo">新增</el-button>
          <el-button style="display: none;"></el-button>
        </div>
        <el-table
          :data="villageCardNoList"
          key="tabel17"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            min-width="176"
            :show-overflow-tooltip="true"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="name"
            width="176"
            :show-overflow-tooltip="true"
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
            min-width="176"
            label="状态">
            <template slot-scope="scope">
              <p v-if="scope.row.status === '3' || scope.row.status === '5' || scope.row.status === '6' || scope.row.status === '8'">已审核</p>
              <p v-else>{{villageStatus[scope.row.status]}}</p>
            </template>
          </el-table-column>
          <el-table-column
            width="176"
            label="操作">
            <template slot-scope="scope">
              <span class="pay-online" @click="reviseVillage(scope.row)" v-if="scope.row.status === '3' || scope.row.status === '4' || scope.row.status === '5' || scope.row.status === '6' || scope.row.status === '7' || scope.row.status === '8'">修改</span>
              <span  class="cant-tap" v-else>修改</span>
              <span  class="cancel-reg" @click="delVillage(scope.row)" v-if="scope.row.status === '3' || scope.row.status === '4' || scope.row.status === '5' || scope.row.status === '6' || scope.row.status === '7' || scope.row.status === '8'">删除</span>
              <span  class="cant-tap" v-else>删除</span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="sup-content" v-show="sideFiveCurP === 1">
        <div class="village-type">
          <span :class="{'active': villageType === 0}" @click="villageType = 0">村医列表</span>
          <span :class="{'active': villageType === 1}" @click="villageType = 1">待审核</span>
          <span :class="{'active': villageType === 2}" @click="villageType = 2">审核不通过</span>
        </div>
        <div class="sup-search">
          村卫生室:
          <el-select v-model="villageRoom" style="width: 200px;" placeholder="请选择">
            <el-option
              v-for="item in villageRoomList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-button @click="getVillageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="villageCardNoList"
          key="tabel154"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="150">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            min-width="150"
            :show-overflow-tooltip="true"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="name"
            width="150"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="newBankAccount"
            label="一卡通账号"
            :show-overflow-tooltip="true"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="operationType"
            min-width="150"
            label="操作类别">
            <template slot-scope="scope">
              {{oType[scope.row.operationType]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            min-width="150"
            label="备注">
          </el-table-column>
          <el-table-column
            prop="submitTime"
            min-width="150"
            label="提交时间">
            <template slot-scope="scope">
              {{scope.row.submitTime | moment}}
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="sup-content" v-show="sideFiveCurP === 2">
        <div class="village-type">
          <span :class="{'active': villageType === 0}" @click="villageType = 0">村医列表</span>
          <span :class="{'active': villageType === 1}" @click="villageType = 1">待审核</span>
          <span :class="{'active': villageType === 2}" @click="villageType = 2">审核不通过</span>
        </div>
        <div class="sup-search">
          村卫生室:
          <el-select v-model="villageRoom" style="width: 200px;" placeholder="请选择">
            <el-option
              v-for="item in villageRoomList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-button @click="getVillageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="villageCardNoList"
          key="tabel18"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="100">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            min-width="130"
            :show-overflow-tooltip="true"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="name"
            width="130"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="newBankAccount"
            label="一卡通账号"
            :show-overflow-tooltip="true"
            min-width="220">
          </el-table-column>
          <el-table-column
            prop="operationType"
            min-width="100"
            label="操作类别">
            <template slot-scope="scope">
              {{oType[scope.row.operationType]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="submitTime"
            min-width="120"
            label="审核时间">
            <template slot-scope="scope">
              {{scope.row.reviewTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            min-width="150"
            label="不通过原因">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <span class="pay-online" @click="reviseVillage(scope.row)">重新提交</span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div v-show="villageCardNoList.length" class="pagination-box">
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
    <!--基础服务处理弹窗-->
    <el-dialog
      title="村卫生室执行情况"
      :visible.sync="villageEntryDialog"
      :close-on-click-modal="false"
      width="750px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <span class="red-star">村卫生室：</span><el-select v-model="baseVillageUid" @change="baseChooseVillage" style="width: 200px;" v-if="!baseVillageEntryCanSelect" placeholder="请选择">
            <el-option
              v-for="item in baseVillageEntryList"
              :key="item.clinicExeUid"
              :label="item.name"
              :value="item.clinicExeUid">
            </el-option>
          </el-select>
          <el-input :disabled="true" v-model="baseCurVillageEntryName"  style="width: 200px;height: 32px;" v-else></el-input>
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
              ref="picUploadB1"
              :class="{'img-upload': true}"
              :disabled="noUpload"
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
        <el-button type="primary" :disabled="isActive(baseVillageEntryData)" v-if="!baseVillageEntryCanSelect" style="width: 106px" @click.native="baseSaveVillageEntry(true)">保存并新增</el-button>
        <el-button @click.native="cancel1">取 消</el-button>
      </span>
    </el-dialog>
    <!--基础服务修改处理弹窗-->
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
    <!--卡号维护-录入村医-->
    <el-dialog
      :title="oVType === 0 ? '新增村医' : oType[operationType] + '村医'"
      :visible.sync="vCardNoEntryDialog"
      :close-on-click-modal="false"
      width="340px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <span class="red-star" style="width: 77px;">村卫生室：</span>
          <el-select v-model="villageEntryData.villageClinicUid" @change="chooseVillage" style="width: 200px;" v-if="!villageEntryCanSelect" placeholder="请选择">
            <el-option
              v-for="item in villageRoomList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-input :disabled="true" v-model="curVillageEntryName"  style="width: 200px;height: 32px;" v-else></el-input>
        </div>
        <div class="town-entry-row">
          <span class="red-star"  style="width: 77px;">村医姓名：</span>
          <el-input :disabled="villageEntryCanSelect" v-model="villageEntryData.name" style="width: 200px; height: 32px;"></el-input>
        </div>
        <div class="town-entry-row">
          <span class="red-star" style="width: 77px;">一卡通：</span>
          <el-input  v-model="villageEntryData.bankAccount" style="width: 200px; height: 32px;"></el-input>
        </div>
        <div class="town-entry-row">
          <span  style="width: 77px;">备注：</span>
          <textarea  style="width: 200px;"  v-model="villageEntryData.description"  name=""  cols="30" rows="10"></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!villageEntryData.bankAccount || !villageEntryData.name || !villageEntryData.villageClinicUid"  @click.native="saveVillageEntry">确定</el-button>
        <el-button @click.native="vCardNoEntryDialog = false; villageEntryCanSelect = false;">取 消</el-button>
      </span>
    </el-dialog>
    <!--删除村医-->
    <el-dialog
      title="删除村医"
      :visible.sync="delVillageCardNoDialog"
      :close-on-click-modal="false"
      width="750px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <div class="has-color">
            <span>村卫生室:{{villageEntryData.villageClinicName}}</span><span>村医姓名:{{villageEntryData.name}}</span><span style="margin-right: 0">一卡通账号:{{villageEntryData.bankAccount}}</span>
          </div>
        </div>
        <div class="town-entry-row">
          <span class="red-star"  style="width: 52px;text-align: left">备注：</span>
          <textarea  style="width: 636px;"  v-model="vDelDescription"  name=""  cols="30" rows="10"></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!vDelDescription" @click="confirmDel">提交</el-button>
        <el-button @click="delVillageCardNoDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--基卫项目导出-->
    <el-dialog
      title="基卫补助导出"
      :visible.sync="exportDialog"
      width="340px"
      :close-on-click-modal="false"
      center>
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
        <el-button :disabled="!exportBaseParams.where.year" type="primary" @click.native="comfirmExportBase">确定</el-button>
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
          {name: '卫计项目投入监测', sideType: 1, sideCurP: 0}
        ],
        '2': [
          {name: '基本公卫服务补助', sideType: 2, sideCurP: 0}
        ],
        '3': [
          {name: '基本药物制度补助-卫生院补助', sideType: 3, sideCurP: 0}
        ],
        '4': [
          {name: '基本药物制度补助-村卫生室补助', sideType: 4, sideCurP: 0}
        ],
        '5': [
          {name: '村医卡号维护', sideType: 5, sideCurP: 0}
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
    this.getGageList();
    this.getCurYear();
  },
  methods: {
    chooseBaseType (e) {
      let params = {
        exportType: (parseInt(e) - 1) + '',
        townshipHospUid: this.$store.state.token.organInfoList[0].uid
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
    cancel1 () {
      this.villageEntryDialog = false;
      this.villageUpdateEntryDialog = false;
      if (!this.baseVillageEntryCanSelect && this.baseVillageUid) {
        this.proBaseVDoctorList.filter(y => y.villageClinicExecuteUid === this.baseVillageUid).map(x => {
          x.appendices = [];
        })
      } else {
        if (this.sideTwoCurP === 3) {
          this.baseVillageEntryData.forEach((u, index) => {
            if (u.commentImgList && u.commentImgList.length) {
              this.$refs.picUploadB2[index].clearFiles();
            }
          })
        } else {
          this.baseVillageEntryData.forEach((u, index) => {
            if (u.commentImgList && u.commentImgList.length) {
              this.$refs.picUploadB1[index].clearFiles();
            }
          })
        }
        console.log(this.proBaseVDoctorList[this.curUpdateIndex], this.myFile)
        for (let p in this.myFile) {
          this.proBaseVDoctorList[this.curUpdateIndex][p] = this.myFile[p]
        }
        this.myFile = {
          description: '',
          actualAmount: 0,
          appendices: []
        };
        console.log(this.proBaseVDoctorList[this.curUpdateIndex], this.myFile)
      }
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
    comfirmExportBase () {
      this.exportDialog = false;
      delete this.exportBaseParams.month;
      this.exportBaseParams.where.year += ''
      this.axios.get('/hisServices/financialSupervision/exportServiceTownshipHosp/' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.exportBaseParams))), {
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
    }, // 导出基卫项目
    comfirmExportDrug () {
      delete this.exportBaseParams.where.quarter;
      this.exportBaseParams.where.year += ''
      console.log(this.exportBaseParams)
      this.exportDrugDialog = false;
      this.axios.get('/hisServices/financialSupervision/exportDrugTownshipHosp/' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.exportBaseParams))), {
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
    }, // 导出基础药物-卫生院
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
      if (this.sideType === 4) { // 0季度
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
      } else {
        if (this.exportDrugDialog) {
          params['isProjectMonth'] = true;
        }
        this.axios.get('/hisServices/financialSupervision/systemSubsidy/months', {params})
          .then(res => {
            if (res) {
              res.data.forEach(x => {
                this.drugCurMonthList.push(this.proMonthList.find(y => y.value === x))
              })
            }
          })
      }
    },
    chooseBaseYear (e) {
      this.baseCurQuarterList = [];
      this.exportBaseParams.where.quarter = '';
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
        this.getGageList();
      } else if (this.sideType === 2) {
        this.getBaseList();
      } else if (this.sideType === 3) {
        this.proDrugHandleData = {
          actualAmount: '',
          hospArriveTime: '',
          description: ''
        };
        this.getDrugHList();
      } else if (this.sideType === 4) {
        this.getDrugVList();
      } else if (this.sideType === 5) {
        this.getVillageList();
        this.getDrugVillageList();
      }
    },
    resetData () {
      this.exportProYear = [];
      this.sideOneCurP = 0;
      this.sideTwoCurP = 0;
      this.sideThreeCurP = 0;
      this.sideFourCurP = 0;
      this.baseQuarter = '';
      this.sideFiveCurP = 0;
      this.quotaNum = '';
      this.proName = '';
      this.proBaseDoneDetial = {};
      this.baseVillageUid = '';
      this.drugVillageEntryList = [];
      this.proDrugDoneDetial = {};
      this.drugVillageUid = '';
      this.allTotal = {
        totalActualAmount: null,
        totalBudgetAmount: null,
        totalClinicNum: null,
        totalDoctorNum: null
      }
      this.breadList = {
        '1': [
          {name: '卫计项目投入监测', sideType: 1, sideCurP: 0}
        ],
        '2': [
          {name: '基本公卫服务补助', sideType: 2, sideCurP: 0}
        ],
        '3': [
          {name: '基本药物制度补助-卫生院补助', sideType: 3, sideCurP: 0}
        ],
        '4': [
          {name: '基本药物制度补助-村卫生室补助', sideType: 4, sideCurP: 0}
        ],
        '5': [
          {name: '村医卡号维护', sideType: 5, sideCurP: 0}
        ]
      };
      this.isUploading = false;
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
      switch (this.sideType) {
        case 1:
          if (this.sideOneCurP === 0 || this.sideOneCurP === 1) {
            this.getGageList();
          }
          break;
        case 2:
          if (this.sideTwoCurP === 0 || this.sideTwoCurP === 1) {
            this.getBaseList();
          } else if (this.sideTwoCurP === 2) {
            this.showVillageDetail(this.proBaseDoneDetial, true)
          } else if (this.sideTwoCurP === 3) {
            this.reviseBase(this.proBaseDoneDetial, true)
          }
          break;
        case 3:
          this.getDrugHList();
          break;
        case 4:
          if (this.sideFourCurP === 0 || this.sideFourCurP === 1) {
            this.getDrugVList();
          } else if (this.sideFourCurP === 2) {
            this.showDrugVillageDetail(this.proDrugDoneDetial, true)
          } else if (this.sideFourCurP === 3) {
            this.reviseDrug(this.proDrugDoneDetial, true)
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
          if (this.sideOneCurP === 0 || this.sideOneCurP === 1) {
            this.getGageList();
          }
          break;
        case 2:
          if (this.sideTwoCurP === 0 || this.sideTwoCurP === 1) {
            this.getBaseList();
          } else if (this.sideTwoCurP === 2) {
            this.showVillageDetail(this.proBaseDoneDetial, true)
          } else if (this.sideTwoCurP === 3) {
            this.reviseBase(this.proBaseDoneDetial, true)
          }
          break;
        case 3:
          this.getDrugHList();
          break;
        case 4:
          if (this.sideFourCurP === 0 || this.sideFourCurP === 1) {
            this.getDrugVList();
          } else if (this.sideFourCurP === 2) {
            this.showDrugVillageDetail(this.proDrugDoneDetial, true)
          } else if (this.sideFourCurP === 3) {
            this.reviseDrug(this.proDrugDoneDetial, true)
          }
          break;
        case 5:
          this.getVillageList();
          break;
      }
    },
    breadTap (type, index, curP) {
      this.breadList[type].splice(index + 1);
      this.sideType = type;
      console.log(type, curP)
      switch (type) {
        case 1:
          if (this.sideOneCurP === 3) {
            this.sideOneCurP = 1;
          } else {
            this.sideOneCurP = curP;
          }
          break;
        case 2:
          this.sideTwoCurP = 1;
          break;
        case 3:
          this.sideThreeCurP = 1;
          break;
        case 4:
          this.sideFourCurP = 1;
          break;
      }
    }, // 面包屑点击
    // 卫计项目
    getGageList () {
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
          status: this.sideOneCurP + '',
          hospitalUid: this.$store.state.token.organInfoList[0].uid
        }
      }
      if (this.proYear && this.sideOneCurP === 1) {
        params.where['year'] = this.proYear;
      }
      if (this.proName) {
        params.where['name'] = this.proName;
      }
      if (this.quotaNum) {
        params.where['quotaNum'] = this.quotaNum;
      }
      this.axios.get('/hisServices/financialSupervision/projectMonitors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.proGageList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          }
        })
    }, // 获取卫计项目列表
    handlePro (item) {
      this.proGageHandleData = {
        uid: '',
        actualAmount: '',
        hospArriveTime: '',
        finishSituation: '',
        description: '',
        appendices: []
      }
      let params = {
        uid: item.projectTownshipHosp.uid
      }
      // this.axios.get('/hisServices/financialSupervision/projectTownshipHosp', {params})
      // .then(res => {
      // if (res) {
      // this.proGageDetail = res.data;
      //  }
      // })
      this.proGageDetail = item;
      this.sideOneCurP = 2;
      this.breadList['1'].push({name: '处理', sideType: 1, sideCurP: 2})
      // this.$refs.gageUpload.clearFiles();
    }, // 处理卫计项目
    sendGagePro () {
      let imgList = [];
      // this.proGageHandleData.appendices = [];
      if (this.commentImgList && this.commentImgList.length > 0) {
        for (let i = 0; i < this.commentImgList.length; i++) {
          if (this.commentImgList[i].response) {
            let oRes = this.commentImgList[i].response.data;
            if (oRes) {
              imgList.push({
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
      if (this.sideOneCurP === 2) {
        this.proGageHandleData.uid = this.proGageDetail.projectTownshipHosp.uid;
      } else {
        this.proGageHandleData.uid = this.proGageDetail.uid;
      }
      this.proGageHandleData.appendices.splice(0, 0, ...imgList);
      this.axios.put('/hisServices/financialSupervision/projectTownshipHosp', this.proGageHandleData)
        .then(res => {
          if (res) {
            this.sideOneCurP = 1;
            this.breadList['1'].splice(1);
            this.$refs.gageUpload.clearFiles();
          }
        })
    }, // 提交处理卫计项目
    cancelGagePro () {
      this.sideOneCurP = 0;
      this.breadList['1'].splice(1);
      if (this.commentImgList.length) {
        this.$refs.gageUpload.clearFiles();
      }
    }, // 取消处理卫计项目
    cancelPro () {
      this.canRevisePro = false;
      if (this.commentImgList.length) {
        this.$refs.gageUpload1.clearFiles();
      }
    },
    delPic (index) {
      this.proGageHandleData.appendices.splice(index, 1);
    }, // 删除执行情况项目现场图片
    reviseGagePro () {
      this.canRevisePro = !this.canRevisePro;
      this.proGageHandleData.uid = this.proGageDetail.uid;
      this.proGageHandleData.actualAmount = this.proGageDetail.actualAmount;
      this.proGageHandleData.hospArriveTime = this.proGageDetail.hospArriveTime;
      this.proGageHandleData.finishSituation = this.proGageDetail.finishSituation;
      this.proGageHandleData.description = this.proGageDetail.description;
      this.proGageHandleData.appendices = Object.assign([], this.proGageDetail.appendices);
    }, // 修改卫计项目
    showProDetail (item) {
      this.commentImgList = [];
      this.canRevisePro = false;
      let params = {
        uid: item.projectTownshipHosp.uid
      }
      this.axios.get('/hisServices/financialSupervision/projectTownshipHosp', {params})
        .then(res => {
          if (res) {
            this.proGageDetail = res.data;
            this.proGageDetail.updateType = item.updateType;
            this.previewPictures(res.data.appendices, 'proE')
          }
        })
      this.sideOneCurP = 3;
      this.breadList['1'].push({name: '执行情况', sideType: 1, sideCurP: 3})
    },
    handleRemove (file, fileList) {
      // console.log('this.commentImgList', this.commentImgList.length)
      // console.log(file, fileList);
    },
    handlePictureCardPreview (file) {
      this.showPic(file.url)
    },
    beforeAvatarUpload (file) {
      if (this.commentImgList && this.commentImgList.length >= 6) {
        this.$message.warning('最多只能上传5张图片!');
        return false;
      }
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
    uploadSucess (response, file, fileList) {
      this.commentImgList = fileList;
    },
    handleRemove1 (file, fileList) {
      this.isUploading = false;
      this.noUpload = false;
      if (this.baseVDoctorBankPic > 0) {
        this.baseVDoctorBankPic -= 1;
      } else {
        this.baseVDoctorBankPic = 0;
      }
      this.isActive(this.baseVillageEntryData)
      // console.log('this.commentImgList', this.commentImgList.length)
      // console.log(file, fileList);
    },
    handlePictureCardPreview1 (file) {
    },
    beforeAvatarUpload1 (file) {
      console.log(this.isUploading)
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
    uploadSucess1 (response, file, fileList) {
      this.isUploading = false;
      this.updateVillageData = [];
      if (this.sideTwoCurP !== 0 || this.baseVillageEntryCanSelect) {
        this.showUploadPic = false;
      }
      if (this.baseVillageEntryCanSelect) {
        this.noUpload = true;
      }
      this.baseVDoctorBankPic += 1;
      this.baseVillageEntryData[this.curUploadPicIndex]['commentImgList'] = fileList;
      // this.updateVillageData[this.curUpdateIndex]['commentImgList'] = fileList;
      this.proBaseVDoctorList[this.curUpdateIndex]['commentImgList'] = fileList;
      this.proBaseVDoctorList.forEach(x => {
        console.log(x)
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
        this.updateVillageData.push({uid, actualAmount, appendices, description})
      })
      console.log(this.updateVillageData)
      this.isActive(this.baseVillageEntryData)
    },
    // 基础服务
    getBaseList () {
      this.proBaseVDoctorList = [];
      let params1 = {
        pageNum: this.pagination.pageNum,
        where: {
          status: this.sideTwoCurP + '',
          hospitalUid: this.$store.state.token.organInfoList[0].uid
        }
      }
      if (this.sideTwoCurP === 1) {
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
      this.axios.get('/hisServices/financialSupervision/serviceSubsidies/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params1))))
        .then(res => {
          if (res) {
            if (this.sideTwoCurP === 0) {
              if (res.data.list && res.data.list.length) {
                this.proBaseDetail = res.data.list[0];
                let params = {
                  pageNum: 1,
                  pageSize: this.pagination.pageSize,
                  where: {
                    hospitalExeUid: res.data.list[0].serviceTownshipHosp.uid,
                    detailType: '1'
                  }
                }
                this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
                  .then(res => {
                    if (res) {
                      this.baseCanSubmit = res.data.allEntry;
                      this.proBaseVDoctorList = res.data.page.list;
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
                this.proBaseDetail = {};
              }
            } else {
              this.hideP = false;
              this.proBaseList = res.data.list;
              this.pagination.pageNum = res.data.pageNum;
              this.pagination.total = res.data.total;
            }
          }
        })
    },
    baseChooseVillage (e) {
      console.log('change')
      let params = {
        pageSize: 0,
        where: {
          detailType: '0',
          hospitalExeUid: this.proBaseDetail.serviceTownshipHosp.uid,
          clinicExeUid: e
        }
      }
      this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.baseVillageEntryData = res.data.page.list;
          }
        })
    },
    baseSaveVillageEntry (boolean) {
      if (!boolean) {
        this.villageEntryDialog = false;
      }
      let params = [];
      console.log(this.baseVillageEntryData)
      if (this.sideTwoCurP === 3) {
        this.villageUpdateEntryDialog = false;
        this.baseVillageEntryData.forEach(x => {
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
          this.updateVillageData.push({uid, actualAmount, appendices, description});
        })
      } else {
        this.baseVillageEntryData.forEach(x => {
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
        this.axios.put('/hisServices/financialSupervision/doctorExecutes', params)
          .then(res => {
            if (res) {
              this.noUpload = false;
              this.showUploadPic = true;
              this.baseVDoctorBankPic = 0;
              this.baseVillageEntryData = [];
              this.baseVillageUid = '';
              // 更新村医数据
              let params = {
                pageNum: 1,
                pageSize: this.pagination.pageSize,
                where: {
                  hospitalExeUid: this.proBaseDetail.serviceTownshipHosp.uid,
                  detailType: '1'
                }
              }
              this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
                .then(res => {
                  if (res) {
                    this.baseCanSubmit = res.data.allEntry;
                    this.proBaseVDoctorList = res.data.page.list;
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
              // 获取该基础项目未选择的村卫生室
              let p1 = {
                where: {
                  hospitalExeUid: this.proBaseDetail.serviceTownshipHosp.uid,
                  status: '3'
                }
              }
              this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
                .then(res => {
                  if (res) {
                    this.baseVillageEntryList = res.data.list;
                  }
                })
            } else {
              this.villageEntryDialog = false;
            }
          })
      }
    },
    baseHandle () {
      this.noUpload = false;
      this.showUploadPic = true;
      this.baseVillageEntryCanSelect = false;
      this.baseVDoctorBankPic = 0;
      this.villageEntryDialog = true;
      this.baseVillageUid = '';
      this.baseVillageEntryData = [];
      // 获取该基础项目未选择的村卫生室
      let p1 = {
        where: {
          hospitalExeUid: this.proBaseDetail.serviceTownshipHosp.uid,
          status: '3'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
        .then(res => {
          if (res) {
            this.baseVillageEntryList = res.data.list;
          }
        })
    }, // 处理项目
    delBasePic (index) {
      this.isUploading = false;
      this.noUpload = false;
      this.showUploadPic = true;
      if (this.baseVDoctorBankPic > 0) {
        this.baseVDoctorBankPic -= 1;
      } else {
        this.baseVDoctorBankPic = 0;
      }
      this.baseVillageEntryData[index].appendices.splice(0, 1);
    }, // 删除基卫修改里面的图片
    updateBaseActual () {
      this.baseUpdateActual.hospitalExeUid = this.proBaseDetail.serviceTownshipHosp.uid;
      this.axios.put('/hisServices/financialSupervision/serviceTownshipHosp', this.baseUpdateActual)
        .then(res => {
          if (res) {
            this.$message.success('保存成功！')
            // 更新村医数据
            let params = {
              pageNum: 1,
              pageSize: this.pagination.pageSize,
              where: {
                detailType: '1'
              }
            }
            if (this.sideTwoCurP === 3) {
              params.where['hospitalExeUid'] = this.proBaseDoneDetial.serviceTownshipHosp.uid;
            } else {
              params.where['hospitalExeUid'] = this.proBaseDetail.serviceTownshipHosp.uid;
            }
            this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
              .then(res => {
                if (res) {
                  this.baseCanSubmit = res.data.allEntry;
                  this.proBaseVDoctorList = res.data.page.list;
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
          }
        })
    }, // 更新实发金额，待处理的确定按钮
    showVillageDetail (item, bread) {
      console.log(item)
      this.proBaseDoneDetial = item;
      this.sideTwoCurP = 2;
      if (!bread) {
        this.breadList['2'].push({name: '村卫生室详情', sideType: 2, sideCurP: 2})
      }
      // 获取该基础项目已经选择的村卫生室
      let p1 = {
        where: {
          hospitalExeUid: item.serviceTownshipHosp.uid,
          status: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p1))))
        .then(res => {
          if (res) {
            this.baseVillageEntryList = res.data.list;
          }
        })
      let params = {
        pageNum: 1,
        pageSize: this.pagination.pageSize,
        where: {
          hospitalExeUid: item.serviceTownshipHosp.uid,
          detailType: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.proBaseVDoctorList = res.data.page.list;
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
      console.log('dd')
    }, // 村卫生室详情
    searchVDoctorList () {
      let params = {
        pageNum: 1,
        pageSize: this.pagination.pageSize,
        where: {
          hospitalExeUid: this.proBaseDoneDetial.serviceTownshipHosp.uid,
          detailType: '1'
        }
      }
      if (this.baseVillageUid) {
        params.where['clinicExeUid'] = this.baseVillageUid
      }
      this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.proBaseVDoctorList = res.data.page.list;
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
    reviseBase (item, bread) {
      console.log(item)
      this.updateVillageData = [];
      this.proBaseDoneDetial = item;
      this.baseUpdateActual.actualAmount = item.serviceTownshipHosp.actualAmount;
      this.baseUpdateActual.doctorActualAmount = item.serviceTownshipHosp.doctorActualAmount;
      this.baseUpdateActual.hospActualAmount = item.serviceTownshipHosp.hospActualAmount;
      this.sideTwoCurP = 3;
      if (!bread) {
        this.breadList['2'].push({name: '修改', sideType: 2, sideCurP: 3})
      }
      let params = {
        pageNum: 1,
        pageSize: this.pagination.pageSize,
        where: {
          hospitalExeUid: item.serviceTownshipHosp.uid,
          detailType: '1'
        }
      }
      this.axios.get('/hisServices/financialSupervision/doctorExecutes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.proBaseVDoctorList = res.data.page.list;
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
    }, // 修改基础服务，已处理
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
    reviseVillageEntry (item) {
      console.log(item)
      this.myFile.description = item.description;
      this.myFile.actualAmount = item.actualAmount;
      this.myFile.appendices[0] = this.copy(item.appendices[0]);
      this.noUpload = true;
      this.showUploadPic = false;
      this.curUpdateIndex = this.proBaseVDoctorList.indexOf(item)
      this.baseVDoctorBankPic = item.appendices.length;
      this.baseVillageEntryData = [];
      if (this.sideTwoCurP === 3) {
        this.villageUpdateEntryDialog = true;
      } else {
        this.villageEntryDialog = true;
      }
      this.baseVillageEntryCanSelect = true;
      this.baseCurVillageEntryName = item.villageClinicName;
      this.baseVillageEntryData.push(item);
    },
    changeUploadIndex (item, index) {
      if (this.isUploading) return;
      this.curUploadPicIndex = index;
      this.curUpdateIndex = this.proBaseVDoctorList.indexOf(this.proBaseVDoctorList.find(x => x.uid === item.uid));
    },
    submitBase () {
      let params = {
        hospitalExeUid: this.proBaseDetail.serviceTownshipHosp.uid,
        executeStatus: '1'
      }
      this.axios.put('/hisServices/financialSupervision/serviceTownshipHosp', params)
        .then(res => {
          if (res) {
            console.log(res)
            this.sideTwoCurP = 1;
            // 更新村医数据
            this.proBaseDetail = {
              serviceTownshipHosp: {}
            }
            this.proBaseVDoctorList = [];
          }
        })
    },
    submitUpdateBase () {
      let params = {
        uid: this.proBaseDoneDetial.serviceTownshipHosp.uid,
        actualAmount: this.baseUpdateActual.actualAmount,
        hospActualAmount: this.baseUpdateActual.hospActualAmount,
        doctorActualAmount: this.baseUpdateActual.doctorActualAmount,
        villageDoctorExecutes: this.updateVillageData
      }
      this.axios.put('/hisServices/financialSupervision/serviceTownshipHosp', params)
        .then(res => {
          if (res) {
            console.log(res)
            this.sideTwoCurP = 1;
            this.breadList['2'].splice(1)
            // 更新村医数据
            this.proBaseDetail = {
              serviceTownshipHosp: {}
            }
            this.proBaseVDoctorList = [];
          }
        })
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
    // 基础药物-卫生院
    getDrugHList () {
      let params1 = {
        pageNum: this.pagination.pageNum,
        where: {
          executeStatus: this.sideThreeCurP + '',
          townshipHospUid: this.$store.state.token.organInfoList[0].uid
        }
      }
      if (this.sideThreeCurP === 1) {
        if (this.proYear) {
          params1.where['year'] = this.proYear;
        }
        if (this.proMonth) {
          params1.where['month'] = this.proMonth;
        }
        if (this.quotaNum) {
          params1.where['quotaNum'] = this.quotaNum;
        }
      } else {
        // 放待处理的筛选条件
      }
      this.axios.get('/hisServices/financialSupervision/systemTownshipHospDisposes/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params1))))
        .then(res => {
          if (res) {
            if (this.sideThreeCurP === 0) {
              if (res.data && res.data.length) {
                this.proDrugHospDetail = res.data[0];
              } else {
                this.proDrugHospDetail = {};
              }
            } else {
              this.proDrugHospList = res.data.list;
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
    submitDrugHosp () {
      console.log(this.proDrugHospDetail)
      let params = {
        operationType: '1',
        uid: this.proDrugHospDetail.uid,
        projectUid: this.proDrugHospDetail.projectUid,
        actualAmount: this.proDrugHandleData.actualAmount,
        hospArriveTime: this.proDrugHandleData.hospArriveTime,
        description: this.proDrugHandleData.description
      };
      this.axios.put('/hisServices/financialSupervision/systemTownshipHosp', params)
        .then(res => {
          if (res) {
            this.sideThreeCurP = 1;
            this.breadList['3'].splice(1)
            this.getDrugHList();
          }
        })
    },
    reviseDrugH (item) {
      this.proDrugHospDetail = item;
      this.proDrugHandleData.actualAmount = item.actualAmount;
      this.proDrugHandleData.hospArriveTime = item.appropriateTime;
      this.proDrugHandleData.description = item.description;
      this.sideThreeCurP = 2;
      this.breadList['3'].push({name: '修改', sideType: 3, sideCurP: 2})
      console.log('ds')
    },
    // 基础药物-村卫生室
    getDrugVList () {
      this.proDrugVDoctorList = [];
      let params1 = {
        pageNum: this.pagination.pageNum,
        where: {
          executeStatus: this.sideFourCurP + '',
          townshipHospUid: this.$store.state.token.organizationRelList[0].uid
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
        this.breadList['4'].push({name: '村卫生室详情', sideType: 3, sideCurP: 2})
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
        this.drugVillageEntryData.forEach(x => {
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
    handlePictureCardPreview2 (file) {
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
        this.breadList['4'].push({name: '修改', sideType: 4, sideCurP: 3})
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
            this.breadList['4'].splice(1)
            // 更新村医数据
            this.proDrugVDetail = {
              serviceTownshipHosp: {}
            }
            this.proDrugVDoctorList = [];
          }
        })
    },
    // 村医卡号
    addVCardNo () {
      this.vCardNoEntryDialog = true;
      this.villageEntryCanSelect = false;
      this.oVType = 0;
      this.villageEntryData = {
        townshipHospUid: this.$store.state.token.organInfoList[0].uid,
        villageClinicUid: '',
        name: '',
        bankAccount: '',
        description: ''
      }
    }, // 新增村医卡号
    getVillageList () {
      let params = {
        pageNum: this.pagination.pageNum,
        where: {
          townshipHospUid: this.$store.state.token.organInfoList[0].uid,
          dateType: this.villageType + ''
        }
      }
      if (this.villageRoom) {
        params.where['villageClinicUId'] = this.villageRoom;
      }
      this.axios.get('/hisServices/financialSupervision/villageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.villageCardNoList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
            this.pagination.pageSize = res.data.pageSize;
            this.allTotal = {
              totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
              totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
              totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
              totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
            }
          }
        })
    }, // 村医卡号列表
    getDrugVillageList () {
      let p = {
        pageSize: 0,
        where: {
          hospitalUid: this.$store.state.token.organInfoList[0].uid
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.villageRoomList = res.data.list;
          }
        })
    }, // 村卫生室下拉
    chooseVillage (e) {
    },
    saveVillageEntry () {
      if (this.oVType === 0) {
        this.axios.post('/hisServices/financialSupervision/villageDoctor', this.villageEntryData)
          .then(res => {
            if (res) {
              this.vCardNoEntryDialog = false;
              this.getVillageList();
            }
          })
      } else if (this.oVType === 1) {
        let params = {
          uid: this.villageEntryData.uid,
          status: '5',
          newBankAccount: this.villageEntryData.bankAccount,
          description: this.villageEntryData.description
        }
        this.axios.put('/hisServices/financialSupervision/villageDoctor', params)
          .then(res => {
            if (res) {
              this.vCardNoEntryDialog = false;
              this.getVillageList();
              console.log(res)
            }
          })
      }
    },
    reviseVillage (item) {
      console.log(item)
      this.operationType = item.operationType;
      this.oVType = 1;
      this.vCardNoEntryDialog = true;
      this.villageEntryCanSelect = true;
      this.curVillageEntryName = item.villageClinicName;
      this.villageEntryData.description = '';
      this.villageEntryData.uid = item.uid;
      this.villageEntryData.bankAccount = item.bankAccount;
      this.villageEntryData.villageClinicUid = '00000';
      this.villageEntryData.name = item.name;
      if (item.status === '3' || item.status === '5' || item.status === '7') {
        this.villageEntryData.status = '1';
      } else if (item.status === '4' || item.status === '6' || item.status === '8') {
        this.villageEntryData.status = '2';
      } else {
        this.villageEntryData.status = '0';
      }
    },
    delVillage (item) {
      this.delVillageCardNoDialog = true;
      this.vDelDescription = '';
      this.villageEntryData.villageClinicName = item.villageClinicName;
      this.villageEntryData.name = item.name;
      this.villageEntryData.bankAccount = item.newBankAccount;
      this.vDelUid = item.uid;
    },
    confirmDel () {
      let params = {
        uid: this.vDelUid
      }
      this.axios.delete('/hisServices/financialSupervision/villageDoctor', {params})
        .then(res => {
          if (res) {
            this.delVillageCardNoDialog = false;
            this.getVillageList();
          }
        })
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
    }
  },
  watch: {
    exportDialog (e) {
      if (!e) {
        this.exportBaseParams = {
          where: {
            type: '2',
            year: '',
            quarter: '',
            month: '',
            townshipHospUid: this.$store.state.token.organInfoList[0].uid
          }
        }
      } else {
        this.chooseBaseType(2)
      }
    },
    exportDrugDialog (e) {
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
    sideOneCurP (e) {
      if (e === 0 || e === 1) {
        this.quotaNum = '';
        this.proYear = '';
        this.proName = '';
        this.getGageList();
      }
    },
    sideTwoCurP (e) {
      if (e === 0 || e === 1) {
        this.hideP = false;
        this.quotaNum = '';
        this.proYear = '';
        this.proName = '';
        this.baseUpdateActual = {
          hospitalExeUid: '',
          actualAmount: '',
          hospActualAmount: '',
          doctorActualAmount: ''
        }
        this.getBaseList();
      }
    },
    sideThreeCurP (e) {
      if (e === 0 || e === 1) {
        this.quotaNum = '';
        this.proYear = '';
        this.proName = '';
        this.proDrugHandleData = {
          actualAmount: '',
          hospArriveTime: '',
          description: ''
        };
        this.getDrugHList();
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
    },
    villageType (e) {
      this.sideFiveCurP = e;
      this.villageHos = '';
      this.villageRoom = '';
      this.getVillageList();
    }
  }
}
</script>
<style scoped="scoped" lang="less">
  .sup-bread{
    padding: 28px 30px;
    float: left;
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
          color: #666666;
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
      padding: 0 30px 20px 30px;
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
