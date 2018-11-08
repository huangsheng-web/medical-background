<template>
  <div class="disease-list">
    <h1><i class="icon iconfont">&#xe690;</i><span>疾病维护</span></h1>
      <div class="demo-input-suffix">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="科室:">
            <el-select v-model="deptUid" size="small" filterable placeholder="请选择">
              <el-option label="全部科室" :value="null"></el-option>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.deptName"
                :value="item.uid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="疾病名称:">
            <el-input v-model="diseaseName" size="small" placeholder="请填写" @keyup.enter.native="getDiseaseList(1)"></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="diseaseType" size="small" placeholder="请选择">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已完成" :value="'2'"></el-option>
              <el-option label="编写中" :value="'1'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" size="small" @click="getDiseaseList(1)">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    <div style="padding-bottom: 16px;">
      <el-button type="primary" size="small" @click="JumpToAdd">添加疾病</el-button>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="diseaseListDate.list"
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
          prop="diseaseName"
          :show-overflow-tooltip="true"
          label="疾病名称">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.diseaseType === '1' ? '编写中' : '已完成' }}</span>
          </template>
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
            <router-link tag="span" style="cursor: pointer;margin-right: 10px;color: #1890FF;" :to="{ name: 'disease-add', query: { diseaseUid: scope.row.uid, type: 2} }">修改</router-link>
            <span style="color: #E9E9E9;">|</span>
            <span @click="popUpDeleteBox(scope.row.uid, scope.row.diseaseName)" style="cursor: pointer;margin-left: 10px;color: #1890FF;">删除</span>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
    </div>
    <div class="pagination-box" v-if="diseaseListDate.list && diseaseListDate.list.length > 0">
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="diseaseListDate.total">
      </el-pagination>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="290px"
      top="40vh"
      center>
      <p style="color: #333333;text-align: center;">确定删除&nbsp;{{diseaseNameDel}}&nbsp;疾病吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="loadingBtn" @click="delDiseaseById">确 定</el-button>
        <el-button size="small" @click="dialogVisible = false" plain>取 消</el-button>
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
      diseaseName: null,
      diseaseNameDel: null,
      diseaseType: '',
      diseaseListDate: {},
      currentPage: 1,
      dialogVisible: false,
      diseaseUid: '',
      loading: false,
      loadingBtn: false
    }
  },
  created () {
    this.getOfficesDropdownList();
    this.getDiseaseList(1);
  },
  mounted () {
  },
  methods: {
    JumpToAdd () {
      this.$router.push({ name: 'disease-add', query: { type: 1, id: this.$route.query.id } });
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    popUpDeleteBox (uid, name) {
      this.diseaseNameDel = name;
      this.dialogVisible = true;
      this.diseaseUid = uid;
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getDiseaseList();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getDiseaseList();
    },
    // 分页查询疾病列表
    getDiseaseList (search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      let jsonStr = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        where: {
          diseaseDeptUid: this.deptUid,
          deptName: null,
          diseaseName: this.diseaseName,
          diseaseType: this.diseaseType
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/repository/diseases/' + jsonStr)
        .then(res => {
          if (res) {
            this.diseaseListDate = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    // 查询科室下拉列表
    getOfficesDropdownList () {
      let jsonStr = {
        pageNum: 0,
        pageSize: 0,
        where: {
          resultType: 1
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/repository/diseasedepts/' + jsonStr)
        .then(res => {
          console.log(res);
          if (res) {
            this.options = res.data.list;
          }
        })
    },
    // 根据疾病标识删除疾病信息
    delDiseaseById () {
      this.loadingBtn = true;
      this.axios.delete('/hisServices/repository/disease?uid=' + this.diseaseUid)
        .then(res => {
          if (res) {
            console.log(res);
            this.$message.success('删除疾病成功！');
            this.getDiseaseList();
            this.dialogVisible = false;
          }
        })
        .finally(() => {
          this.loadingBtn = false;
        })
    }
  }
}
</script>
<style lang="less">
  .disease-list{
    .demo-input-suffix{
      border-bottom: 1px solid rgba(232,232,232,1);
      margin-bottom: 16px;
      .el-form-item{
        margin-right: 30px;
        margin-bottom: 16px;
      }
      .el-form-item__label{
        color: #000;
      }
    }
    h1{
      padding-bottom: 20px;
      span{
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
        color:rgba(51,51,51,1);
      }
    }
  }
</style>
