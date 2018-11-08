<template>
  <div class="header">
    <div class="left">
        <img src="../../assets/img/logo.png" alt="">
        <span>怀化市溆浦县智慧医疗信息平台</span>
    </div>
    <div class="user">
      <span @click="skipIsPersonalCenter">{{loginName}}</span>
      <span>|</span>
      <span @click="cancelLogin">退出</span>
    </div>
  </div>
</template>
<script>
import {getCookie, setCookie} from '@/utils/util.js';
export default {
  data () {
    return {
      loginName: ''
    }
  },
  mounted () {
    this.getName();
  },
  methods: {
    skipIsPersonalCenter () {
      const item = this.$store.state.routers[0].children.find(f => f.meta.title === '个人中心');
      this.$router.push({ path: '/main/' + item.path, query: {id: item.meta.menu} })
    },
    getName () {
      if (this.$store.state.token != null) {
        this.loginName = this.$store.state.token.userName;
      }
    },
    // 退出登陆
    cancelLogin () {
      this.axios.delete('/hisServices/users/logout?telephone=' + this.$store.state.token.telephone)
        .then(res => {
          this.$message({
            message: '退出成功！',
            type: 'success'
          });
          // 退出登录状态
          this.$store.commit('setToken', {
            token: null
          });
          this.$store.commit('REMOVE_MENU');
          window.location.reload();
          this.$router.push({name: 'login'})
        }).finally(fn => {
          sessionStorage.removeItem('sessionId');
        })
    }
  }
}
</script>
<style scoped lang="less">
  .header{
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: fixed;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    padding: 0 38px;
    background:rgba(24,144,255,1);
    .left{
      span{
        font-size:18px;
        color:rgba(255,255,255,1);
      }
      img{
        width: 40px;
        height: 40px;
        vertical-align: middle;
        margin-right: 10px;
        padding-bottom: 6px;
      }
    }
    .user span{
      margin-right: 4px;
      font-size:14px;
      color:rgba(255,255,255,1);
      cursor: pointer;
    }
  }
</style>
