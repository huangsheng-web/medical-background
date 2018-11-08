<template>
  <div class="pm-main">
    <div class="filter">
      <div class="filter-left">
        <el-select
          class="filterSelect"
          v-model="filter['where.groupId']"
          style="width: 208px;"
          clearable
          size="small"
          placeholder="全部用户组"
          @change="onSelectChange">
          <el-option v-for="(item, index) in dropDownGroupList" :key="index + 'd'" :label="item.groupName" :value="item.uid"/>
        </el-select>
      </div>
      <div class="filter-right">
        <el-input
          style="width: 334px;"
          size="small"
          v-model="filter['where.keyWord']"
          placeholder="请输入用户名/姓名搜索查找"
          @keyup.enter.native="onSearch()">
          <i v-if="closeShow" slot="suffix" @click="onClear()" class="el-input__icon el-icon-close"></i>
          <i slot="suffix" @click="onSearch()" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
    <div class="create-module">
      <div @click="onCreateProject" class="create-btn">创建用户</div>
    </div>
    <el-table
      class="ar-table"
      :data="listData.list"
      border
      v-loading="loading"
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
        prop="createTime"
        label="创建时间"
        align="center"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | moment}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="最后登陆时间"
        align="center"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.lastLoginTime">{{scope.row.lastLoginTime | moment}}</span>
          <span v-else>未登录</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sysUserGroupInfos"
        label="所属组"
        align="center"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.sysUserGroupInfos" :key="index + 't'" v-if="index < scope.row.sysUserGroupInfos[scope.row.sysUserGroupInfos.length - 1].allgroup">{{item.groupName}}</p>
          <p v-if="scope.row.sysUserGroupInfos[scope.row.sysUserGroupInfos.length - 1].isShowAllGroup && scope.row.sysUserGroupInfos.length > 4" class="expand" @click="onOpenAll(scope.row)">展开全部<i class="iconfont row-insert-i">&#xe6c2;</i></p>
          <p v-if="!scope.row.sysUserGroupInfos[scope.row.sysUserGroupInfos.length - 1].isShowAllGroup && scope.row.sysUserGroupInfos.length > 4" class="expand" @click="onCloseAll(scope.row)">收起<i class="iconfont row-insert-i">&#xe6b0;</i></p>
        </template>
      </el-table-column>
      <el-table-column
        prop="sysUserRoleInfos"
        label="角色配置"
        align="center"
        width="180px"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.sysUserRoleInfos" :key="index + 't'" v-if="index < scope.row.sysUserRoleInfos[scope.row.sysUserRoleInfos.length - 1].allgroup">{{item.roleName}}</p>
          <p v-if="scope.row.sysUserRoleInfos[scope.row.sysUserRoleInfos.length - 1].isShowAllGroup && scope.row.sysUserRoleInfos.length > 4" class="expand" @click="onOpenAllT(scope.row)">展开全部<i class="iconfont row-insert-i">&#xe6c2;</i></p>
          <p v-if="!scope.row.sysUserRoleInfos[scope.row.sysUserRoleInfos.length - 1].isShowAllGroup && scope.row.sysUserRoleInfos.length > 4" class="expand" @click="onCloseAllT(scope.row)">收起<i class="iconfont row-insert-i">&#xe6b0;</i></p>
        </template>
      </el-table-column>
      <el-table-column
        prop="isForce"
        label="状态"
        align="center"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.isForce">禁用</span>
          <span v-else>启用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        align="center"
        width="200px"
        class-name="operate">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
            <i class="iconfont" @click="onEdit(scope.row)">&#xe6a0;</i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="重置密码" placement="bottom">
            <i class="iconfont" @click="resetPwdList(scope.row)">&#xe6c8;</i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改所属组" placement="bottom">
            <i class="iconfont" @click="onEditGroups(scope.row)">&#xe6be;</i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="配置角色" placement="bottom">
            <i class="iconfont" @click="onEditRoles(scope.row)">&#xe6a6;</i>
          </el-tooltip>
          <el-tooltip v-if="scope.row.isForce" class="item" effect="dark" content="启用" placement="bottom">
            <i class="iconfont" @click="onUpUser(scope.row)">&#xe6a8;</i>
          </el-tooltip>
          <el-tooltip v-if="!scope.row.isForce" class="item" effect="dark" content="禁用" placement="bottom">
            <i class="iconfont" @click="onForBidUser(scope.row)">&#xe6a9;</i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
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
    <!-- 修改所属组弹框 -->
    <el-dialog
      class="project-dialog edit-group-dialog"
      title="修改所属组"
      :visible.sync="editGroupdialogVisible"
      width="520px"
      :append-to-body="true">
      <div class="content edit-group">
        <div class="left">
          <div class="title">当前所属组</div>
          <el-checkbox-group v-model="checkOutGroups" class="middle" @change="onChange">
            <el-checkbox v-for="(item, index) in selectGroups" :key="index + 'group'" :label="item">{{item.groupName}}</el-checkbox>
          </el-checkbox-group>
          <div class="bottom-btn" @click="onOutSelectGroup">移出所选组</div>
        </div>
        <div class="right">
          <div class="title">可选组</div>
          <el-input class="fuzzy" placeholder="请输入组名"/>
          <el-checkbox-group v-model="checkInGroups" class="middle" @change="onChange">
            <el-checkbox v-for="(item, index) in allGroups" :key="index + 'groupa'" :label="item">{{item.groupName}}</el-checkbox>
          </el-checkbox-group>
          <div class="bottom-btn" @click="onAddSelectGroup">加入所选组</div>
        </div>
      </div>
    </el-dialog>
    <!-- 配置角色弹框 -->
    <el-dialog
      class="project-dialog edit-group-dialog"
      title="配置角色"
      :visible.sync="newRoledialogVisible"
      width="520px"
      :append-to-body="true">
      <div class="content edit-group">
        <div class="left">
          <div class="title">已配角色</div>
          <el-checkbox-group v-model="checkOutRoles" class="middle" @change="onChange">
            <el-checkbox v-for="(item, index) in selectRoles" :key="index + 'role'" :label="item">{{item.roleName}}</el-checkbox>
          </el-checkbox-group>
          <div class="bottom-btn" @click="onOutSelectRole">删除所选角色</div>
        </div>
        <div class="right">
          <div class="title">可选角色</div>
          <el-input class="fuzzy" placeholder="请输入组名"/>
          <el-checkbox-group v-model="checkInRoles" class="middle" @change="onChange">
            <el-checkbox v-for="(item, index) in allRoles" :key="index + 'rolea'" :label="item">{{item.roleName}}</el-checkbox>
          </el-checkbox-group>
          <div class="bottom-btn" @click="onAddSelectRole">添加所选角色</div>
        </div>
      </div>
    </el-dialog>
    <!-- 编辑信息弹框 -->
    <el-dialog
      class="project-dialog"
      title="编辑信息"
      :visible.sync="editdialogVisible"
      width="400px"
      :append-to-body="true">
      <div class="content">
        <div class="line">
          <span class="line-title">用户名</span>
          <span class="line-name">{{editItem.userMobile}}</span>
        </div>
        <div class="line">
          <span class="line-title">姓名</span>
          <el-input v-model="editItem.userName" size="small" placeholder="请输入姓名"/>
        </div>
        <div class="line">
          <span class="line-title">身份号码</span>
          <el-input v-model="editItem.userIdcard" size="small" placeholder="请输入用户身份证号码"/>
        </div>
        <div class="line">
          <span class="line-title">性别</span>
          <el-radio-group class="retire-page-radio" v-model="editItem.userSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </div>
        <div class="line">
          <span class="line-title">邮箱</span>
          <el-input v-model="editItem.userEmail" size="small" placeholder="请输入邮箱"/>
        </div>
        <div class="line">
          <span class="line-title">居住地</span>
          <el-select
            v-model="editItem.province"
            style="width: 120px;"
            clearable
            size="small"
            placeholder="请选择省份"
            @change="onProvinceChange"
            value-key="uid">
            <el-option v-for="item in provinceData" :key="item.uid" :label="item.cname" :value="item"/>
          </el-select>
          <el-select
            v-model="editItem.city"
            style="width: 120px; margin-left: 8px;"
            clearable
            size="small"
            placeholder="请选择城市">
            <el-option v-for="item in cityData" :key="item.uid" :label="item.cname" :value="item.cname"/>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer double-btn-80">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button @click="onConfirmEdit">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog
      class="project-dialog"
      title="删除"
      :visible.sync="deletedialogVisible"
      width="340px"
      :append-to-body="true">
      <div class="content">
        <p class="text two-line-tip">是否确认删除该用户及相关信息？</p>
        <p class="text two-line-warning"><i class="el-icon-warning"></i>删除后数据不可恢复</p>
      </div>
      <span slot="footer" class="dialog-footer double-btn-80">
        <el-button @click="onConfirmDelete">确 认</el-button>
        <el-button @click="deletedialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 重置密码提示弹框 -->
    <el-dialog
      class="project-dialog"
      title="重置密码"
      :visible.sync="resetPwddialogVisible"
      width="340px"
      :append-to-body="true">
      <div class="content">
        <p class="text two-line-tip">是否重置密码？</p>
        <p class="text" style="font-size: 12px; color: #666;">重置后，新密码将以短信形式发送给用户</p>
      </div>
      <span slot="footer" class="dialog-footer double-btn-80">
        <el-button @click="onConfirmResetPwd">确 认</el-button>
        <el-button @click="resetPwddialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setCookie, getCookie } from '@/utils/util.js';
export default {
  data () {
    return {
      listData: {},
      loading: true,
      checkOutGroups: [], // 选中需要移除的所选组
      checkInGroups: [], // 选中需要移入的所选组
      selectGroups: [], // 当前所选组
      allGroups: [], // 当前可选组
      checkOutRoles: [], // 选中需要移除的配置角色
      checkInRoles: [], // 选中需要移入的配置角色
      selectRoles: [], // 当前已配角色
      allRoles: [], // 当前可配角色
      groupUserId: null, // 当前用户id
      roleUserId: null, // 当前用户id
      dropDownGroupList: [], // 筛选列表
      deletedialogVisible: false, // 删除提示
      deleteItem: {},
      resetPwddialogVisible: false, // 重置密码提示
      editdialogVisible: false, // 编辑信息提示
      editItem: {},
      provinceData: [], // 省份列表
      cityData: [], // 城市列表
      editGroupdialogVisible: false, // 修改所属组弹框
      newRoledialogVisible: false, // 配置角色弹框
      filter: {
        'where.groupId': null,
        'where.keyWord': null
      },
      pagination: {
        pageNum: 1,
        pageSize: 10,
        orderBy: null,
        order: null
      },
      currentPage: 1,
      closeShow: false
    }
  },
  created () {
    this.getList();
    this.getAllGroups();
    this.getProvince(); // 省份
  },
  methods: {
    onChange (val) {
      console.log(val);
    },
    // 获取列表数据
    getList () {
      if (!this.filter['where.groupId']) { this.filter['where.groupId'] = null }
      let params = Object.assign({}, this.filter, this.pagination, { 'where.proKey': getCookie('proKey') });
      this.axios.get('S2/auth/authServices/users', {params})
        .then(res => {
          if (res) {
            res.data.list.forEach(obj => {
              if (obj.sysUserGroupInfos) {
                obj.sysUserGroupInfos[obj.sysUserGroupInfos.length] = {
                  allgroup: 3,
                  isShowAllGroup: true
                }
              }
              if (obj.sysUserRoleInfos) {
                obj.sysUserRoleInfos[obj.sysUserRoleInfos.length] = {
                  allgroup: 3,
                  isShowAllGroup: true
                }
              }
            });
            this.listData = res.data;
            this.loading = false;
          }
        })
    },
    onOpenAll (obj) {
      obj.sysUserGroupInfos[obj.sysUserGroupInfos.length - 1].allgroup = 99999;
      obj.sysUserGroupInfos[obj.sysUserGroupInfos.length - 1].isShowAllGroup = false;
    },
    onCloseAll (obj) {
      obj.sysUserGroupInfos[obj.sysUserGroupInfos.length - 1].allgroup = 3;
      obj.sysUserGroupInfos[obj.sysUserGroupInfos.length - 1].isShowAllGroup = true;
    },
    onOpenAllT (obj) {
      obj.sysUserRoleInfos[obj.sysUserRoleInfos.length - 1].allgroup = 99999;
      obj.sysUserRoleInfos[obj.sysUserRoleInfos.length - 1].isShowAllGroup = false;
    },
    onCloseAllT (obj) {
      obj.sysUserRoleInfos[obj.sysUserRoleInfos.length - 1].allgroup = 3;
      obj.sysUserRoleInfos[obj.sysUserRoleInfos.length - 1].isShowAllGroup = true;
    },
    // 获取筛选列表
    getAllGroups () {
      this.axios.get('S2/auth/authServices/userGroups', {params: {'where.proKey': getCookie('proKey')}})
        .then(res => {
          if (res) {
            this.dropDownGroupList = res.data.list;
          }
        })
    },
    onEditGroups (obj) {
      this.groupUserId = obj.uid;
      this.selectGroups = [];
      this.checkOutGroups = [];
      this.allGroups = [];
      this.checkInGroups = [];
      obj.sysUserGroupInfos.forEach(item => {
        if (item.uid && item.groupName) {
          this.selectGroups.push({
            uid: item.uid,
            groupName: item.groupName
          })
        }
      })
      this.axios.get('S2/auth/authServices/userGroups', {params: {'where.proKey': getCookie('proKey')}})
        .then(res => {
          if (res) {
            this.selectGroups.forEach(aa => {
              res.data.list.forEach((bb, index) => {
                if (aa.groupName === bb.groupName) {
                  res.data.list.splice(index, 1);
                }
              })
            })
            res.data.list.forEach(zz => {
              this.allGroups.push({
                uid: zz.uid,
                groupName: zz.groupName
              })
            })
          }
        })
      this.editGroupdialogVisible = true;
    },
    onEditRoles (obj) {
      this.roleUserId = obj.uid;
      this.selectRoles = [];
      this.checkOutRoles = [];
      this.allRoles = [];
      this.checkInRoles = [];
      obj.sysUserRoleInfos.forEach(item => {
        if (item.uid && item.roleName) {
          this.selectRoles.push({
            uid: item.uid,
            roleName: item.roleName
          })
        }
      })
      this.axios.get('S2/auth/authServices/userRoles', {params: {'where.proKey': getCookie('proKey'), 'pageSize': 0}})
        .then(res => {
          if (res) {
            this.selectRoles.forEach(aa => {
              res.data.list.forEach((bb, index) => {
                if (aa.roleName === bb.roleName) {
                  res.data.list.splice(index, 1);
                }
              })
            })
            console.log(res.data.list);
            res.data.list.forEach(zz => {
              this.allRoles.push({
                uid: zz.uid,
                roleName: zz.roleName
              })
            })
          }
        })
      this.newRoledialogVisible = true;
    },
    // 加入所选组
    onAddSelectGroup () {
      console.log(this.checkInGroups);
      let params = {
        proKey: getCookie('proKey'),
        uid: this.groupUserId,
        uids: []
      }
      this.checkInGroups.forEach(cc => {
        params.uids.push(cc.uid);
      })
      this.axios.post('S2/auth/authServices/userBatchGroup', params)
        .then(res => {
          if (res) {
            this.checkInGroups.forEach((aa, i) => {
              this.allGroups.forEach((bb, index) => {
                if (aa.groupName === bb.groupName) {
                  this.allGroups.splice(index, 1);
                }
              })
            })
            this.selectGroups.splice(this.selectGroups.length, 0, ...this.checkInGroups);
            this.checkInGroups = [];
            this.getList();
          }
        })
    },
    // 移出所选组
    onOutSelectGroup () {
      let params = {
        proKey: getCookie('proKey'),
        uid: this.groupUserId,
        uids: []
      }
      this.checkOutGroups.forEach(cc => {
        params.uids.push(cc.uid);
      })
      this.axios.delete('S2/auth/authServices/userBatchGroup', {data: params})
        .then(res => {
          if (res) {
            this.checkOutGroups.forEach((aa, i) => {
              this.selectGroups.forEach((bb, index) => {
                if (aa.groupName === bb.groupName) {
                  this.selectGroups.splice(index, 1);
                }
              })
            })
            this.allGroups.splice(this.allGroups.length, 0, ...this.checkOutGroups);
            this.checkOutGroups = [];
            this.getList();
          }
        })
    },
    // 加入配置角色
    onAddSelectRole () {
      let params = {
        proKey: getCookie('proKey'),
        userId: this.roleUserId,
        roleIdList: []
      }
      this.checkInRoles.forEach(cc => {
        params.roleIdList.push(cc.uid);
      })
      this.axios.post('S2/auth/authServices/userBatchRole', params)
        .then(res => {
          if (res) {
            this.checkInRoles.forEach((aa, i) => {
              this.allRoles.forEach((bb, index) => {
                if (aa.roleName === bb.roleName) {
                  this.allRoles.splice(index, 1);
                }
              })
            })
            this.selectRoles.splice(this.selectRoles.length, 0, ...this.checkInRoles);
            this.checkInRoles = [];
            this.getList();
          }
        })
    },
    // 移出配置角色
    onOutSelectRole () {
      let params = {
        proKey: getCookie('proKey'),
        userId: this.roleUserId,
        roleIdList: []
      }
      this.checkOutRoles.forEach(cc => {
        params.roleIdList.push(cc.uid);
      })
      this.axios.delete('S2/auth/authServices/userBatchRole', {data: params})
        .then(res => {
          if (res) {
            this.checkOutRoles.forEach((aa, i) => {
              this.selectRoles.forEach((bb, index) => {
                if (aa.roleName === bb.roleName) {
                  this.selectRoles.splice(index, 1);
                }
              })
            })
            this.allRoles.splice(this.allRoles.length, 0, ...this.checkOutRoles);
            this.checkOutRoles = [];
            this.getList();
          }
        })
    },
    // 创建用户
    onCreateProject () {
      this.$router.push({name: 'userCreate'});
    },
    // 获取省份列表
    getProvince () {
      let params = { parentUid: '00000000-0000-0000-0000-000000000000' }
      this.axios.get('S2/auth/usersServices/areas', {params})
        .then((res) => {
          if (res) {
            this.provinceData = res.data;
          }
        })
    },
    // 省份改变时
    onProvinceChange (obj) {
      this.cityData = {};
      this.editItem.city = null;
      let params = { parentUid: obj.uid }
      this.axios.get('S2/auth/usersServices/areas', {params})
        .then((res) => {
          if (res) {
            this.cityData = res.data;
          }
        })
    },
    // 编辑信息
    onEdit (obj) {
      this.editItem = obj;
      this.editdialogVisible = true;
    },
    // 编辑信息确认
    onConfirmEdit () {
      let obj = {
        uid: this.editItem.uid,
        proKey: getCookie('proKey'),
        userName: this.editItem.userName,
        userIdcard: this.editItem.userIdcard,
        userSex: this.editItem.userSex,
        userEmail: this.editItem.userEmail,
        province: this.editItem.province.cname,
        city: this.editItem.city
      }
      console.log(obj);
      this.axios.put('S2/auth/authServices/user', obj)
        .then(res => {
          if (res) {
            this.$message.success('修改成功');
            this.editdialogVisible = false;
          }
        })
    },
    // 启用
    onUpUser (obj) {
      let params = {
        uid: obj.uid,
        proKey: getCookie('proKey'),
        isForce: false
      }
      this.axios.put('S2/auth/authServices/user', params)
        .then(res => {
          if (res) {
            this.$message.success('启用成功');
            this.getList();
          }
        })
    },
    // 禁用
    onForBidUser (obj) {
      let params = {
        uid: obj.uid,
        proKey: getCookie('proKey'),
        isForce: true
      }
      this.axios.put('S2/auth/authServices/user', params)
        .then(res => {
          if (res) {
            this.$message.success('禁用成功');
            this.getList();
          }
        })
    },
    // 删除
    deleteList (obj) {
      this.deleteItem = obj;
      this.deletedialogVisible = true;
    },
    onConfirmDelete () {
      this.axios.delete('S2/auth/authServices/user/' + this.deleteItem.uid + '?proKey=' + getCookie('proKey'))
        .then(res => {
          if (res) {
            this.$message.success('删除成功');
            this.deletedialogVisible = false;
            this.getList();
          }
        })
    },
    // 重置密码提示
    resetPwdList (obj) {
      this.resetPwddialogVisible = true;
    },
    // 重置密码确认提示
    onConfirmResetPwd () {
      this.resetPwddialogVisible = false;
    },
    // 过滤实时查询
    onSelectChange () {
      this.getList();
    },
    // 输入框查询
    onSearch () {
      this.closeShow = true;
      this.getList();
    },
    // 清除输入框
    onClear () {
      this.filter['where.keyWord'] = '';
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
  .create-module {
    height: 54px;
    line-height: 54px;
    border-radius: 2px;
    background: #F5F5F5;
    margin-top: 20px;
    padding: 0 20px;
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
  }
  .ar-table {
    margin-top: 20px;
    .expand {
      width:86px; height:26px;
      background:#FFF;
      border-radius:12px;
      line-height: 26px;
      text-align: center;
      font-size: 12px;
      color: #999;
      border: 1px solid #DBDBDB;
      cursor: pointer;
      margin: 0 auto;
      .row-insert-i {
        font-size: 12px;
        color: #999;
        margin-left: 3px;
      }
      &:hover {
        color: #1890FF;
        border: 1px solid #1890FF;
        background:#F4FFFE;
        .row-insert-i {
          color: #1890FF;
        }
      }
    }
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
    /deep/ .operate {
      .cell {
        width: 185px;
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
  .filter{
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
  .line-name {
    color: #333;
  }
  .retire-page-datepicker {
    /deep/ .el-input__prefix {
      right: 5px;
      left: auto;
    }
    /deep/ .el-input__inner {
      padding-left: 15px;
    }
  }
  .retire-page-radio {
    margin-left: 15px;
    /deep/ .el-radio__input.is-checked .el-radio__inner {
      border-color: #009688;
      background: #009688;
    }
    /deep/ .el-radio__input.is-checked+.el-radio__label {
      color: #606266;
    }
    /deep/ .el-radio__inner:hover {
      border-color: #009688;
    }
  }
}
.pagination-box{
  .el-pagination{
    .el-pager{
      margin: 0 20px!important;
    }
  }
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
