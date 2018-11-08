<template>
  <div class="main">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="state === 1">用户</el-breadcrumb-item>
      <el-breadcrumb-item v-if="state === 2">用户组</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ar-tab-nav">
      <router-link :to="{ name: 'userList'}" :class="{'router-link-exact-active': state === 1}" @click.native = "state = 1">用户</router-link>
      <router-link :to="{ name: 'groupList'}" :class="{'router-link-exact-active': state === 2}"  @click.native = "state = 2">组</router-link>
    </div>
    <div>
      <transition enter-active-class="fade-in" leave-active-class="leave-immediately"
                  :duration="{ enter: 300, leave: 100 }">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import { setCookie, getCookie } from '@/utils/util.js';
export default {
  data () {
    return {
      plateName: getCookie('plateName'),
      state: 1
    }
  },
  created () {
    console.log('初始化')
  }
}
</script>

<style lang="less" scoped>
.main {
  > .ar-tab-nav {
    padding: 20px 0 30px 0;
    overflow: hidden;
    > a {
      display: block;
      float: left;
      width: 120px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
      border-left: 1px solid #e8e8e8;
      text-decoration: none !important;
      color: #333333;
      font-size: 14px;
      cursor: pointer;
      &:hover{
        border: 1px solid #1890FF;
        color: #1890FF;
      }
      &:first-child{
        -webkit-border-radius: 4px 0 0 4px;
        -moz-border-radius: 4px 0 0 4px;
        border-radius: 4px 0 0 4px;
        &:hover{
          border: 1px solid #1890FF;
          color: #1890FF;
        }
      }
      &:last-child{
        border-right: 1px solid #e8e8e8;
        -webkit-border-radius: 0 4px 4px 0;
        -moz-border-radius: 0 4px 4px 0;
        border-radius: 0 4px 4px 0;
        &:hover{
          border: 1px solid #1890FF;
          color: #1890FF;
        }
      }
      &.router-link-exact-active {
        background: #1890FF;
        color: #ffffff;
        position: relative;
        border: none;
        &:after{
          content: '';
          display: block;
          width: 12px;
          height: 12px;
          background: #1890FF;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          position: absolute;
          bottom: -6px;
          left: 54px;
        }
        &:hover{
          border: none!important;
          color: #FFFFFF!important;
        }
      }
    }
  }
}
.pm-main {
  background: #fff;
}
</style>
