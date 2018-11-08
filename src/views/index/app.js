// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from '@/components/App.vue';
// axios
import '@/config/axios.js';
// include
import '@/config/include.js';
import { Message } from 'element-ui'
// 通用store
import store from '@/store/store.js';
// 全局moment
import moment from 'moment';
// router
import router from './router/index.js';

import { imgBaseUrl, fileUploadUrl, ajaxCtx } from '@/config/config.js';
store.commit('setBaseUrl', {
  ajaxCtx: ajaxCtx,
  imgBaseUrl: imgBaseUrl,
  fileUploadUrl: fileUploadUrl
});

// 关闭生产模式下给出的提示
Vue.config.productionTip = false;

// 获取本地用户信息
let userInfo = JSON.parse(sessionStorage.getItem('token'));
if (userInfo) {
  store.commit('setToken', {
    token: userInfo
  });
} else {
  store.commit('setToken', {
    token: null
  });
}

window['menu'] = '';

router.beforeEach((to, from, next) => {
  window['menu'] = to.meta.menu || ''
  if (to.path !== '/login' && to.path !== '/') {
    if (!store.state.isAddRouter) {
      let vehicleMenuCache = sessionStorage.getItem('Vehicle-Menu')
      try {
        vehicleMenuCache = JSON.parse(vehicleMenuCache)
      } catch (e) {
        vehicleMenuCache = null
      }
      if (vehicleMenuCache) {
        // console.log('加载缓存中的路由')
        // 加载缓存中的路由
        store.dispatch('addRouters', vehicleMenuCache).then(() => {
          router.addRoutes(store.state.routers)
          next({...to})
        })
      } else {
        next({ path: '/login' });
      }
    } else {
      next()
    }
  } else {
    next()
  }
  // 判断界面是否需要登录
  // if (!to.meta.requireAuth || sessionStorage.getItem('token')) {
  //   // console.log('=============================', to)
  //   if (!to.meta.menu) {
  //     // console.log('菜单' + to.path + '不需要判断权限，直接加载')
  //     // 有权限
  //     next()
  //   } else if (store.state.roleAuthList.indexOf(to.meta.menu) !== -1) {
  //     // console.log('菜单' + to.path + '有权限，直接加载该页面')
  //     // 有权限
  //     next()
  //   } else {
  //     Message({ message: '菜单' + to.path + ':无权限，界面已返回', type: 'error' });
  //     // console.log('菜单' + to.path + ':无权限，界面返回')
  //     next({...from})
  //   }
  // } else {
  //   next({ path: '/login' });
  // }
  // if (sessionStorage.getItem('TOKEN')) {
  //   next();
  // } else {
  //   const login = { path: '/login', query: { redirect: to.fullPath } };
  //   next(login);
  // }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  moment,
  components: { App },
  template: '<App/>'
});
