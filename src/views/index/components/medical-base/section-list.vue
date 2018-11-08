<template>
  <div class="section-list">
    <div class="title"><i class="icon iconfont">&#xe691;</i><span>科室维护</span></div>
    <div style="padding-bottom: 16px;margin-bottom: 16px;border-bottom: 1px solid rgba(232,232,232,1);">
      <label style="color: rgba(0,0,0,1);">科室：</label>
      <el-select v-model="deptUid" size="small" filterable placeholder="请选择">
        <el-option label="全部科室" :value="null"></el-option>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.deptName"
          :value="item.uid">
        </el-option>
      </el-select>
      <el-button style="margin-left: 25px;" icon="el-icon-search" size="small" @click="getOfficesDropdownList(2, 1)">搜索</el-button>
    </div>
    <div style="margin-bottom: 16px;">
      <el-button type="primary" class="add" size="small" @click="dialogAdd = true;deptName = null">添加科室</el-button>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="deptListDate.list"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="科室"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="diseaseTotal"
          label="疾病数量">
        </el-table-column>
        <el-table-column
          label="添加时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | moment() }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <span style="cursor: pointer;margin-right: 10px;color: #1890FF;" @click="popUpUpdateBox(scope.row.uid, scope.row.deptName)">修改</span>
            <span style="color: #E9E9E9;">|</span>
            <span v-if="scope.row.diseaseTotal <= 0" @click="popUpDeleteBox(scope.row.uid, scope.row.deptName)" style="cursor: pointer;margin-left: 10px;color: #1890FF;">删除</span>
            <el-tooltip v-else class="item" effect="dark" content="该科室存在疾病，不能删除" placement="top">
              <span style="color: #999;margin-left: 10px;">删除</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
    </div>
     <div class="pagination-box" v-if="deptListDate.list && deptListDate.list.length > 0">
        <el-pagination
          background
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20]"
          layout="total, prev, pager, next, sizes, jumper"
          :total="deptListDate.total">
        </el-pagination>
      </div>
      <el-dialog
        :visible.sync="dialogDel"
        :close-on-click-modal="false"
        width="290px"
        top="40vh"
        center>
        <p style="color: #333333;text-align: center;">确定删除&nbsp;{{updateDeptName}}&nbsp;吗？</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="loadingBtn" @click="delDeptById">确 定</el-button>
          <el-button @click="dialogDel = false" plain>取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加科室"
        :visible.sync="dialogAdd"
        :close-on-click-modal="false"
        width="327px"
        top="40vh"
        center>
        <div style="display: flex;">
          <label for="name" style="width: 35%;line-height: 30px;">科室名称：</label>
          <el-input :maxlength="20" v-model="deptName" id="name" size="small" placeholder="请填写" @keyup.enter.native="addOffices"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="loadingBtn" @click="addOffices">确 定</el-button>
          <el-button @click="dialogAdd = false" plain>取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改科室"
        :visible.sync="dialogUpdate"
        :close-on-click-modal="false"
        width="327px"
        top="40vh"
        center>
        <div style="display: flex;">
          <label for="name" style="width: 35%;line-height: 30px;">科室名称：</label>
          <el-input v-model="updateDeptName" size="small" id="name" placeholder="请填写" @keyup.enter.native="updateOffices"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="loadingBtn" @click="updateOffices">确 定</el-button>
          <el-button @click="dialogUpdate = false" plain>取 消</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      options: [],
      deptUid: '',
      operateDeptUid: null,
      deptListDate: {},
      deptName: null,
      updateDeptName: null,
      currentPage: 1,
      dialogDel: false,
      dialogAdd: false,
      dialogUpdate: false,
      loading: false,
      loadingBtn: false
    }
  },
  created () {
    this.getOfficesDropdownList(1);
    this.getOfficesDropdownList(2, 1);
  },
  mounted () {
  },
  methods: {
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getOfficesDropdownList(2);
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getOfficesDropdownList(2);
    },
    popUpUpdateBox (uid, name) {
      this.operateDeptUid = uid;
      this.updateDeptName = name;
      this.dialogUpdate = true;
    },
    popUpDeleteBox (uid, name) {
      this.operateDeptUid = uid;
      this.updateDeptName = name;
      this.dialogDel = true;
    },
    // 添加科室
    addOffices () {
      let value = this.Trim(this.deptName, 'g');
      if ((!this.deptName || value) && value.length === 0) {
        this.$message.error('科室名称不能为空！');
        return false;
      }
      this.loadingBtn = true;
      this.axios.post('/hisServices/repository/diseasedept', {
        deptName: value
      })
        .then(res => {
          if (res) {
            console.log(res);
            this.$message.success('添加科室成功！');
            this.dialogAdd = false;
            this.getOfficesDropdownList(1);
            this.getOfficesDropdownList(2);
          }
        })
        .finally(() => {
          this.loadingBtn = false;
        })
    },
    // 修改科室
    updateOffices () {
      let value = this.Trim(this.updateDeptName, 'g');
      if (!this.updateDeptName || value.length === 0) {
        this.$message.error('科室名称不能为空！');
        return false;
      }
      if (value.length > 20) {
        this.$message.error('科室名称不能超过20个字符！');
        return false;
      }
      this.loadingBtn = true;
      this.axios.put('/hisServices/repository/diseasedept', {
        deptName: value,
        uid: this.operateDeptUid
      })
        .then(res => {
          if (res) {
            console.log(res);
            this.$message.success('修改科室成功！');
            this.dialogUpdate = false;
            this.getOfficesDropdownList(1);
            this.getOfficesDropdownList(2);
          }
        })
        .finally(() => {
          this.loadingBtn = false;
        })
    },
    // 删除科室
    delDeptById () {
      this.loadingBtn = true;
      this.axios.delete('/hisServices/repository/diseasedept?uid=' + this.operateDeptUid)
        .then(res => {
          console.log(res);
          if (res) {
            this.$message.success('删除科室成功！');
            this.dialogDel = false;
            this.getOfficesDropdownList(1);
            this.getOfficesDropdownList(2);
          }
        })
        .finally(() => {
          this.loadingBtn = false;
        })
    },
    // 分页查询科室下拉列表
    getOfficesDropdownList (type, search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      let jsonStr = {
        where: {
          resultType: type,
          diseaseDeptUid: this.deptUid,
          deptName: this.deptName
        }
      }
      if (type === 1) {
        jsonStr.pageNum = 0;
        jsonStr.pageSize = 0;
      } else {
        jsonStr.pageNum = this.pageNum;
        jsonStr.pageSize = this.pageSize;
        this.loading = true;
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/repository/diseasedepts/' + jsonStr)
        .then(res => {
          console.log(res);
          if (res) {
            if (type === 1) {
              this.options = res.data.list;
            } else {
              this.deptListDate = res.data;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        })
    }
  }
}
</script>
<style scoped lang="less">
  .section-list{
    .title{
      padding-bottom: 30px;
      i{
        margin-right: 10px;
      }
      span{
        color:rgba(51,51,51,1);
        font-weight: bold;
      }
    }
    .dialog-footer .el-button{
      padding: 8px 15px;
    }
  }
</style>
