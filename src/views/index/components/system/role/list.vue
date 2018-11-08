<template>
  <div class="c-main main">
    <div class="c-main-header">
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="pn-main">
      <div class="filter">
        <div class="filter-left">
          <el-input
            style="width: 334px;"
            size="small"
            v-model="filter['where.roleName']"
            placeholder="请输入角色名称查找"
            @keyup.enter.native="onSearch()">
            <i v-if="closeShow" slot="suffix" @click="onClear()" class="el-input__icon el-icon-close"></i>
            <i slot="suffix" @click="onSearch()" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="filter-right">
          <div @click="showAddDialog" class="create-btn">创建角色</div>
        </div>
      </div>
      <el-table
        class="ar-table"
        v-loading="loading"
        :data="roleList"
        border
        header-row-class-name="table-header">
        <el-table-column
          type="index"
          width="50px"
          label="序号"
          align="center"
          :show-overflow-tooltip="true"
          />
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
          :show-overflow-tooltip="true"/>
        <el-table-column
          prop="roleDesc"
          label="描述"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
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
          rop=""
          label="操作"
          align="center"
          width="200px"
          class-name="operate">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看权限" placement="bottom">
              <i class="iconfont" @click="onSeeLimit(scope.row)">&#xe69f;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑角色" placement="bottom">
              <i class="iconfont" @click="onEditRole(scope.row)">&#xe6a0;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="配置权限" placement="bottom">
              <i class="iconfont" @click="onEditLimit(scope.row)">&#xe6a6;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除角色" placement="bottom">
              <i class="iconfont" @click="deleteList(scope.row)">&#xe6af;</i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total > 0" class="pagination-box">
        <el-pagination
          @current-change="onPageChange"
          :current-page.sync="currentPage"
          :page-size="pagination.pageSize"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 查看权限弹框 -->
    <el-dialog
      class="th-delete-dialog limit-dialog"
      title="查看权限"
      :visible.sync="seeLimitDialogVisible"
      width="480px"
      center>
      <div class="content">
        <div class="left">
          <div class="title">权限组</div>
          <ul>
            <li :class="{'active': index === seeState}" v-for="(item, index) in groupList" :key="index + 'tt'" @click="onSeeGroup(item, index)">
              <span>{{item.groupName}}</span>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="title">{{seeRoleName}}</div>
          <div class="tree-list">
            <el-tree
              class="filter-tree"
              :data="seeLimitObj.A"
              :default-expand-all="false"
              node-key="resourceName"
              ref="trees"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="has_color" @click="onGoEditLimitDialog">配置权限</el-button>
      </span>
    </el-dialog>
    <!-- 创建角色弹框 -->
    <el-dialog title="创建角色" :visible.sync="dialogFormVisible" width='480px' class="th-delete-dialog new-department">
      <el-form class='add-depart-form' :model='addForm' ref="addForm">
        <el-form-item label="角色名称" label-width='85px' prop='roleName'>
          <el-input type="text" placeholder='请输入角色名称' style='width: 98%' v-model='addForm.roleName'></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width='85px' prop="roleDesc">
          <el-input type="textarea" rows="5" placeholder='请简要描述角色' style='width: 98%' v-model='addForm.roleDesc'></el-input>
        </el-form-item>
        <el-form-item label-width='85px' v-show="isShowError">
          <div class="error-msg">
            <i class="el-icon-error"></i>
            <span>{{errorMsg}}</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="no_color" @click="cancelAdd">取 消</el-button>
        <el-button class="has_color" @click="submitAddData">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 删除角色弹框 -->
    <el-dialog
      title="删除"
       class="th-delete-dialog"
      :visible.sync="deleteRoleDialog"
      width="480px"
      height='205px'
      >
      <div class="delete-text">
        <p>是否确定删除该角色及关联信息？</p>
        <p>删除后数据不可恢复</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="has_color" @click="onConfirmDelete">确 定</el-button>
        <el-button class="no_color" @click="deleteRoleDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹框 -->
    <el-dialog title="编辑角色" :visible.sync="editFormVisible" width='480px' class="th-delete-dialog new-department">
      <el-form class='add-depart-form' :model='editForm' ref="editForm">
        <el-form-item label="角色名称" label-width='85px' prop="roleName">
          <el-input type="text" placeholder='请输入角色名称' style='width: 98%' v-model='editForm.roleName'></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width='85px' prop="roleDesc">
          <el-input type="textarea" rows="5" placeholder='请简要描述角色' style='width: 98%' v-model='editForm.roleDesc'></el-input>
        </el-form-item>
        <el-form-item label-width='85px' v-show="isShowError">
          <div class="error-msg">
            <i class="el-icon-error"></i>
            <span>{{errorMsg}}</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="has_color" @click="onConfirmEditRole">保 存</el-button>
        <el-button class="no_color" @click="cancelEdit">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 配置权限弹框 -->
    <el-dialog
      class="limit-dialog th-delete-dialog"
      title="配置权限"
      :visible.sync="editLimitDialogVisible"
      width="480px"
      >
      <div class="content">
        <div class="left">
          <div class="title">权限组</div>
          <ul>
            <li :class="{'active': index === editState}" v-for="(item, index) in groupList" :key="index + 'yy'" @click="onSeeTarget(item, index)">
              <span>{{item.groupName}}</span>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="title">{{seeRoleName}}</div>
          <div class="tree-list">
            <el-tree
              class="filter-tree"
              :data="allLimitObj.A"
              show-checkbox
              :default-expand-all="false"
              check-strictly
              node-key="uid"
              ref="tree"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="no_color" @click="editLimitDialogVisible = false">取 消</el-button>
        <el-button type="primary" class="has_color" @click="onConfirmEditLimit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setCookie, getCookie } from '@/utils/util.js';
export default {
  data () {
    return {
      firstGroupId: null,
      dataObj: null,
      loading: true,
      profile: {},
      groupList: [],
      seeState: 0,
      editState: 0,
      seeRoleName: null,
      plateName: getCookie('plateName'),
      defaultProps: {
        children: 'children',
        label: 'resourceName'
      },
      filter: {
        'where.roleName': null
      },
      currentPage: 1,
      seeLimitObj: { A: [], B: [], C: [], D: [], E: [] },
      allLimitObj: { A: [], B: [], C: [], D: [], E: [] },
      defaultKeys: [], // 配置权限中默认选中的节点
      seeLimitItem: {}, // 查看权限对象
      deleteRoleDialog: false, // 删除角色
      dialogFormVisible: false, // 创建角色
      editFormVisible: false, // 编辑角色
      seeLimitDialogVisible: false, // 查看权限
      editLimitDialogVisible: false, // 配置权限
      pagination: {
        pageNum: 1,
        pageSize: 10,
        orderBy: 'update_time',
        order: 'desc'
      },
      total: 0,
      roleList: [],
      selectLimitItem: {},
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        uid: '',
        roleDesc: ''
      },
      errorMsg: '',
      isShowError: false,
      deleteId: '', // 要删除的角色id
      closeShow: false,
      timer: null
    }
  },
  destroyed () {
    clearTimeout(this.timer);
  },
  created () {
    this.getRoleList();
  },
  methods: {
    getGroupList (obj, text) {
      this.axios.get('S2/auth/resourceGroupServices/resourceGroups?where.proKey=' + getCookie('proKey') + '&pageSize=0')
        .then(res => {
          if (res) {
            res.data.list.forEach(a => {
              this.$set(a, 'list', [])
            })
            if (obj && obj.roleAuthList && obj.roleAuthList.length > 0) {
              res.data.list.forEach(b => {
                obj.roleAuthList.forEach(item => {
                  if (b.uid === item.groupId) {
                    b.list.push(item)
                  }
                })
              })
            }
            this.groupList = res.data.list
            console.log(this.groupList)
            if (this.groupList && this.groupList.length > 0) {
              this.groupList.forEach((c, d) => {
                if (c.groupName === '默认组') {
                  this.onMakeLimit(c.list)
                  this.getAuthorityList(c.authResourceInfoList)
                  this.seeState = d
                }
              })
            }
            if (text === 'edit') {
              console.log('111111111111', obj)
              this.setAA(obj);
            }
          }
        })
    },
    onSeeGroup (obj, i) {
      this.seeState = i;
      this.onMakeLimit(obj.list)
    },
    // 输入框查询
    onSearch () {
      this.closeShow = true;
      this.getRoleList();
    },
    // 清除输入框
    onClear () {
      this.filter['where.roleName'] = '';
      this.getRoleList();
      this.closeShow = false;
    },
    getAuthorityList (obj) { // 获取权限列表
      this.allLimitObj.A = [];
      this.allLimitObj.B = [];
      this.allLimitObj.C = [];
      this.allLimitObj.D = [];
      this.allLimitObj.E = [];
      obj.forEach(item => {
        if (item.resourceLayer === 1) {
          this.allLimitObj.A.push({
            uid: item.uid,
            groupId: item.groupId,
            parentUid: item.parentUid,
            resourceName: item.resourceName,
            resourceType: item.resourceType,
            isShow: true,
            children: []
          });
        }
        if (item.resourceLayer === 2) {
          this.allLimitObj.B.push({
            uid: item.uid,
            parentUid: item.parentUid,
            groupId: item.groupId,
            resourceName: item.resourceName,
            resourceType: item.resourceType,
            isShow: true,
            children: []
          });
        }
        if (item.resourceLayer === 3) {
          this.allLimitObj.C.push({
            uid: item.uid,
            parentUid: item.parentUid,
            groupId: item.groupId,
            resourceName: item.resourceName,
            resourceType: item.resourceType,
            isShow: true,
            children: []
          });
        }
        if (item.resourceLayer === 4) {
          this.allLimitObj.D.push({
            uid: item.uid,
            parentUid: item.parentUid,
            groupId: item.groupId,
            resourceName: item.resourceName,
            resourceType: item.resourceType,
            isShow: true,
            children: []
          });
        }
        if (item.resourceLayer === 5) {
          this.allLimitObj.E.push({
            uid: item.uid,
            parentUid: item.parentUid,
            groupId: item.groupId,
            resourceName: item.resourceName,
            resourceType: item.resourceType
          });
        }
      });
      console.log('1', this.allLimitObj.A)
      console.log('2', this.allLimitObj.B)
      console.log('3', this.allLimitObj.C)
      console.log('4', this.allLimitObj.D)
      console.log('5', this.allLimitObj.E)
      // console.log(this.allLimitObj);
      if (this.allLimitObj.A && this.allLimitObj.A.length > 0) {
        // 2
        this.allLimitObj.A.forEach(a => {
          this.allLimitObj.B.forEach(b => {
            if (a.uid === b.parentUid) {
              a.children.push(b);
            }
          })
        })
        // 3
        this.allLimitObj.A.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              this.allLimitObj.C.forEach(c => {
                if (b.uid === c.parentUid) {
                  b.children.push(c);
                }
              })
            })
          }
        })
        // 4
        this.allLimitObj.A.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              if (b.children && b.children.length > 0) {
                b.children.forEach(c => {
                  this.allLimitObj.D.forEach(d => {
                    if (c.uid === d.parentUid) {
                      c.children.push(d);
                    }
                  })
                })
              }
            })
          }
        })
        // 5
        this.allLimitObj.A.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              if (b.children && b.children.length > 0) {
                b.children.forEach(c => {
                  if (c.children && c.children.length > 0) {
                    c.children.forEach(d => {
                      this.allLimitObj.E.forEach(e => {
                        if (d.uid === e.parentUid) {
                          d.children.push(e);
                        }
                      })
                    })
                  }
                })
              }
            })
          }
        })
      }
      if (this.allLimitObj.A <= 0 && this.allLimitObj.B.length > 0) {
        // 2
        this.allLimitObj.B.forEach(a => {
          this.allLimitObj.C.forEach(b => {
            if (a.uid === b.parentUid) {
              a.children.push(b);
            }
          })
        })
        // 3
        this.allLimitObj.B.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              this.allLimitObj.D.forEach(c => {
                if (b.uid === c.parentUid) {
                  b.children.push(c);
                }
              })
            })
          }
        })
        // 4
        this.allLimitObj.B.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              if (b.children && b.children.length > 0) {
                b.children.forEach(c => {
                  this.allLimitObj.E.forEach(d => {
                    if (c.uid === d.parentUid) {
                      c.children.push(d);
                    }
                  })
                })
              }
            })
          }
        })
        this.allLimitObj.A = JSON.parse(JSON.stringify(this.allLimitObj.B))
      }
      if (this.allLimitObj.A.length <= 0 && this.allLimitObj.B.length <= 0 && this.allLimitObj.C.length > 0) {
        // 2
        this.allLimitObj.C.forEach(a => {
          this.allLimitObj.D.forEach(b => {
            if (a.uid === b.parentUid) {
              a.children.push(b);
            }
          })
        })
        // 3
        this.allLimitObj.C.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              this.allLimitObj.E.forEach(c => {
                if (b.uid === c.parentUid) {
                  b.children.push(c);
                }
              })
            })
          }
        })
        this.allLimitObj.A = JSON.parse(JSON.stringify(this.allLimitObj.C))
      }
      if (this.allLimitObj.A.length <= 0 && this.allLimitObj.B.length <= 0 && this.allLimitObj.C.length <= 0 && this.allLimitObj.D.length > 0) {
        // 2
        this.allLimitObj.D.forEach(a => {
          this.allLimitObj.E.forEach(b => {
            if (a.uid === b.parentUid) {
              a.children.push(b);
            }
          })
        })
        this.allLimitObj.A = JSON.parse(JSON.stringify(this.allLimitObj.D))
      }
      console.log('111', this.allLimitObj.A);
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getRoleList();
    },
    onSizeChange (val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getRoleList();
    },
    getRoleList () { // 分页获取角色列表
      if (!this.filter['where.roleName']) { this.filter['where.roleName'] = null };
      let params = Object.assign({}, this.filter, this.pagination, { 'where.proKey': getCookie('proKey') });
      this.axios.get('S2/auth/authServices/userRoles', {params})
        .then(res => {
          if (res) {
            this.roleList = res.data.list;
            this.total = res.data.total;
            this.loading = false;
          }
        })
    },
    selectData () { // 查询
      this.getRoleList();
    },
    onSeeLimit (obj) { // 查看权限
      console.log(obj)
      this.groupList = []
      this.seeRoleName = obj.roleName;
      this.getGroupList(obj, 'see')
      this.seeLimitItem = Object.assign({}, obj);
      this.seeLimitDialogVisible = true;
    },
    onMakeLimit (obj) {
      this.seeLimitObj.A = [];
      this.seeLimitObj.B = [];
      this.seeLimitObj.C = [];
      this.seeLimitObj.D = [];
      this.seeLimitObj.E = [];
      // this.seeLimitItem = Object.assign({}, obj);
      // this.seeRoleName = obj.roleName;
      obj.forEach(item => {
        if (item.resourceLayer === 1) {
          this.seeLimitObj.A.push({
            uid: item.uid,
            groupId: item.groupId,
            resourceName: item.resourceName,
            isShow: false,
            children: []
          });
        }
        if (item.resourceLayer === 2) {
          this.seeLimitObj.B.push({
            uid: item.uid,
            groupId: item.groupId,
            parentUid: item.parentUid,
            resourceName: item.resourceName,
            isShow: false,
            children: []
          });
        }
        if (item.resourceLayer === 3) {
          this.seeLimitObj.C.push({
            uid: item.uid,
            groupId: item.groupId,
            parentUid: item.parentUid,
            resourceName: item.resourceName,
            isShow: false,
            children: []
          });
        }
        if (item.resourceLayer === 4) {
          this.seeLimitObj.D.push({
            uid: item.uid,
            groupId: item.groupId,
            parentUid: item.parentUid,
            resourceName: item.resourceName,
            isShow: false,
            children: []
          });
        }
        if (item.resourceLayer === 5) {
          this.seeLimitObj.E.push({
            uid: item.uid,
            groupId: item.groupId,
            parentUid: item.parentUid,
            resourceName: item.resourceName
          });
        }
      });
      if (this.seeLimitObj.A && this.seeLimitObj.A.length > 0) {
        // 2
        this.seeLimitObj.A.forEach(a => {
          this.seeLimitObj.B.forEach(b => {
            if (a.uid === b.parentUid) {
              a.children.push(b);
            }
          })
        })
        // 3
        this.seeLimitObj.A.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              this.seeLimitObj.C.forEach(c => {
                if (b.uid === c.parentUid) {
                  b.children.push(c);
                }
              })
            })
          }
        })
        // 4
        this.seeLimitObj.A.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              if (b.children && b.children.length > 0) {
                b.children.forEach(c => {
                  this.seeLimitObj.D.forEach(d => {
                    if (c.uid === d.parentUid) {
                      c.children.push(d);
                    }
                  })
                })
              }
            })
          }
        })
        // 5
        this.seeLimitObj.A.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              if (b.children && b.children.length > 0) {
                b.children.forEach(c => {
                  if (c.children && c.children.length > 0) {
                    c.children.forEach(d => {
                      this.seeLimitObj.E.forEach(e => {
                        if (d.uid === e.parentUid) {
                          d.children.push(e);
                        }
                      })
                    })
                  }
                })
              }
            })
          }
        })
      }
      if (this.seeLimitObj.A.length <= 0 && this.seeLimitObj.B.length > 0) {
        // 2
        this.seeLimitObj.B.forEach(a => {
          this.seeLimitObj.C.forEach(b => {
            if (a.uid === b.parentUid) {
              a.children.push(b);
            }
          })
        })
        // 3
        this.seeLimitObj.B.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              this.seeLimitObj.D.forEach(c => {
                if (b.uid === c.parentUid) {
                  b.children.push(c);
                }
              })
            })
          }
        })
        // 4
        this.seeLimitObj.B.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              if (b.children && b.children.length > 0) {
                b.children.forEach(c => {
                  this.seeLimitObj.E.forEach(d => {
                    if (c.uid === d.parentUid) {
                      c.children.push(d);
                    }
                  })
                })
              }
            })
          }
        })
        this.seeLimitObj.A = JSON.parse(JSON.stringify(this.seeLimitObj.B))
      }
      if (this.seeLimitObj.A.length <= 0 && this.seeLimitObj.B.length <= 0 && this.seeLimitObj.C.length > 0) {
        // 2
        this.seeLimitObj.C.forEach(a => {
          this.seeLimitObj.D.forEach(b => {
            if (a.uid === b.parentUid) {
              a.children.push(b);
            }
          })
        })
        // 3
        this.seeLimitObj.C.forEach(a => {
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              this.seeLimitObj.E.forEach(c => {
                if (b.uid === c.parentUid) {
                  b.children.push(c);
                }
              })
            })
          }
        })
        this.seeLimitObj.A = JSON.parse(JSON.stringify(this.seeLimitObj.C))
      }
      if (this.seeLimitObj.A.length <= 0 && this.seeLimitObj.B.length <= 0 && this.seeLimitObj.C.length <= 0 && this.seeLimitObj.D.length > 0) {
        // 2
        this.seeLimitObj.D.forEach(a => {
          this.seeLimitObj.E.forEach(b => {
            if (a.uid === b.parentUid) {
              a.children.push(b);
            }
          })
        })
        this.seeLimitObj.A = JSON.parse(JSON.stringify(this.seeLimitObj.D))
      }
      console.log(this.seeLimitObj.A);
    },
    onEditRole (obj) { // 编辑角色
      this.editFormVisible = true;
      this.editForm.roleName = obj.roleName;
      this.editForm.roleDesc = obj.roleDesc;
      this.editForm.uid = obj.uid;
      this.isShowError = false;
      this.errorMsg = '';
    },
    // 编辑角色确认
    onConfirmEditRole () {
      this.editForm.proKey = getCookie('proKey');
      if (!this.editForm.roleName) {
        this.isShowError = true;
        this.errorMsg = '必填项不能为空';
        return false;
      }
      this.axios.put('S2/auth/authServices/userRole', this.editForm)
        .then(res => {
          if (res) {
            this.$message.success('修改成功');
            this.getRoleList();
            this.editFormVisible = false;
          }
        })
    },
    showAddDialog () { // 创建角色
      this.dialogFormVisible = true;
    },
    cancelAdd () { // 取消添加
      this.isShowError = false;
      this.errorMsg = '';
      this.addForm = {};
      this.dialogFormVisible = false;
    },
    cancelEdit () { // 取消编辑
      this.isShowError = false;
      this.errorMsg = '';
      this.editForm = {};
      this.editFormVisible = false;
    },
    submitAddData () { // 创建角色确认
      this.addForm.proKey = getCookie('proKey');
      if (!this.addForm.roleName) {
        this.isShowError = true;
        this.errorMsg = '此项内容不可为空';
        return;
      }
      this.axios.post('S2/auth/authServices/userRole', this.addForm)
        .then((res) => {
          if (res) {
            this.$message.success('创建成功');
            this.dialogFormVisible = false;
            this.getRoleList();
          }
        })
        .catch(() => {});
    },
    deleteList (obj) { // 删除角色
      this.deleteRoleDialog = true;
      this.deleteId = obj.uid;
    },
    onConfirmDelete () { // 删除角色确认
      this.axios.delete('S2/auth/authServices/userRole/' + this.deleteId + '?proKey=' + getCookie('proKey'))
        .then(res => {
          if (res) {
            this.$message.success('删除成功');
            this.deleteRoleDialog = false;
            this.getRoleList();
          } else {
            this.$message.error('删除失败，您暂无删除角色的权限');
          }
        })
      this.deleteRoleDialog = false;
    },
    onGoEditLimitDialog () {
      this.editState = 0
      this.seeLimitDialogVisible = false;
      for (let i = 0; i < this.seeLimitItem.roleAuthList.length; i++) {
        if (this.seeLimitItem.roleAuthList[i].groupName === '默认组') {
          this.firstGroupId = this.seeLimitItem.roleAuthList[i].groupId
          break
        } else {
          this.firstGroupId = null
        }
      }
      console.log(this.firstGroupId)
      this.onEditLimit(this.seeLimitItem);
    },
    getHaveLimit (a, b, keysArr) {
      if (a && a.length > 0) {
        a.forEach(item => {
          b.forEach(obj => {
            if (item.resourceName === obj.resourceName) {
              keysArr.push(obj.resourceName);
              if (obj.children && obj.children.length > 0) {
                this.getHaveLimit(a, obj.children, keysArr);
              }
            }
          })
        })
      }
    },
    onSeeTarget (data, i) {
      console.log('data', data)
      if (data.authResourceInfoList && data.authResourceInfoList.length > 0) {
        this.firstGroupId = data.authResourceInfoList[0].groupId
      }
      this.editState = i
      this.getAuthorityList(data.authResourceInfoList)
      this.setAA(this.dataObj)
      // this.setAA(data)
    },
    // 配置权限
    onEditLimit (obj) {
      console.log(obj)
      this.dataObj = Object.assign({}, obj);
      this.groupList.length = 0
      this.seeRoleName = obj.roleName
      this.getGroupList(obj, 'edit')
    },
    setAA (obj) {
      this.selectLimitItem = {};
      console.log('obj', obj)
      let keysArr = [];
      this.defaultKeys = [];
      if (obj.roleAuthList && obj.roleAuthList.length > 0) {
        console.log(this.allLimitObj.A)
        obj.roleAuthList.forEach(item => {
          this.allLimitObj.A.forEach(b => {
            if (b.uid === item.uid) {
              // if (b.children && b.children.length === 0) {
              keysArr.push(item.uid)
              // }
            }
          })
          this.allLimitObj.B.forEach(b => {
            if (b.uid === item.uid) {
              if (b.children && b.children.length > 0) {
                b.children.forEach(child => {
                  if (child.uid === item.uid) {
                    keysArr.push(item.uid)
                  }
                })
              }
              keysArr.push(item.uid)
            }
          })
          this.allLimitObj.C.forEach(b => {
            if (b.uid === item.uid) {
              if (b.children && b.children.length > 0) {
                b.children.forEach(child => {
                  if (child.uid === item.uid) {
                    keysArr.push(item.uid)
                  }
                })
              }
              keysArr.push(item.uid)
            }
          })
          this.allLimitObj.D.forEach(b => {
            if (b.uid === item.uid) {
              if (b.children && b.children.length > 0) {
                b.children.forEach(child => {
                  if (child.uid === item.uid) {
                    keysArr.push(item.uid)
                  }
                })
              }
              keysArr.push(item.uid)
            }
          })
          this.allLimitObj.E.forEach(b => {
            if (b.uid === item.uid) {
              if (b.children && b.children.length > 0) {
                b.children.forEach(child => {
                  if (child.uid === item.uid) {
                    keysArr.push(item.uid)
                  }
                })
              }
              keysArr.push(item.uid)
            }
          })
        })
      }
      // 递归
      // this.getHaveLimit(obj.roleAuthList, this.allLimitObj.A, keysArr)
      this.defaultKeys = JSON.parse(JSON.stringify(keysArr));
      console.log(this.defaultKeys)
      this.timer = setTimeout(() => {
        this.$refs.tree.setCheckedKeys(this.defaultKeys);
      }, 200)
      this.selectLimitItem = Object.assign({}, obj);
      this.editLimitDialogVisible = true;
    },
    onConfirmEditLimit () { // 配置权限确认
      let oldAuthArr = []; // 已有的权限
      let checkAuthArr = []; // 页面上已经勾选上的
      let arr = [];
      let addArr = [];
      let deleteArr = [];
      const treeList = this.$refs.tree.getCheckedNodes();
      // console.log('treeList', treeList)
      if (treeList.length > 0) {
        treeList.map((item) => {
          checkAuthArr.push(item);
          arr.push(item);
        });
      }
      if (this.selectLimitItem.roleAuthList.length > 0) {
        this.selectLimitItem.roleAuthList.map((item) => {
          oldAuthArr.push(item);
        });
      }
      console.log('checkAuthArr', checkAuthArr)
      console.log('oldAuthArr', oldAuthArr)
      const finalCheckArr = [...new Set(checkAuthArr)]; // 数组去重
      let finalCheckArr1 = JSON.parse(JSON.stringify(finalCheckArr));
      let oldAuthArr1 = JSON.parse(JSON.stringify(oldAuthArr));
      let oldAuthArr2 = []
      // 增加
      if (finalCheckArr1 && finalCheckArr1.length > 0) {
        for (let j = 0; j < oldAuthArr.length; j++) {
          for (let i = 0; i < finalCheckArr1.length; i++) {
            if (oldAuthArr[j].uid === finalCheckArr1[i].uid && oldAuthArr[j].groupId === finalCheckArr1[i].groupId) {
              finalCheckArr1.splice(i, 1);
            }
          }
        }
      }
      addArr = JSON.parse(JSON.stringify(finalCheckArr1));
      // 删除
      oldAuthArr2 = oldAuthArr1.filter(item => { return item.groupId === this.firstGroupId })
      console.log(oldAuthArr2);
      if (oldAuthArr2 && oldAuthArr2.length > 0) {
        for (let j = 0; j < finalCheckArr.length; j++) {
          for (let i = 0; i < oldAuthArr2.length; i++) {
            if (oldAuthArr2[i].uid === finalCheckArr[j].uid) {
              oldAuthArr2.splice(i, 1);
            }
          }
        }
      }
      // console.log(this.firstGroupId)
      deleteArr = JSON.parse(JSON.stringify(oldAuthArr2));
      // console.log(oldAuthArr2)
      // console.log(finalCheckArr)
      console.log('addArr', addArr)
      console.log('deleteArr', deleteArr)
      let params = {
        uid: this.selectLimitItem.uid,
        proKey: getCookie('proKey'),
        authResourceList: []
      }
      addArr.forEach(a => {
        params.authResourceList.push({
          opType: 1,
          uid: a.uid
        })
      })
      deleteArr.forEach(b => {
        params.authResourceList.push({
          opType: 3,
          uid: b.uid
        })
      })
      if (params.authResourceList && params.authResourceList.length > 0) {
        this.axios.post('S2/auth/authServices/roleAuthBatch', params)
          .then(res => {
            if (res) {
              this.$message.success('配置成功');
              this.editLimitDialogVisible = false;
              this.getRoleList();
            }
          })
      } else {
        this.editLimitDialogVisible = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  .pn-main {
    background: #fff;
    padding: 20px 25px 80px 25px;
    margin-top: 3px;
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
  }
}
.c-main {
  .filter-box {
    width: 100%; height: 90px;
    line-height: 90px;
    background: #fff;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .c-export {
      display: inline-block;
      width: 80px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #fff;
      border-radius: 2px;
      background: #393D49;
      cursor: pointer;
    }
    .c-tips {
      display: flex;
      i {
        font-size: 20px;
      }
      span {
        color: #666666;
        font-size: 14px;
      }
      div {
        display: flex;
        align-items: center;
      }
      .c-tips-first {
        margin-right: 20px;
      }
    }
    .filter-select-inp {
      display: inline-block;
      width: 342px;
    }
  }
  .no_color {
    border-color: #E5E5E5;
    margin-right: 5px;
  }
  .new-department {
    /deep/ .el-dialog__body {
      padding: 30px 70px;
    }
    .add-depart-form {
      width: 100%;
      /deep/ .el-form-item__label {
        text-align: left;
        line-height: 32px;
      }
      /deep/ .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
      /deep/ .el-form-item {
        margin-bottom: 20px;
      }
      /deep/ .el-form-item:first-child label:after {
        content: '*';
        color: #f56c6c;
        margin-left: 4px;
      }
      .error-msg {
        width: 98%;
        height:32px;
        line-height: 32px;
        text-align: left;
        background: #FFF6F6;
        padding-left: 10px;
        border: 1px solid #FDC9C9;
        border-radius: 3px;
        i {
          color: #FF0000;
        }
        span {
          color: #FF0000;
          font-size: 12px;
        }
      }
    }
  }
  .limit-dialog {
    .content {
      display: flex;
      flex-direction: row;
      width: 100%;
      .left {
        width: 200px;
        .title {
          padding: 10px 0;
        }
        > ul {
          width: 160px;
          height: 300px;
          border: 1px solid #E7EAEC;
          overflow: auto;
          > li {
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            > span {
              padding-left: 15px;
            }
          }
          li.active,
          li:hover {
            color: #1890FF;
          }
        }
      }
      .right {
        .title {
          text-align: left;
          padding: 10px 0;
        }
        .tree-list {
          border: 1px solid #E7EAEC;
          width: 250px;
          height: 300px;
          padding: 0 20px 0 15px;
          overflow: auto;
          /deep/ .el-tree {
            padding-top: 10px;
          }
        }
      }
    }
    /deep/ .el-button {
      background: #0785FD;
      color: #fff;
    }
    /deep/ .el-icon-caret-right:before {
      content: '';
    }
    /deep/ .el-tree-node__expand-icon.is-leaf {
      background: none;
    }
    /deep/ .el-tree-node__expand-icon {
      background: url('../../../../../assets/img/expand.png') no-repeat;
    }
    /deep/ .el-tree-node__expand-icon.expanded {
      background: url('../../../../../assets/img/takeup.png') no-repeat;
      transform: none;
    }
    /deep/ .el-checkbox__inner:hover {border-color: #686CEE;}
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
    /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #686CEE;
      border-color: #686CEE;
    }
    /deep/ .el-tree-node__label {
      margin-left: 5px;
    }
    /deep/ .el-checkbox__inner {
      margin-left: 5px;
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
          background-color: #686CEE;
          border-color: #686CEE;
        }
        /deep/ .el-checkbox__input.is-checked+.el-checkbox__label { color: #606266; }
        /deep/ .el-checkbox__inner:hover { border-color: #686CEE; }
      }
      .bottom-btn {
        width: 120px; height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 20px;
        background: #F4F4FF;
        color: #686CEE;
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
          background-color: #686CEE;
          border-color: #686CEE;
        }
        /deep/ .el-checkbox__input.is-checked+.el-checkbox__label { color: #606266; }
        /deep/ .el-checkbox__inner:hover { border-color: #686CEE; }
      }
      .bottom-btn {
        width: 110px; height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 2px;
        background: #686CEE;
        color: #FFF;
        margin: 20px 0 0 70px;
        cursor: pointer;
      }
    }
  }
}
</style>
