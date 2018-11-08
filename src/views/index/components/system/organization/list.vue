<template>
<div class="main">
  <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>组织架构</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="pm-main">
    <div class="filter">
      <div class="filter-left">
        <el-input
          style="width: 334px;"
          size="small"
          v-model="filter['where.organName']"
          placeholder="请输入项目编号/名称搜索"
          @keyup.enter.native="onSearch()">
          <i v-if="closeShow" slot="suffix" @click="onClear()" class="el-input__icon el-icon-close"></i>
          <i slot="suffix" @click="onSearch()" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="filter-right">
        <div @click="onCreateDepart" class="create-btn"><i class="el-icon-plus"></i>新建部门</div>
      </div>
    </div>
    <el-table
      class="ar-table"
      :data="listData.list"
      border
       @row-click="goDetail"
      header-row-class-name="table-header">
      <el-table-column
        type="index"
        width="50px"
        label="序号"
        align="center"
        :show-overflow-tooltip="true"
        :index="indexMethod"/>
      <el-table-column
        prop="organName"
        label="名称"
        align="center"
        :show-overflow-tooltip="true"/>
      <el-table-column
        prop="parentOrganName"
        label="上级部门"
        align="center"
        :show-overflow-tooltip="true"/>
      <el-table-column
        prop="chargeUserNameStr"
        label="部门负责人"
        align="center"
        :show-overflow-tooltip="true"/>
      <el-table-column
        prop=""
        label="操作"
        align="center"
        width="200px"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" @click.native.stop>
            <i class="iconfont" @click="accreditList(scope.row)" style="font-size: 18px;">&#xe6a0;</i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom" @click.native.stop>
            <i class="iconfont" @click="deleteList(scope.row)">&#xe6af;</i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="listData.list && listData.list.length > 0" class="pagination-box">
      <el-pagination
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pagination.pageSize"
        layout="prev, pager, next, jumper"
        :total="listData.total"/>
    </div>
    <!-- 删除弹框 -->
    <el-dialog
      class="project-dialog"
      title="删除"
      :visible.sync="deletedialogVisible"
      width="340px"
      :append-to-body="true">
      <div class="content">
        <p class="text two-line-tip">是否确认删除此部门？</p>
        <p class="text two-line-warning"><i class="el-icon-warning"></i>删除后数据不可恢复</p>
      </div>
      <span slot="footer" class="dialog-footer double-btn-80">
        <el-button @click="onConfirmDelete">确 认</el-button>
        <el-button @click="deletedialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 新建部门弹框 -->
    <el-dialog
      class="project-dialog"
      title="新建部门"
      :visible.sync="newDepartdialogVisible"
      width="400px"
      :append-to-body="true">
      <div class="content">
        <div class="line">
          <span class="line-title red-color-star">部门名称</span>
          <el-input v-model="newDepartData.organName" @change="onNewDepartChange" size="small" placeholder="请输入部门名称"/>
        </div>
        <div class="line">
          <span class="line-title">上级部门</span>
          <el-select
            size="small"
            v-model="newDepartData.organPid"
            style="width: 250px;">
            <el-option v-for="item in listData.list" :key="item.uid" :label="item.organName" :value="item.uid"></el-option>
          </el-select>
        </div>
        <div class="line">
          <span class="line-title">部门负责人</span>
          <!-- <el-input v-model="newDepartData.chargeUserName" size="small" placeholder="请输入部门负责人姓名"/> -->
          <el-select size="small" filterable clearable placeholder="请输入部门负责人姓名" style="width: 250px" v-model='newDepartData.chargeUserName'>
            <el-option v-for="item in userList" :key="item.uid" :label="item.userName" :value="item.uid"></el-option>
          </el-select>
        </div>
        <div v-if="errorShow" class="error-msg">
          <i class="el-icon-error"></i>
          <span>{{errorMsg}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer double-btn-80">
        <el-button @click="newDepartdialogVisible = false">取 消</el-button>
        <el-button @click="onConfirmNewDepart">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 编辑部门弹框 -->
    <el-dialog
      class="project-dialog"
      title="编辑部门"
      :visible.sync="editDepartdialogVisible"
      width="400px"
      :append-to-body="true">
      <div class="content">
        <div class="line">
          <span class="line-title red-color-star">部门名称</span>
          <el-input v-model="editDepartItem.organName" @change="onNewDepartChange" size="small" placeholder="请输入部门名称"/>
        </div>
        <div class="line">
          <span class="line-title">部门负责人</span>
          <!-- <el-input v-model="editDepartItem.chargeUserNameStr" size="small" placeholder="请输入部门负责人姓名"/> -->
          <el-select size="small" filterable clearable placeholder="请输入部门负责人姓名" style="width: 250px" v-model='editDepartItem.chargeUserName'>
            <el-option v-for="item in userList" :key="item.uid" :label="item.userName" :value="item.uid"></el-option>
          </el-select>
        </div>
        <div v-if="errorShow" class="error-msg">
          <i class="el-icon-error"></i>
          <span>{{errorMsg}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer double-btn-80">
        <el-button @click="editDepartdialogVisible = false">取 消</el-button>
        <el-button @click="onConfirmEditDepart">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 删除部门弹框 -->
    <el-dialog
      class="project-dialog"
      title="删除部门"
      :visible.sync=" deleteDepartdialogVisible"
      width="340px"
      :append-to-body="true">
      <div class="content" style="text-align: center;">
        <span class="text" style="padding: 0 30px;">删除时将删除部门及其下级部门，是否确认删除？</span>
      </div>
      <span slot="footer" class="dialog-footer double-btn-80">
        <el-button @click="deleteDepartdialogVisible = false">确 认</el-button>
        <el-button @click="deleteDepartdialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</div>
</template>

<script>
import { setCookie, getCookie } from '@/utils/util.js';
export default {
  data () {
    return {
      plateName: getCookie('plateName'),
      listData: {},
      newDepartData: {
        organName: null,
        organPid: null,
        chargeUserName: null,
        proKey: getCookie('proKey')
      },
      errorShow: false,
      errorMsg: null,
      deletedialogVisible: false, // 删除提示
      deleteItem: {},
      newDepartdialogVisible: false, // 新建部门提示
      editDepartdialogVisible: false, // 编辑部门提示
      editDepartItem: {},
      deleteDepartdialogVisible: false, // 删除部门提示
      filter: {
        'where.organName': null
      },
      pagination: {
        pageNum: 1,
        pageSize: 10,
        orderBy: null,
        order: null
      },
      currentPage: 1,
      closeShow: false,
      userList: []
    }
  },
  created () {
    this.getList();
    this.getUserList();
  },
  methods: {
    getList () {
      let params = Object.assign({}, this.filter, this.pagination, {'where.proKey': getCookie('proKey')});
      this.axios.get('S2/auth/authServices/organInfos', {params})
        .then(res => {
          if (res) {
            this.listData = res.data;
          }
        })
    },
    getUserList () {
      const pagination = {
        pageSize: 0
      };
      let params = Object.assign({}, pagination, {'where.proKey': getCookie('proKey')});
      console.log(params);
      this.axios.get('S2/auth/authServices/users', {params})
        .then(res => {
          if (res && res.data.list) {
            this.userList = res.data.list;
          }
        })
        .catch(() => {})
    },
    goDetail (row) {
      this.$router.push({name: 'organization-detail', query: {id: row.uid}});
    },
    // 新建部门
    onCreateDepart () {
      this.errorShow = false;
      this.errorMsg = null;
      this.newDepartData.organName = null;
      this.newDepartData.organPid = null;
      this.newDepartData.chargeUserName = null;
      this.newDepartdialogVisible = true;
    },
    onConfirmNewDepart () {
      if (!this.newDepartData.organName) {
        this.errorShow = true;
        this.errorMsg = '此项内容不可为空';
        return false;
      }
      this.axios.post('S2/auth/authServices/organInfo', this.newDepartData)
        .then(res => {
          if (res) {
            this.$message.success('创建成功');
            this.getList();
            this.newDepartdialogVisible = false;
          }
        })
    },
    onNewDepartChange (val) {
      let params = {
        proKey: getCookie('proKey'),
        organName: val
      }
      this.axios.get('S2/auth/authServices/organName', {params})
        .then(res => {
          if (res) {
            this.errorShow = res.data;
            this.errorMsg = '该用户组已存在';
          }
        })
    },
    // 编辑部门
    accreditList (obj) {
      this.errorShow = false;
      this.errorMsg = null;
      this.editDepartItem = obj;
      this.editDepartdialogVisible = true;
    },
    onConfirmEditDepart () {
      if (!this.editDepartItem.organName) {
        this.errorShow = true;
        this.errorMsg = '此项内容不可为空';
        return false;
      }
      let params = {
        uid: this.editDepartItem.uid,
        chargeUserName: this.editDepartItem.chargeUserName,
        organName: this.editDepartItem.organName,
        proKey: getCookie('proKey')
      }
      this.axios.put('S2/auth/authServices/organInfo', params)
        .then(res => {
          if (res) {
            this.$message.success('修改成功');
            this.getList();
            this.editDepartdialogVisible = false;
          }
        })
    },
    deleteList (obj) {
      this.deleteItem = obj;
      this.deletedialogVisible = true;
    },
    onConfirmDelete () {
      this.axios.delete('S2/auth/authServices/organInfo?uids=' + this.deleteItem.uid + '&proKey=' + getCookie('proKey'))
        .then(res => {
          if (res) {
            this.$message.success('删除成功');
            this.getList();
            this.deletedialogVisible = false;
          }
        })
    },
    // 输入框查询
    onSearch () {
      this.closeShow = true;
      this.getList();
    },
    // 清除输入框
    onClear () {
      this.filter['where.organName'] = '';
      this.getList();
      this.closeShow = false;
    },
    // 分页翻页
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    indexMethod (index) {
      return index + 1 + 10 * (this.pagination.pageNum - 1);
    }
  }
}
</script>

<style lang="less" scoped>
.pm-main {
  background: #fff;
  padding: 20px 25px 80px 25px;
  margin-top: 3px;
  .filter {
    width: 100%;
    height: 40px;
    clear: both;
    .filter-left {
      float: left;
    }
    .filter-right {
      float: right;
    }
  }
  .create-btn {
    display: inline-block;
    width: 98px; height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 3px;
    background: #1890FF;
    color: #FFF;
    cursor: pointer;
    i {
      font-size: 12px;
      margin-right: 3px;
    }
  }
  .ar-table {
    margin-top: 20px;
    /deep/ .el-table__empty-block {
      min-height: 200px;
      background: url(../../../../../assets/img/no_data.png) no-repeat;
      background-position: calc(50% - 3px) 34%;
      .el-table__empty-text {
        margin-top: 40px;
      }
    }
    /deep/ .table-header th {
      background: #F5F5F5;
      font-size: 14px;
      color: #555;
      padding: 11px 0;
    }
    /deep/ .el-table__row {
      height: 54px;
    }
    /deep/ .cell {
      i {
        margin-left: 10px;
        color: #666;
        font-size: 20px;
        cursor: pointer;
      }
      i:hover {
        color: #1890FF;
      }
      i:last-child:hover {
        color: #FF5722;
      }
    }
  }
}
.line {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  .el-input {
    width: 250px;
  }
  .line-title {
    width: 80px;
    color: #555;
    display: inline-block;
    font-weight: 600;
  }
  .red-color-star:after {
    content: '*';
    color: #f56c6c;
    margin-left: 4px;
  }
  .line-name {
    color: #333;
  }
}
.error-msg {
  width: 250px;height: 36px;
  line-height: 36px;
  border: 1px solid #FDC9C9;
  border-radius: 3px;
  color: #FF0000;
  background: #FFF6F6;
  padding-left: 16px;
  margin-left: 80px;
}
</style>
