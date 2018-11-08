<template>
  <div class="hc-guide">
    <h1><i class="icon iconfont">&#xe66b;</i><span>指导申请审核</span></h1>
    <div class="tabs" :style="{width: nabs.length * 120 + 'px'}">
      <div v-for="(item, index) in nabs" :key="index" :class="{ active: index === type, 'not-border': index === nabs.length - 1 }" @click="getGuideTeamList(index)">{{item}}<i></i></div>
    </div>
    <div class="line"></div>
    <el-form label-width="90px" :inline="true">
      <el-form-item label="团队负责人:">
        <el-select v-model="teamId" size="small" filterable placeholder="请选择">
          <el-option label="全部负责人" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in teamDropdownList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" icon="el-icon-search" @click="getGuideTeamList(type, 1)">搜索</el-button>
      </el-form-item>
    </el-form>
    <div>
      <div class="table" v-show="type === 0">
        <el-table
          v-loading="loading"
          :data="guideTeamList.list"
          stripe>
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="审核类别">
            <template slot-scope="scope">
              {{scope.row.applyType === '1' ? '申请审核' : scope.row.applyType === '2' ? '续签审核' : scope.row.applyType === '3' ? '结束审核' : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="leaderDoctor.docName"
            :show-overflow-tooltip="true"
            label="团队负责人">
          </el-table-column>
          <el-table-column
            prop="leaderDoctor.deptName"
            :show-overflow-tooltip="true"
            label="所在科室">
          </el-table-column>
          <el-table-column
            prop="guideDoctor.hospName"
            :show-overflow-tooltip="true"
            label="指导医院">
          </el-table-column>
          <el-table-column
            prop="guideDoctor.docName"
            :show-overflow-tooltip="true"
            label="指导医生">
          </el-table-column>
          <el-table-column
            prop="guideYear"
            label="指导年度">
          </el-table-column>
          <el-table-column
            label="申请时间">
            <template slot-scope="scope">
              {{scope.row.applyTime | moment('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="operate" @click="popPutDialog(scope.row)">审核</span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="table" v-show="type === 1">
        <el-table
          v-loading="loading"
          :data="guideTeamList.list"
          stripe>
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="审核类别">
            <template slot-scope="scope">
              {{scope.row.applyType === '1' ? '申请审核' : scope.row.applyType === '2' ? '续签审核' : scope.row.applyType === '3' ? '结束审核' : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="leaderDoctor.docName"
            :show-overflow-tooltip="true"
            label="团队负责人">
          </el-table-column>
          <el-table-column
            prop="leaderDoctor.deptName"
            :show-overflow-tooltip="true"
            label="所在科室">
          </el-table-column>
          <el-table-column
            prop="guideDoctor.hospName"
            :show-overflow-tooltip="true"
            label="指导医院">
          </el-table-column>
          <el-table-column
            prop="guideDoctor.docName"
            :show-overflow-tooltip="true"
            label="指导医生">
          </el-table-column>
          <el-table-column
            prop="guideYear"
            label="指导年度">
          </el-table-column>
          <el-table-column
            label="审核时间">
            <template slot-scope="scope">
              {{scope.row.reviewTime | moment('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="operate" @click="getGuideTeamDetail(scope.row)">申请详情</span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="table" v-show="type === 2">
        <el-table
          v-loading="loading"
          :data="guideTeamList.list"
          stripe>
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="审核类别">
            <template slot-scope="scope">
              {{scope.row.applyType === '1' ? '申请审核' : scope.row.applyType === '2' ? '续签审核' : scope.row.applyType === '3' ? '结束审核' : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="leaderDoctor.docName"
            :show-overflow-tooltip="true"
            label="团队负责人">
          </el-table-column>
          <el-table-column
            prop="leaderDoctor.deptName"
            :show-overflow-tooltip="true"
            label="所在科室">
          </el-table-column>
          <el-table-column
            prop="guideDoctor.hospName"
            :show-overflow-tooltip="true"
            label="指导医院">
          </el-table-column>
          <el-table-column
            prop="guideDoctor.docName"
            :show-overflow-tooltip="true"
            label="指导医生">
          </el-table-column>
          <el-table-column
            prop="guideYear"
            label="指导年度">
          </el-table-column>
          <el-table-column
            label="审核时间">
            <template slot-scope="scope">
              {{scope.row.reviewTime | moment('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            :show-overflow-tooltip="true"
            label="不通过原因">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="operate" @click="getGuideTeamDetail(scope.row)">申请详情</span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
    </div>
    <div class="pagination-box" v-if="guideTeamList.list && guideTeamList.list.length > 0">
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="guideTeamList.total">
      </el-pagination>
    </div>
    <div class="examine">
      <el-dialog
        :visible.sync="dialogExamine"
        :close-on-click-modal="false"
        :title="teamGuideInfo && teamGuideInfo.operationType === '0' ? '指导申请审核' : teamGuideInfo && teamGuideInfo.operationType === '1' ? '续签申请审核' : teamGuideInfo && teamGuideInfo.operationType === '2' ? '结束申请审核' : ''"
        width="750px"
        top="30vh"
        center>
        <div class="info">
          <h1 style="margin-left: -9px;">【提交信息】</h1>
          <div><span>团队负责人：{{teamGuideInfo && teamGuideInfo.leaderDoctor.docName}}▪{{teamGuideInfo && teamGuideInfo.leaderDoctor.deptName}}</span></div>
          <p style="margin-top: 5px;">
            <span>指导医生：{{teamGuideInfo && teamGuideInfo.guideDoctor.docName}}▪{{teamGuideInfo && teamGuideInfo.guideDoctor.hospName}}▪{{teamGuideInfo && teamGuideInfo.guideDoctor.deptName}}</span>
            <span>指导年度：{{teamGuideInfo && teamGuideInfo.guideYear}}</span>
          </p>
          <div v-if="teamGuideInfo && teamGuideInfo.operationType !== '2'"><div style="width: 7%;">备注：</div><div style="width: 93%;">{{teamGuideInfo && teamGuideInfo.description}}</div></div>
          <div v-if="teamGuideInfo && teamGuideInfo.operationType === '2'"><div style="width: 11%;">结束原因：</div><div style="width: 89%;">{{teamGuideInfo && teamGuideInfo.endGuideReason}}</div></div>
        </div>
        <el-radio-group v-model="passValue" style="margin-top: 10px;padding-left: 20px;text-align: left;">
          <el-radio :label="'1'" @click.native="notPass = null">通过</el-radio>
          <el-radio :label="'2'" class="not-pass">
            不通过
            <el-input
              style="width: 596px;margin-left: 10px;"
              size="small"
              :disabled="passValue !== '2'"
              placeholder="请填写不通过原因"
              :maxlength="1000"
              v-model="notPass">
            </el-input>
          </el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingBtn" @click="putTeamGuide()">确 定</el-button>
          <el-button size="small" @click="dialogExamine = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dtl">
      <el-dialog
        :visible.sync="dialogDtl"
        :close-on-click-modal="false"
        :title="teamGuideInfo && teamGuideInfo.operationType === '0' ? '指导申请详情' : teamGuideInfo && teamGuideInfo.operationType === '1' ? '续签申请详情' : teamGuideInfo && teamGuideInfo.operationType === '2' ? '结束申请详情' : ''"
        width="750px"
        top="30vh"
        center>
        <div class="info">
          <h1 style="margin-left: -9px;">【提交信息】</h1>
          <div><span>团队负责人：{{teamGuideInfo && teamGuideInfo.leaderDoctor.docName}}▪{{teamGuideInfo && teamGuideInfo.leaderDoctor.deptName}}</span></div>
          <p style="margin-top: 5px;">
            <span>指导医生：{{teamGuideInfo && teamGuideInfo.guideDoctor.docName}}▪{{teamGuideInfo && teamGuideInfo.guideDoctor.hospName}}▪{{teamGuideInfo && teamGuideInfo.guideDoctor.deptName}}</span>
            <span>指导年度：{{teamGuideInfo && teamGuideInfo.guideYear}}</span>
          </p>
          <div v-if="teamGuideInfo && teamGuideInfo.operationType !== '2'"><div style="width: 7%;">备注：</div><div style="width: 93%;">{{teamGuideInfo && teamGuideInfo.description}}</div></div>
          <div v-if="teamGuideInfo && teamGuideInfo.operationType === '2'"><div style="width: 11%;">结束原因：</div><div style="width: 89%;">{{teamGuideInfo && teamGuideInfo.endGuideReason}}</div></div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogDtl = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {checkPhone, checkName} from '@/utils/validator.js';
export default {
  data () {
    return {
      type: 0,
      nabs: ['卫生院审核中', '医生审核中', '审核不通过'],
      teamId: '',
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      guideTeamList: [],
      dialogExamine: false,
      dialogDtl: false,
      passValue: '',
      notPass: '',
      teamDropdownList: [],
      teamGuideInfo: null,
      loading: false,
      loadingBtn: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    this.getDiseaseTeamList();
    this.getGuideTeamList(0);
  },
  methods: {
    // 分页查询慢病团队负责人下拉列表
    getDiseaseTeamList () {
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          townshipHospUid: this.userInfo.organInfoList[0].uid
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      console.log(222, jsonStr);
      this.axios.get('/hisServices/chronic/teams/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.teamDropdownList = res.data.list.map(item => {
              return {
                label: item.leaderName,
                value: item.uid
              }
            })
          }
        })
    },
    // 分页查询慢病团队指导
    getGuideTeamList (index, search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      if (this.type !== index) {
        this.pageNum = 1;
        this.currentPage = 1;
        this.teamId = '';
      }
      this.type = index;
      let jsonStr = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        where: {
          townshipHospUid: this.userInfo.organInfoList[0].uid,
          teamUid: this.teamId
        }
      }
      if (index === 0) {
        jsonStr.where.reviewType = '1';
        jsonStr.where.status = '0';
      } else if (index === 1) {
        jsonStr.where.reviewType = '2';
        jsonStr.where.status = '0';
      } else {
        jsonStr.where.status = '2';
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/chronic/teamGuides/' + jsonStr)
        .then(res => {
          if (res) {
            this.guideTeamList = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    popPutDialog (info) {
      this.teamGuideInfo = info;
      this.dialogExamine = true;
      this.passValue = '';
      this.notPass = '';
    },
    // 更新团队指导
    putTeamGuide () {
      let params = {
        uid: this.teamGuideInfo.uid,
        status: this.passValue,
        reason: this.notPass
      }
      if (this.passValue === '') {
        this.$message.error('请选择审核结果！');
        return false;
      }
      let value = this.Trim(this.notPass, 'g');
      if (this.passValue === '2' && !this.notPass && value.length === 0) {
        this.$message.error('请填写不通过原因！');
        return false;
      }
      this.loadingBtn = true;
      this.axios.put('/hisServices/chronic/teamGuide', params)
        .then(res => {
          if (res) {
            console.log(res);
            this.dialogExamine = false;
            this.$message.success('审核操作成功！');
            this.getGuideTeamList(this.type);
            this.passValue = '';
            this.notPass = '';
          }
        })
        .finally(() => {
          this.loadingBtn = false;
        })
    },
    // 查询慢病指导团队
    getGuideTeamDetail (info) {
      this.teamGuideInfo = info;
      this.dialogDtl = true;
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getGuideTeamList(this.type);
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getGuideTeamList(this.type);
    }
  }
}
</script>
<style lang="less" scoped>
  .hc-guide{
    h1{
      i{
        font-size: 18px;
        vertical-align: bottom;
      }
      span{
        margin-left: 10px;
        color: #333333;
        font-weight: bold;
      }
    }
    .line{
      width: 100%;
      height: 1px;
      background:rgba(232,232,232,1);
      margin: 16px 0;
    }
    .examine, .dtl{
      p:nth-child(1){
        padding-bottom: 30px;
        text-align: center;
        color: #333333;
      }
      .info{
        width: 100%;
        padding: 10px 20px;
        line-height: 28px;
        background: #FAFAFA;
        h1{
          color: #333333;
        }
        > div{
          display: flex;
          word-wrap: break-word;
          line-height: 26px;
          margin-top: 5px;
        }
        > div span, div{
          color: #999999;
        }
        p{
          display: flex;
          justify-content: space-between;
          span{
            color: #999999;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .hc-guide{
    .not-pass{
      display: block;
      margin-left: 0 !important;
      margin-top: 10px;
      .el-radio__label{
        padding-left: 5px;
      }
    }
    .el-dialog__wrapper .el-dialog__body{
      padding: 14px 30px 10px 26px;
    }
  }
</style>
