<template>
  <div class="hp-guide">
    <h1><i class="icon iconfont">&#xe6c5;</i><span>指导医生管理</span></h1>
    <div class="line"></div>
    <el-form label-width="80px" :inline="true">
      <el-form-item label="科室:" class="dept">
        <el-select v-model="deptId" size="small" filterable placeholder="请选择" @change="getGuideDoctorDropdownList()">
          <el-option label="全部科室" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in deptList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指导医生:">
        <el-select v-model="doctorId" size="small" filterable placeholder="请选择">
          <el-option label="全部医生" :value="null"></el-option>
          <el-option :label="item.label" :value="item.value" v-for="item in guideDoctorDropdownList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" icon="el-icon-search" @click="getGuideDoctorList(1)">搜索</el-button>
      </el-form-item>
      <el-form-item label="" style="float: right;">
        <el-button type="primary" size="small" @click="popAddGuideDoctor(1)">新增指导医生</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="guideDoctorList.list"
        stripe>
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod">
        </el-table-column>
        <el-table-column
          prop="doctor.docName"
          :show-overflow-tooltip="true"
          label="指导医生">
        </el-table-column>
        <el-table-column
          prop="doctor.deptName"
          :show-overflow-tooltip="true"
          label="所在科室">
        </el-table-column>
        <el-table-column
          prop="guideTeamCount"
          label="指导团队数">
        </el-table-column>
        <el-table-column
          prop="docAdept"
          :show-overflow-tooltip="true"
          width="450"
          label="医生擅长">
        </el-table-column>
        <el-table-column
          label="新增时间">
          <template slot-scope="scope">
            {{scope.row.createTime | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="operate" @click="popPutDialog(scope.row)">修改</span>
            <span style="color: #E9E9E9;margin: 0 10px;">|</span>
            <span class="operate" @click="popDelDialog(scope.row)" v-if="scope.row.canDelete">删除</span>
            <el-tooltip class="item" effect="dark" content="该指导医生不能删除" placement="top">
              <span style="color: #999;" v-if="!scope.row.canDelete">删除</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
    </div>
    <div class="pagination-box" v-if="guideDoctorList.list && guideDoctorList.list.length > 0">
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="guideDoctorList.total">
      </el-pagination>
    </div>
    <div class="add">
      <el-dialog
        :visible.sync="dialogAdd"
        :close-on-click-modal="false"
        title="新增指导医生"
        width="600px"
        top="30vh"
        center>
        <div class="form">
          <el-form :model="ruleFormAdd" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px">
            <el-form-item label="选择科室:" prop="deptId" style="width: 50%;">
              <el-select v-model="ruleFormAdd.deptId" size="small" filterable placeholder="请选择" @change="getDoctorDropdownList()">
                <el-option :label="item.label" :value="item.value" v-for="item in deptList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指导医生:" prop="doctorId" style="width: 50%;">
              <el-select v-model="ruleFormAdd.doctorId" size="small" filterable placeholder="请选择">
                <el-option :label="item.label" :value="item.value" v-for="item in doctorList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医生擅长:" prop="beGoodAtAdd" style="margin-bottom: 16px;width: 100%;">
              <el-input v-model="ruleFormAdd.beGoodAtAdd" size="small" :rows="6" type="textarea" :maxlength="1000"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingAdd" @click="addGuideDoctor('ruleFormAdd')">确 定</el-button>
          <el-button size="small" @click="dialogAdd = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="add" v-if="dialogUp">
      <el-dialog
        :visible.sync="dialogUp"
        :close-on-click-modal="false"
        :title="'修改指导医生'"
        width="600px"
        top="30vh"
        center>
        <div class="form">
          <el-form :model="ruleFormUp" :rules="rulesUp" ref="ruleFormUp" label-width="100px">
            <el-form-item label="选择科室:" style="width: 50%;">
              <el-input :disabled="true" v-model="deptName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="指导医生:" style="width: 50%;">
              <el-input :disabled="true" v-model="doctorName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="医生擅长:" prop="beGoodAtUp" style="margin-bottom: 16px;width: 100%;">
              <el-input v-model="ruleFormUp.beGoodAtUp" size="small" :rows="6" type="textarea" :maxlength="1000"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingAdd" @click="putGuideDoctor('ruleFormUp')">确 定</el-button>
          <el-button size="small" @click="dialogUp = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="del">
      <el-dialog
        :visible.sync="dialogDel"
        :close-on-click-modal="false"
        title="删除指导医生"
        width="420px"
        top="30vh"
        center>
        <div style="text-align: center;padding: 20px;">是否删除{{delDoctorInfo && delDoctorInfo.doctor.docName}}？</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingDel" @click="delDiseaseGuideDoctor()">确 定</el-button>
          <el-button size="small" @click="dialogDel = false">取 消</el-button>
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
      type: null,
      deptId: '',
      deptName: null,
      doctorId: '',
      doctorUid: null,
      doctorName: null,
      deptList: [],
      guideDoctorDropdownList: [],
      guideDoctorList: [],
      doctorList: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      dialogAdd: false,
      dialogUp: false,
      dialogDel: false,
      ruleFormAdd: {
        deptId: null,
        doctorId: null,
        beGoodAtAdd: null
      },
      rulesAdd: {
        deptId: [
          {required: true, message: '不能为空！', trigger: 'change'}
        ],
        doctorId: [
          {required: true, message: '不能为空！', trigger: 'change'}
        ],
        beGoodAtAdd: [
          {required: true, message: '不能为空！', trigger: 'blur'}
        ]
      },
      ruleFormUp: {
        beGoodAtUp: null
      },
      rulesUp: {
        beGoodAtUp: [
          {required: true, message: '不能为空！', trigger: 'blur'}
        ]
      },
      delDoctorInfo: null,
      loading: false,
      loadingAdd: false,
      loadingDel: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    this.getDeptList();
    this.getGuideDoctorDropdownList();
    this.getGuideDoctorList();
  },
  methods: {
    // 查询科室下拉列表
    getDeptList () {
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          uid: this.userInfo.organInfoList[0].uid
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/scheduling/queryDeptByHospital/' + jsonStr)
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
    // 查询慢病指导医生下拉列表
    getGuideDoctorDropdownList () {
      this.guideDoctorDropdownList = [];
      this.doctorId = '';
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          hospUid: this.userInfo.organInfoList[0].uid,
          deptUid: this.deptId
        }
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
    // 分页查询慢病指导医生列表
    getGuideDoctorList (search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          hospUid: this.userInfo.organInfoList[0].uid,
          deptUid: this.deptId,
          docUid: this.doctorId
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/chronic/guideDocs/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.guideDoctorList = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    popAddGuideDoctor (index) {
      this.type = index;
      this.dialogAdd = true;
      this.resetForm('ruleFormAdd');
    },
    // 查询慢病医生下拉列表
    getDoctorDropdownList () {
      this.ruleFormAdd.beGoodAtAdd = '';
      this.ruleFormAdd.doctorId = null;
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          hospUid: this.userInfo.organInfoList[0].uid,
          deptUid: this.ruleFormAdd.deptId,
          isChronicDoctor: false
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/doctors/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.doctorList = res.data.map(item => {
              return {
                label: item.docName,
                value: item.uid
              }
            });
          }
        })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getGuideDoctorList();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getGuideDoctorList();
    },
    resetForm (formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    // 新增指导医生
    addGuideDoctor (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let value = this.Trim(this.ruleFormAdd.beGoodAtAdd, 'g');
          if (!this.ruleFormAdd.beGoodAtAdd && value.length === 0) {
            this.$message.error('擅长不能为空！');
            return false;
          }
          let params = {
            docUid: this.ruleFormAdd.doctorId,
            docAdept: value
          }
          this.loadingAdd = true;
          this.axios.post('/hisServices/chronic/guideDoc', params)
            .then(res => {
              if (res) {
                console.log(res);
                this.dialogAdd = false;
                this.$message.success('新增成功！');
                this.getGuideDoctorList();
                this.getGuideDoctorDropdownList();
              }
            })
            .finally(() => {
              this.loadingAdd = false;
            })
        } else {
          return false;
        }
      })
    },
    // 修改指导医生
    putGuideDoctor (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let value = this.Trim(this.ruleFormUp.beGoodAtUp, 'g');
          if (!this.ruleFormUp.beGoodAtUp && value.length === 0) {
            this.$message.error('擅长不能为空！');
            return false;
          }
          let params = {
            uid: this.doctorUid,
            docAdept: value
          }
          this.loadingAdd = true;
          this.axios.put('/hisServices/chronic/guideDoc', params)
            .then(res => {
              if (res) {
                console.log(res);
                this.dialogUp = false;
                this.$message.success('修改成功！');
                this.getGuideDoctorList();
                this.getGuideDoctorDropdownList();
              }
            })
            .finally(() => {
              this.loadingAdd = false;
            })
        } else {
          return false;
        }
      })
    },
    popPutDialog (info) {
      this.dialogUp = true;
      this.resetForm('ruleFormUp');
      this.doctorUid = info.uid;
      this.deptName = info.doctor.deptName;
      this.doctorName = info.doctor.docName;
      this.ruleFormUp.beGoodAtUp = info.docAdept;
    },
    popDelDialog (info) {
      this.delDoctorInfo = info;
      this.dialogDel = true;
    },
    // 删除慢病指导医生
    delDiseaseGuideDoctor () {
      const params = {uid: this.delDoctorInfo.uid}
      this.loadingDel = true;
      this.axios.delete('/hisServices/chronic/guideDoc', {params})
        .then(res => {
          if (res) {
            console.log(res);
            this.dialogDel = false;
            this.$message.success('删除成功！');
            this.getGuideDoctorList();
          }
        })
        .finally(() => {
          this.loadingDel = false;
        })
    }
  }
}
</script>
<style lang="less" scoped>
  .hp-guide{
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
        .el-form{
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
  }
</style>
<style lang="less">
  .hp-guide{
    .dept .el-form-item__label{
      width: 50px !important;
    }
    .el-dialog__wrapper .el-dialog__body{
      padding: 14px 30px 10px 26px;
    }
  }
</style>
