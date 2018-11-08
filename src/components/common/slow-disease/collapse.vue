<template>
  <div class="collapse">
    <div v-for="(item, index) in serviceData" :key="index" style="padding-bottom: 20px;">
      <div class="title">
        <div><label>{{item.packName}}</label><span>({{item.packYear}})</span></div>
        <div @click="changeDropdown(index)" style="cursor: pointer;"><i class="el-icon-arrow-down" v-if="!item.isDropdown"></i><i class="el-icon-arrow-up" v-if="item.isDropdown"></i></div>
      </div>
      <div class="table" :class="{ dp: item.isDropdown }">
        <!-- 团队服务包 -->
        <table cellpadding="3" cellspacing="0" bordercolor="#E8E8E8" v-if="!type">
          <tr>
            <td style="width: 70%;">子项名称</td>
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
        <!-- 签约服务包 -->
        <table cellpadding="3" cellspacing="0" bordercolor="#E8E8E8" v-if="type">
          <tr>
            <td style="width: 80%;">子项名称</td>
            <td>子项金额</td>
            <td>服务频率</td>
          </tr>
          <tr v-for="value in item.subitems" :key="value.id">
            <td style="padding: 6px 10px 6px 46px;">{{value.subitemName}}</td>
            <td class="price">{{value.signedPrice}}</td>
            <td>{{value.userFrequency}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['serviceList', 'type'],
  data () {
    return {
      serviceData: []
    }
  },
  methods: {
    changeDropdown (index) {
      this.serviceData[index].isDropdown = !this.serviceData[index].isDropdown;
    }
  },
  watch: {
    serviceList () {
      this.serviceData = this.serviceList;
      this.serviceData.map(item => {
        this.$set(item, 'isDropdown', true);
        return item;
      })
    }
  }
}
</script>
<style lang="less" scoped>
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
    }
    .title > div:nth-child(1){
      width: 30%;
    }
    .title > div:nth-child(2){
      width: 70%;
      text-align: right;
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
</style>
