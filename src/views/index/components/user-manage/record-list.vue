<template>
    <div class="record-list">
      <div class="title"><i class="icon iconfont">&#xe68b;</i><span>关联健康档案</span></div>
      <div class="info-choice clearfix">
        <div class="tabs" :style="{width: nabs.length * 120 + 'px'}">
          <div v-for="(item, index) in nabs" :key="index" :class="{ active: index === type, 'not-border': index === nabs.length - 1 }" @click="titleChoice(index)">{{item}}<i></i></div>
        </div>
      </div>
      <div class="demo-input-suffix">
        <el-form :inline="true" :model="searchForm" ref="searchForm" :rules="formRules">
          <el-form-item label="姓名:">
            <el-input v-model="searchForm.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="身份证号:">
            <el-input v-model="searchForm.idcard" size="small"></el-input>
          </el-form-item>
          <el-form-item label="手机号:">
            <el-input v-model="searchForm.telephone" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="search('searchForm')" size="small">搜索</el-button>
          </el-form-item>
          <el-form-item v-if="type===0">
            <el-button @click="slideShow = !slideShow" type="text">{{text}}<i :class="{'el-icon-arrow-up':slideShow,'el-icon-arrow-down':!slideShow }"></i></el-button>
          </el-form-item>
          <el-collapse-transition v-if="type===0">
            <div v-show="slideShow">
              <el-form-item label="是否有健康档案:">
                <el-select v-model="searchForm.isHave" size="small" placeholder="请选择" style="width: 112px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-collapse-transition>
        </el-form>
      </div>
      <!-- 显示信息列表 -->
      <div class="table" v-if="type===0">
        <el-table
          stripe
        :data="recordListData"
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
          prop="sex"
          label="性别">
          <template slot-scope="scope">
            {{scope.row.sex === '1' ?  '男' : scope.row.sex === '2' ?  '女': '未知'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="isHaveHealthRecords"
          label="是否有健康档案">
          <template slot-scope="scope">
            {{scope.row.isHaveHealthRecords === '1' ?  '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间">
          <template slot-scope="scope">
            {{scope.row.createTime | moment()}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="relevanceRecord(scope)" v-if="scope.row.isHaveHealthRecords === '1' && scope.row.isRelationHealthRecords === '2'" style="margin: 0;">关联档案</el-button>
            <el-tooltip content="功能正在建设中，敬请期待!" placement="top">
              <el-button type="text" v-if="scope.row.isHaveHealthRecords === '2' && scope.row.isRelationHealthRecords === '2'" style="margin: 0;" @click.native="clickMessage">提醒建档</el-button>
            </el-tooltip>
            <el-button type="text" @click="cancelRecordBtn(scope)" v-if="scope.row.isRelationHealthRecords === '1'" style="margin: 0;">解除关联</el-button>
            <span v-if="scope.row.isRelationHealthRecords === '1'" class="table-link">
              <router-link target="_blank" :to="{name: 'record-detail', query: {idcard: scope.row.idcard, id: this.$route.query.id}}">查看档案</router-link>
            </span>
          </template>
        </el-table-column>
        <div class="not-content" slot="empty">
          <img src="../../../../assets/img/not.png" alt="">
          <p>抱歉，暂无相关内容</p>
        </div>
      </el-table>
      </div>
      <div class="table" v-if="type===1">
        <el-table
          stripe
          v-loading="loading"
          :data="recordListData"
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
            prop="sex"
            label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex ==='1' || scope.row.sex ==='2'">{{scope.row.sex === '1' ?  '男' : scope.row.sex === '2' ?  '女': ''}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="关联时间">
            <template slot-scope="scope">
              <span v-if="scope.row.relationHealthRecordsTime">{{scope.row.relationHealthRecordsTime | moment()}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="relevanceRecord(scope)" v-if="scope.row.isHaveHealthRecords === '1' && scope.row.isRelationHealthRecords === '2'" style="margin: 0;">关联档案</el-button>
              <el-tooltip content="功能正在建设中，敬请期待!" placement="top">
                <el-button type="text" v-if="scope.row.isHaveHealthRecords === '2' && scope.row.isRelationHealthRecords === '2'" style="margin: 0;" @click.native="clickMessage">提醒建档</el-button>
              </el-tooltip>
              <el-button type="text" @click="cancelRecordBtn(scope)" v-if="scope.row.isRelationHealthRecords === '1'" style="margin: 0;">解除关联</el-button>
              <span v-if="scope.row.isRelationHealthRecords === '1'" class="table-link">
                <router-link target="_blank" :to="{name: 'record-detail', query: {idcard: scope.row.idcard, id: this.$route.query.id}}">查看档案</router-link>
              </span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
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
      <!-- 关联健康档案 -->
      <el-dialog
          title="关联健康档案"
          :visible.sync="dialogVisible"
          width="40%"
          center>
          <div class="dialog-content">
            <div class="personal-info clearfix">
              <span style="width:40%">姓名:{{personalInfo.name}}</span>
              <span>身份证号:{{personalInfo.idcard}}</span>
              <span style="width:40%">性别:{{parseInt(personalInfo.sex)===1 ? '男' : parseInt(personalInfo.sex)===2 ? '女': '未知'}}</span>
              <span>手机号码:{{personalInfo.telephone}}</span>
            </div>
            <h2>匹配的健康档案</h2>
            <div class="matching-box" v-loading="loading1">
              <div v-for="(item, index) in healthList" :key="index" class="info-box clearfix">
                <div class="choice" @click="choiceHealth(item,index)">
                  <div v-show="choiceBtn === index" style="width: 100%;height: 100%;border-radius: 50%;color: #20a0ff;">
                    <i class="icon iconfont">&#xe697;</i>
                  </div>
                </div>
                <div class="info" :class="{'choiceBorder': choiceBtn === index}">
                  <span style="width:40%">姓名：{{item.name}}</span>
                  <span>身份证号：{{item.idcard}}</span>
                  <span style="width:40%">性别：{{item.sex}}</span>
                  <span>手机号码：{{item.telephone}}</span>
                </div>
                <p><router-link target="_blank" :to="{name: 'record-detail', query: {idcard: item.idcard, id: this.$route.query.id}}">查看健康档案</router-link></p>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="connectBtn">确 定</el-button>
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          </span>
      </el-dialog>
      <!--解除绑定-->
      <el-dialog
        :visible.sync="dialogDel"
        :close-on-click-modal="false"
        width="290px"
        top="40vh"
        center>
        <p style="color: #333333;">确定解除关联吗？</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="cancelRecord">确 定</el-button>
          <el-button @click="dialogDel = false" plain>取 消</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'record-list',
  data: function () {
    return {
      nabs: ['未关联', '已关联'], // 左侧边栏
      type: 0, // 侧边栏切换显隐
      loading: false,
      loading1: false,
      slideShow: false, // 搜索栏健康档案搜索显隐
      dialogDel: false, // 删除弹窗
      // 取消关联
      unbind: {
        uid: '',
        userUid: '',
        isHaveHealthRecords: ''
      },
      dialogVisible: false, // 关联健康档案dialog
      // 搜索区域
      searchForm: {
        name: '',
        idcard: '',
        telephone: '',
        isHave: '',
        isRelation: '2'
      },
      // 搜索表单规则
      formRules: {
        name: [],
        idcard: [],
        telephone: [],
        isRelevance: []
      },
      // 表格内容列表
      recordListData: [],
      // 分页
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      // 关联内容
      personalInfo: {
        name: '',
        sex: '',
        idcard: '',
        telephone: '',
        uid: '',
        userUid: '',
        isRelationHealthRecords: '',
        isHaveHealthRecords: ''
      },
      // 匹配的健康档案
      healthList: [],
      choiceBtn: -1 // 匹配健康档案按钮选择
    }
  },
  computed: {
    // 收起展开按钮
    text () {
      return this.slideShow ? '收起' : '展开';
    }
  },
  mounted () {
    this.getUserConnInfo();
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
    // 获取所有用户的关联信息
    getUserConnInfo () {
      this.loading = true;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        where: {
          isRelation: this.searchForm.isRelation
        }
      }
      if (this.searchForm.name) {
        params.where['name'] = this.searchForm.name
      }
      if (this.searchForm.idcard) {
        params.where['idcard'] = this.searchForm.idcard
      }
      if (this.searchForm.telephone) {
        params.where['telephone'] = this.searchForm.telephone
      }
      if (this.searchForm.isHave) {
        params.where['isHave'] = this.searchForm.isHave
      }
      let jsons = encodeURIComponent(encodeURIComponent(JSON.stringify(params)));
      this.axios.get('/hisServices/relatesInfo/users/' + jsons).then(res => {
        if (res) {
          this.recordListData = res.data.list
          this.totalSize = res.data.total;
        }
        this.loading = false;
      }).catch(err => {
        if (err) {
          this.loading = false
        }
      })
    },
    // 搜索按钮
    search (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.currentPage = 1
          this.getUserConnInfo();
        } else {
          return false;
        }
      });
    },
    // 切换
    titleChoice (type) {
      this.currentPage = 1;
      this.totalSize = 0;
      this.type = type;
      this.searchForm.name = '';
      this.searchForm.telephone = '';
      this.searchForm.isHave = '';
      this.searchForm.idcard = '';
      if (type === 0) {
        this.searchForm.isRelation = '2'
      } else {
        this.searchForm.isRelation = '1'
      }
      this.getUserConnInfo();
    },
    // 分页
    onPageSizeChange (size) {
      this.pageSize = size;
    },
    // 分页
    onPageChange (page) {
      this.currentPage = page;
      this.getUserConnInfo()
    },
    // 关联档案
    relevanceRecord (scope) {
      this.choiceBtn = -1;
      this.dialogVisible = true;
      this.personalInfo.name = scope.row.name;
      this.personalInfo.idcard = scope.row.idcard;
      this.personalInfo.sex = scope.row.sex;
      this.personalInfo.telephone = scope.row.telephone;
      this.personalInfo.uid = scope.row.uid;
      this.personalInfo.userUid = scope.row.userUid;
      this.personalInfo.isHaveHealthRecords = scope.row.isHaveHealthRecords;
      this.personalInfo.isRelationHealthRecords = scope.row.isRelationHealthRecords;
      this.loading1 = true;
      this.gethealthList()
    },
    // 匹配健康档案
    gethealthList () {
      let params = this.personalInfo.idcard;
      this.healthList = [];
      this.axios.get('/hisServices/selfHelpSearch/healthFile/detail?patientIdCard=' + params + '&channel=2').then(res => {
        if (res) {
          let healthObj = {
            name: res.data.cxm,
            sex: res.data.cxbmc,
            idcard: res.data.csfzh,
            telephone: res.data.cbrdh
          }
          this.healthList.push(healthObj)
        }
      }).finally(fn => {
        this.loading1 = false;
      })
    },
    // 选择健康档案
    choiceHealth (item, index) {
      if (this.choiceBtn === index) {
        this.choiceBtn = -1
      } else {
        this.choiceBtn = index
      }
    },
    // 确定关联
    connectBtn () {
      if (parseInt(this.choiceBtn) !== -1) {
        let params = {
          uid: this.personalInfo.uid,
          userUid: this.personalInfo.userUid,
          isHaveHealthRecords: this.personalInfo.isHaveHealthRecords,
          isRelationHealthRecords: '1'
        }
        this.axios.put('/hisServices/relatesInfo/user', params).then(res => {
          if (res) {
            this.$message({type: 'success', message: '关联成功！'});
            this.dialogVisible = false;
            this.getUserConnInfo();
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择匹配内容！'
        })
      }
    },
    // 解除关联按钮
    cancelRecordBtn (scope) {
      this.unbind.uid = scope.row.uid
      this.unbind.userUid = scope.row.userUid
      this.unbind.isHaveHealthRecords = scope.row.isHaveHealthRecords
      this.dialogDel = true;
    },
    // 取消关联
    cancelRecord () {
      let params = {
        uid: this.unbind.uid,
        userUid: this.unbind.userUid,
        isRelationHealthRecords: '2',
        isHaveHealthRecords: this.unbind.isHaveHealthRecords
      }
      this.axios.put('/hisServices/relatesInfo/user', params).then(res => {
        if (res) {
          this.getUserConnInfo()
          this.$message({type: 'success', message: '取消关联成功！'});
          this.dialogDel = false;
        }
      })
    },
    // 查看健康档案
    lookRecord (scope) {
      this.$router.push({name: 'record-detail', query: {idcard: scope.row.idcard, id: this.$route.query.id}})
    },
    // 提醒建档
    clickMessage () {},
    // 表格序号自增
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.currentPage - 1);
    }
  }
}
</script>

<style scoped lang="less">
.record-list{
  /* 标题 */
  .title{
    i{
      margin-right: 10px;
    }
    span{
      color:rgba(51,51,51,1);
      font-weight: bold;
    }
  }
  .choiceBorder{
    border: 1px solid #1890ff!important;
  }
  .table-link{
    margin: 0;
    a{
      text-decoration: none;
      color: #409EFF;
    }
  }
  .info-choice{
    margin: 10px 0;
    border-bottom: 1px solid #e8e8e8;
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
  .dialog-content{
    padding: 10px 20px;
    overflow: hidden;

    .personal-info{
      width: 100%;
      height: auto;
      padding: 5px 25px;
      overflow: hidden;
      background-color: #eff2f7;
      border-radius: 5px;
      span{
        height: 40px;
        line-height: 40px;
        float: left;
      }
    }
    h2{
      height: 50px;
      line-height: 50px;
      font-weight: bold;
    }
    .matching-box{
      overflow: hidden;
      padding-bottom: 25px;
      border-bottom: 1px solid #e3e3e3;
      .info-box{
        width: 100%;
        height: 100px;
        padding-left:40px;
        position: relative;
        left: 0;
        top: 0;
        .choice{
          position: absolute;
          left: 0;
          top: 50%;
          z-index: 1;
          margin-top: -25px;
          width: 18px;height: 18px;
          border: 1px solid #E8E8E8;
          cursor: pointer;
        }
        .info{
          border-radius: 5px;
          border: 1px solid #eff2f7;
          height: 86px;
          padding-left: 17px;
          padding-top: 16px;
          span{
            height: 30px;
            line-height: 30px;
            float: left;
          }
        }
        p{
          margin: 9px 17px;
          a{
            color: #1890ff;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.record-list{
    .el-table td, .el-table th{
      padding: 0;
    }
    .el-dialog__body{padding-bottom: 0}
    /* 标题 */
  }
</style>
