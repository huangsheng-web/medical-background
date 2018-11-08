<template>
  <div class="hc-service">
    <h1><i class="icon iconfont">&#xe6c6;</i><span>服务包管理</span></h1>
    <div class="btn">
      <el-button type="primary" size="small" @click="getServiceList(2)" v-show="!showOperate">管理服务包</el-button>
      <div v-show="showOperate">
        <el-button type="primary" size="small" :loading="loadingBtn" @click="batchAddService()">保存</el-button>
        <el-button size="small" @click="cancel()">取消</el-button>
      </div>
      <span v-show="showOperate">共{{serviceList.length}}个服务包</span>
    </div>
    <div class="collapse" v-loading="loading">
      <div v-for="(item, indexP) in serviceList" :key="indexP" v-if="serviceList.length > 0" style="padding-bottom: 20px;">
        <template v-if="item.packType === '1'">
          <div class="title">
            <div><span style="position: absolute;top: 15px;" v-show="showOperate" class="radio" :class="{ selected: item.selected }"><i style="position: absolute;top: -18px;left: 1px;" class="icon iconfont">&#xe67c;</i></span><label>{{item.packName}}</label><span>({{item.packYear}})</span></div>
            <div @click="changeDropdown(indexP)" style="cursor: pointer;"><i class="el-icon-arrow-down" v-show="!item.isDropdown"></i><i class="el-icon-arrow-up" v-show="item.isDropdown"></i></div>
          </div>
          <div class="table" :class="{ dp: item.isDropdown }">
            <table cellpadding="3" cellspacing="0" bordercolor="#E8E8E8">
              <tr>
                <td style="width: 71px;"></td>
                <td style="width: 64%;">子项名称</td>
                <td>子项价格</td>
                <td>最低服务频率</td>
                <td>超出频率每次单价</td>
              </tr>
              <tr v-for="(value, indexC) in item.subitems" :key="indexC">
                <td style="width: 71px;"><span v-show="showOperate" class="radio" :class="{ selected: value.selected }"><i class="icon iconfont">&#xe67c;</i></span></td>
                <td style="padding: 6px 10px 6px 0;">{{value.subitemName}}</td>
                <td class="price">{{value.subitemPrice}}</td>
                <td>{{value.frequencyMin}}</td>
                <td>{{value.frequencyExcessPrice}}</td>
              </tr>
            </table>
          </div>
        </template>
        <template v-if="item.packType === '9'">
          <div class="title">
            <div><span style="position: absolute;top: 15px;" v-show="showOperate" class="radio" :class="{ selected: item.selected }" @click="changeCheckedP(indexP)"><i style="position: absolute;top: -18px;left: 1px;" class="icon iconfont">&#xe67c;</i></span><label>{{item.packName}}</label><span>({{item.packYear}})</span></div>
            <div @click="changeDropdown(indexP)" style="cursor: pointer;"><i class="el-icon-arrow-down" v-show="!item.isDropdown"></i><i class="el-icon-arrow-up" v-show="item.isDropdown"></i></div>
          </div>
          <div class="table" :class="{ dp: item.isDropdown }">
            <table cellpadding="3" cellspacing="0" bordercolor="#E8E8E8">
              <tr>
                <td style="width: 71px;"></td>
                <td style="width: 64%;">子项名称</td>
                <td>子项价格</td>
                <td>最低服务频率</td>
                <td>超出频率每次单价</td>
              </tr>
              <tr v-for="(value, indexC) in item.subitems" :key="indexC">
                <td style="width: 71px;"><span v-show="showOperate" class="radio" :class="{ selected: value.selected }" @click="changeCheckeC(indexP, indexC)"><i class="icon iconfont">&#xe67c;</i></span></td>
                <td style="padding: 6px 10px 6px 0;">{{value.subitemName}}</td>
                <td class="price">{{value.subitemPrice}}</td>
                <td>{{value.frequencyMin}}</td>
                <td>{{value.frequencyExcessPrice}}</td>
              </tr>
            </table>
          </div>
        </template>
      </div>
      <div class="not-content" v-if="serviceList.length === 0">
        <img src="../../../../assets/img/not.png" alt="">
        <p>抱歉，暂无相关内容</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      serviceList: [],
      showOperate: false,
      loading: false,
      loadingBtn: false
    }
  },
  mounted () {
    this.getServiceList(1);
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  methods: {
    // 获取服务包列表
    getServiceList (type) {
      this.serviceList = [];
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          userUid: this.userInfo.organInfoList[0].uid,
          userType: '2'
        }
      }
      if (type === 2) {
        jsonStr.where.isSuperiorAndMarkOwn = true;
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.loading = true;
      this.axios.get('/hisServices/chronic/packs/' + jsonStr)
        .then(res => {
          if (res) {
            this.serviceList = res.data;
            this.serviceList.map(item => {
              this.$set(item, 'isDropdown', true);
            })
            if (type === 2) {
              this.showOperate = !this.showOperate;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    // 批量更新服务包
    batchAddService () {
      let params = {
        userUid: this.userInfo.organInfoList[0].uid,
        userType: '2',
        chronicPacks: this.serviceList
      }
      this.loadingBtn = true;
      this.axios.put('/hisServices/chronic/packs', params)
        .then(res => {
          if (res) {
            console.log(res);
            this.$message.success('保存成功！');
            this.showOperate = false;
            this.getServiceList(1);
          }
        })
        .finally(() => {
          this.loadingBtn = false;
        })
    },
    cancel () {
      this.getServiceList(1);
      this.showOperate = !this.showOperate;
    },
    //  折叠面板
    changeDropdown (indexP) {
      this.serviceList[indexP].isDropdown = !this.serviceList[indexP].isDropdown;
    },
    //  全选
    changeCheckedP (indexP) {
      this.serviceList[indexP].selected = !this.serviceList[indexP].selected;
      if (this.serviceList[indexP].selected) {
        this.serviceList[indexP].subitems.map(item => {
          item.selected = true;
          return item;
        })
      } else {
        this.serviceList[indexP].subitems.map(item => {
          item.selected = false;
          return item;
        })
      }
    },
    //  单选
    changeCheckeC (indexP, indexC) {
      this.serviceList[indexP].subitems[indexC].selected = !this.serviceList[indexP].subitems[indexC].selected;
      if (this.serviceList[indexP].subitems.every(item => item.selected === true)) {
        this.serviceList[indexP].selected = true;
      } else if (this.serviceList[indexP].subitems.some(item => item.selected === false)) {
        this.serviceList[indexP].selected = false;
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .hc-service{
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
    .btn{
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      span{
        color: #999999;
      }
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
          margin-left: 26px;
          margin-right: 10px;
          color: #333333;
          font-weight: bold;
        }
        span{
          color: #999999;
        }
      }
      .title > div:nth-child(1){
        width: 30%;
        position: relative;
      }
      .title > div:nth-child(2){
        width: 70%;
        text-align: right;
      }
      .table{
        width: 100%;
        max-height: 0;
        overflow: hidden;
        transition: all .3s linear;
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
    .radio{
      display: inline-block;
      width: 16px;
      height: 16px;
      text-align: center;
      vertical-align: top;
      margin-top: 1px;
      margin-right: 10px;
      border: 1px solid rgba(204,204,204,1);
      cursor: pointer;
      i{
        display: none;
        vertical-align: top;
        font-size: 14px;
        color: #fff;
      }
    }
    .radio.selected{
      background: #1890FF;
      border: 1px solid #1890FF;
      i{
        display: inline;
      }
    }
  }
</style>
