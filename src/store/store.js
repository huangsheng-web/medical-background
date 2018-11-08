import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
// import { ctx } from '@/config/config.js';
Vue.use(Vuex);
const state = {
  // ctx: process.env.NODE_ENV === 'production' ? ('/' + ctx) : '',
  ctx: '',
  // 登录token
  token: null,
  // 面包屑
  breadcrumb: [],
  testStore: '~@~',
  // 上传文件路径
  fileUploadUrl: '',
  // 纠纷管理权限账号
  // 医院端
  // userId: '1'
  // 医调委
  // userId: '2'
  // 卫计局端
  userId: '3',
  // 侧边栏动态栏目
  activeMenuId: '',
  routers: [],
  roleAuthList: [],
  isAddRouter: false,
  proKey: '69e1a034c587a490f34a8b28724beb0d'
};
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
