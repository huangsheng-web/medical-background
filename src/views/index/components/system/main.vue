<template>
  <div class="main">
    <main-header class="ar-header"/>
    <div class="ar-content">
      <el-menu :router="true" style="" class="ar-c-menu el-menu-vertical-demo">
        <el-menu-item index="/mainAth/organization">
          <i class="iconfont first-icon">&#xe6c5;</i>
          <span slot="title" class="first-menu">组织架构</span>
        </el-menu-item>
        <el-menu-item index="/mainAth/user">
          <i class="iconfont first-icon">&#xe6ba;</i>
          <span slot="title" class="first-menu">项目用户</span>
        </el-menu-item>
        <el-menu-item index="/mainAth/role">
          <i class="iconfont first-icon">&#xe6a7;</i>
          <span slot="title" class="first-menu">角色管理</span>
        </el-menu-item>
        <el-menu-item index="/mainAth/authority">
          <i class="iconfont first-icon">&#xe6aa;</i>
          <span slot="title" class="first-menu">权限管理</span>
        </el-menu-item>
      </el-menu>
      <div class="ar-cont">
        <transition enter-active-class="fade-in" leave-active-class="leave-immediately"
                    :duration="{ enter: 300, leave: 100 }">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <footer class="ar-footer">
      <div>Copyright © 2014 - 2015 aorise.com ALL Rights Reserved 网站备案 湘ICP备15016651号技术支持：湖南奥昇信息技术有限公司</div>
    </footer>
  </div>
</template>
<script>
import mainHeader from '@/components/common/header.vue';
export default {
  components: {mainHeader},
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.main {
  margin: 0 auto;
  height: 100%;
  .ar-header {
    position: fixed; top: 0; left: 0; z-index: 1002;
    width: 100%; min-width: 1200px; height: 65px;
  }
  .ar-content {
    padding-top: 65px;
    min-height: calc(100% - 80px);
    position: relative;
    background: #F5F5F5;
    .ar-c-menu {
      position: fixed;
      background-color: #393D49;
      height: 100%;
      z-index: 900;
      float: left;
    }
    .ar-cont {
      height: 100%;
      transition: margin-left .3s linear;
      margin-left: 220px;
      margin-right: 20px;
    }
    .first-icon {
      color: #FFF;
      font-size: 18px;
    }
    .first-menu {
      color: #FFF;
      padding-left: 10px;
    }
  }
  .ar-footer {
    width: calc(100% - 200px); height: 80px;
    position: relative; bottom: 0; z-index: 1002;
    display: flex;
    justify-content: center;
    background: #F5F5F5;
    margin-left: 200px;
    > div {
      width: 480px;
      font-size: 12px;
      color: #999;
      text-align: center;
      position: absolute;
      bottom: 30px;
    }
  }
}
</style>
<style lang="less">
  .el-menu-vertical-demo {
    width: 200px;
    min-height: 400px;
    .el-menu-item:focus,
    .el-menu-item:hover {
      background-color: #2B2E37;
    }
  }
</style>
