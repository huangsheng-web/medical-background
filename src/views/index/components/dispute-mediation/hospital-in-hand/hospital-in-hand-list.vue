<template>
  <div class="in-hand">
    <div class="title">
      <i class="icon iconfont">&#xe67d;</i>
      <span>处理中</span>
    </div>
    <div class="tabs" style="width: 240px;">
      <div :class="{ active:status === '0' }" @click="getDisputeList('0')">医院处理<i></i></div>
      <div :class="{ active:status === '3' }" @click="getDisputeList('3')" class="not-border">上报医调委<i></i></div>
    </div>
    <div class="line"></div>
    <div class="report-person">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="上报人:">
          <el-input size="small" v-model="reportName" @keyup.prevent.enter.native="getDisputeList(status, 1)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" size="small" @click="getDisputeList(status, 1)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="disputeList.list"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod">
        </el-table-column>
        <el-table-column
          prop="disputeCode"
          label="纠纷编号"
          v-if="status === '3'">
        </el-table-column>
        <el-table-column
          prop="disputeType"
          label="纠纷类型"
          :formatter="formatterOne"
          v-if="status === '3'">
        </el-table-column>
        <el-table-column
          prop="reportName"
          label="上报人"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="reportType"
          label="上报人类型"
          :formatter="formatterTwo">
        </el-table-column>
        <el-table-column
          prop="reportTelephone"
          label="上报人联系电话"
          width="120"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="纠纷科室"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="disputeObject"
          label="纠纷对象"
          :formatter="formatterFive"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="上报时间"
          :formatter="formatterThree">
        </el-table-column>
        <el-table-column
          label="受理时间"
          prop="acceptTime"
          :formatter="formatterFour" v-if="status === '3'">
        </el-table-column>
        <el-table-column
          label="操作"
          :width="status === '0' ? 410 : 150">
          <template slot-scope="scope" class="operate">
            <template v-if="status === '0'">
              <router-link tag="span" :to="{ name: 'hospital-in-hand-detail', query: { disputeUid: scope.row.uid, status: scope.row.status } }">纠纷详情</router-link>
              <strong>|</strong>
              <router-link tag="span" :to="{ name: 'hospital-in-hand-protocol', query: { disputeUid: scope.row.uid, status: scope.row.status, agreementUid: scope.row.agreementUid, createTime: scope.row.createTime } }">纠纷协议书</router-link>
              <strong>|</strong>
              <span v-if="scope.row.agreementUid" @click="popDialog(scope.row.uid, scope.row.createTime, scope.row.hospName, scope.row.deptName, scope.row.reportName, scope.row.disputeObject, 1, scope.row.agreementUid, scope.row.reportType )">结案</span>
              <el-tooltip v-else class="item" effect="dark" content="请先填写纠纷协议书" placement="top">
                <span style="color: #999;" v-if="!scope.row.canDelete">结案</span>
              </el-tooltip>
              <strong>|</strong>
              <span @click="popDialog(scope.row.uid, scope.row.createTime, scope.row.hospName, scope.row.deptName, scope.row.reportName, scope.row.disputeObject, 2, scope.row.agreementUid, scope.row.reportType )">上报医调委</span>
              <strong>|</strong>
              <span @click="popDialog(scope.row.uid, scope.row.createTime, scope.row.hospName, scope.row.deptName, scope.row.reportName, scope.row.disputeObject, 3, scope.row.agreementUid, scope.row.reportType )">快速结案</span>
            </template>
            <template v-if="status === '3'">
              <router-link tag="span" :to="{ name: 'hospital-in-hand-detail', query: { disputeUid: scope.row.uid, status: scope.row.status } }">纠纷详情</router-link>
              <strong>|</strong>
              <router-link tag="span" :to="{ name: 'hospital-in-hand-requisition', query: { disputeUid: scope.row.uid, status: scope.row.status, applyBookUid: scope.row.applyBookUid } }">申请书</router-link>
            </template>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
    </div>
    <div class="pagination-box" v-if="disputeList.list && disputeList.list.length > 0">
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="disputeList.total">
      </el-pagination>
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
                <label>纠纷上报人：</label><span class="as-ellipsis" :title="reportRen">{{reportRen}}</span>
              </span>
            </div>
            <div>
              <span class="left">
                <label>纠纷科室：</label><span>{{deptName}}</span>
              </span>
              <span class="right" v-if="reportType === '1'">
                <label>纠纷对象：</label><span class="as-ellipsis" :title="reportRen">{{disputeObject}}</span>
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
                <label>纠纷上报人：</label><span class="as-ellipsis" :title="reportRen">{{reportRen}}</span>
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
                <label>纠纷上报人：</label><span class="as-ellipsis" :title="reportRen">{{reportRen}}</span>
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
    </div>
  </div>
</template>
<script>
import uploadPic from '@/components/common/dispute-mediation/uploadPic.vue';
export default {
  components: { uploadPic },
  data () {
    return {
      disputeUid: '',
      createTime: '',
      status: '0',
      reportName: '',
      reportRen: '',
      hospName: '',
      deptName: '',
      disputeObject: '',
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      disputeList: [],
      disputeTypeList: [
        {label: '医德医风', value: '0'},
        {label: '就医环境', value: '1'},
        {label: '不良事件', value: '2'},
        {label: '诊疗差错', value: '3'},
        {label: '其他', value: '9'}
      ],
      reportType: '',
      appendixList: [],
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
    this.getDisputeList('0', 1);
  },
  methods: {
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getDisputeList(this.status);
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getDisputeList(this.status);
    },
    formatterOne (row, column) {
      return row.disputeType === '0'
        ? '医德医风'
        : row.disputeType === '1'
          ? '就医环境'
          : row.disputeType === '2'
            ? '不良事件'
            : '诊疗差错'
    },
    formatterTwo (row, column) {
      return row.reportType === '1' ? '医务人员' : '患者';
    },
    formatterThree (row, column) {
      if (this.status === '0') {
        return row.createTime && this.moment(row.createTime).format('YYYY-MM-DD');
      } else if (this.status === '3') {
        return row.reportTime && this.moment(row.reportTime).format('YYYY-MM-DD');
      }
    },
    formatterFour (row, column) {
      return row.acceptTime !== null ? (row.acceptTime && this.moment(row.acceptTime).format('YYYY-MM-DD')) : '--';
    },
    formatterFive (row, column) {
      if (row.reportType === '2') {
        return '--';
      } else {
        return row.disputeObject;
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogImg = true;
    },
    // 查询纠纷列表
    getDisputeList (status, search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      if (this.status !== status) {
        this.pageNum = 1;
        this.currentPage = 1;
        this.pageSize = 10;
        this.reportName = null;
      }
      this.status = status;
      let jsonStr = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        where: {
          channel: '1',
          status: this.status,
          reportName: this.reportName,
          hospUid: this.userInfo.organInfoList[0].uid
        }
      }
      if (this.status === '0') {
        jsonStr.where.order = '0';
      } else {
        jsonStr.where.order = '2';
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/dispute/disputeList/background/' + jsonStr)
        .then(res => {
          if (res) {
            this.disputeList = res.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        })
    },
    resetForm (formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    // 弹出结案框
    popDialog (uid, createTime, hospName, deptName, reportName, disputeObject, type, agreementUid, reportType) {
      if (type === 1) {
        if (agreementUid === null) {
          return false;
        } else {
          this.dialogWindUpCase = true;
          this.appendixList = [];
          this.fileList = [];
          this.resetForm('ruleFormWindUpCase');
        }
      } else if (type === 2) {
        this.dialogNewspapers = true;
        this.resetForm('ruleFormNewspapers');
      } else {
        this.dialogQuickClosure = true;
        this.resetForm('ruleFormQuickClosure');
      }
      this.disputeUid = uid;
      this.createTime = createTime;
      this.hospName = hospName;
      this.deptName = deptName;
      this.reportRen = reportName;
      this.disputeObject = disputeObject;
      this.reportType = reportType;
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
                this.getDisputeList(this.status);
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
          this.appendixList.push(aImg)
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
    }
  }
}
</script>
<style lang="less">
  .in-hand{
    .title i{
      margin-right: 10px;
    }
    .title span{
      color:rgba(51,51,51,1);
      font-weight: bold;
    }
    .line{
      width: 100%;
      height: 1px;
      background:rgba(232,232,232,1);
      margin: 16px 0;
    }
    .report-person{
      .el-form-item{
        margin-right: 25px;
      }
      .el-form-item__label{
        color: #000;
      }
    }
    .table .el-table .cell{
      strong{
        margin-left: 4px;
        color: #E9E9E9;
      }
      span{
        cursor: pointer;
        margin-left: 4px;
        color: #1890FF;
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
    .el-dialog__wrapper .el-dialog__body{
      padding: 25px 25px 10px;
    }
  }
</style>
