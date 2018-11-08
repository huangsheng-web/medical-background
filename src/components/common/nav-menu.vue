<template>
  <div class="navs">
    <ul>
      <router-link tag="li" v-if="item.meta.header" v-for="item in routerArr"  :key="item.index" :to="{ path: '/main/' + item.path, query: {id: item.meta.menu} }">{{item.meta.title}}</router-link>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      navDatas: [],
      highIndex: '',
      isYY: false,
      isWSY: false,
      isYTW: false,
      isWJJ: false,
      isWHRY: false,
      isXTGLY: false,
      routerArr: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    // this.getRole();
    this.routerArr = this.$store.state.routers[0].children;
    console.log(this.routerArr, '=====')
    // console.log(this.$route)
  },
  methods: {
    // 找到数组固定位置下标方法
    // find (str, cha, num) {
    //   let x = str.indexOf(cha);
    //   for (let i = 0; i < num; i++) {
    //     x = str.indexOf(cha, x + 1);
    //   }
    //   return x;
    // },
    // getRole () {
    //   // 卫计局
    //   const WJJNavDatas = [
    //     {path: '/userManage', name: '用户管理'},
    //     {path: '/registration', name: '挂号管理'},
    //     {path: '/dispute/performanceList', name: '医疗纠纷管理'},
    //     {path: '/supervise-bureau', name: '财务监管'},
    //     {path: '/disease/sebGuide', name: '慢病及职业病管理'},
    //     {path: '/statistics', name: '统计'}
    //   ]
    //   // 医院
    //   const YYNavDatas = [
    //     {path: '/registration', name: '挂号管理'},
    //     {path: '/dispute/hospitalInHandList', name: '医疗纠纷管理'},
    //     {path: '/disease/hpGuide', name: '慢病及职业病管理'},
    //     {path: '/statistics', name: '统计'}
    //   ]
    //   // 医调委
    //   const YTWNavDatas = [
    //     {path: '/dispute/notAcceptedList', name: '医疗纠纷管理'},
    //     {path: '/statistics', name: '统计'}
    //   ]
    //   // 卫生院
    //   const WSYNavDatas = [
    //     {path: '/supervise-hospital', name: '财务监管'},
    //     {path: '/disease/hcGuide', name: '慢病及职业病管理'},
    //     {path: '/statistics', name: '统计'}
    //   ]
    //   // 维护人员
    //   const WHRYNavDatas = [
    //     {path: '/medical', name: '医疗知识库'},
    //     {path: '/diseaseClassify', name: '综合管理'}
    //   ]
    //   // 系统管理员
    //   // const XTGLYNavDatas = [
    //   //   {path: '/user-manage', name: '用户管理'},
    //   //   {path: '/registration', name: '挂号管理'},
    //   //   {path: '/dispute/accepted', name: '医疗纠纷管理'},
    //   //   {path: '/medical', name: '医疗知识库'},
    //   //   {path: '/supervise-bureau', name: '财务监管'},
    //   //   {path: '/disease/seb-guide', name: '慢病及职业病管理'},
    //   //   {path: '/disease-classify', name: '综合管理'},
    //   //   {path: '/statistics', name: '统计'}
    //   // ]
    //   if (this.userInfo) {
    //     this.isWJJ = this.userInfo.roleNameList.some(item => item === '卫计局');
    //     this.isYY = this.userInfo.roleNameList.some(item => item === '医院');
    //     this.isWSY = this.userInfo.roleNameList.some(item => item === '卫生院');
    //     this.isYTW = this.userInfo.roleNameList.some(item => item === '医调委');
    //     this.isWHRY = this.userInfo.roleNameList.some(item => item === '维护人员');
    //     this.isXTGLY = this.userInfo.roleNameList.some(item => item === '系统管理员');
    //     let roleList = [];
    //     if (this.isWJJ) {
    //       roleList = [...WJJNavDatas];
    //     }
    //     if (this.isYY) {
    //       roleList = [...roleList, ...YYNavDatas];
    //     }
    //     if (this.isWSY) {
    //       roleList = [...roleList, ...WSYNavDatas];
    //     }
    //     if (this.isYTW) {
    //       roleList = [...roleList, ...YTWNavDatas];
    //     }
    //     if (this.isWHRY) {
    //       roleList = [...roleList, ...WHRYNavDatas];
    //     }
    //     // 去重
    //     let obj = {};
    //     roleList = roleList.reduce((item, next) => {
    //       if (!obj[next.name]) {
    //         obj[next.name] = true;
    //         item.push(next);
    //       }
    //       return item;
    //     }, []);
    //     this.navDatas = roleList;
    //     // 让导航栏保持高亮
    //     this.highIndex = this.navDatas.indexOf(this.navDatas.find(x => this.$route.path.includes(x.path.slice(0, this.find(x.path, '/', 1)))));
    //   }
    // }
  }
  // watch: {
  //   $route (to, from) {
  //     // 让导航栏保持高亮
  //     this.highIndex = this.navDatas.indexOf(this.navDatas.find(x => to.path.includes(x.path.slice(0, this.find(x.path, '/', 1)))));
  //   }
  // }
}
</script>
<style scoped lang="less">
  .navs{
    width: 100%;
    background: #1281e7;
    box-shadow:2px 2px 6px rgba(0,0,0,0.19);
    position: fixed;
    top: 50px;
    z-index: 999;
    ul{
      height: 40px;
      display: flex;
      line-height: 40px;
      padding-left: 80px;
      li{
        color:rgba(208,230,250,1);
        padding: 0 15px;
        cursor: pointer;
        &:hover, &.router-link-active{
          color:rgba(255,255,255,1);
          font-weight: bold;
          border-bottom: 3px solid rgba(255,255,255,1);
        }
        span{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
