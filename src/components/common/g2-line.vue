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
      this.chart.source(dv, {
        month: {
          range: [0, 1]
        }
      });
      this.chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      });
      this.chart.line().position('month*num').color('name', this.color);
      this.chart.point().position('month*num').color('name', this.color).size(4).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      });
      this.chart.render();
    }
  },
  watch: {
    charData () {
      console.log('变')
      this.drawChart();
    }
  }
}
</script>
<style scoped="scoped" lang="less">
</style>
