<template>
  <div class="user-manage clearfix">
      <div class="left fl">
        <div is="sidebar" :sidebar-data="sidebarData"></div>
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
  name: 'user-manage',
  components: { sidebar },
  data () {
    return {
      sidebarData: [
        { name: 'register-list', title: '注册用户管理', style: 'user-manage-one' },
        { name: 'record-list', title: '关联健康档案', style: 'user-manage-tow' }
      ]
    }
  },
  methods: {
  }
}
</script>
<style scoped lang="less">
  .user-manage{
    .left{
      width: 160px;
      padding-top: 20px;
      background: #fff;
    }
    .right{
      margin-top: 90px;
      width: calc(100% - 160px);
      height: 100%;
      padding: 26px 30px 30px 30px;
      border-left: 1px solid rgba(232,232,232,1);
    }
  }
</style>
