<template>
  <div class="seb-guide">
    <h1><i class="icon iconfont">&#xe627;</i><span>指导医生结束指导审核</span></h1>
    <div class="tabs" :style="{width: nabs.length * 120 + 'px'}">
      <div v-for="(item, index) in nabs" :key="index" :class="{ active: index === type, 'not-border': index === nabs.length - 1 }" @click="getGuideTeamList(index)">{{item}}<i></i></div>
    </div>
    <div class="line"></div>
    <el-form label-width="80px" :inline="true">
      <el-form-item label="团队名称:">
        <el-select v-model="teamId" size="small" filterable placeholder="请选择">
          <el-option label="全部团队" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in teamDropdownList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指导医生:">
        <el-select v-model="doctorId" size="small" filterable placeholder="请选择">
          <el-option label="全部医生" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in guideDoctorDropdownList" :key="item.id"></el-option>
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
            prop="team.teamName"
            :show-overflow-tooltip="true"
            label="团队名称">
          </el-table-column>
          <el-table-column
            prop="leaderDoctor.hospName"
            :show-overflow-tooltip="true"
            label="乡镇卫生院">
          </el-table-column>
          <el-table-column hospName
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
            label="申请结束时间">
            <template slot-scope="scope">
              {{scope.row.applyTime | moment('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="operate" @click="popTeamGuideDialog(scope.row)">审核</span>
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
            prop="team.teamName"
            :show-overflow-tooltip="true"
            label="团队名称">
          </el-table-column>
          <el-table-column
            prop="leaderDoctor.hospName"
            :show-overflow-tooltip="true"
            label="乡镇卫生院">
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
            prop="endGuideReason"
            :show-overflow-tooltip="true"
            label="结束原因">
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
            prop="team.teamName"
            :show-overflow-tooltip="true"
            label="团队名称">
          </el-table-column>
          <el-table-column
            prop="leaderDoctor.hospName"
            :show-overflow-tooltip="true"
            label="乡镇卫生院">
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
            prop="endGuideReason"
            :show-overflow-tooltip="true"
            label="结束原因">
          </el-table-column>
          <el-table-column
            prop="reason"
            :show-overflow-tooltip="true"
            label="不通过原因">
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
        title="结束指导审核"
        width="750px"
        top="30vh"
        center>
        <div class="info" style="text-align: left;">
          <h1>【提交信息】</h1>
          <div>
            <span>团队信息：{{teamGuideInfo && teamGuideInfo.team.teamName}}▪{{teamGuideInfo && teamGuideInfo.leaderDoctor.hospName}}▪{{teamGuideInfo && teamGuideInfo.leaderDoctor.deptName}}</span>
          </div>
          <div>
            <span>指导医生：{{teamGuideInfo && teamGuideInfo.guideDoctor.docName}}▪{{teamGuideInfo && teamGuideInfo.guideDoctor.hospName}}▪{{teamGuideInfo && teamGuideInfo.guideDoctor.deptName}}</span>
            <span>指导年度：{{teamGuideInfo && teamGuideInfo.guideYear}}</span>
          </div>
          <p>结束原因：{{teamGuideInfo && teamGuideInfo.endGuideReason}}</p>
        </div>
        <el-radio-group v-model="passValue" style="margin-top: 10px;text-align: left;">
          <el-radio :label="'1'" @click.native="notPass = null">通过</el-radio>
          <el-radio :label="'2'" class="not-pass">
            不通过
            <el-input
              style="width: 616px;margin-left: 10px;"
              size="small"
              :disabled="passValue !== '2'"
              placeholder="请填写不通过原因"
              :maxlength="1000"
              v-model="notPass">
            </el-input>
          </el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingAudit" @click="putTeamGuide()">确 定</el-button>
          <el-button size="small" @click="dialogExamine = false">取 消</el-button>
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
      nabs: ['待审核', '审核通过', '审核不通过'],
      teamId: '',
      teamDropdownList: [],
      guideTeamList: [],
      doctorId: '',
      guideDoctorDropdownList: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      signingList: [{name: '张三'}],
      dialogExamine: false,
      passValue: '',
      notPass: '',
      teamGuideInfo: '',
      loading: false,
      loadingAudit: false
    }
  },
  mounted () {
    this.getDiseaseTeamList();
    this.getGuideDoctorDropdownList();
    this.getGuideTeamList(0);
  },
  methods: {
    // 分页查询慢病团队下拉列表
    getDiseaseTeamList () {
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {}
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      console.log(222, jsonStr);
      this.axios.get('/hisServices/chronic/teams/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.teamDropdownList = res.data.list.map(item => {
              return {
                label: item.teamName,
                value: item.uid
              }
            })
          }
        })
    },
    // 查询慢病指导医生下拉列表
    getGuideDoctorDropdownList () {
      let jsonStr = {
        pageSize: 0,
        pageNum: 1
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/guideDocs/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.guideDoctorDropdownList = res.data.list.map(item => {
              return {
                label: item.doctor.docName,
                value: item.doctor.uid
              }
            });
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
        this.doctorId = '';
      }
      this.type = index;
      let jsonStr = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        where: {
          teamUid: this.teamId,
          guideDocUid: this.doctorId,
          applyType: '3',
          reviewType: '0',
          status: String(this.type)
        }
      }
      console.log(jsonStr)
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/chronic/teamGuides/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.guideTeamList = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    popTeamGuideDialog (info) {
      this.teamGuideInfo = info;
      this.passValue = '';
      this.notPass = '';
      this.dialogExamine = true;
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
      this.loadingAudit = true;
      this.axios.put('/hisServices/chronic/teamGuide', params)
        .then(res => {
          if (res) {
            console.log(res);
            this.$message.success('审核操作成功！');
            this.dialogExamine = false;
            this.getGuideTeamList(this.type);
            this.passValue = '';
            this.notPass = '';
          }
        })
        .finally(() => {
          this.loadingAudit = false;
        })
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
  .seb-guide{
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
    .examine{
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
          justify-content: space-between;
          span{
            color: #999999;
          }
        }
        p{
          color: #999999;
        }
      }
    }
  }
</style>
<style lang="less">
  .seb-guide{
    .el-dialog__wrapper .el-dialog__body{
      padding: 14px 30px 10px 26px;
    }
    .not-pass{
      display: block;
      margin-left: 0 !important;
      margin-top: 10px;
      .el-radio__label{
        padding-left: 5px;
      }
    }
  }
</style>
