<template>
  <div class="seb-service-list">
    <h1><i class="icon iconfont">&#xe6c6;</i><span>服务包管理</span></h1>
    <div class="top">
      <div class="tabs" :style="{width: nabs.length * 120 + 'px'}">
        <div v-for="(item, index) in nabs" :key="index" :class="{ active: index === type, 'not-border': index === nabs.length - 1 }" @click="getServiceList(index)">{{item}}<i></i></div>
      </div>
      <div class="btn">
        <el-button type="primary" size="small" @click="skipIsAdd()">新增服务包</el-button>
        <el-button size="small" @click="popDialogDiscount()">折扣设置</el-button>
      </div>
    </div>
    <div class="line"></div>
    <el-form :inline="true">
      <el-form-item label="所属年份:">
        <el-select v-model="year" size="small" filterable placeholder="请选择">
          <el-option label="2018年" :value="'2018'"></el-option>
          <el-option label="2017年" :value="'2017'"></el-option>
          <el-option label="2016年" :value="'2016'"></el-option>
          <el-option label="2015年" :value="'2015'"></el-option>
          <el-option label="2014年" :value="'2014'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" icon="el-icon-search" @click.native="getServiceList(type)">搜索</el-button>
      </el-form-item>
      <el-form-item label="" style="float: right;">
        <div style="color: #999999;">
          <span v-show="type === 0">待上线{{serviceList.length}}个服务包</span>
          <span v-show="type === 1">已上线{{serviceList.length}}个服务包</span>
          <span v-show="type === 2">已下线{{serviceList.length}}个服务包</span>
        </div>
      </el-form-item>
    </el-form>
    <div class="collapse" v-if="serviceList && serviceList.length > 0" v-loading="loading">
      <div v-for="(item, index) in serviceList" :key="index" style="padding-bottom: 20px;">
        <div class="title">
          <div style="width: 85%;cursor: pointer;" @click="changeDropdown(index)"><label>{{item.packName}}</label><span>({{item.packYear}})</span></div>
          <div class="operate" style="padding-left: 40px;">
            <template v-if="type === 0">
              <router-link :to="{ name: 'seb-service-detail', query: {serviceId: item.uid, type: 2} }" class="operate">修改</router-link>
              <span @click="popPutDialog(item.uid, item.packName, '2')">上线</span>
            </template>
            <template v-if="type === 1">
              <router-link :to="{ name: 'seb-service-detail', query: {serviceId: item.uid, type: 3} }" class="operate">复用</router-link>
              <span @click="popPutDialog(item.uid, item.packName, '3')" v-if="item.packType === '9'">下线</span>
            </template>
            <template v-if="type === 2">
              <router-link :to="{ name: 'seb-service-detail', query: {serviceId: item.uid, type: 3} }" class="operate">复用</router-link>
            </template>
          </div>
          <div style="cursor: pointer;" @click="changeDropdown(index)"><i class="el-icon-arrow-down" v-if="!item.isDropdown"></i><i class="el-icon-arrow-up" v-if="item.isDropdown"></i></div>
        </div>
        <div class="table" :class="{ dp: item.isDropdown }">
          <table cellpadding="3" cellspacing="0" bordercolor="#E8E8E8">
            <tr>
              <td style="width: 72%;">子项名称</td>
              <td>子项价格</td>
              <td>最低服务频率</td>
              <td>超出频率每次单价</td>
            </tr>
            <tr v-for="value in item.subitems" :key="value.id">
              <td style="padding: 6px 10px 6px 46px;">{{value.subitemName}}</td>
              <td class="price">{{value.subitemPrice}}</td>
              <td>{{value.frequencyMin}}</td>
              <td>{{value.frequencyExcessPrice}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="not-content" v-else>
      <img src="../../../../assets/img/not.png" alt="">
      <p>抱歉，暂无相关内容</p>
    </div>
    <div class="discount">
      <el-dialog
        :visible.sync="dialogDiscount"
        :close-on-click-modal="false"
        title="折扣设置"
        width="600px"
        top="30vh"
        center>
        <div class="btn">
          <el-tooltip class="item" effect="dark" content="最多新增4个" placement="top" v-show="ruleFormDiscount.list.length === 4">
            <el-button type="info" size="small" style="margin-left: 10px;;cursor: text;">新增</el-button>
          </el-tooltip>
          <el-button type="primary" size="small" @click="addDomain()" v-show="ruleFormDiscount.list.length < 4">新增</el-button>
          <span>(还可新增<span>{{4 - ruleFormDiscount.list.length}}</span>个)</span>
        </div>
        <div class="form">
          <el-form v-if="ruleFormDiscount.list.length > 0" :model="ruleFormDiscount" ref="ruleFormDiscount" :label-position="labelPosition">
            <div v-for="(item, index) in ruleFormDiscount.list" :key="index">
              <el-form-item label="签约金额达到:" :prop="'list.' + index + '.price'" :rules="[{required: true, message: '不能为空', trigger: 'blur'}, {validator: validator, trigger: 'blur'}]">
                <el-input v-model="item.price" size="small"></el-input><span class="unit">元，</span>
              </el-form-item>
              <el-form-item label="则折扣百分比:" :prop="'list.' + index + '.discount'" :rules="[{required: true, message: '不能为空', trigger: 'blur'}, {validator: validator, trigger: 'blur'}]">
                <el-input v-model="item.discount" size="small"></el-input><span class="unit">%</span>
              </el-form-item>
              <el-form-item label="">
                <span class="unit" @click="removeDomain(item)" style="float: right;color: #1890FF;cursor: pointer;">删除</span>
              </el-form-item>
            </div>
          </el-form>
          <div v-if="ruleFormDiscount.list.length === 0" style="padding: 20px 0 30px;text-align: center;">
            可点击新增按钮进行折扣设置！
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingSet" @click="addServiceDiscount('ruleFormDiscount')" v-if="serviceDiscount.length === 0">保存</el-button>
          <el-button type="primary" size="small" :loading="loadingSet" @click="putServiceDiscount('ruleFormDiscount')" v-if="serviceDiscount.length > 0">保存</el-button>
          <el-button size="small" @click="dialogDiscount = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="put">
      <el-dialog
        :visible.sync="dialogPut"
        :close-on-click-modal="false"
        :title="serviceStatus === '2' ? '上线服务包' : '下线服务包'"
        width="420px"
        top="30vh"
        center>
        <div style="text-align: center;padding: 20px;">是否{{serviceStatus === '2' ? '上线' : '下线'}}{{packName}}？</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="loadingOp" @click="putService()">确 定</el-button>
          <el-button size="small" @click="dialogPut = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {checkPositiveInteger} from '@/utils/validator.js';
export default {
  data () {
    return {
      pageSize: 10,
      pageNum: 1,
      type: 0,
      nabs: ['待上线', '已上线', '已下线'],
      year: '2018',
      serviceList: [],
      labelPosition: 'right',
      dialogDiscount: false,
      ruleFormDiscount: {
        list: [{
          price: '',
          discount: ''
        }]
      },
      serviceDiscount: [],
      validator: null,
      dialogPut: false,
      serviceId: null,
      serviceStatus: null,
      packName: null,
      loading: false,
      loadingSet: false,
      loadingOp: false
    }
  },
  created () {
    this.validator = checkPositiveInteger;
  },
  methods: {
    changeDropdown (index) {
      this.serviceList[index].isDropdown = !this.serviceList[index].isDropdown;
    },
    skipIsAdd () {
      this.$router.push({ name: 'seb-service-detail', query: {type: 1} })
    },
    popDialogDiscount () {
      this.dialogDiscount = true;
      this.getServiceDiscount();
    },
    // 批量修改服务包折扣
    putServiceDiscount (formName) {
      if (this.ruleFormDiscount.list.length > 0) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = this.ruleFormDiscount.list.map(item => {
              return {
                price: item.price,
                discount: item.discount
              }
            })
            this.loadingSet = true;
            this.axios.put('/hisServices/chronic/packDiscounts', params)
              .then(res => {
                if (res) {
                  console.log(res);
                  this.$message.success('修改成功！');
                  this.dialogDiscount = false;
                }
              })
              .finally(() => {
                this.loadingSet = false;
              })
          } else {
            return false;
          }
        });
      } else {
        this.loadingSet = true;
        this.axios.put('/hisServices/chronic/packDiscounts', this.ruleFormDiscount.list)
          .then(res => {
            if (res) {
              console.log(res);
              this.$message.success('修改成功！');
              this.dialogDiscount = false;
            }
          })
          .finally(() => {
            this.loadingSet = false;
          })
      }
    },
    // 批量新增服务包折扣
    addServiceDiscount (formName) {
      if (this.ruleFormDiscount.list.length > 0) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = this.ruleFormDiscount.list.map(item => {
              return {
                price: item.price,
                discount: item.discount
              }
            })
            this.loadingSet = true;
            this.axios.post('/hisServices/chronic/packDiscounts', params)
              .then(res => {
                if (res) {
                  console.log(res);
                  this.$message.success('新增成功！');
                  this.dialogDiscount = false;
                }
              })
              .finally(() => {
                this.loadingSet = false;
              })
          } else {
            return false;
          }
        });
      } else {
        this.$message.error('请新增服务包！');
      }
    },
    // 批量获取服务包折扣
    getServiceDiscount () {
      this.axios.get('/hisServices/chronic/packDiscounts')
        .then(res => {
          if (res) {
            this.ruleFormDiscount.list = res.data;
            this.serviceDiscount = this.ruleFormDiscount.list.concat([]);
          }
        })
    },
    removeDomain (item) {
      var index = this.ruleFormDiscount.list.indexOf(item)
      if (index !== -1) {
        this.ruleFormDiscount.list.splice(index, 1)
      }
    },
    addDomain () {
      this.ruleFormDiscount.list.push({
        price: '',
        discount: ''
      });
    },
    // 获取服务包列表
    getServiceList (index) {
      this.serviceList = [];
      this.type = index;
      let jsonStr = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        where: {
          userUid: '00000000-0000-0000-0000-000000000000',
          year: this.year,
          userType: '1',
          packStatus: String(this.type + 1)
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/chronic/packs/' + jsonStr)
        .then(res => {
          if (res) {
            this.serviceList = res.data;
            this.serviceList.map(item => {
              this.$set(item, 'isDropdown', true);
              return item;
            })
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    popPutDialog (uid, packName, status) {
      this.dialogPut = true;
      this.serviceId = uid;
      this.serviceStatus = status;
      this.packName = packName;
    },
    // 修改服务包状态
    putService () {
      let params = {
        uid: this.serviceId,
        packStatus: this.serviceStatus
      }
      this.loadingOp = true;
      this.axios.put('/hisServices/chronic/pack', params)
        .then(res => {
          if (res) {
            this.getServiceList(this.type);
            if (this.serviceStatus === '2') {
              this.$message.success('上线成功！');
            } else {
              this.$message.success('下线成功！');
            }
            this.dialogPut = false;
          }
        })
        .finally(() => {
          this.loadingOp = false;
        })
    }
  },
  mounted () {
    this.getServiceList(0);
  }
}
</script>
<style lang="less" scoped>
  .seb-service-list{
    h1{
      i{
        font-size: 18px;
        vertical-align: bottom;
      }
      span{
        margin-left: 10px;
        color: #333333;
        font-weight: bold;
      }
    }
    .top{
      display: flex;
      justify-content: space-between;
      .btn{
        padding-top: 18px;
      }
    }
    .line{
      width: 100%;
      height: 1px;
      background:rgba(232,232,232,1);
      margin-bottom: 16px;
    }
    .collapse{
      padding-bottom: 68px;
      .title{
        width: 100%;
        display: flex;
        padding: 0 14px;
        height: 50px;
        line-height: 50px;
        background:rgba(242,242,242,1);
        label{
          margin-right: 10px;
          color: #333333;
          font-weight: bold;
        }
        span{
          color: #999999;
        }
        .operate{
          width: 14%;
          span{
            margin-right: 10px;
            color: #1890FF;
            cursor: pointer;
          }
        }
      }
      .table{
        width: 100%;
        max-height: 0;
        overflow: hidden;
        transition: all .5s linear;
        border-bottom: 1px solid #E8E8E8;
        table{
          width: 100%;
          border: 1px solid #E8E8E8;
          border-collapse:collapse;
          tr:nth-child(1){
            color: #595959;
            font-weight: bold;
          }
          tr{
            border: 1px solid #E8E8E8;
            td{
              height: 50px;
              color: #666666;
            }
            td:nth-child(1){
              padding-left: 44px;
            }
            td.price{
              color: #FEA025;
            }
          }
        }
      }
      .table.dp{
        max-height: 600px !important;
      }
    }
    .discount{
      .btn{
        padding-bottom: 16px;
        border-bottom: 1px solid #E8E8E8;
        > span{
          margin-left: 10px;
          color: #999999;
          > span{
            color: #FF0000;
          }
        }
      }
      .unit{
        margin-left: 10px;
      }
    }
  }
</style>
<style lang="less">
  .seb-service-list{
    .discount{
      .form{
        padding-top: 20px;
        border-bottom: 1px solid #E8E8E8;
        .el-form div{
          display: flex;
          justify-content: space-between;
          .el-form-item__content{
            display: flex;
            input{
              margin-top: 4px;
              width: 80px;
            }
          }
        }
      }
    }
  }
</style>
