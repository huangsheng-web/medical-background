<template>
  <div class="seb-protocol-list">
    <div is="disease-crumbs" :titleList="titleList"></div>
    <div class="table" v-if="stepIndex === 1">
      <el-table
        v-loading="loading"
        :data="protocolList.list"
        stripe>
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          width="400"
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="mmzfy"
          label="发布时间">
          <template slot-scope="scope">
            {{scope.row.updateTime | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="operate" @click="getDiseaseDetailById(scope.row.uid)">查看</span>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
      <div class="pagination-box" v-if="protocolList && protocolList.list && protocolList.list.length > 0">
        <el-pagination
          background
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20]"
          layout="total, prev, pager, next, sizes, jumper"
          :total="protocolList.total">
        </el-pagination>
      </div>
    </div>
    <div class="form" v-if="stepIndex === 2">
      <el-form :label-position="labelPosition" label-width="80px">
        <el-form-item label="标题:">
          <el-input :value="protocolDetail && protocolDetail.title" size="small" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="内容:">
          <div class="ql-container ql-snow" style="min-height: 495px;">
            <div class="ql-editor">
              <p v-html="protocolDetail && protocolDetail.content"></p>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import diseaseCrumbs from '@/components/common/slow-disease/disease-crumbs.vue';
export default {
  components: {diseaseCrumbs},
  data () {
    return {
      pageSize: 10,
      pageNum: 1,
      currentPage: 1,
      stepIndex: null,
      titleList: null,
      path: '',
      title: '',
      content: '',
      labelPosition: 'right',
      protocolList: [],
      protocolDetail: [],
      loading: false
    }
  },
  watch: {
    $route (to) {
      this.stepIndex = parseInt(to.query.stepIndex);
      this.getCrumbs();
    }
  },
  mounted () {
    this.stepIndex = parseInt(this.$route.query.stepIndex);
    this.getCrumbs();
    this.getDiseaseProtocolList();
  },
  methods: {
    // 分页查询慢病签约协议
    getDiseaseProtocolList () {
      let jsonStr = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/chronic/agreements/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.protocolList = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    // 获取详情
    getDiseaseDetailById (id) {
      const params = {uid: id}
      this.axios.get('/hisServices/chronic/agreement', {params})
        .then(res => {
          if (res) {
            console.log(res);
            this.protocolDetail = res.data;
            this.$router.push({ name: 'seb-protocol-list', query: {stepIndex: 2} });
          }
        })
    },
    getCrumbs () {
      if (this.stepIndex === 1) {
        this.path = 'seb-protocol-detail';
        this.titleList = ['签约协议维护', '发布记录'];
      } else if (this.stepIndex === 2) {
        this.path = 'seb-protocol-list';
        this.titleList = ['签约协议维护', '发布记录', '发布详情'];
      }
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getDiseaseProtocolList();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getDiseaseProtocolList();
    }
  }
}
</script>
<style lang="less">
  .seb-protocol-list{
    .table{
      margin-top: 30px;
    }
    .form{
      margin-top: 30px;
      .el-form-item__label{
        color: #000;
        font-weight: bold;
      }
    }
  }
</style>
