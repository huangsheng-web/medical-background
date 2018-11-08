<template>
  <div class="register-list">
    <div class="title"><i class="icon iconfont">&#xe680;</i><span>注册用户管理</span></div>
    <!-- 搜索输出筛选部分 -->
    <div class="demo-input-suffix">
      <el-form :inline="true" :rules="formRules" :model="searchForm" ref="searchForm">
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="searchForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" prop="idcard">
          <el-input v-model="searchForm.idcard" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="telephone">
          <el-input v-model="searchForm.telephone" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="search('searchForm')" size="small">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="slideShow = !slideShow" type="text">{{text}}<i :class="{'el-icon-arrow-up':slideShow,'el-icon-arrow-down':!slideShow }"></i></el-button>
        </el-form-item>
        <el-collapse-transition>
          <div v-show="slideShow">
            <el-form-item label="注册方式:" prop="registration">
            <el-select v-model="searchForm.registerType" size="small" placeholder="请选择" style="width: 154px;">
              <el-option v-for="item in SelectOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="注册时间:" prop="timeValue">
            <div class="block">
              <el-date-picker
                v-model="timeValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd-HH-mm-ss"
                :default-time="['00:00:00', '23:59:59']"
                :unlink-panels="true"
                size="small">
              </el-date-picker>
            </div>
          </el-form-item>
          </div>
        </el-collapse-transition>
      </el-form>
    </div>
    <!-- 显示信息列表 -->
    <el-table
      stripe
      :data="registerListData"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="64px"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="idcard"
        label="身份证号"
        width="180"
        :formatter="transformIdCard">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="patientCount"
        label="就诊人个数">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间">
        <template slot-scope="scope">
          {{scope.row.createTime | moment()}}
        </template>
      </el-table-column>
      <el-table-column
        prop="registerType"
        label="注册方式">
        <template slot-scope="scope">
          {{scope.row.registerType === '0' ? '系统' : scope.row.registerType === '1' ?  '小程序' : '网页'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isRelationHealthRecords"
        label="是否关联健康档案"
        width="140">
        <template slot-scope="scope">
          {{scope.row.isRelationHealthRecords === '1' ? '是' : '否'}}
        </template>
      </el-table-column>
      <div class="not-content" slot="empty">
        <img src="../../../../assets/img/not.png" alt="">
        <p>抱歉，暂无相关内容</p>
      </div>
    </el-table>
    <!--分页-->
    <div class="pagination-box">
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'register-list',
  data () {
    return {
      // 注册方式
      SelectOptions: [
        {value: '', label: '全部'},
        {value: '0', label: '系统'},
        {value: '1', label: '小程序'},
        {value: '2', label: '网页'}
      ],
      slideShow: false, // 下拉显隐变量
      timeValue: '', // 注册时间
      // 搜索
      searchForm: {
        name: '',
        idcard: '',
        telephone: '',
        registerType: '',
        registerBeginTime: '',
        registerEndTime: ''
      },
      // 搜索规则
      formRules: {
        name: [],
        idcard: [],
        telephone: []
      },
      // 表格列表
      registerListData: [],
      // 分页
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      loading: false // 加载状态
    }
  },
  computed: {
    // 收起展开
    text () {
      return this.slideShow ? '收起' : '展开';
    }
  },
  mounted () {
    this.getUserInfo();
  },
  methods: {
    // 数据转换(身份证)
    transformIdCard (row, col) {
      if (row.idcard) {
        return row.idcard
      } else {
        return '--'
      }
    },
    // 获取搜索时间分段
    getTime () {
      if (this.timeValue) {
        this.searchForm.registerBeginTime = this.timeValue[0];
        this.searchForm.registerEndTime = this.timeValue[1];
      } else {
        this.searchForm.registerBeginTime = '';
        this.searchForm.registerEndTime = '';
      }
    },
    // 获取系统中所有的用户信息(可以根据条件筛选)
    getUserInfo () {
      this.loading = true
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        where: {}
      }
      if (this.searchForm.name !== '') {
        params.where['name'] = this.searchForm.name
      }
      if (this.searchForm.idcard !== '') {
        params.where['idcard'] = this.searchForm.idcard
      }
      if (this.searchForm.telephone !== '') {
        params.where['telephone'] = this.searchForm.telephone
      }
      if (this.searchForm.registerType !== '') {
        params.where['registerType'] = this.searchForm.registerType
      }
      if (this.searchForm.registerBeginTime !== '') {
        params.where['registerBeginTime'] = this.searchForm.registerBeginTime
      }
      if (this.searchForm.registerEndTime !== '') {
        params.where['registerEndTime'] = this.searchForm.registerEndTime
      }
      let jsons = encodeURIComponent(encodeURIComponent(JSON.stringify(params)));
      this.axios.get('/hisServices/users/users/' + jsons)
        .then(res => {
          if (res) {
            this.registerListData = [];
            this.registerListData = res.data.list;
            this.totalSize = res.data.total;
            this.loading = false;
          }
        }).finally(() => {
          this.loading = false
        })
    },
    // 搜索按钮
    search (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.currentPage = 1;
          this.registerListData = [];
          this.getTime();
          this.getUserInfo();
        } else {
          return false;
        }
      });
    },
    // 分页
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getUserInfo()
    },
    // 分页
    onPageChange (page) {
      this.currentPage = page;
      this.getUserInfo()
    },
    // 自增
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.currentPage - 1);
    }
  }
}
</script>

<style scoped lang="less">
.register-list{
  .title{
    padding-bottom: 20px;
    i{
      margin-right: 10px;
    }
    span{
      color:rgba(51,51,51,1);
      font-weight: bold;
    }
  }
}
</style>
