<template>
  <div class="dispute-detail">
    <div is="dispute-crumbs" :only="only" :status="status"></div>
    <div is="dispute-steps" :status="status" :createTime="createTime" :hospHandleTime="hospHandleTime" :acceptTime="acceptTime" :mediateHandleTime="mediateHandleTime" :publicityTime="publicityTime"></div>
    <div class="content">
      <p class="name">
        <span>纠纷信息</span>
        <span></span>
        <span v-if="status === '3' || status === '4' || status === '5' || status === '6'" style="color: #999999;font-weight: normal;">纠纷编号：&nbsp;[{{disputeCode.slice(0, 4)}}]&nbsp;{{disputeCode.slice(4)}}</span>
      </p>
      <div class="form-one">
        <el-form :label-position="labelPosition" label-width="136px">
          <el-form-item label="纠纷上报人:" class="w30">
            <el-input v-model="reportName" size="small" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="上报人类型:" class="w30">
            <el-input v-model="reportTypeName" size="small" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="上报人联系电话:" class="w30" style="margin-right: 0;">
            <el-input v-model="phone" size="small" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="纠纷医院:" class="w30">
            <el-input v-model="hospName" size="small" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="纠纷科室:" class="w30">
            <el-input v-model="deptName" size="small" :disabled="true"></el-input>
          </el-form-item>
          <template v-if="reportType === '1'">
            <el-form-item label="纠纷对象:" class="w30" style="margin-right: 0;">
              <el-input v-model="disputeObject" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="纠纷对象联系电话:" class="w30" style="margin-right: 0;">
              <el-input v-model="targetPhone" size="small" :disabled="true"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="纠纷描述:" class="w100" style="margin-right: 0;">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="概述患者诊疗时间、损害后果、申诉要点及诉求，不超过300字。"
              v-model="disputeDesc" :disabled="true">
            </el-input>
          </el-form-item>
          <template v-if="status !== '0'">
            <div style="width: 100%;height: 1px;margin: 15px 0;background: #E8E8E8;"></div>
            <el-form-item label="医院处理时间:" class="w30">
              <el-input v-model="hospHandleTime" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="投诉原因:" class="w100" v-if="status === '1'">
              <el-input v-model="cause" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="纠纷类型:" class="w30" v-if="status !== '0' && status !== '1'">
              <el-input v-model="disputeType" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="保险类别:" class="w30" v-if="isYY && status !== '0' && status !== '1'">
              <el-input v-model="insuranceType" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="纠纷事实:" class="w100" style="margin-right: 0;" v-if="status !== '2' && status !== '1'">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请填写纠纷事实内容"
                v-model="disputeFact" :disabled="true">
              </el-input>
            </el-form-item>
            <el-form-item label="诊疗过程:" class="w100" style="margin-right: 0;" v-if="status !== '2' && status !== '1'">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请填写诊疗过程内容"
                v-model="medicalProcess" :disabled="true">
              </el-input>
            </el-form-item>
            <el-form-item label="医调委处理时间:" class="w30" style="margin-right: 0;" v-if="status === '5' || status === '6'">
              <el-input v-model="mediateHandleTime" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="调解方式:" class="w30" style="margin-right: 0;" v-if="status === '5' || status === '6'">
              <el-input v-model="mediateType" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="处理结果:" class="w100" style="margin-right: 0;" v-if="status === '1'">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="本人于2018年1月2日在溆浦县人民医院进行了XX手术，术后发现体内遗留手术纱布，XXXXXXX（读取上报时填写的纠纷描述），本人于2018年1月2日在溆浦县人民医院进行了XX手术，术后发现体内遗留手术纱布，XXXXXXX（读取上报时填写的纠纷描述）。"
                v-model="handleResult" :disabled="true">
              </el-input>
            </el-form-item>
            <el-form-item label="纠纷协议书:" class="w100" style="margin-right: 0;" v-if="status === '2'">
              <div id="imgs"></div>
            </el-form-item>
            <el-form label-width="136px" class="book" v-if="isYY">
              <el-form-item label="调解过程书:" class="w30" v-if="status === '5'">
                <router-link tag="span" class="clic-view" :to="{ name: 'processed-process-book', query: { disputeUid: this.disputeUid, type: 0, status: '5' } }">点击查看</router-link>
              </el-form-item>
              <el-form-item label="调解过程书:" class="w30" v-if="status === '6'">
                <router-link tag="span" class="clic-view" :to="{ name: 'publicized-process-book', query: { disputeUid: this.disputeUid, type: 0, status: '6' } }">点击查看</router-link>
              </el-form-item>
              <el-form-item label="调解通知书:" class="w30" v-if="status === '6'">
                <router-link tag="span" class="clic-view" :to="{ name: 'publicized-advice-note', query: { disputeUid: this.disputeUid, type: 1, status: '6' } }">点击查看</router-link>
              </el-form-item>
            </el-form>
            <el-form label-width="136px" class="book" v-if="!isYY">
              <template v-if="!alone">
                <el-form-item label="调解过程书:" class="w30" v-if="status === '5'">
                  <router-link tag="span" class="clic-view" :to="{ name: 'processed-not-process-book', query: { disputeUid: this.disputeUid, type: 0, status: '5' } }">点击查看</router-link>
                </el-form-item>
                <el-form-item label="调解过程书:" class="w30" v-if="status === '6'">
                  <router-link tag="span" class="clic-view" :to="{ name: 'publicized-not-process-book', query: { disputeUid: this.disputeUid, type: 0, status: '6' } }">点击查看</router-link>
                </el-form-item>
                <el-form-item label="调解通知书:" class="w30" v-if="status === '6'">
                  <router-link tag="span" class="clic-view" :to="{ name: 'publicized-not-advice-note', query: { disputeUid: this.disputeUid, type: 1, status: '6' } }">点击查看</router-link>
                </el-form-item>
              </template>
              <template v-if="alone">
                <el-form-item label="调解过程书:" class="w30" v-if="status === '5'">
                  <router-link tag="span" class="clic-view" :to="{ name: 'performance-process-book', query: { disputeUid: this.disputeUid, type: 0, status: '5', alone: alone } }">点击查看</router-link>
                </el-form-item>
                <el-form-item label="调解过程书:" class="w30" v-if="status === '6'">
                  <router-link tag="span" class="clic-view" :to="{ name: 'performance-process-book', query: { disputeUid: this.disputeUid, type: 0, status: '6', alone: alone } }">点击查看</router-link>
                </el-form-item>
                <el-form-item label="调解通知书:" class="w30" v-if="status === '6'">
                  <router-link tag="span" class="clic-view" :to="{ name: 'performance-advice-note', query: { disputeUid: this.disputeUid, type: 1, status: '6', alone: alone } }">点击查看</router-link>
                </el-form-item>
              </template>
            </el-form>
          </template>
          <template v-if="!alone">
            <el-form-item class="w100" style="padding-top: 14px;margin-bottom: 0;text-align: center;" v-if="isYY && status === '0'">
              <el-button type="primary" size="small" @click="skipIsProtocol()">纠纷协议书</el-button>
              <el-button type="primary" size="small" @click="popWindUpCase()">结案</el-button>
              <el-button type="primary" size="small" @click="dialogQuickClosure = true;resetForm('ruleFormQuickClosure')">快速结案</el-button>
              <el-button type="primary" plain size="small" @click="dialogNewspapers = true;resetForm('ruleFormNewspapers')">上报医调委</el-button>
            </el-form-item>
            <el-form-item class="w100" style="padding-top: 14px;margin-bottom: 0;text-align: center;" v-if="!isYY && status === '3'">
              <el-button type="primary" size="small" :loading="loading" @click="acceptDispute(disputeUid)">受理</el-button>
            </el-form-item>
            <el-form-item class="w100" style="padding-top: 14px;margin-bottom: 0;text-align: center;" v-if="!isYY && status === '4'">
              <el-button type="primary" size="small" @click="skipIsAcceptanceSheet()">受理单</el-button>
              <el-button type="primary" size="small" @click="skipIsprocess()">调解过程书</el-button>
              <el-button type="primary" size="small" @click="popWindUpCaseTwo()">结案</el-button>
            </el-form-item>
            <el-form-item class="w100" style="padding-top: 14px;margin-bottom: 0;text-align: center;" v-if="!isYY && status === '5'">
              <el-button type="primary" size="small" @click="skipIsAdviceNote()">调解通知书</el-button>
              <el-button type="primary" size="small" @click="popPublicity()">公示</el-button>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>
    <div class="wind-up-case">
      <el-dialog
        :visible.sync="dialogWindUpCase"
        :close-on-click-modal="false"
        width="600px"
        top="20vh"
        title="结案"
        center>
        <div class="content">
          <div class="top">
            <div>
              <span class="left">
                <label>纠纷医院：</label><span>{{hospName}}</span>
              </span>
              <span class="right">
                <label>纠纷上报人：</label><span class="as-ellipsis" :title="reportName">{{reportName}}</span>
              </span>
            </div>
            <div>
              <span class="left">
                <label>纠纷科室：</label><span>{{deptName}}</span>
              </span>
              <span class="right" v-if="reportType === '1'">
                <label>纠纷对象：</label><span class="as-ellipsis" :title="reportName">{{disputeObject}}</span>
              </span>
            </div>
          </div>
          <div class="form" style="text-align: left;">
            <el-form :model="ruleFormWindUpCase" :rules="rulesWindUpCase" :show-message="false" ref="ruleFormWindUpCase" label-width="100px">
              <el-form-item label="处理时间:" prop="date" style="margin-bottom: 10px;" class="alone">
                <el-date-picker
                  v-model="ruleFormWindUpCase.date"
                  type="date"
                  size="small"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="纠纷类型:" prop="disputeType" style="margin-bottom: 10px;">
                <el-select v-model="ruleFormWindUpCase.disputeType" size="small" filterable placeholder="请选择">
                  <el-option
                    v-for="item in disputeTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="保险类别:" prop="insuranceType" style="margin-bottom: 10px;">
                <el-select v-model="ruleFormWindUpCase.insuranceType" size="small" filterable placeholder="请选择">
                  <el-option label="保内" value="0"></el-option>
                  <el-option label="保外" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="纠纷协议书:" :rules="[{required: true}]" style="margin-bottom: 0;padding-bottom: 10px;border-bottom: 1px solid rgba(232,232,232,1);">
                <span style="color:rgba(153,153,153,1);">(请上传已盖章的医疗纠纷协议书)</span><br/>
                <span style="position: relative;bottom: 15px;color:rgba(153,153,153,1);">{{appendixList.length}}/3张 仅支持JPEG、JPG、PNG图片文件，且大小不超过2M</span>
                <div is="uploadPic" :maxSize="3" :fileList="fileList" @uploadPicSubmit="uploadPicSubmit" @uploadPicDel="uploadPicDel" @uploadPicFileList="uploadPicFileList" @uploadPicBefore="uploadPicBefore" @uploadPicError="uploadPicError"></div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingBtn" @click="hospDispose('ruleFormWindUpCase', '2', ruleFormWindUpCase.date)">确 定</el-button>
          <el-button size="small" plain @click="dialogWindUpCase = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="quick-closure">
      <el-dialog
        :visible.sync="dialogQuickClosure"
        :close-on-click-modal="false"
        width="600px"
        top="20vh"
        title="快速结案"
        center>
        <div class="content">
          <div class="top">
            <div>
              <span class="left">
                <label>纠纷医院：</label><span>{{hospName}}</span>
              </span>
              <span class="right">
                <label>纠纷上报人：</label><span class="as-ellipsis" :title="reportName">{{reportName}}</span>
              </span>
            </div>
            <div>
              <span class="left">
                <label>纠纷科室：</label><span>{{deptName}}</span>
              </span>
              <span class="right" v-if="reportType === '1'">
                <label>纠纷对象：</label><span class="as-ellipsis" :title="disputeObject">{{disputeObject}}</span>
              </span>
            </div>
          </div>
          <div class="form" style="text-align: left;">
            <el-form :model="ruleFormQuickClosure" :show-message="false" :rules="rulesQuickClosure" ref="ruleFormQuickClosure" label-width="100px">
              <el-form-item label="处理时间:" prop="date">
                <el-date-picker
                  v-model="ruleFormQuickClosure.date"
                  type="date"
                  size="small"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="投诉原因:" prop="cause">
                <el-input
                  type="textarea"
                  :rows="4"
                  :maxlength="4000"
                  v-model="ruleFormQuickClosure.cause">
                </el-input>
              </el-form-item>
              <el-form-item label="处理结果:" prop="result" style="margin-bottom: 0;padding-bottom: 16px;border-bottom: 1px solid rgba(232,232,232,1);">
                <el-input
                  type="textarea"
                  :rows="4"
                  :maxlength="4000"
                  v-model="ruleFormQuickClosure.result">
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingBtn" @click="hospDispose('ruleFormQuickClosure', '1', ruleFormQuickClosure.date)">确 定</el-button>
          <el-button size="small" plain @click="dialogQuickClosure = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="newspapers">
      <el-dialog
        :visible.sync="dialogNewspapers"
        :close-on-click-modal="false"
        width="750px"
        top="20vh"
        title="上报医调委"
        center>
        <div class="content">
          <div class="top">
            <div>
              <span class="left">
                <label>纠纷医院：</label><span>{{hospName}}</span>
              </span>
              <span class="right">
                <label>纠纷上报人：</label><span class="as-ellipsis" :title="reportName">{{reportName}}</span>
              </span>
            </div>
            <div>
              <span class="left">
                <label>纠纷科室：</label><span>{{deptName}}</span>
              </span>
              <span class="right" v-if="reportType === '1'">
                <label>纠纷对象：</label><span class="as-ellipsis" :title="disputeObject">{{disputeObject}}</span>
              </span>
            </div>
          </div>
          <div class="form" style="text-align: left;">
            <el-form :model="ruleFormNewspapers" :show-message="false" :rules="rulesNewspapers" ref="ruleFormNewspapers" label-width="100px">
              <el-form-item class="one">
                <el-form-item label="纠纷类型:" prop="disputeType" style="margin-bottom: 10px;margin-right: 102px;">
                  <el-select v-model="ruleFormNewspapers.disputeType" size="small" filterable placeholder="请选择">
                    <el-option
                      v-for="item in disputeTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="保险类别:" prop="insuranceType" style="margin-bottom: 10px;">
                  <el-select v-model="ruleFormNewspapers.insuranceType" size="small" filterable placeholder="请选择">
                    <el-option label="保内" value="0"></el-option>
                    <el-option label="保外" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="纠纷事实:" prop="cause">
                <el-input
                  type="textarea"
                  :rows="4"
                  :maxlength="4000"
                  v-model="ruleFormNewspapers.cause">
                </el-input>
              </el-form-item>
              <el-form-item label="诊疗过程:" prop="process">
                <el-input
                  type="textarea"
                  :rows="4"
                  :maxlength="4000"
                  v-model="ruleFormNewspapers.process">
                </el-input>
              </el-form-item>
              <el-form-item class="one" style="margin-bottom: 0;padding-bottom: 16px;border-bottom: 1px solid rgba(232,232,232,1);">
                <el-form-item label="处理时间:" prop="handTime" style="margin-bottom: 10px;margin-right: 60px;">
                  <el-date-picker
                    v-model="ruleFormNewspapers.handTime"
                    type="date"
                    size="small"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="上报时间:" prop="ReportTime">
                  <el-date-picker
                    v-model="ruleFormNewspapers.ReportTime"
                    type="date"
                    size="small"
                    :disabled="true"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingBtn" @click="hospDispose('ruleFormNewspapers', '3', ruleFormNewspapers.handTime)">确 定</el-button>
          <el-button size="small" plain @click="dialogNewspapers = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogProtocol"
        :close-on-click-modal="false"
        width="290px"
        top="40vh"
        center>
        <p style="color: #333333;text-align: center;">请填写纠纷协议书</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="dialogProtocol = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      :visible.sync="dialogProtocol"
      :close-on-click-modal="false"
      width="290px"
      top="40vh"
      center>
      <p style="color: #333333;text-align: center;">请填写纠纷协议书</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogProtocol = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogProcess"
      :close-on-click-modal="false"
      width="290px"
      top="40vh"
      center>
      <p style="color: #333333;text-align: center;">请先填写调解过程书</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogProcess = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="wind-up-case-two">
      <el-dialog
        :visible.sync="dialogWindUpCaseTwo"
        :close-on-click-modal="false"
        width="750px"
        top="40vh"
        title="结案"
        center>
        <div class="content">
          <div class="top">
            <span>
              <label>纠纷医院：</label><span>{{hospName}}</span>
            </span>
            <span>
              <label>纠纷科室:</label><span class="as-ellipsis" title="卢宇飞">{{deptName}}</span>
            </span>
            <span>
              <label>纠纷上报人：</label><span class="as-ellipsis" title="卢宇飞">{{reportName}}</span>
            </span>
            <span class="right" v-if="reportType === '1'">
              <label>纠纷对象：</label><span class="as-ellipsis" :title="disputeObject">{{disputeObject}}</span>
            </span>
          </div>
          <div class="form" style="text-align: left;">
            <el-form :model="ruleFormWindUpCaseTwo" :rules="rulesWindUpCaseTwo" ref="ruleFormWindUpCaseTwo" label-width="100px">
              <el-form-item label="处理时间:" prop="date" style="margin-bottom: 10px;">
                <el-date-picker
                  v-model="ruleFormWindUpCaseTwo.date"
                  type="date"
                  size="small"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="调解方式:" prop="methods" style="margin-bottom: 10px;">
                <el-select v-model="ruleFormWindUpCaseTwo.methods" size="small" filterable placeholder="请选择">
                  <el-option label="调解结案" value="1"></el-option>
                  <el-option label="司法结案" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingBtn" @click="windUpCase('ruleFormWindUpCaseTwo')">确 定</el-button>
          <el-button size="small" plain @click="dialogWindUpCaseTwo = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      :visible.sync="dialogAccept"
      :close-on-click-modal="false"
      width="290px"
      top="40vh"
      center>
      <p style="color: #333333;text-align: center;">受理成功</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogAccept = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogAdviceNote"
      :close-on-click-modal="false"
      width="290px"
      top="40vh"
      center>
      <p style="color: #333333;text-align: center;">请先填写调解通知书</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogAdviceNote = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="publicity">
      <el-dialog
        :visible.sync="dialogPublicity"
        :close-on-click-modal="false"
        width="600px"
        top="40vh"
        title="公示"
        center>
        <div class="content">
          <div class="top">
            <span>
              <label>纠纷上报人：</label><span>{{reportName}}</span>
            </span>
            <span>
              <label>纠纷医院：</label><span class="as-ellipsis" title="卢宇飞">{{hospName}}</span>
            </span>
            <span>
              <label>纠纷科室：</label><span class="as-ellipsis" title="卢宇飞">{{deptName}}</span>
            </span>
          </div>
          <div class="form">
            <el-form :model="ruleFormPublicity" :rules="rulesPublicity" ref="ruleFormPublicity" label-width="100px">
              <el-form-item label="公示类型:" prop="publicityType" style="margin-bottom: 10px;">
                <el-radio-group v-model="ruleFormPublicity.publicityType">
                  <el-radio :label="0">医患双方公示</el-radio>
                  <el-radio :label="1">公开公示</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingBtn" @click="disputePublic()">确 定</el-button>
          <el-button size="small" plain @click="dialogPublicity = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import disputeCrumbs from '@/components/common/dispute-mediation/dispute-crumbs.vue';
import disputeSteps from '@/components/common/dispute-mediation/dispute-steps.vue';
import uploadPic from '@/components/common/dispute-mediation/uploadPic.vue';
export default {
  components: { disputeSteps, disputeCrumbs, uploadPic },
  props: ['disputeUid', 'status', 'alone', 'only'],
  data () {
    return {
      labelPosition: 'right',
      disputeDateil: {},
      reportName: '',
      reportTypeName: '',
      phone: '',
      hospName: '',
      deptName: '',
      disputeObject: '',
      targetPhone: '',
      disputeDesc: '',
      hospitalTime: '',
      disputeType: '',
      handleResult: '',
      reportType: '',
      cause: '',
      mediateType: '',
      createTime: null,
      hospHandleTime: null,
      insuranceType: null,
      disputeFact: null,
      medicalProcess: null,
      acceptTime: null,
      mediateHandleTime: null,
      publicityTime: null,
      protocolImgList: [],
      disputeCode: '',
      // 弹出框变量
      agreementUid: '',
      noticeBookUid: '',
      disputeTypeList: [
        {label: '医德医风', value: '0'},
        {label: '就医环境', value: '1'},
        {label: '不良事件', value: '2'},
        {label: '诊疗差错', value: '3'},
        {label: '其他', value: '9'}
      ],
      appendixList: [],
      dialogProtocol: false,
      dialogWindUpCase: false,
      dialogImageUrl: '',
      dialogImg: false,
      dialogQuickClosure: false,
      dialogNewspapers: false,
      ruleFormWindUpCase: {
        date: null,
        disputeType: null,
        insuranceType: null
      },
      ruleFormQuickClosure: {
        date: null,
        cause: null,
        result: null
      },
      ruleFormNewspapers: {
        disputeType: null,
        insuranceType: null,
        cause: null,
        process: null,
        handTime: null,
        ReportTime: new Date()
      },
      rulesWindUpCase: {
        date: [
          { required: true, trigger: 'blur' }
        ],
        disputeType: [
          { required: true, trigger: 'change' }
        ],
        insuranceType: [
          { required: true, trigger: 'change' }
        ]
      },
      rulesQuickClosure: {
        date: [
          { required: true, trigger: 'blur' }
        ],
        cause: [
          { required: true, trigger: 'blur' }
        ],
        result: [
          { required: true, trigger: 'blur' }
        ]
      },
      rulesNewspapers: {
        disputeType: [
          { required: true, trigger: 'change' }
        ],
        insuranceType: [
          { required: true, trigger: 'blur' }
        ],
        cause: [
          { required: true, trigger: 'blur' }
        ],
        process: [
          { required: true, trigger: 'blur' }
        ],
        handTime: [
          { required: true, trigger: 'blur' }
        ],
        ReportTime: [
          { required: true, trigger: 'blur' }
        ]
      },
      dialogAccept: false,
      dialogAdviceNote: false,
      publicity: false,
      ruleFormPublicity: {
        publicityType: 0
      },
      rulesPublicity: {
        publicityType: [
          { required: true, message: '请选择科室名称', trigger: 'change' }
        ]
      },
      dialogPublicity: false,
      mediateHandleUid: '',
      dialogWindUpCaseTwo: false,
      ruleFormWindUpCaseTwo: {
        date: null,
        methods: null
      },
      rulesWindUpCaseTwo: {
        date: [
          { required: true, message: '请选择科室名称', trigger: 'change' }
        ],
        methods: [
          { required: true, message: '请输入疾病名称', trigger: 'blur' }
        ]
      },
      dialogProcess: false,
      processBookUid: '',
      // isWJJ: false,
      // isYTW: false,
      isYY: false,
      loading: false,
      loadingBtn: false,
      fileList: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    // this.isWJJ = this.userInfo.roleNameList.some(item => item === '卫计局');
    // this.isYTW = this.userInfo.roleNameList.some(item => item === '医调委');
    this.isYY = this.userInfo.roleList.some(item => item.roleName === '医院');
  },
  watch: {
    disputeUid () {
      if (this.disputeUid) {
        this.getDisputeDetail();
      }
    }
  },
  methods: {
    skipIsProtocol () {
      this.$router.push({ name: 'hospital-in-hand-protocol', query: { disputeUid: this.disputeUid, status: this.status, agreementUid: this.agreementUid } });
    },
    skipIsProcessBook () {
      this.$router.push({ name: 'process-book' });
    },
    skipIsAcceptanceSheet () {
      this.$router.push({ name: 'acceptance-sheet', query: { disputeUid: this.disputeUid, status: '4' } });
    },
    skipIsprocess () {
      this.$router.push({ name: 'in-hand-process-book', query: { disputeUid: this.disputeUid, status: '4', type: 0, processBookUid: this.processBookUid, deptName: this.deptName, disputeObject: this.disputeObject, reportType: this.reportType } });
    },
    skipIsAdviceNote () {
      this.$router.push({ name: 'processed-not-advice-note', query: { disputeUid: this.disputeUid, status: '5', type: 1, noticeBookUid: this.noticeBookUid, deptName: this.deptName } });
    },
    // 获取纠纷详情
    getDisputeDetail () {
      this.axios.get('/hisServices/dispute/' + this.disputeUid)
        .then(res => {
          if (res) {
            console.log(res);
            this.disputeDateil = res.data;
            this.reportName = this.disputeDateil.reportName;
            this.reportTypeName = this.disputeDateil.reportType === '1' ? '医务人员' : '患者';
            this.phone = this.disputeDateil.reportTelephone;
            this.hospName = this.disputeDateil.hospName;
            this.deptName = this.disputeDateil.deptName;
            this.disputeObject = this.disputeDateil.disputeObject;
            this.targetPhone = this.disputeDateil.disputeTelephone;
            this.disputeDesc = this.disputeDateil.disputeDesc;
            this.reportType = this.disputeDateil.reportType;
            this.createTime = this.disputeDateil.createTime;
            this.hospHandleTime = this.moment(this.disputeDateil.handleTime).format('YYYY-MM-DD');
            this.acceptTime = this.disputeDateil.acceptTime;
            this.mediateHandleTime = this.moment(this.disputeDateil.mediateHandleTime).format('YYYY-MM-DD');
            this.publicityTime = this.disputeDateil.publicityTime;
            this.handleResult = this.disputeDateil.handleResult;
            this.cause = this.disputeDateil.handleCause;
            this.disputeFact = this.disputeDateil.disputeFact;
            this.medicalProcess = this.disputeDateil.medicalProcess;
            this.mediateType = this.disputeDateil.mediateType === '1' ? '调解结案' : '司法结案';
            this.insuranceType = this.disputeDateil.insuranceType === '0' ? '保内' : '保外';
            this.disputeType = this.disputeDateil.disputeType === '0' ? '医德医风' : this.disputeDateil.disputeType === '1' ? '就医环境' : this.disputeDateil.disputeType === '2' ? '不良事件' : '诊疗差错';
            this.disputeCode = this.disputeDateil.disputeCode;
            this.agreementUid = this.disputeDateil.agreementUid;
            this.noticeBookUid = this.disputeDateil.noticeBookUid;
            this.mediateHandleUid = this.disputeDateil.mediateHandleUid;
            this.processBookUid = this.disputeDateil.processBookUid;
            if (this.status === '2') {
              this.previewPictures();
            }
          }
        })
    },
    // 预览图片
    previewPictures () {
      setTimeout(() => {
        let imgs = this.disputeDateil.appendixList.map(value => value.fileFullPath);
        // 图片数组2
        let imgs2 = []
        // 获取图片列表容器
        let $el = document.getElementById('imgs');
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
        let ziv = new ZxImageView(this._config, imgs2);
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
      }, 50)
    },
    popWindUpCase () {
      if (this.agreementUid === null) {
        this.dialogProtocol = true;
      } else {
        this.dialogWindUpCase = true;
        this.appendixList = [];
        this.fileList = [];
        this.resetForm('ruleFormWindUpCase');
      }
    },
    // 结案、快速结案、上报医调委
    hospDispose (formName, status, date) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            uid: this.disputeUid,
            handleUser: this.userInfo.uid,
            handleDate: this.moment(date).format('YYYY-MM-DD'),
            status: status,
            disputeType: status === '2' ? this.ruleFormWindUpCase.disputeType : status === '3' ? this.ruleFormNewspapers.disputeType : null,
            insuranceType: status === '2' ? this.ruleFormWindUpCase.insuranceType : status === '3' ? this.ruleFormNewspapers.insuranceType : null,
            appendixList: status === '2' ? this.appendixList : null,
            handleCause: status === '1' ? this.ruleFormQuickClosure.cause : null,
            handleResult: status === '1' ? this.ruleFormQuickClosure.result : null,
            disputeFact: status === '3' ? this.ruleFormNewspapers.cause : null,
            medicalProcess: status === '3' ? this.ruleFormNewspapers.process : null,
            reportDate: status === '3' ? this.moment(this.ReportTime).format('YYYY-MM-DD') : null
          }
          if (status === '2' && this.appendixList && this.appendixList.length <= 0) {
            this.$message.error('必须上传纠纷协议书');
            return false;
          }
          this.loadingBtn = true;
          this.axios.put('/hisServices/dispute/hospDispose', params)
            .then(res => {
              if (res) {
                if (status === '1') {
                  this.dialogQuickClosure = false;
                  this.$message.success('快速结案成功！');
                } else if (status === '2') {
                  this.dialogWindUpCase = false;
                  this.$message.success('结案成功！');
                } else {
                  this.dialogNewspapers = false;
                  this.$message.success('上报医调委成功！');
                }
                this.$router.push({ name: 'hospital-in-hand-list' });
              }
              this.loadingBtn = false;
            })
            .catch(() => {
              this.loadingBtn = false;
            })
        } else {
          return false;
        }
      });
    },
    // 接收到上传之前的情况
    uploadPicBefore (params) {
      if (params) {
        this.loadingBtn = true;
      }
    },
    // 接收到的上传错误情况
    uploadPicError (params) {
      this.loadingBtn = false;
    },
    // 多张上传，全部上传完的情况
    uploadPicFileList (picList) {
      if (this.appendixList.length === picList.length) {
        this.loadingBtn = false;
      }
    },
    // 接收到上传组件传过来的图片数据
    uploadPicSubmit (aUploadImg) {
      if (aUploadImg) {
        if (aUploadImg.response && aUploadImg.response.data) {
          let oRes = aUploadImg.response.data;
          let aImg = {
            cname: oRes.fileName, // 附件名称
            imgHeight: oRes.fileHeight, // 图片高存储的单位位px
            imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
            imgWidth: oRes.fileWidth, // 图片宽存储的单位位px ,
            thumbnailFullPath: oRes.thumbnailFileFullPath, // 缩略图全路径
            fileFullPath: oRes.fileFullPath, // 附件全路径
            fileType: '1'
          };
          this.appendixList.push(aImg);
          console.log(this.appendixList)
        }
      }
    },
    uploadPicDel (aUploadImg) {
      this.appendixList = aUploadImg.map(item => {
        return {
          cname: item.response.data.fileName, // 附件名称
          imgHeight: item.response.data.fileHeight, // 图片高存储的单位位px
          imgSize: item.response.data.fileSize, // 图片大小存储的单位位byte ,
          imgWidth: item.response.data.fileWidth, // 图片宽存储的单位位px ,
          thumbnailFullPath: item.response.data.thumbnailFileFullPath, // 缩略图全路径
          fileFullPath: item.response.data.fileFullPath, // 附件全路径
          fileType: '1'
        }
      });
    },
    // 受理纠纷
    acceptDispute (disputeUid) {
      let params = {
        uid: disputeUid,
        operUserUid: this.userInfo.uid
      }
      this.loading = true;
      this.axios.put('/hisServices/dispute/mediate', params)
        .then(res => {
          if (res) {
            this.dialogAccept = true;
            this.$router.push({ name: 'not-accepted-list' });
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        })
    },
    popPublicity () {
      if (this.noticeBookUid === null) {
        this.dialogAdviceNote = true;
      } else {
        this.dialogPublicity = true;
        this.resetForm('ruleFormPublicity');
      }
    },
    // 纠纷公示
    disputePublic () {
      let params = {
        uid: this.disputeUid,
        operUserUid: this.userInfo.uid,
        publicityType: this.ruleFormPublicity.publicityType
      }
      this.loadingBtn = true;
      this.axios.post('/hisServices/dispute/public', params)
        .then(res => {
          if (res) {
            this.dialogPublicity = false;
            this.$message.success('公示成功！');
            this.$router.push({ name: 'hospital-not-processed-list' });
          }
          this.loadingBtn = false;
        })
        .catch(() => {
          this.loadingBtn = false;
        })
    },
    popWindUpCaseTwo () {
      if (this.processBookUid === null) {
        this.dialogProcess = true;
      } else {
        this.dialogWindUpCaseTwo = true;
        this.resetForm('ruleFormWindUpCaseTwo');
      }
    },
    // 医调委结案
    windUpCase (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            disposeUid: this.disputeUid,
            uid: this.mediateHandleUid,
            finishUserUid: this.userInfo.uid,
            handleDate: this.moment(this.ruleFormWindUpCaseTwo.date).format('YYYY-MM-DD'),
            mediateType: this.ruleFormWindUpCaseTwo.methods
          }
          this.loadingBtn = true;
          this.axios.put('/hisServices/dispute/finish', params)
            .then(res => {
              if (res) {
                this.$message.success('结案成功！');
                this.dialogWindUpCaseTwo = false;
                this.$router.push({ name: 'hospital-not-in-hand-list' });
              }
              this.loadingBtn = false;
            })
            .catch(() => {
              this.loadingBtn = false;
            })
        } else {
          return false;
        }
      })
    },
    resetForm (formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    }
  }
}
</script>
<style lang="less">
  .dispute-detail{
    width: 100%;
    .content{
      p.name{
        display: flex;
        position: relative;
        justify-content: space-between;
        border-bottom: 2px solid #E8E8E8;
        font-weight: bold;
        font-size: 14px;
        span:nth-child(1){
          padding: 16px 0 16px;
          color: #1890FF;
        }
        span:nth-child(3){
          padding: 16px 2px;
          color: #4A4A4A;
        }
        span:nth-child(2){
          width: 96px;
          height: 2px;
          background: #1890FF;
          position: absolute;
          bottom: -2px;
          left: 0;
        }
      }
      .form-one{
        padding-top: 20px;
        width: 100%;
        >.el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            padding-right: 40px;
            margin-bottom: 10px;
            .el-form-item__label{
              color: rgba(0,0,0,0.85);
            }
            .el-input__inner{
              color: #4A4A4A;
            }
            .el-textarea textarea{
              color: #4a4a4a !important;
            }
          }
          .book{
            width: 100%;
            display: flex;

          }
          .clic-view{
            color: rgb(8, 133, 250);
            text-decoration: underline;
            cursor: pointer;
            &:hover{
              color: rgba(8, 133, 250, 0.877);
            }
          }
        }
      }
    }
    .wind-up-case .content, .quick-closure .content, .newspapers .content{
      .top{
        width: 100%;
        padding: 15px;
        margin-bottom: 10px;
        background:rgba(250,250,250,1);
        > div:nth-child(1){
          padding-bottom: 15px;
        }
        > div{
          display: flex;
          justify-content: space-between;
          .left{
            label{
              color:rgba(153,153,153,1);
            }
            span{
              color:rgba(153,153,153,1);
            }
          }
          .right{
            label{
              color:rgba(153,153,153,1);
            }
            span{
              vertical-align: bottom;
              color:rgba(153,153,153,1);
            }
          }
        }
      }
      .el-upload{
        width: 100px;
        height: 100px;
        line-height: 100px;
      }
      .el-upload-list--picture-card .el-upload-list__item{
        width: 100px;
        height: 100px;
        line-height: 100px;
      }
      .alone .el-input__inner{
        width: 200px !important;
      }
    }
    .newspapers .content{
      .form .one{
        margin-bottom: 8px;
        .el-form-item__content{
          display: flex;
          flex-wrap: wrap;
          margin-left: 0 !important;
        }
      }
    }
    .publicity{
      .content{
        .top{
          width: 100%;
          padding: 0 16px;
          line-height: 46px;
          display: flex;
          justify-content: space-between;
          background:rgba(250,250,250,1);
        }
        .form{
          padding-left: 110px;
          border-bottom: 1px solid rgba(232,232,232,1);
          .el-form{
            display: flex;
            justify-content: space-between;
            margin-top: 14px;
          }
        }
      }
    }
    .wind-up-case-two{
      .content{
        .top{
          width: 100%;
          padding: 0 16px;
          line-height: 46px;
          display: flex;
          justify-content: space-between;
          background:rgba(250,250,250,1);
        }
        .form{
          border-bottom: 1px solid rgba(232,232,232,1);
          .el-form{
            display: flex;
            justify-content: space-between;
            margin-top: 14px;
          }
        }
      }
    }
    .el-dialog__wrapper .el-dialog__body{
      padding: 25px 25px 10px;
    }
  }
</style>
