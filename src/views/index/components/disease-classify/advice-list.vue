<template>
  <div class="advice-list">
    <h1><i class="icon iconfont">&#xe68d;</i><span>意见反馈</span></h1>
    <!-- 搜索栏目 -->
    <div class="advice-search">
      <el-form :inline="true">
        <el-form-item label="处理状态:">
          <el-select v-model="selectValue" placeholder="请选择" size="small">
            <el-option
              v-for="item in SelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="search" size="small">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 显示信息列表 -->
    <el-table
      stripe
      :data="adviceListDate"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="64px"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="opinion"
        width="300px"
        :show-overflow-tooltip="true"
        label="反馈意见">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="联系电话">
        <template slot-scope="scope">
          <span v-if="scope.row.telephone">{{scope.row.telephone}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="反馈时间">
        <template slot-scope="scope">
          {{scope.row.createTime | moment()}}
        </template>
      </el-table-column>
      <el-table-column
        prop="handleStatus"
        label="处理状态">
        <template slot-scope="scope">
          <i style="display: inline-block;width: 5px;height: 5px;background:#FB8C00;border-radius: 50%;vertical-align: middle;" v-show="scope.row.handleStatus == '2'"></i>
          <i style="width: 5px;height: 5px;background: #1890FF;display: inline-block;border-radius: 50%;vertical-align: middle;" v-show="scope.row.handleStatus == '1'"></i>
          <span>{{scope.row.handleStatus == '1'? '未处理' : scope.row.handleStatus == '2' ? '已处理': ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="handleTime"
        label="处理时间">
        <template slot-scope="scope">
          <span v-if="scope.row.handleStatus == '1'">--</span>
          <span v-if="scope.row.handleStatus == '2'">{{scope.row.handleTime|moment()}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="handleDescription"
        width="200px"
        :show-overflow-tooltip="true"
        label="处理备注">
        <template slot-scope="scope">
          {{scope.row.handleDescription === null ? '--': scope.row.handleDescription}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="64px">
        <template slot-scope="scope">
          <el-button type="text" @click="disposeAdvice(scope)" v-show="scope.row.handleStatus == '1'" style="margin: 0">处理</el-button>
          <el-button type="text" @click="disposeAdvice(scope)" v-show="scope.row.handleStatus == '2'" style="margin: 0">修改</el-button>
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
import {formatDate} from '@/utils/util.js'
export default {
  name: 'advice-list',
  data () {
    return {
      loading: false,
      selectValue: '', // 搜索选择内容
      // 搜索下拉内容
      SelectOptions: [{
        value: '',
        label: '全部'
      }, {
        value: 2,
        label: '已处理'
      }, {
        value: 1,
        label: '未处理'
      }],
      // 表格列表
      adviceListDate: [],
      // 分页
      currentPage: 1,
      pageSize: 10,
      totalSize: 0
    }
  },
  mounted () {
    this.getAdviceList();
  },
  methods: {
    // 分页查询意见反馈列表
    getAdviceList () {
      this.loading = true;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        where: {}
      };
      if (this.selectValue !== '') {
        params.where['handleStatus'] = this.selectValue
      }
      let jsons = encodeURIComponent(encodeURIComponent(JSON.stringify(params)));
      this.axios.get('/hisServices/personalcenter/opinions/' + jsons).then(res => {
        if (res) {
          this.adviceListDate = [];
          this.totalSize = res.data.total;
          this.adviceListDate = res.data.list;
        }
        this.loading = false;
      }).finally(() => {
        this.loading = false
      })
    },
    // 分页函数
    onPageSizeChange (size) {
      this.pageSize = size;
    },
    // 分页函数
    onPageChange (page) {
      this.currentPage = page;
      this.getAdviceList();
    },
    // 自增
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.currentPage - 1);
    },
    // 处理按钮
    disposeAdvice (scope) {
      if (scope.row.handleStatus === '2') {
        this.$router.push(
          {name: 'advice-dispose', query: {uid: scope.row.uid, handleType: 2, id: this.$route.query.id}})
      } else {
        this.$router.push(
          {name: 'advice-dispose', query: {uid: scope.row.uid, handleType: 1, id: this.$route.query.id}})
      }
    },
    // 搜索按钮
    search () {
      this.currentPage = 1;
      this.getAdviceList();
    }
  }
}
</script>

<style scoped lang="less">
  .advice-list{
    h1{
      padding-bottom: 20px;
      span{
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
        color:rgba(51,51,51,1);
      }
    }
    .advice-search{
      margin: 5px 0;
    }
  }
</style>
