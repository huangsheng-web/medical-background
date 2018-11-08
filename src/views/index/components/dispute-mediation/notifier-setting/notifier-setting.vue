<template>
  <div class="notifier-setting">
    <div class="title">
      <i class="icon iconfont">&#xe67e;</i>
      <span>短信通知人设置</span>
    </div>
    <div class="report-person">
      <el-button type="primary" size="small" @click="popAddNotifier()">添加通知人</el-button>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="smsUsersList.list"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod">
        </el-table-column>
        <el-table-column
          prop="hospName"
          label="医院名称"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="通知人姓名"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="手机号"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间">
          <template slot-scope="scope">
            {{scope.row.createTime | moment()}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <span @click="getSmsUsersById(scope.row.uid)">修改</span>
            <strong>|</strong>
            <span @click="dialogDel = true, smsUsersId = scope.row.uid">删除</span>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
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
        :total="smsUsersList.total">
      </el-pagination>
    </div>
    <div class="addNotifier" v-if="dialogAddNotifier">
      <el-dialog
        :visible.sync="dialogAddNotifier"
        :close-on-click-modal="false"
        width="387px"
        top="40vh"
        :title="addAndUpdate === 1 ? '添加通知人' : '修改通知人'"
        center>
        <div class="content">
          <div class="form">
            <el-form :model="ruleFormAddNotifier" :rules="rulesAddNotifier" :show-message="false" ref="ruleFormAddNotifier" label-width="100px">
              <el-form-item label="医院名称:" prop="hospName" style="margin-bottom: 10px;">
                <el-select v-model="ruleFormAddNotifier.hospName" size="small" filterable placeholder="请选择">
                  <el-option
                    v-for="item in hospitalList"
                    :key="item.value"
                    :label="item.hospName"
                    :value="item.uid">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="通知人姓名:" prop="informantName" style="margin-bottom: 10px;">
                <el-input v-model="ruleFormAddNotifier.informantName" size="small" :maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="手机号:" prop="phone" style="margin-bottom: 10px;">
                <el-input v-model="ruleFormAddNotifier.phone" size="small"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingBtn" @click="addAndUpdateSmsUsers('ruleFormAddNotifier')">确 定</el-button>
          <el-button size="small" plain @click="dialogAddNotifier = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="del">
      <el-dialog
        :visible.sync="dialogDel"
        :close-on-click-modal="false"
        width="290px"
        top="40vh"
        title="删除"
        center>
        <p style="color: #333333;text-align: center;">确定删除吗？</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="delSmsUserById()">确 定</el-button>
          <el-button size="small" plain @click="dialogDel = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {checkPhone} from '@/utils/validator.js';
export default {
  data () {
    return {
      status: 0,
      reportPerson: '',
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      options: [],
      hospitalList: [],
      smsUsersId: '',
      addAndUpdate: null, // 1未添加，2未修改
      dialogDel: false,
      dialogAddNotifier: false,
      ruleFormAddNotifier: {
        hospName: null,
        informantName: null,
        phone: null
      },
      rulesAddNotifier: {
        hospName: [
          {required: true, message: '请选择科室名称', trigger: 'change'}
        ],
        informantName: [
          {required: true, message: '请选择科室名称', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '手机号码不能为空！'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      smsUsersList: [],
      loading: false,
      loadingBtn: false
    }
  },
  mounted () {
    this.getSmsUsers();
    this.getHospitalList();
  },
  methods: {
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getDiseaseList();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getDiseaseList();
    },
    // 获得短信通知人列表
    getSmsUsers () {
      let jsonStr = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/dispute/smsUsers/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.smsUsersList = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    addAndUpdateSmsUsers (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addAndUpdate === 1) {
            this.addSmsUsers();
          } else {
            this.putSmsUsers();
          }
        } else {
          return false;
        }
      })
    },
    popAddNotifier () {
      this.dialogAddNotifier = true;
      this.addAndUpdate = 1;
      this.ruleFormAddNotifier.hospName = null;
      this.ruleFormAddNotifier.informantName = null;
      this.ruleFormAddNotifier.phone = null;
    },
    // 添加短信通知人
    addSmsUsers () {
      let params = {
        hospUid: this.ruleFormAddNotifier.hospName,
        userName: this.ruleFormAddNotifier.informantName,
        telephone: this.ruleFormAddNotifier.phone
      }
      this.loadingBtn = true;
      this.axios.post('/hisServices/dispute/smsUser', params)
        .then(res => {
          if (res) {
            console.log(res);
            this.getSmsUsers();
            this.dialogAddNotifier = false;
          }
        })
        .finally(() => {
          this.loadingBtn = false;
        })
    },
    // 修改短信通知人
    putSmsUsers () {
      let params = {
        uid: this.smsUsersId,
        hospUid: this.ruleFormAddNotifier.hospName,
        userName: this.ruleFormAddNotifier.informantName,
        telephone: this.ruleFormAddNotifier.phone
      }
      this.loadingBtn = true;
      this.axios.put('/hisServices/dispute/smsUser', params)
        .then(res => {
          if (res) {
            console.log(res);
            this.getSmsUsers();
            this.dialogAddNotifier = false;
          }
        })
        .finally(() => {
          this.loadingBtn = false;
        })
    },
    // 根据唯一标识查询短信通知人
    getSmsUsersById (smsUsersId) {
      this.smsUsersId = smsUsersId;
      this.axios.get('/hisServices/dispute/smsUser/' + this.smsUsersId)
        .then(res => {
          if (res) {
            this.dialogAddNotifier = true;
            this.addAndUpdate = 2
            this.ruleFormAddNotifier.hospName = res.data.hospUid;
            this.ruleFormAddNotifier.informantName = res.data.userName;
            this.ruleFormAddNotifier.phone = res.data.telephone;
            console.log(res);
          }
        })
    },
    // 删除短信通知人
    delSmsUserById () {
      this.axios.delete('/hisServices/dispute/smsUser/' + this.smsUsersId)
        .then(res => {
          if (res) {
            this.getSmsUsers();
            this.dialogDel = false;
            console.log(res);
          }
        })
    },
    // 获取医院列表
    getHospitalList () {
      const params = {businessType: '2'};
      this.axios.get('/hisServices/scheduling/queryHospitalList', {params})
        .then(res => {
          if (res) {
            console.log(res);
            this.hospitalList = res.data;
          }
        })
    }
  }
}
</script>
<style lang="less">
  .notifier-setting{
    .title i{
      margin-right: 10px;
    }
    .title span{
      color:rgba(51,51,51,1);
      font-weight: bold;
    }
    .report-person{
      margin-top: 26px;
      margin-bottom: 16px;
    }
    .table .el-table .cell{
      strong{
        margin-left: 10px;
        color: #E9E9E9;
      }
      span{
        cursor: pointer;
        margin-left: 10px;
        color: #1890FF;
      }
    }
    .form{
      border-bottom: 1px solid rgba(232,232,232,1);
      .el-input{
        width: 200px;
      }
    }
    .el-dialog__wrapper .el-dialog__body{
      padding: 25px 25px 10px;
    }
  }
</style>
