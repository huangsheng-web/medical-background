<template>
  <div>
    <h1><i class="icon iconfont" style="margin-right: 10px;font-size: 18px;">&#xe6c4;</i><span style="font-weight: bold;">家庭医生团队</span></h1>
    <div class="hc-team-list" v-if="serviceList && serviceList.length > 0">
      <div class="tabs" style="width: 240px;">
        <div :class="{ active: type === 0 }" @click="getDiseaseMemberList()">成员待审核<i></i></div>
        <div :class="{ active: type === 1 }" class="not-border" @click="getDiseaseTeamList(2)">团队列表<i></i></div>
      </div>
      <div class="line"></div>
      <el-form label-width="80px" :inline="true">
        <el-form-item label="团队名称:">
          <el-select v-model="teamId" size="small" filterable placeholder="请选择">
            <el-option label="全部团队" :value="null"></el-option>
            <el-option :label="item.label" :value="item.value" v-for="item in teamData" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核类别:" v-if="type === 0">
          <el-select v-model="examineType" size="small" filterable placeholder="请选择">
            <el-option label="全部类别" :value="null"></el-option>
            <el-option label="新增成员" :value="'0'"></el-option>
            <el-option label="删除成员" :value="'2'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室:" v-if="type === 1">
            <el-select v-model="deptId" size="small" filterable placeholder="请选择">
              <el-option label="全部科室" :value="null"></el-option>
              <el-option :label="item.label" :value="item.value" v-for="item in deptList" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" icon="el-icon-search" v-if="type === 0" @click="getDiseaseMemberList(1)">搜索</el-button>
          <el-button size="small" icon="el-icon-search" v-if="type === 1" @click="getDiseaseTeamList(2, 1)">搜索</el-button>
        </el-form-item>
        <el-form-item label="" style="float: right;" v-if="type === 1">
          <el-button type="primary" size="small" @click="dialogDoctor = true;resetForm('ruleFormAdd')">新增团队</el-button>
        </el-form-item>
      </el-form>
      <div v-show="type === 0">
        <div class="table">
          <el-table
            v-loading="loading"
            :data="examineList.list"
            stripe>
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod">
            </el-table-column>
            <el-table-column
              prop="teamName"
              :show-overflow-tooltip="true"
              label="团队名称">
            </el-table-column>
            <el-table-column
              prop="memberName"
              :show-overflow-tooltip="true"
              label="成员姓名">
            </el-table-column>
            <el-table-column
              label="职业">
              <template slot-scope="scope">
                {{scope.row.occupationType === '1' ? '医生' : scope.row.occupationType === '2' ? '护士' : scope.row.occupationType === '3' ? '公卫' : scope.row.occupationType === '4' ? '乡医' : ''}}
              </template>
            </el-table-column>
            <el-table-column
              label="审核类别">
              <template slot-scope="scope">
                {{scope.row.operationType === '0' ? '新增成员' : scope.row.operationType === '2' ? '删除成员' : ''}}
              </template>
            </el-table-column>
            <el-table-column
              label="提交时间">
              <template slot-scope="scope">
                {{scope.row.submitTime | moment('YYYY-MM-DD')}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="operate" @click="popDialogMember(scope.row)">审核</span>
              </template>
            </el-table-column>
            <div class="not-content" slot="empty">
              <img src="../../../../assets/img/not.png" alt="">
              <p>抱歉，暂无相关内容</p>
            </div>
          </el-table>
        </div>
      </div>
      <div v-show="type === 1">
        <div class="table">
          <el-table
            v-loading="loading"
            :data="teamList.list"
            stripe>
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod">
            </el-table-column>
            <el-table-column
              prop="teamName"
              :show-overflow-tooltip="true"
              label="团队名称">
            </el-table-column>
            <el-table-column
              prop="belongToDept"
              :show-overflow-tooltip="true"
              label="科室">
            </el-table-column>
            <el-table-column
              prop="signedCount"
              label="签约人数">
            </el-table-column>
            <el-table-column
              prop="countersignCount"
              label="复签人数">
            </el-table-column>
            <el-table-column
              label="新增时间">
              <template slot-scope="scope">
                {{scope.row.createTime | moment('YYYY-MM-DD')}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <router-link tag="span" :to="{ name: 'hc-team-detail', query: {teamId: scope.row.uid} }"  class="operate">团队详情</router-link>
                <span style="color: #E9E9E9;margin: 0 10px;">|</span>
                <span class="operate" @click="dialogDel = true;teamInfo = scope.row" v-if="scope.row.canDelete">删除</span>
                <el-tooltip v-else class="item" effect="dark" content="该团队已产生数据，不能删除" placement="top">
                  <span style="color: #999;">删除</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <div class="not-content" slot="empty">
              <img src="../../../../assets/img/not.png" alt="">
              <p>抱歉，暂无相关内容</p>
            </div>
          </el-table>
        </div>
      </div>
      <div class="pagination-box">
        <el-pagination
          background
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20]"
          layout="total, prev, pager, next, sizes, jumper"
          :total="type === 0 ? examineList.total : teamList.total">
        </el-pagination>
      </div>
      <div class="addDoctor">
        <el-dialog
          :visible.sync="dialogDoctor"
          :close-on-click-modal="false"
          title="新增家庭医生团队"
          width="340px"
          top="30vh"
          center>
          <div class="form" style="text-align: left;">
            <el-form :model="ruleFormAdd" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px">
              <el-form-item label="负责人姓名:" prop="name">
                <el-input v-model="ruleFormAdd.name" size="small"></el-input>
              </el-form-item>
              <el-form-item label="手机号:" prop="phone">
                <el-input v-model="ruleFormAdd.phone" size="small"></el-input>
              </el-form-item>
              <el-form-item label="所在科室:" prop="deptId" style="margin-bottom: 16px;">
                <el-select v-model="ruleFormAdd.deptId" size="small" filterable placeholder="请选择">
                  <el-option :label="item.label" :value="item.value" v-for="item in deptList" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" :loading="loadingAdd" @click="addDiseaseTeam('ruleFormAdd')">确 定</el-button>
            <el-button size="small" @click="dialogDoctor = false">取 消</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="member">
        <el-dialog
          :visible.sync="dialogMember"
          :close-on-click-modal="false"
          :title="memberInfo && (memberInfo.operationType === '0' ? '新增团队成员审核' : memberInfo.operationType === '2' ? '删除团队成员审核' : '') "
          width="750px"
          top="30vh"
          center>
          <p>{{memberInfo && memberInfo.teamName}}</p>
          <div class="info">
            <h1 style="margin-left: -9px;">【提交信息】</h1>
            <div>
              <span>成员姓名：{{memberInfo && memberInfo.memberName}}</span>
              <span>手机号：{{memberInfo && memberInfo.memberTelephone}}</span>
              <span>职业：{{ memberInfo && (memberInfo.occupationType === '1' ? '医生' : memberInfo.occupationType === '2' ? '护士' : memberInfo.occupationType === '3' ? '公卫' : memberInfo.occupationType === '4' ? '乡医' : '')}}</span>
            </div>
            <p>备注：{{memberInfo && memberInfo.description}}</p>
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
            <el-button type="primary" size="small" :loading="loadingAudit" @click="putDiseaseMember()">确 定</el-button>
            <el-button size="small" @click="dialogMember = false">取 消</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="del">
        <el-dialog
          :visible.sync="dialogDel"
          :close-on-click-modal="false"
          title="删除团队"
          width="420px"
          top="30vh"
          center>
          <div style="text-align: center;padding: 20px;">是否删除{{teamInfo && teamInfo.teamName}}？</div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" :loading="loadingDel" @click="delDiseaseTeam()">确 定</el-button>
            <el-button size="small" @click="dialogDel = false">取 消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <div class="not-content" v-if="serviceList && serviceList.length === 0">
      <img src="../../../../assets/img/not.png" alt="">
      <p>请先选择本机构可提供的服务包</p>
    </div>
  </div>
</template>
<script>
import {checkPhone, checkName} from '@/utils/validator.js';
export default {
  data () {
    return {
      type: 0,
      deptList: [],
      teamId: '',
      examineType: '',
      deptId: '',
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      teamList: [],
      examineList: [],
      dialogDoctor: false,
      dialogMember: false,
      ruleFormAdd: {
        name: null,
        phone: null,
        deptId: null
      },
      rulesAdd: {
        name: [
          { required: true, message: '不能为空！', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '不能为空！', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '不能为空！', trigger: 'change' }
        ]
      },
      passValue: '',
      notPass: '',
      memberInfo: null,
      teamInfo: null,
      dialogDel: false,
      serviceList: null,
      teamData: [],
      loading: false,
      loadingAdd: false,
      loadingAudit: false,
      loadingDel: false
    }
  },
  mounted () {
    this.getServiceList();
    this.getDeptList();
    this.getDiseaseTeamList(1);
    this.getDiseaseMemberList();
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  methods: {
    // 查询卫生院是否选择了卫计局提供的服务包
    getServiceList () {
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          userUid: this.userInfo.organInfoList[0].uid, // 用户标识 卫计局、卫生院、慢病团队、患者
          userType: '2' // 用户类型
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/packs/' + jsonStr)
        .then(res => {
          if (res) {
            this.serviceList = res.data;
          }
        })
    },
    // 分页查询慢病科室下拉列表
    getDeptList () {
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          townshipHospUid: this.userInfo.organInfoList[0].uid,
          isHaveTeam: false
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/teamDepts/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.deptList = res.data.list.map(item => {
              return {
                label: item.deptName,
                value: item.uid
              }
            })
          }
        })
    },
    resetForm (formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    // 新增慢病团队
    addDiseaseTeam (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            leaderName: this.ruleFormAdd.name,
            telephone: this.ruleFormAdd.phone,
            deptUid: this.ruleFormAdd.deptId,
            hospUid: this.userInfo.organInfoList[0].uid
          }
          this.loadingAdd = true;
          this.axios.post('/hisServices/chronic/team', params)
            .then(res => {
              if (res) {
                this.$message.success('新增成功！');
                this.dialogDoctor = false;
                this.getDiseaseTeamList(1);
                this.getDiseaseTeamList(2);
                this.ruleFormAdd.name = null;
                this.ruleFormAdd.phone = null;
                this.ruleFormAdd.deptId = null
              }
            })
            .finally(() => {
              this.loadingAdd = false;
            })
        } else {
          return false;
        }
      });
    },
    // 分页查询成员待审核列表
    getDiseaseMemberList (search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      console.log(this.teamId);
      if (this.type === 1) {
        this.pageNum = 1;
        this.currentPage = 1;
        this.teamId = '';
        this.deptId = '';
      }
      this.type = 0;
      let jsonStr = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        where: {
          townshipHospUid: this.userInfo.organInfoList[0].uid,
          teamUid: this.teamId,
          operationType: this.examineType,
          memberStatus: '0'
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/chronic/teamMembers/' + jsonStr)
        .then(res => {
          if (res) {
            this.examineList = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    // 分页查询慢病团队以及下拉列表
    getDiseaseTeamList (index, search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      if (this.type === 0) {
        this.pageNum = 1;
        this.currentPage = 1;
        this.teamId = '';
        this.examineType = '';
      }
      this.type = 1;
      let jsonStr = null;
      // 团队下拉列表入参
      if (index === 1) {
        jsonStr = {
          pageSize: 0,
          pageNum: 1,
          where: {
            townshipHospUid: this.userInfo.organInfoList[0].uid
          }
        }
      // 团队列表入参
      } else {
        jsonStr = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          where: {
            townshipHospUid: this.userInfo.organInfoList[0].uid,
            deptUid: this.deptId,
            teamUid: this.teamId
          }
        }
        this.loading = true;
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/teams/' + jsonStr)
        .then(res => {
          if (res) {
            if (index === 1) {
              this.teamData = res.data.list.map(item => {
                return {
                  label: item.teamName,
                  value: item.uid
                }
              })
            } else {
              this.teamList = res.data;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    getList (item) {
      this.teamId = item.uid;
    },
    popDialogMember (info) {
      this.passValue = '';
      this.notPass = '';
      this.dialogMember = true;
      this.memberInfo = info;
    },
    // 更新慢病团队成员
    putDiseaseMember () {
      let params = {
        uid: this.memberInfo.uid,
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
      this.axios.put('/hisServices/chronic/teamMember', params)
        .then(res => {
          if (res) {
            console.log(res);
            this.dialogMember = false;
            this.$message.success('操作成功！');
            this.getDiseaseMemberList();
            this.passValue = '';
            this.notPass = '';
          }
        })
        .finally(() => {
          this.loadingAudit = false;
        })
    },
    // 删除团队
    delDiseaseTeam () {
      const params = {uid: this.teamInfo.uid}
      this.loadingDel = true;
      this.axios.delete('/hisServices/chronic/team', {params})
        .then(res => {
          if (res) {
            console.log(res);
            this.dialogDel = false;
            this.$message.success('删除成功！');
            this.getDiseaseTeamList(1);
            this.getDiseaseTeamList(2);
          }
        })
        .finally(() => {
          this.loadingDel = false;
        })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      if (this.type === 0) {
        this.getDiseaseMemberList();
      } else {
        this.getDiseaseTeamList(2);
      }
    },
    onPageChange (page) {
      this.pageNum = page;
      if (this.type === 0) {
        this.getDiseaseMemberList();
      } else {
        this.getDiseaseTeamList(2);
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .hc-team-list{
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
    .add{
      .form{
        border-bottom: 1px solid rgba(232,232,232,1);
      }
    }
    .member {
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
        text-align: left;
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
  .hc-team-list{
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
