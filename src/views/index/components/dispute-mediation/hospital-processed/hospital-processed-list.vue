<template>
  <div class="processed-list">
    <div class="title">
      <i class="icon iconfont">&#xe686;</i>
      <span>已处理</span>
    </div>
    <div class="tabs" style="width: 240px;">
      <div :class="{ active:status === '1' }" @click="getDisputeList('1')">医院处理<i></i></div>
      <div :class="{ active:status === '4' }" @click="getDisputeList('4')" class="not-border">上报医调委<i></i></div>
    </div>
    <div class="line"></div>
    <div class="report-person">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="上报人:">
          <el-input size="small" v-model="reportName" @keyup.enter.native="getDisputeList(status, 1)"></el-input>
        </el-form-item>
        <el-form-item label="纠纷类型:">
          <el-select v-model="disputeType" size="small" filterable placeholder="请选择">
            <el-option label="全部类型" :value="null"></el-option>
            <el-option
              v-for="item in disputeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" size="small" @click="getDisputeList(status, 1)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="disputeList.list"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod">
        </el-table-column>
        <el-table-column
          prop="disputeCode"
          label="纠纷编号"
          v-if="status === '4'">
        </el-table-column>
        <el-table-column
          prop="disputeType"
          label="纠纷类型"
          :formatter="formatterOne"
          v-if="status === '4'">
        </el-table-column>
        <el-table-column
          prop="reportName"
          label="上报人"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="reportType"
          label="上报人类型"
          :formatter="formatterTwo">
        </el-table-column>
        <el-table-column
          prop="reportTelephone"
          label="上报人联系电话"
          width="120"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="纠纷科室"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="disputeObject"
          label="纠纷对象"
          :formatter="formatterFive"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="obj"
          label="纠纷类型"
          :formatter="formatterOne"
          v-if="status === '1'">
        </el-table-column>
        <el-table-column
          label="上报时间"
          :formatter="formatterThree"
          v-if="status === '4'">
        </el-table-column>
        <el-table-column
          label="结案时间"
          :formatter="formatterFour">
        </el-table-column>
        <el-table-column
          label="操作"
          :width="status === '1' ? 200 : 100">
          <template slot-scope="scope">
            <template v-if="status === '1'">
              <router-link tag="span" :to="{ name: 'hospital-processed-detail', query: { disputeUid: scope.row.uid, status: scope.row.status } }">纠纷详情</router-link>
              <template v-if="scope.row.status !== '1'">
                <strong>|</strong>
                <span @click="previewPictures(scope.row.hospHandleUid)">纠纷协议书</span>
              </template>
            </template>
            <template v-if="status === '4'">
              <router-link tag="span" :to="{ name: 'hospital-processed-detail', query: { disputeUid: scope.row.uid, status: scope.row.status } }">纠纷详情</router-link>
            </template>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
    </div>
    <div class="pagination-box" v-if="disputeList.list && disputeList.list.length > 0">
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="disputeList.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      status: '1',
      disputeTypeList: [
        {label: '医德医风', value: '0'},
        {label: '就医环境', value: '1'},
        {label: '不良事件', value: '2'},
        {label: '诊疗差错', value: '3'},
        {label: '其他', value: '9'}
      ],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      disputeList: [],
      reportName: '',
      disputeType: '',
      loading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    this.getDisputeList(this.status, 1);
  },
  methods: {
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getDisputeList(this.status);
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getDisputeList(this.status);
    },
    formatterOne (row, column) {
      if (row.status === '1') {
        return '--';
      } else {
        return row.disputeType === '0'
          ? '医德医风'
          : row.disputeType === '1'
            ? '就医环境'
            : row.disputeType === '2'
              ? '不良事件'
              : '诊疗差错'
      }
    },
    formatterTwo (row, column) {
      return row.reportType === '1' ? '医务人员' : '患者';
    },
    formatterThree (row, column) {
      if (this.status === '1') {
        return row.createTime && this.moment(row.createTime).format('YYYY-MM-DD');
      } else if (this.status === '4') {
        return row.reportTime && this.moment(row.reportTime).format('YYYY-MM-DD');
      }
    },
    formatterFour (row, column) {
      if (this.status === '1') {
        return row.hospFinishTime && this.moment(row.hospFinishTime).format('YYYY-MM-DD');
      } else if (this.status === '4') {
        return row.finishTime && this.moment(row.finishTime).format('YYYY-MM-DD');
      }
    },
    formatterFive (row, column) {
      if (row.reportType === '2') {
        return '--';
      } else {
        return row.disputeObject;
      }
    },
    // 查询纠纷列表
    getDisputeList (status, search) {
      if (search) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      if (this.status !== status) {
        this.pageNum = 1;
        this.currentPage = 1;
        this.pageSize = 10;
        this.reportName = null;
        this.disputeType = '';
      }
      this.status = status;
      let jsonStr = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        where: {
          channel: '1',
          status: this.status,
          reportName: this.reportName,
          disputeType: this.disputeType,
          hospUid: this.userInfo.organInfoList[0].uid
        }
      }
      if (this.status === '1') {
        jsonStr.where.order = '1';
      } else {
        jsonStr.where.order = '4';
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/dispute/disputeList/background/' + jsonStr)
        .then(res => {
          if (res) {
            this.disputeList = res.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        })
    },
    newPicView (imgs, _ziv) {
      // 使用方法
      let ziv;
      if (_ziv) {
        ziv = _ziv;
      } else {
        ziv = new ZxImageView(this.config, imgs);
      }
      if (ziv.$img.height) {
        ziv.view(0);
      } else {
        setTimeout(() => {
          this.newPicView(imgs, ziv)
        }, 300)
      }
    },
    // 预览图片
    previewPictures (hospHandleUid) {
      this.axios.get('S2/usersServices/appendixs?contentUid=' + hospHandleUid)
        .then(res => {
          if (res) {
            if (res.data === []) {
              this.$message.error('无纠纷协议书');
              return false;
            }
            // 预览图片公共方法
            let imgs = res.data.map(item => item.fileFullPath);
            // 图片数组2
            let imgs2 = []
            imgs.forEach(function (src) {
              imgs2.push({
                url: src,
                angle: 0
              })
            })
            this.newPicView(imgs);
          }
        })
    }
  }
}
</script>
<style scoped lang="less">
  .processed-list{
    .title i{
      margin-right: 10px;
    }
    .title span{
      color:rgba(51,51,51,1);
      font-weight: bold;
    }
    .line{
      width: 100%;
      height: 1px;
      background:rgba(232,232,232,1);
      margin: 16px 0;
    }
  }
</style>
<style lang="less">
  .processed-list{
    .report-person{
      .el-form-item{
        margin-right: 25px;
      }
      .el-form-item__label{
        color: #000;
      }
    }
    .table .el-table .cell{
      strong{
        margin-left: 4px;
        color: #E9E9E9;
      }
      span{
        cursor: pointer;
        margin-left: 4px;
        color: #1890FF;
      }
    }
  }
</style>
