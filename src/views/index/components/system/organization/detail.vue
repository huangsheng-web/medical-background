<template>
  <div class="um-main">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'organization' }">组织架构</el-breadcrumb-item>
      <el-breadcrumb-item>部门名称</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="all-content">
      <ul class="header-tab">
        <li :class="{active: tabState === 1}" @click="tabState = 1">部门</li>
        <li :class="{active: tabState === 2}" @click="tabState = 2">成员</li>
      </ul>
      <!-- 部门模块 -->
      <div v-if="tabState === 1" class="depart">
        <div class="title">{{detailData.organName}}</div>
        <table class="detail-line">
          <tr>
            <td>
              <div>上级部门：</div>
              <div>
                <span v-if="detailData.parentOrganName">{{detailData.parentOrganName}}</span>
                <span v-else>无</span>
              </div>
            </td>
            <td>
              <div>负责人：</div>
              <div>{{detailData.chargeUserNameStr}}</div>
            </td>
            <td>
              <div>创建时间：</div>
              <div>{{detailData.createTime | moment('yyyy-MM-dd')}}</div>
            </td>
            <td>
              <div>更新时间：</div>
              <div>{{detailData.updateTime | moment('yyyy-MM-dd')}}</div>
            </td>
          </tr>
        </table>
        <div class="down-depart-title"><span>下级部门</span></div>
        <div class="btn-group">
          <div class="create-btn" @click="onAddDepart"><i class="el-icon-plus"></i>添加部门</div>
          <div v-if="departData && departData.length > 0" class="delete-btn" @click="onDeleteBtn">删除部门</div>
        </div>
        <ul class="list-box">
          <li class="list" v-if="selectAgree" style="background: #FAFAFA;"><el-checkbox v-model="allSelect" @change="onAllSelectChange"></el-checkbox><span style="margin-left: 10px; font-size: 12px;">全选</span></li>
          <div v-if="departData && departData.length > 0">
            <li
              class="list"
              v-for="(item, index) in departData"
              :key="index + 'o'">
              <div class="left" @click="item.isShow = !item.isShow && item.sonList.length > 0">
                <i v-if="!item.isShow && !selectAgree && item.sonList.length > 0" class="iconfont">&#xe6c1;</i>
                <i v-if="item.isShow && !selectAgree && item.sonList.length > 0" class="iconfont">&#xe6b4;</i>
                <el-checkbox v-if="selectAgree" v-model="item.isSelect" @change="onChange"></el-checkbox>
                <span v-if="item.sonList.length > 0">{{item.name}}</span>
                <span v-if="item.sonList.length <= 0 && !selectAgree" class="m47">{{item.name}}</span>
                <span v-if="item.sonList.length <= 0 && selectAgree">{{item.name}}</span>
              </div>
              <i class="iconfont right" @click="goDepartDetail(item)">&#xe6a4;</i>
              <ul class="list-second" v-show="item.isShow">
                <li v-for="(a, b) in item.sonList" :key="b + 't'"><el-checkbox v-if="selectAgree" v-model="a.isSelect" @change="onChange"></el-checkbox><span style="margin-left: 8px;">{{a.sonName}}</span><i class="iconfont sec-right"  @click="goDepartDetail(a)">&#xe6a4;</i></li>
              </ul>
            </li>
          </div>
          <li class="list" v-if="departData.length <= 0"><span style="color: #333;margin-left: 47px;">暂无子级部门，请添加。</span></li>
          <div v-if="selectAgree" class="bottom-btn">
            <span @click="selectAgree = false">取 消</span>
            <span @click="onDeleteDepart">确 认</span>
          </div>
        </ul>
      </div>
      <!-- 成员模块 -->
      <div v-if="tabState === 2" class="member">
        <div class="filter">
          <div class="filter-left">
            <el-input
              style="width: 334px;"
              size="small"
              v-model="filter['where.userName']"
              placeholder="请输入账户名/姓名查找"
              @keyup.enter.native="onSearch()">
              <i v-if="closeShow" slot="suffix" @click="onClear()" class="el-input__icon el-icon-close"></i>
              <i slot="suffix" @click="onSearch()" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="filter-right">
            <div class="create-btn" @click="onAdminNumber">管理成员</div>
          </div>
        </div>
        <el-table
          class="ar-table"
          :data="listData.list"
          border
          header-row-class-name="table-header">
          <el-table-column
            type="index"
            width="50px"
            label="序号"
            align="center"
            :show-overflow-tooltip="true"
            :index="indexMethod"/>
          <el-table-column
            prop="userMobile"
            label="账户名"
            align="center"
            :show-overflow-tooltip="true"/>
          <el-table-column
            prop="userName"
            label="姓名"
            align="center"
            :show-overflow-tooltip="true"/>
          <el-table-column
            prop="userSex"
            label="性别"
            align="center"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.userSex === 0">未知</span>
              <span v-if="scope.row.userSex === 1">男</span>
              <span v-if="scope.row.userSex === 2">女</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userEmail"
            label="邮箱"
            align="center"
            :show-overflow-tooltip="true"/>
          <el-table-column
            prop="lastLoginTime"
            label="最后登陆时间"
            align="center"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{scope.row.lastLoginTime | moment}}</span>
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
      </div>
    </div>
    <!-- 添加部门弹框 -->
    <el-dialog
      class="project-dialog"
      title="添加部门"
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
            <el-option v-for="(item, index) in addDepartList" :key="index" :label="item.organName" :value="item.uid"></el-option>
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
    <!-- 管理成员弹框 -->
    <el-dialog
      class="project-dialog edit-group-dialog"
      title="管理成员"
      :visible.sync="newNumberdialogVisible"
      width="520px"
      :append-to-body="true">
      <div class="content edit-group">
        <div class="left">
          <div class="title">当前成员</div>
          <el-checkbox-group v-model="checkOutNumbers" class="middle" @change="onChange">
            <el-checkbox v-for="(item, index) in selectNumbers" :key="index + 'role'" :label="item">{{item.userName}}</el-checkbox>
          </el-checkbox-group>
          <div class="bottom-btn" @click="onOutSelectNumber">删除所选成员</div>
        </div>
        <div class="right">
          <div class="title">可选成员</div>
          <el-input class="fuzzy" placeholder="请输入组名"/>
          <el-checkbox-group v-model="checkInNumbers" class="middle" @change="onChange">
            <el-checkbox v-for="(item, index) in allNumbers" :key="index + 'rolea'" :label="item">{{item.userName}}</el-checkbox>
          </el-checkbox-group>
          <div class="bottom-btn" @click="onAddSelectNumber">添加所选成员</div>
        </div>
      </div>
    </el-dialog>
    <!-- 删除部门弹框 -->
    <el-dialog
      class="project-dialog"
      title="删除部门"
      :visible.sync="deleteDepartdialogVisible"
      width="340px"
      :append-to-body="true">
      <div class="content" style="text-align: center;">
        <span class="text" style="padding: 0 30px;">删除时将删除部门及其下级部门，是否确认删除？</span>
      </div>
      <span slot="footer" class="dialog-footer double-btn-80">
        <el-button @click="onConfirmDeleteDepart">确 认</el-button>
        <el-button @click="deleteDepartdialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setCookie, getCookie } from '@/utils/util.js';
export default {
  data () {
    return {
      plateName: getCookie('plateName'),
      tabState: 1,
      listData: {},
      newNumberdialogVisible: false,
      checkOutNumbers: [], // 选中需要移除的配置成员
      checkInNumbers: [], // 选中需要移入的配置成员
      selectNumbers: [], // 当前已配成员
      allNumbers: [], // 当前可配成员
      filter: {
        'where.userName': null
      },
      pagination: {
        pageNum: 1,
        pageSize: 10,
        orderBy: null,
        order: null
      },
      currentPage: 1,
      closeShow: false,
      detailData: {},
      departData: [], // 下级部门数据
      selectAgree: false, // 是否出现多选删除按钮
      allSelect: false, // 是否全选
      newDepartData: {
        organName: null,
        organPid: null,
        chargeUserName: null,
        proKey: getCookie('proKey')
      }, // 新增部门弹框数据
      addDepartList: [],
      userList: [], // 已有的用户数据
      newDepartdialogVisible: false, // 新增部门弹窗提示
      deleteDepartdialogVisible: false, // 删除弹框提示
      errorShow: false, // 错误信息显示
      errorMsg: null // 错误信息提示语
    }
  },
  watch: {
    // 监听下级部门数据 是否全选
    departData: {
      handler (obj) {
        let a = 0;
        if (!obj) { return false }
        obj.forEach(item => {
          if (!item.isSelect) { a++; }
          if (item.sonList && item.sonList.length > 0) {
            item.sonList.forEach(vv => {
              if (!vv.isSelect) {
                a++;
              }
            })
          }
        })
        if (a > 0) {
          this.allSelect = false;
        } else {
          this.allSelect = true;
        }
      },
      deep: true
    }
  },
  mounted () {
    this.getDetailData();
    this.getList();
    this.getUserList();
  },
  methods: {
    onChange (val) {
      console.log(val);
    },
    // 部门成员列表
    getList () {
      let params = Object.assign({}, this.filter, this.pagination, {
        'where.uid': this.$route.params.id,
        'where.proKey': getCookie('proKey')
      })
      this.axios.get('S2/auth/authServices/organ/user', {params})
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
    // 部门详情
    getDetailData () {
      let params = {
        proKey: getCookie('proKey'),
        uid: this.$route.params.id
      }
      this.axios.get('S2/auth/authServices/organInfo', {params})
        .then(res => {
          if (res) {
            this.detailData = res.data;
            this.getDepartData();
          }
        })
    },
    // 获取两级部门
    getDepartData () {
      this.departData = [];
      this.addDepartList = [];
      let params = {
        'where.proKey': getCookie('proKey'),
        'where.organPid': this.$route.params.id
      }
      this.axios.get('S2/auth/authServices/organInfos', {params})
        .then(res => {
          if (res) {
            this.addDepartList.push({
              uid: this.detailData.uid,
              organName: this.detailData.organName
            })
            let restArr = [];
            res.data.list.forEach(item => {
              this.addDepartList.push({
                uid: item.uid,
                organName: item.organName
              })
              if (item.organLayer === this.detailData.organLayer + 1) {
                this.departData.push({
                  uid: item.uid,
                  name: item.organName,
                  isShow: false,
                  isSelect: false,
                  sonList: []
                })
              } else {
                restArr.push(item);
              }
            })
            restArr.forEach(a => {
              this.departData.forEach(b => {
                if (a.parentOrganName === b.name) {
                  b.sonList.push({
                    uid: a.uid,
                    sonName: a.organName,
                    isSelect: false
                  })
                }
              })
            })
          }
        })
    },
    // 部门传送门
    goDepartDetail (obj) {
      this.$router.push('/main/organization-detail/' + obj.uid);
      this.getDetailData();
    },
    // 删除按钮事件
    onDeleteBtn () {
      this.selectAgree = true;
    },
    // 新增部门
    onAddDepart () {
      this.errorShow = false;
      this.errorMsg = null;
      this.newDepartData.organName = null;
      this.newDepartData.organPid = null;
      this.newDepartData.chargeUserName = null;
      this.newDepartdialogVisible = true;
    },
    // 弹窗确认新增部门
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
            this.getDetailData();
            this.newDepartdialogVisible = false;
          }
        })
    },
    // 验证重名
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
    // 删除
    onDeleteDepart () {
      this.deleteDepartdialogVisible = true;
    },
    // 确认删除
    onConfirmDeleteDepart () {
      console.log(this.departData);
      let arr = [];
      this.departData.forEach(item => {
        if (item.isSelect) {
          arr.push(item.uid);
        }
        if (item.sonList && item.sonList.length > 0) {
          item.sonList.forEach(obj => {
            if (obj.isSelect) {
              arr.push(obj.uid);
            }
          })
        }
      })
      if (arr.length <= 0) {
        this.$message.warning('请选择删除项');
        this.deleteDepartdialogVisible = false;
        return false;
      } else {
        arr.forEach((items, index) => {
          this.departData.forEach(item => {
            if (item.sonList && item.sonList.length > 0) {
              item.sonList.forEach(obj => {
                if (item.isSelect && obj.uid === items) {
                  arr.splice(index, 1);
                }
              });
            }
          });
        });
      }
      arr = arr.join(',');
      let params = {
        proKey: getCookie('proKey'),
        uids: arr
      }
      this.axios.delete('S2/auth/authServices/organInfo', {params})
        .then(res => {
          if (res) {
            this.$message.success('删除成功');
            this.deleteDepartdialogVisible = false;
            this.selectAgree = false;
            this.getDetailData();
          }
        })
    },
    // 全选
    onAllSelectChange (val) {
      if (val) {
        this.departData.forEach(item => {
          if (item.sonList && item.sonList.length > 0) {
            item.sonList.forEach(obj => {
              obj.isSelect = true;
            })
          }
          item.isSelect = true;
        })
      } else {
        this.departData.forEach(item => {
          if (item.sonList && item.sonList.length > 0) {
            item.sonList.forEach(obj => {
              obj.isSelect = false;
            })
          }
          item.isSelect = false;
        })
      }
    },
    // 成员管理
    onAdminNumber () {
      this.selectNumbers = [];
      this.checkOutNumbers = [];
      this.allNumbers = [];
      this.checkInNumbers = [];
      this.listData.list.forEach(item => {
        this.selectNumbers.push({
          uid: item.uid,
          userName: item.userName
        })
      })
      this.axios.get('S2/auth/authServices/users?where.proKey=' + getCookie('proKey'))
        .then(res => {
          if (res) {
            if (this.selectNumbers && this.selectNumbers.length > 0) {
              this.selectNumbers.forEach(aa => {
                res.data.list.forEach((bb, index) => {
                  if (aa.userName === bb.userName) {
                    res.data.list.splice(index, 1);
                  }
                })
              })
            }
            res.data.list.forEach(zz => {
              this.allNumbers.push({
                uid: zz.uid,
                userName: zz.userName
              })
            })
          }
        })
      this.newNumberdialogVisible = true;
    },
    // 添加所选成员
    onAddSelectNumber () {
      console.log(this.checkInNumbers);
      let params = {
        proKey: getCookie('proKey'),
        organId: this.$route.params.id,
        userIds: []
      }
      this.checkInNumbers.forEach(item => {
        params.userIds.push(item.uid);
      })
      params.userIds = params.userIds.join(',');
      this.axios.post('S2/auth/authServices/organ/user', params)
        .then(res => {
          if (res) {
            this.checkInNumbers.forEach((aa, i) => {
              this.allNumbers.forEach((bb, index) => {
                if (aa.userName === bb.userName) {
                  this.allNumbers.splice(index, 1);
                }
              })
            })
            this.selectNumbers.splice(this.selectNumbers.length, 0, ...this.checkInNumbers);
            this.checkInNumbers = [];
            this.getList();
          }
        })
    },
    // 删除所选成员
    onOutSelectNumber () {
      let params = {
        proKey: getCookie('proKey'),
        organId: this.$route.params.id,
        userIds: []
      }
      this.checkOutNumbers.forEach(item => {
        params.userIds.push(item.uid);
      })
      params.userIds = params.userIds.join(',');
      this.axios.delete('S2/auth/authServices/organ/user', {params})
        .then(res => {
          if (res) {
            this.checkOutNumbers.forEach((aa, i) => {
              this.selectNumbers.forEach((bb, index) => {
                if (aa.userName === bb.userName) {
                  this.selectNumbers.splice(index, 1);
                }
              })
            })
            this.allNumbers.splice(this.allNumbers.length, 0, ...this.checkOutNumbers);
            this.checkOutNumbers = [];
            this.getList();
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
      this.filter['where.userName'] = '';
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
.um-main {
  .all-content {
    .header-tab {
      padding:20px 0 30px 0;
      > li {
        display: block;
        float: left;
        width: 120px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        border-top: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
        border-left: 1px solid #e8e8e8;
        text-decoration: none !important;
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
        &.active {
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
    }
    .depart {
      .title {
        font-size: 18px;
        color: #555;
        font-weight: 600;
        height: 45px; line-height: 45px;
        background: #FFF;
        padding-left: 38px;
      }
      .detail-line {
        width: 100%;
        padding: 0 38px;
        background: #fff;
        margin-top: 3px;
        > tr {
          > td {
            vertical-align: top;
            padding: 25px 10px 25px 0;
            > div {
              &:first-child {
                width: 80px;
                float: left;
                color: #333;
              }
              &:last-child {
                margin-left: 80px;
                color: #666;
                line-height: 20px;
              }
            }
          }
          td:nth-child(1) { width: 25%; }
          td:nth-child(2) { width: 25%; }
          td:nth-child(3) { width: 25%; }
          td:nth-child(4) { width: 25%; }
        }
      }
      .down-depart-title {
        background: #fff;
        height: 60px; line-height: 60px;
        border-left: 5px solid #1890FF;
        margin-top: 8px;
        > span {
          font-size: 16px;
          color: #333;
          padding-left: 18px;
        }
      }
      .btn-group {
        padding: 15px 23px;
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
        .delete-btn {
          display: inline-block;
          width: 98px; height: 36px;
          line-height: 36px;
          text-align: center;
          border-radius: 3px;
          background: #ED5666;
          color: #FFF;
          cursor: pointer;
          margin-left: 15px;
        }
      }
      .list-box {
        .list {
          line-height: 54px;
          background: #FFF;
          border-bottom: 1px solid #EBEBEB;
          i {color: #B3B3B3;font-size: 14px;cursor: pointer;padding-left: 24px;}
          .m47 { margin-left: 47px !important; }
          .el-checkbox {
            padding-left: 24px;
            /deep/ .el-checkbox__inner:hover {border-color: #1890FF;}
            /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
            /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
              background-color: #1890FF;
              border-color: #1890FF;
            }
          }
          .left {
            display: inline-block;
            width: 80%;
            cursor: pointer;
            span {
              font-size: 14px;
              color: #333;
              margin-left: 5px;
            }
          }
          .right {float: right;padding-right: 24px;}
          .list-second {
            li {
              padding: 0 24px 0 50px;
              border-bottom: 1px dashed #EBEBEB;
              color: #666;
              font-size: 14px;
              background: #FAFAFA;
              &:hover {background: #F2F2F2;}
              .sec-right {float: right;}
            }
            li:first-child {
              border-top: 1px solid #EBEBEB;
            }
            li:last-child {
              border-bottom: 1px solid #EBEBEB;
            }
          }
        }
        .bottom-btn {
          text-align: center;
          padding-bottom: 150px;
          padding-top: 40px;
          background: #fff;
          span {
            display: inline-block;
            width: 80px; height: 32px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            border-radius:3px;
          }
          span:nth-child(1) {
            border: 1px solid #DBDBDB;
            color: #666;
            margin-right: 20px;
          }
          span:nth-child(2) {
            color: #fff;
            background: #1890FF;
          }
        }
      }
    }
    .member {
      background: #fff;
      padding: 25px 25px 80px 25px;
      .filter {
        .create-btn {
          display: inline-block;
          width: 98px; height: 36px;
          line-height: 36px;
          text-align: center;
          border-radius: 3px;
          background: #1890FF;
          color: #FFF;
          cursor: pointer;
        }
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
.edit-group-dialog {
  /deep/ .el-dialog__body {
    padding: 10px 20px 40px 20px;
  }
  .edit-group {
    display: flex;
    .left {
      width: 210px;
      border-right: 4px solid #E5E5E5;
      .title {
        color: #666;
        font-size: 14px;
        height: 30px; line-height: 30px;
        margin-left: 15px;
      }
      .middle {
        width: 190px; height:241px;
        border: 1px solid #E5E5E5;
        display: flex;
        flex-direction: column;
        padding: 5px 0;
        overflow-y: scroll;
        /deep/ .el-checkbox+.el-checkbox {
          margin-left: 0;
        }
        /deep/ .el-checkbox {
          height: 30px; line-height: 30px;
          padding-left: 15px;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
        /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #1890FF;
          border-color: #1890FF;
        }
        /deep/ .el-checkbox__input.is-checked+.el-checkbox__label { color: #606266; }
        /deep/ .el-checkbox__inner:hover { border-color: #1890FF; }
      }
      .bottom-btn {
        width: 120px; height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 16px;
        background: #1890FF;
        color: #ffffff;
        margin: 20px 0 0 20px;
        cursor: pointer;
      }
    }
    .right {
      width: 258px;
      margin-left: 20px;
      .title {
        color: #666;
        font-size: 14px;
        height: 30px; line-height: 30px;
      }
      .fuzzy {
        /deep/ .el-input__inner {
          height: 36px; line-height: 36px;
        }
      }
      .middle {
        width: 258px; height:200px;
        border: 1px solid #E5E5E5;
        display: flex;
        flex-direction: column;
        padding: 5px 0;
        margin-top: 5px;
        overflow-y: scroll;
        /deep/ .el-checkbox+.el-checkbox {
          margin-left: 0;
        }
        /deep/ .el-checkbox {
          height: 30px; line-height: 30px;
          padding-left: 15px;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
        /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #1890FF;
          border-color: #1890FF;
        }
        /deep/ .el-checkbox__input.is-checked+.el-checkbox__label { color: #606266; }
        /deep/ .el-checkbox__inner:hover { border-color: #1890FF; }
      }
      .bottom-btn {
        width: 110px; height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 4px;
        background: #1890FF;
        color: #FFF;
        margin: 20px 0 0 70px;
        cursor: pointer;
      }
    }
  }
}
</style>
