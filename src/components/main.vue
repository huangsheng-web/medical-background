<template>
  <div class="main">
    <div is="mainHeader"></div>
    <div is="mainNavMenu"></div>
    <div class="sl-content-main as-width">
      <transition enter-active-class="fade-in" leave-active-class="leave-immediately"
                  :duration="{ enter: 300, leave: 100 }">
        <router-view></router-view>
      </transition>
    </div>
    <div is="mainFooter"></div>
  </div>
</template>
<script>
import mainFooter from '@/components/common/footer.vue';
import mainHeader from '@/components/common/header.vue';
import mainNavMenu from '@/components/common/nav-menu.vue';
export default {
  components: {mainFooter, mainHeader, mainNavMenu},
  data () {
    return {
      showData: ''
    }
  },
  methods: {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main {
    margin: 0 auto;
    height: 100%;
  }
</style>
