<template>
  <div class="clearfix">
    <div class="left fl">
      <div is="sidebar"></div>
    </div>
    <div class="right fl">
      <transition enter-active-class="fade-in" leave-active-class="leave-immediately"
                :duration="{ enter: 300, leave: 100 }">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import sidebar from '@/components/common/sidebar.vue';
export default {
  components: { sidebar },
  data () {
    return {
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped lang="less">
  .left{
    width: 160px;
    padding-top: 20px;
    background: #fff;
  }
  .right{
    min-height: 800px;
    margin-top: 90px;
    width: calc(100% - 160px);
    height: 100%;
    padding: 26px 30px 30px 30px;
    border-left: 1px solid rgba(232,232,232,1);
  }
</style>
