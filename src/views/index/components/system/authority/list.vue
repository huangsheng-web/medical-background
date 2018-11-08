<template>
  <div class="authority-list c-main">
    <div class="body">
      <div class="body-content" v-if="groupList && groupList.length > 0">
        <div class="left">
          <div class="title">
            <span>权限组</span>
          </div>
          <ul class="group-box">
            <li class="add">
              <el-input v-model="groupName" placeholder="快速添加组">
                <span slot="append" @click="onGroupAdd">添加</span>
                <span slot="append" @click="groupName = null">取消</span>
              </el-input>
            </li>
            <li v-for="(item, index) in groupList" :key="index + 'gg'" @click="onSeeTarget(item)">
              <span class="text" v-if="!item.editState">{{item.groupName}}</span>
              <div class="btn-group" v-if="index !== 0 && !item.editState">
                <i @click.stop="onGroupEdit(item, index)" class="el-icon-edit"></i>
                <i @click.stop="onGroupDelete(item)" class="el-icon-delete"></i>
              </div>
              <el-input v-if="item.editState" ref="content" @blur="onGroupBlur(item, index)" v-model="item.groupName"/>
            </li>
          </ul>
        </div>
        <div class="right">
          <p class="title">权限管理</p>
          <div class="body-detail">
            <el-tree
              :data="allLimitObj.A"
              node-key="uid"
              @node-drag-start="handleDragStart"
              @node-drop="handleDrop"
              draggable
              :default-expand-all="false"
              :props="defaultProps"
              :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ data.resourceName }}</span>
                <span class="operation">
                  <!--<i class="iconfont" @click.stop="onAddLimit(data)">&#xe612;</i>-->
                  <i class="iconfont" @click.stop="onEditRole(data)">&#xe6a0;</i>
                  <!--<i class="iconfont drag">&#xe6eb;</i>-->
                  <i class="iconfont" @click.stop="onDeleteLimit(data)">&#xe6af;</i>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="nothing" v-else>
        <img src="../../../../../assets/img/no_limit.png" />
        <p>亲爱的主人，您暂无权限哦!</p>
        <div class="create-authority" @click="createFirstLimit">创建权限</div>
      </div>
    </div>
    <!-- 添加权限弹框 -->
    <el-dialog
      title="创建权限"
      class="new-department th-delete-dialog"
      :visible.sync="addLimitDialogVisible"
      width="480px"
      center>
      <el-form class='add-depart-form' :model="addForm">
        <el-form-item label="权限名称" label-width='85px'>
          <el-input type="text" v-model="addForm.resourceName" placeholder='请输入权限名称' style='width: 98%'></el-input>
        </el-form-item>
        <el-form-item label-width='85px' v-show="isShowError">
          <div class="error-msg">
            <i class="el-icon-error"></i>
            <span>{{errorMsg}}</span>
          </div>
        </el-form-item>
        <el-form-item label="权限类型" label-width='85px'>
          <el-select placeholder="请选择权限类型" style='width: 98%' v-model="addForm.resourceType">
            <el-option label="菜单" :value="1"></el-option>
            <el-option label="按钮" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限组" label-width='85px'>
          <el-select placeholder="请选择权限组" style='width: 98%' v-model="addForm.groupId">
            <el-option v-for="(item, index) in groupList" :key="index + 'jj'" :label="item.groupName" :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="no_color" @click="addLimitDialogVisible = false">取 消</span>
        <span class="has_color" @click="onConfirmAddLimit">保 存</span>
      </span>
    </el-dialog>
    <!-- 编辑权限弹框 -->
    <el-dialog
      title="编辑权限"
      class="new-department th-delete-dialog"
      :visible.sync="editLimitDialogVisible"
      width="480px"
      >
      <el-form class='add-depart-form'>
        <el-form-item label="权限名称" label-width='85px'>
          <el-input type="text" v-model="editLimitItem.resourceName" placeholder='请输入权限名称' style='width: 98%'></el-input>
        </el-form-item>
        <el-form-item label-width='85px' v-show="isShowError">
          <div class="error-msg">
            <i class="el-icon-error"></i>
            <span>{{errorMsg}}</span>
          </div>
        </el-form-item>
        <el-form-item label="权限类型" label-width='85px'>
          <el-select placeholder="请选择权限类型" style='width: 98%' v-model="editLimitItem.resourceType">
            <el-option label="菜单" :value="1"></el-option>
            <el-option label="按钮" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限组" label-width='85px'>
          <el-select placeholder="请选择权限组" style='width: 98%' v-model="editLimitItem.groupId">
            <el-option v-for="(item, index) in groupList" :key="index + 'jj'" :label="item.groupName" :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="no_color" @click="editLimitDialogVisible = false">取 消</span>
        <span class="has_color" @click="onConfirmEditLimit">保 存</span>
      </span>
    </el-dialog>
    <!-- 删除权限弹框 -->
    <el-dialog
      class="th-delete-dialog"
      title="删除提示"
      width="480px"
      :visible.sync="deleteLimitdialogVisible">
      <div class="delete-text">
        <p>是否确定删除该权限？</p>
        <p>删除后数据不可恢复</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="has_color" @click="onConfirmDelete">确 定</span>
        <span class="no_color" @click="deleteLimitdialogVisible = false">取 消</span>
      </span>
    </el-dialog>
    <!-- 删除权限组弹框 -->
    <el-dialog
      class="th-delete-dialog"
      title="删除提示"
      width="480px"
      :visible.sync="deletegroupdialogVisible">
      <div class="delete-text">
        <p>是否删除？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="has_color" @click="onConfirmGroupDelete">确 定</span>
        <span class="no_color" @click="deletegroupdialogVisible = false">取 消</span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { setCookie, getCookie } from '@/utils/util.js';
export default {
  data () {
    return {
      profile: {},
      groupName: null,
      compareGroupName: null,
      groupList: [],
      deletegroupdialogVisible: false,
      allLimitObj: { A: [], B: [], C: [], D: [], E: [] },
      limitArr: [],
      params: {},
      startNode: null,
      parentUd: null,
      deleteLimitdialogVisible: false, // 删除权限
      editLimitDialogVisible: false, // 编辑权限
      addLimitDialogVisible: false, // 创建权限
      addForm: {
        resourceName: null,
        resourceType: null,
        parentUid: null,
        proKey: null,
        groupId: null
      },
      isShowError: false,
      errorMsg: '',
      editLimitItem: {},
      deleteItem: {},
      defaultProps: {
        children: 'children',
        label: 'resourceName'
      }
    }
  },
  mounted () {
    this.addForm.proKey = getCookie('proKey')
    this.profile = JSON.parse(sessionStorage.getItem('TOKEN'))
    // this.getAuthorityList()
    this.getGroupList()
  },
  methods: {
    // 添加权限组
    onGroupAdd () {
      if (!this.groupName) {
        this.$message.warning('请填写组名')
        return false
      }
      let params = {}
      params.groupName = this.groupName
      params.proKey = getCookie('proKey')
      params.opUserId = this.profile.uid
      params.groupOrder = this.groupList.length
      this.axios.post('S2/auth/resourceGroupServices/resourceGroup', params)
        .then(res => {
          if (res) {
            this.groupName = null;
            this.getGroupList()
            this.$message.success('添加成功');
          }
        })
    },
    getGroupList () {
      this.axios.get('S2/auth/resourceGroupServices/resourceGroups?where.proKey=' + getCookie('proKey') + '&pageSize=0')
        .then(res => {
          if (res) {
            this.groupList = res.data.list
            if (res.data.list && res.data.list.length > 0) {
              res.data.list.forEach(item => {
                if (item.groupName === '默认组') {
                  this.onSeeTarget(item)
                }
                this.$set(item, 'editState', false)
              })
            }
          }
        })
    },
    onSeeTarget (data) {
      this.getAuthorityList(data.authResourceInfoList)
    },
    onGroupEdit (obj, index) {
      this.groupList.forEach((item, i) => {
        if (index !== i && item.editState) {
          this.groupList[i].editState = false;
        }
      })
      this.compareGroupName = obj.groupName;
      obj.editState = true
      this.$nextTick(() => {
        this.$refs.content[0].focus()
      })
    },
    onGroupBlur (obj, index) {
      if (this.compareGroupName === obj.groupName) {
        this.groupList.forEach((item, i) => {
          this.groupList[i].editState = false;
        })
      } else {
        this.groupList.forEach((item, i) => {
          this.groupList[i].editState = false;
        })
        let params = {}
        params.uid = obj.uid
        params.proKey = getCookie('proKey')
        params.groupName = obj.groupName
        this.axios.put('S2/auth/resourceGroupServices/resourceGroup', params)
          .then(res => {
            if (res) {
              this.getGroupList()
              this.$message.success('修改成功')
            }
          })
      }
    },
    onGroupDelete (obj) {
      this.deleteGroupItem = obj;
      this.deletegroupdialogVisible = true;
    },
    onConfirmGroupDelete () {
      this.axios.delete('S2/auth/resourceGroupServices/resourceGroup?uid=' + this.deleteGroupItem.uid + '&proKey=' + getCookie('proKey'))
        .then(res => {
          if (res) {
            this.getGroupList()
            this.deletegroupdialogVisible = false;
            this.$message.success('删除成功')
          }
        })
    },
    handleDragStart (node, ev) {
      this.params = {};
      this.startNode = null;
      this.params.uid = node.data.uid;
      this.startNode = node.data.resourceLayer;
      this.parentUd = node.data.parentUid;
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      this.params.parentUid = dropNode.data.parentUid;
      this.params.proKey = getCookie('proKey');
      if (dropNode.data.resourceLayer !== this.startNode || dropNode.data.parentUid !== this.parentUd || dropType === 'inner') {
        this.getGroupList();
        return false
      }
      if (dropType === 'before') {
        this.params.resourceNumber = dropNode.data.resourceLeft - 1;
        if (dropNode.data.resourceLayer === 1) {
          if (this.params.resourceNumber === 1) {
            this.params.resourceNumber = null;
          }
        }
        if (dropNode.data.resourceLayer === 2) {
          this.allLimitObj.A.forEach(item => {
            if (this.params.resourceNumber === item.resourceLeft) {
              this.params.resourceNumber = null;
            }
          })
        }
        if (dropNode.data.resourceLayer === 3) {
          this.allLimitObj.B.forEach(item => {
            if (this.params.resourceNumber === item.resourceLeft) {
              this.params.resourceNumber = null;
            }
          })
        }
        if (dropNode.data.resourceLayer === 4) {
          this.allLimitObj.C.forEach(item => {
            if (this.params.resourceNumber === item.resourceLeft) {
              this.params.resourceNumber = null;
            }
          })
        }
        if (dropNode.data.resourceLayer === 5) {
          this.allLimitObj.D.forEach(item => {
            if (this.params.resourceNumber === item.resourceLeft) {
              this.params.resourceNumber = null;
            }
          })
        }
      } else if (dropType === 'after') {
        this.params.resourceNumber = dropNode.data.resourceRight;
      }
      this.axios.put('S2/auth/authServices/authResource', this.params)
        .then(res => {
          if (res) {
            this.getGroupList();
          }
        })
    },
    // 获取权限列表
    getAuthorityList (data) {
      this.allLimitObj.A = [];
      this.allLimitObj.B = [];
      this.allLimitObj.C = [];
      this.allLimitObj.D = [];
      this.allLimitObj.E = [];
      data.forEach(item => {
        if (item.resourceLayer === 1) {
          this.allLimitObj.A.push({
            uid: item.uid,
            parentUid: item.parentUid,
            resourceName: item.resourceName,
            resourceType: item.resourceType,
            resourceLeft: item.resourceLeft,
            resourceRight: item.resourceRight,
            resourceLayer: item.resourceLayer,
            groupId: item.groupId,
            isShow: true,
            children: []
          });
        }
        if (item.resourceLayer === 2) {
          this.allLimitObj.B.push({
            uid: item.uid,
            parentUid: item.parentUid,
            resourceName: item.resourceName,
            resourceType: item.resourceType,
            resourceLeft: item.resourceLeft,
            resourceRight: item.resourceRight,
            resourceLayer: item.resourceLayer,
            groupId: item.groupId,
            isShow: true,
            children: []
          });
        }
        if (item.resourceLayer === 3) {
          this.allLimitObj.C.push({
            uid: item.uid,
            parentUid: item.parentUid,
            resourceName: item.resourceName,
            resourceType: item.resourceType,
            resourceLeft: item.resourceLeft,
            resourceRight: item.resourceRight,
            resourceLayer: item.resourceLayer,
            groupId: item.groupId,
            isShow: true,
            children: []
          });
        }
        if (item.resourceLayer === 4) {
          this.allLimitObj.D.push({
            uid: item.uid,
            parentUid: item.parentUid,
            resourceName: item.resourceName,
            resourceType: item.resourceType,
            resourceLeft: item.resourceLeft,
            resourceRight: item.resourceRight,
            resourceLayer: item.resourceLayer,
            groupId: item.groupId,
            isShow: true,
            children: []
          });
        }
        if (item.resourceLayer === 5) {
          this.allLimitObj.E.push({
            uid: item.uid,
            parentUid: item.parentUid,
            resourceName: item.resourceName,
            resourceType: item.resourceType,
            resourceLeft: item.resourceLeft,
            resourceRight: item.resourceRight,
            resourceLayer: item.resourceLayer,
            groupId: item.groupId
          });
        }
      });
      // console.log(this.allLimitObj);
      // 2
      if (this.allLimitObj.A && this.allLimitObj.A.length > 0) {
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
      if (this.allLimitObj.A.length <= 0 && this.allLimitObj.B.length > 0) {
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
        this.allLimitObj.D.forEach(a => {
          this.allLimitObj.E.forEach(b => {
            if (a.uid === b.parentUid) {
              a.children.push(b);
            }
          })
        })
        this.allLimitObj.A = JSON.parse(JSON.stringify(this.allLimitObj.D))
      }
    },
    createFirstLimit () {
      // this.addForm.resourceName = null;
      // this.addForm.resourceType = null;
      // this.addForm.groupId = null;
      this.addForm = {}
      this.addLimitDialogVisible = true;
    },
    // 确认删除权限
    onConfirmDelete () {
      this.axios.delete('S2/auth/authServices/authResource?uid=' + this.deleteItem.uid + '&proKey=' + getCookie('proKey'))
        .then(res => {
          if (res) {
            this.$message.success('删除成功');
            this.getAuthorityList();
            this.deleteLimitdialogVisible = false;
          }
        })
        .catch(() => {});
    },
    // 确认编辑权限
    onConfirmEditLimit () {
      if (!this.editLimitItem.resourceName) {
        this.isShowError = true;
        this.errorMsg = '此项内容不可为空';
        return false;
      }
      let params = {
        parentUid: this.editLimitItem.parentUid,
        resourceName: this.editLimitItem.resourceName,
        resourceType: this.editLimitItem.resourceType,
        uid: this.editLimitItem.uid,
        groupId: this.editLimitItem.groupId,
        proKey: getCookie('proKey')
      }
      this.axios.put('S2/auth/authServices/authResource', params)
        .then(res => {
          if (res) {
            this.$message.success('修改成功');
            this.getGroupList();
            this.editLimitDialogVisible = false;
          }
        })
        .catch(() => {})
      this.editLimitDialogVisible = false;
    },
    // 确认添加权限
    onConfirmAddLimit () {
      this.addForm.proKey = getCookie('proKey')
      if (!this.addForm.resourceName) {
        this.isShowError = true;
        this.errorMsg = '此项内容不可为空';
        return false;
      }
      this.axios.post('S2/auth/authServices/authResource', this.addForm)
        .then(res => {
          if (res) {
            this.$message.success('新增成功');
            this.getGroupList();
            this.addLimitDialogVisible = false;
          }
        })
        .catch(() => {})
      this.addLimitDialogVisible = false;
    },
    onNewLimitChange () {},
    // 添加权限
    onAddLimit (obj) {
      this.addForm = {};
      // this.addForm.resourceName = null;
      // this.addForm.resourceType = null;
      // this.addForm.groupId = null;
      this.addLimitDialogVisible = true;
      this.isShowError = false;
      this.errorMsg = '';
      if (obj.uid) {
        this.addForm.parentUid = obj.uid;
      }
    },
    // 编辑权限
    onEditRole (obj) {
      this.editLimitDialogVisible = true;
      this.isShowError = false;
      this.errorMsg = '';
      this.editLimitItem = Object.assign({}, obj);
      console.log(this.editLimitItem)
    },
    // 删除权限
    onDeleteLimit (obj) {
      this.deleteItem = Object.assign({}, obj);
      this.deleteLimitdialogVisible = true;
    }
  }
}
</script>
<style lang="less" scoped>
  .authority-list {
    min-height: 740px;
    .header {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .body {
      width: 100%;
      background: #fff;
      min-height: 95%;
      position: relative;
      overflow: auto;
      .nothing {
        position: absolute;
        text-align: center;
        left: 45%;
        top: 35%;
        p {
          color: #999999;
          font-size: 14px;
          margin: 20px 0;
        }
        .create-authority {
          color: #fff;
          background: #393D49;
          width: 100px;
          height: 40px;
          line-height: 40px;
          margin: 0 auto;
          border-radius: 2px;
          cursor: pointer;
        }
      }
      .body-content {
        padding: 20px 20px 20px 0;
        display: flex;
        .left {
          width: 300px;
          .title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            border-left: 3px solid #1890FF;
            color: #333;
          }
          .group-box {
            width: 250px;
            min-height: 400px;
            margin: 15px 30px 0 20px;
            border: 1px solid #EBEBEB;
            > li {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
              &:hover {
                background: #FAFAFA;
                .btn-group {
                  display: block;
                }
              }
              .btn-group {
                display: none;
                margin-right: 10px;
                i:nth-child(1) {
                  color:#1890FF;
                  margin-right: 5px;
                }
                i:nth-child(2) {
                  color: #B8B8B8;
                }
              }
            }
            > li:not(:first-child) {
              height: 42px;
              line-height: 42px;
              border-bottom: 1px solid #EBEBEB;
              color: #555;
              > .text {
                margin-left: 15px;
              }
              .el-input {
                padding: 0 10px;
              }
              /deep/ .el-input__inner {
                border-radius: 2px;
                height: 32px;
                line-height: 32px;
                border-color: #B3DCFE;
              }
            }
            .add {
              /deep/ .el-input__inner {
                border-radius: 0;
                border: 0;
                border-bottom: 1px solid #EBEBEB;
              }
              /deep/ .el-input-group__append {
                border-radius: 0;
                border: 0;
                background-color: #fff;
                padding: 0;
                border-bottom: 1px solid #EBEBEB;
                padding-right: 5px;
                > span {
                  display: inline-block;
                  width: 38px;
                  height: 25px;
                  line-height: 26px;
                  text-align: center;
                  font-size: 6px;
                  cursor: pointer;
                  color: #1890FF;
                  &:first-child {
                    background: #1890FF;
                    border-radius: 3px;
                    color: #fff;
                  }
                }
              }
            }
          }
        }
        .right {
          .title {
            font-size: 14px;
            color: #333333;
            height: 30px;
            line-height: 30px;
            // margin-bottom: 15px;
          }
          .body-detail {
            border: 1px solid #E7EAEC;
            width: 410px;
            min-height: 400px;
            margin-top: 15px;
            padding: 30px;
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
            /deep/ .custom-tree-node {
              margin-left: 8px;
              height: 100%;
              width: 100%;
              display: flex;
              cursor: move;
              justify-content: space-between;
              >span {
                color: #333333;
                font-size: 14px;
              }
            }
            /deep/ .el-tree-node__content {
              height: 32px;
              line-height: 32px;
              // padding-left: 5px !important;
            }
            /deep/ .el-tree-node__content>.el-tree-node__expand-icon {
              margin-left: 6px;
            }
            /deep/ .el-tree-node__content:hover {
              background: #E6F7FF;
              .operation {
                display: block;
              }
            }
            .operation {
              margin-right: 30px;
              display: none;
            }
          }
        }
      }
    }
    /deep/ .el-dialog__header {
      background: #F0F0F0 !important;
      text-align: left !important;
      color: #555555;
      font-weight: bold;
      font-size: 16px;
    }
    /deep/  .el-dialog--center .el-dialog__body {
      text-align: center !important;
      padding: 25px 25px 10px;
    }
    .noSureBtn {
      background:#393D49;
      height:35px;
      color: #fff;
      line-height: 10px;
    }
    .sureBtn {
      border-color:#e5e5e5;
      height:35px;
      line-height: 10px;
      color:#666666;
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
          margin-bottom: 10px;
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
    .no_color {
      border-color: #E5E5E5 !important;
      margin-right: 5px;
    }
  }
</style>
