<template>
  <div class="sidebar">
    <div>
      <el-menu
        :default-active="$store.state.activeMenuId"
        class="ar-c-menu el-menu-vertical-demo"
        unique-opened>
        <div v-for="item in slideList" :key="item.index">
          <el-submenu v-if="hasChild(item.children)" :index="item.meta.style">
            <template slot="title">
              <i class="iconfont first-icon" :class="item.meta.style"></i>
              <span slot="title">{{item.meta.title | sidebarTitle}}</span>
            </template>
            <el-menu-item v-if="a.meta.side" class="second-menu" v-for="a in item.children" :key="a.index" :index="a.meta.style" @click="onNavigate(a.name)">
              <span slot="title">{{a.meta.title | sidebarTitle}}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-if="!hasChild(item.children) && item.meta.side" :index="item.meta.style" @click="onNavigate(item.name)">
            <i class="iconfont first-icon" :class="item.meta.style"></i>
            <span slot="title">{{item.meta.title | sidebarTitle}}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      slideList: []
    }
  },
  watch: {
    $route (to, from) {
      this.changeActiveMenu(to.name);
    }
  },
  created () {
    let activeId = this.$route.query.id;
    if (this.$store.state.routers[0].children && this.$store.state.routers[0].children.length > 0) {
      this.$store.state.routers[0].children.forEach(item => {
        if (item.meta.menu === activeId) {
          this.slideList.push(...item.children);
        }
      })
    }
    console.log(this.slideList, '00000')
  },
  mounted () {
    this.$nextTick(() => {
      this.changeActiveMenu(this.$route.name);
    })
  },
  methods: {
    hasChild (item) {
      if (item && item.length !== 0) {
        console.log(item)
        if (item.some(x => x.meta.side === false)) {
          console.log('1')
          return false;
        } else {
          console.log('2')
          return true;
        }
      } else {
        console.log('3')
        return false
      }
    },
    onNavigate (name) {
      this.$router.push({name: name, query: {id: this.$route.query.id}});
    },
    changeActiveMenu (name) {
      console.log(this.slideList, '11111111')
      const menu = this.findMenu(this.slideList, name);
      if (menu) {
        this.$store.commit('setActiveMenu', menu.meta.style);
      } else {
        this.$store.commit('setActiveMenu', '');
      }
    },
    findMenu (menus, name) {
      for (let menu of menus) {
        if (menu.name === name) {
          return menu;
        }
        if (menu.children && menu.children.length > 0) {
          const child = this.findMenu(menu.children, name);
          if (child) {
            return child;
          }
        }
      }
    }
  }
}
</script>
<style lang="less">
  .sidebar{
    width: 160px;
    position: fixed;
    top: 110px;
    .el-submenu__icon-arrow{
      right: 10px!important;
      margin-top: -5px;
    }
    > div {
      .el-menu-item{
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left: 29px;
        color:rgba(102,102,102,1);
        min-width: 0;
        cursor: pointer;
        &:hover, &.is-active{
          color:rgba(24,144,255,1);
          font-weight: bold;
          background:rgba(230,247,255,1);
          border-right: 2px solid rgba(24,144,255,1);
        }
      }
    }
  }
</style>
