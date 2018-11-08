<template>
  <div class="dispute-steps">
    <div>
      <div class="step">
        <div>
          <i class="icon iconfont processed">&#xe67c;</i>
          <span class="gray">纠纷上报</span>
        </div>
        <p class="date">{{createTime | moment()}}</p>
      </div>
      <div class="line"></div>
      <div class="step" style="padding-left: 5px;">
        <div>
          <i class="icon iconfont in-hand" v-if="status === '0'">&#xe684;</i>
          <i class="icon iconfont processed" v-if="status !== '0'">&#xe67c;</i>
          <span :class="{ gray: status !== '0', black: status === '0' }">医院处理</span>
        </div>
        <p class="date gray" v-if="status !== '0'">{{hospHandleTime | moment()}}</p>
        <p class="date black" v-if="status === '0'">处理中</p>
      </div>
      <template v-if="status !== '0' && status !== '1' && status !== '2'">
        <div class="line"></div>
        <div class="step" style="padding-left: 5px;">
          <div>
            <i class="icon iconfont in-hand" v-if="status === '3'">&#xe684;</i>
            <i class="icon iconfont processed" v-if="status !== '3'">&#xe67c;</i>
            <span :class="{ gray: status !== '3', black: status === '3' }">医调委受理</span>
          </div>
          <p class="date gray" v-if="status !== '3'">{{acceptTime | moment()}}</p>
          <p class="date black" v-if="status === '3'">待受理</p>
        </div>
        <div class="line" :class="{ 'shallow-gray': status === '3' }"></div>
        <div class="step" style="padding-left: 5px;">
          <div>
            <i class="icon iconfont untreated" v-if="status === '3'">&#xe688;</i>
            <i class="icon iconfont in-hand" v-if="status === '4'">&#xe684;</i>
            <i class="icon iconfont processed" v-if="status === '5' || status === '6'">&#xe67c;</i>
            <span :class="{ gray: status !== '3', black: status === '4', 'shallow-gray': status === '3' }">医调委处理</span>
          </div>
          <p class="date gray" v-if="status === '5' || status === '6'">{{mediateHandleTime | moment()}}</p>
          <p class="date black" v-if="status === '4'">处理中</p>
        </div>
        <div class="line" :class="{ 'shallow-gray': status !== '6' }"></div>
        <div class="step" style="padding-left: 5px;">
          <div>
            <i class="icon iconfont untreated" v-if="status !== '6'">&#xe688;</i>
            <i class="icon iconfont processed" v-if="status === '6'">&#xe67c;</i>
            <span :class="{ 'shallow-gray': status !== '6', gray: status === '6' }">调解公示</span>
          </div>
          <p class="date shallow-gray" v-if="status === '6'">{{publicityTime | moment()}}</p>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: ['status', 'createTime', 'hospHandleTime', 'acceptTime', 'mediateHandleTime', 'publicityTime'],
  data () {
    return {

    }
  }
}
</script>
<style scoped lang="less">
  .dispute-steps{
    padding: 30px 0 14px 0;
    > div{
      display: flex;
      width: 100%;
      height: 80px;
      padding: 16px;
      background: #FAFAFA;
      .step{
        padding: 0 4px;
        overflow: hidden;
        white-space:nowrap;
        i{
          width: 26px;
          height: 26px;
          padding: 4px;
          margin-right: 6px;
          border-radius: 50%;
          color: #1890FF;
          vertical-align: middle;
        }
        i.processed{
          border: 1px solid #1890FF;
        }
        i.in-hand{
          background: #1890FF;
          color: rgba(255,255,255,1);
        }
        i.untreated{
          display: inline-block;
          color:rgba(204,204,204,1);
          border: 1px solid rgba(204,204,204,1);
          border-radius: 50%;
        }
        span{
          font-size: 16px;
          line-height: 24px;
        }
        p{
          padding-left: 36px;
          padding-top: 6px;
          color: #888888;
          line-height: 22px;
          overflow: hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        .date.gray, span.shallow-gray{
          color: #888888;
        }
        .date.black, span.gray{
          color: #4A4A4A;
        }
        span.black{
          color: rgba(0,0,0,0.85);
          font-weight: bold;
        }
      }
      .line{
        width: 8%;
        height: 16px;
        margin: 0 4px;
        border-bottom: 2px solid #1890FF;
      }
      .line.shallow-gray{
        border-color: rgba(0,0,0,0.15);
      }
    }
  }
</style>
