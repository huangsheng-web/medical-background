<template>
  <div class="personal-center clearfix">
    <div class="left fl">
      <div is="sidebar" :sidebar-data="sidebarData"></div>
    </div>
    <div class="right fl" id="personal-center-right">
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
  name: 'personal-center',
  components: { sidebar },
  data () {
    return {
      sidebarData: [
        { name: 'modify-telephone', title: '修改手机号', style: 'personal-center-one' },
        { name: 'modify-password', title: '修改密码', style: 'personal-center-two' }
      ]
    }
  },
  mounted () {
    // 根据当前屏幕的高度自适应调整页面高度
    $(document).ready(function () {
      let windowHeight = $(window).height();
      if (windowHeight) {
        document.getElementById('personal-center-right').style.height = (windowHeight - 140) + 'px';
      } else {
        document.getElementById('personal-center-right').style.height = 807 + 'px';
      }
    });
  },
  methods: {
  }
}
</script>
<style scoped lang="less">
  .personal-center{
    width: 100%;
    height: 100%;
    .left{
      width: 160px;
      padding-top: 20px;
      background: #fff;
    }
    .right{
      margin-top: 90px;
      width: calc(100% - 160px);
      padding: 26px 30px 30px 30px;
      border-left: 1px solid rgba(232,232,232,1);
    }
  }
</style>
