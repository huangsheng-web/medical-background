<template>
  <div :id="id"></div>
</template>
<script>
import G2 from '@antv/g2';
import {View, DataSet} from '@antv/data-set'
export default {
  props: ['charData', 'id', 'color'],
  mounted () {
  },
  data () {
    return {
      chart: null
    }
  },
  methods: {
    drawChart: function () {
      this.chart && this.chart.destroy();
      const ds = new DataSet();
      const dv = ds.createView().source(this.charData);
      dv.transform({
        type: 'fold',
        fields: ['儿童', '老年人', '孕产妇', '高血压', '糖尿病', '结核病', '严重精神障碍', '残疾人', '农村建档立卡贫困人', '计划生育特殊家庭', '城乡低保五保人口', '重点人群', '其他重点人群'], // 展开字段集
        key: '月份', // key字段
        value: '月均降雨量' // value字段
      });
      this.chart = new G2.Chart({
        container: this.id,
        height: 350,
        width: 1176,
        padding: [ 20, 120, 90, 30 ],
        plotBackground: {
          storke: '#000000',
          radius: 50
        }
      });
      this.chart.tooltip(true, {
        containerTpl: '<div class="g2-tooltip" >' + '<div class="g2-tooltip-title" style="margin:10px 0;"></div>' + '<ul class="g2-tooltip-list"></ul></div>',
        itemTpl: '<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{name}: {value}</li>'
      });
      this.chart.source(dv);
      this.chart.intervalStack().position('月份*月均降雨量').color('name', '#1890FF-#FEBC25');
      this.chart.render();
    }
  },
  watch: {
    charData () {
      console.log('巴巴爸爸')
      this.drawChart();
    }
  }
}
</script>
<style scoped="scoped" lang="less">
</style>
