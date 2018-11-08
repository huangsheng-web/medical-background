<template>
  <div class="info-list">
    <h1><i class="icon iconfont">&#xe68c;</i><span>信息管理</span></h1>
    <div class="info-choice clearfix">
      <div class="tabs" :style="{width: nabs.length * 120 + 'px'}" style="border-right: none;">
        <div v-for="(item, index) in nabs" :key="(index+1)" :class="{ active: (index+1) === type, 'not-border': (index+1) === nabs.length - 1 }" @click="titleChoice(index+1)">{{item}}<i></i></div>
      </div>
    </div>
    <!-- 搜索添加栏目 -->
    <div class="info-search">
      <el-form :inline="true" class="fl" :model="searchForm" ref="searchForm">
        <el-form-item label="标题:">
          <el-input v-model="searchForm.iptContent" placeholder="请输入内容" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" @click="search('searchForm')">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="primary" size="small" @click="infoAdd">添加</el-button>
      </div>
    </div>
    <!-- 显示信息列表 -->
    <el-table
      stripe
      :data="infoList"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="64px"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="title"
        width="600px"
        :show-overflow-tooltip="true"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="browseCount"
        label="阅读量">
      </el-table-column>
      <el-table-column
        prop="sendTime"
        label="添加时间">
        <template slot-scope="scope">
          {{scope.row.sendTime | moment()}}
        </template>
      </el-table-column>
      <el-table-column label="操作" cell-style="center">
        <template slot-scope="scope">
          <span style="cursor: pointer;color: #1890FF;" @click="modifyInfo(scope)">修改</span>
          <span style="color: #E9E9E9;margin: 0 10px;">|</span>
          <span style="cursor: pointer;color: #1890FF;" @click="clickDel(scope)">删除</span>
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
        :current-page.sync="pageNum"
        :page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="totalSize">
      </el-pagination>
    </div>
    <!--删除信息-->
    <el-dialog
      :visible.sync="dialogDel"
      :close-on-click-modal="false"
      width="290px"
      top="40vh"
      center>
      <p style="color: #333333;">确定删除&nbsp;《{{updateDeptName}}》&nbsp;吗？</p>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="delInfo">确 定</el-button>
          <el-button @click="dialogDel = false" plain>取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'info-list',
  data () {
    return {
      loading: false,
      // 上边栏
      nabs: ['通知公告', '常见问题'],
      uid: '', // 消息标识（删除使用）
      type: 1, // 状态（切换、修改、停留）type 1为公告 2为问题
      modifytype: 1, // modifytype 修改状态 1为公告 2为问题
      dialogDel: false, // 删除dialog
      updateDeptName: '', // 删除内容名字
      // 表格列表
      infoListData: [],
      infoList: [],
      // 搜索输入
      searchForm: {
        iptContent: ''
      },
      // 分页
      pageNum: 1,
      pageSize: 10,
      totalSize: 0
    }
  },
  created () {
    this.getQuery();
    this.getInfo();
  },
  methods: {
    // 添加或修改后获取type，保存当前的激活状态
    getQuery () {
      if (this.$route.query.type) {
        this.type = this.$route.query.type
      }
    },
    // 分页函数
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getInfo()
    },
    // 分页函数
    onPageChange (page) {
      this.pageNum = page;
      this.getInfo()
    },
    // 添加按钮
    infoAdd () {
      this.$router.push({name: 'info-add', query: {type: this.type, id: this.$route.query.id}})
    },
    // 删除按钮
    clickDel (scope) {
      this.dialogDel = true;
      this.updateDeptName = scope.row.title;
      this.uid = scope.row.uid;
    },
    // 删除信息(根据标识删除信息)
    delInfo () {
      if (this.type === 1) {
        this.axios.delete('/hisServices/personalcenter/notice?uid=' + this.uid)
          .then(res => {
            if (res) {
              this.infoListData = [];
              this.getInfo();
              this.dialogDel = false;
            }
          })
      } else {
        this.axios.delete('/hisServices/personalcenter/question?uid=' + this.uid)
          .then(res => {
            if (res) {
              this.infoListData = [];
              this.getInfo();
              this.dialogDel = false;
            }
          })
      }
    },
    // 修改信息
    modifyInfo (scope) {
      if (this.type === 1) {
        this.modifytype = 1
      } else {
        this.modifytype = 2;
      }
      this.$router.push({name: 'info-add', query: {uid: scope.row.uid, modifytype: this.modifytype, type: this.type, id: this.$route.query.id}})
    },
    // 切换
    titleChoice (type) {
      this.$route.query.type = type;
      this.type = type;
      this.pageNum = 1;
      this.searchForm.iptContent = ''
      if (type === 1) {
        this.infoListData = [];
        this.getInfo()
      }
      if (type === 2) {
        this.infoListData = [];
        this.getInfo()
      }
    },
    // 搜索
    search (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.pageNum = 1;
          this.getInfo()
        } else {
          return false;
        }
      });
    },
    // 分页查询列表
    getInfo () {
      this.loading = true;
      let url = '';
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        where: {
          title: this.searchForm.iptContent
        }
      };
      if (this.type === 1) {
        // 查询公告
        url = '/hisServices/personalcenter/notices/'
      } else {
        // 查询问题
        url = '/hisServices/personalcenter/questions/'
      }
      let jsons = encodeURIComponent(encodeURIComponent(JSON.stringify(params)));
      this.axios.get(url + jsons).then(res => {
        if (res) {
          this.infoListData = res.data.list
          this.totalSize = res.data.total
          this.infoList = this.infoListData;
        }
        this.loading = false;
      }).finally(() => {
        this.loading = false
      })
    },
    // 自增
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    }
  }
}
</script>
<style scoped lang="less">
.info-list{
  h1{
    padding-bottom: 20px;
    span{
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color:rgba(51,51,51,1);
    }
  }
  .info-choice{
    margin: 10px 0;
    border-bottom: 1px solid #99a9bf;
    padding-bottom: 10px;
    ul{
      li{
        line-height:30px;
        float: left;
        width: 100px;
        height: 30px;
        text-align: center;
        cursor: pointer;
        position: relative;
        span{
          display: none;
        }
        .choice-icon{
          position: absolute;
          display: block;
          top: 28px;
          left: 50%;
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 10px solid rgba(24,144,255,1);
          margin-left: -5px;
        }
      }
      li:first-child{
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        border: 1px solid #99a9bf;
      }
      li:last-child{
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-right: 1px solid #99a9bf ;
        border-top: 1px solid #99a9bf;
        border-bottom: 1px solid #99a9bf ;
      }
    }
    .active{
      background: rgba(24,144,255,1);
      color: white;
    }
  }
  .info-search{
    overflow: hidden;
    padding: 0;
    margin-top: 22px;
  }
}
</style>
