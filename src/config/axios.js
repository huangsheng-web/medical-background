/*
* axios定义
* */
import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
// router
import router from '@/views/index/router/index.js';
import { ajaxCtx, ajaxCtx2, ajaxCtx0 } from '@/config/config.js';
// axios支持跨域cookie
axios.defaults.withCredentials = true;
// axios添加一个请求拦截器
axios.interceptors.request.use((config) => {
  // 拦截接口路径然后给接口后续添加一个_r=时间截的内容
  if (config.url.indexOf('S0') === 0) {
    config.url = ajaxCtx0 + config.url.substring(2);
  } else if (config.url.indexOf('S2') === 0) {
    config.url = ajaxCtx2 + config.url.substring(2);
  } else if (config.url.indexOf('http') !== 0) {
    config.url = ajaxCtx + config.url;
  }
  let r = '_r=' + new Date().getTime();
  if (config.url.indexOf('?') > 0) {
    r = '&' + r;
  } else {
    r = '?' + r;
  }
  config.url = config.url + r;
  /* // 设置权限头star */
  if (sessionStorage.getItem('sessionId')) {
    config.headers['AUTH_SESSION_ID'] = sessionStorage.getItem('sessionId');
  }
  /* // 设置权限头end */
  return config;
}, (error) => {
  return Promise.reject(error);
});
// axios添加一个响应拦截器
axios.interceptors.response.use((response) => {
  if (response && response.data) {
    let _data = response.data;
    /* // 获取权限头内容star */
    _data.header = response.headers;
    /*  // 获取权限头内容end */
    if (response.headers['content-type'] === 'application/octet-stream') {
      return _data;
    }
    if (_data.code === '00000000') {
      // 00000000 表示数据正确
      return _data;
    } else if (_data.code === '99999999') {
      // 退出登录
      // sessionStorage.removeItem('loginId');
      // sessionStorage.removeItem('authorization');
      ElementUI.Message({ message: '登录超时，请重新登录！', type: 'error' });
      router.push({name: 'login'});
      return null;
    } else {
      let msg = '访问出错';
      if (_data.viewMsg) {
        msg = _data.viewMsg;
        ElementUI.Message({ message: msg, type: 'error' });
      }
      return null;
    }
  } else {
    return null;
  }
}, (error) => {
  let errorMsg = '<span style="font-weight: bold; font-size: 13px; display: inline-block; padding-bottom: 5px;">操作失败</span><br/><span>请刷新页面重新操作，如果问题依旧存在，请联系管理员</span>';
  if (error && error.response && error.response.data) {
    let errorData = error.response.data;
    let mCode = errorData.code;
    // 根据返回的错误信息得到相关的错误内容数据并且赋值到提示语句中用于后续提示
    if (errorData.message) { errorMsg = errorData.message; }
    if (errorData.error) {
      if (errorData.error.message) { errorMsg = errorData.error.message; }
      mCode = errorData.error.code;
    }
  }
  // 提示出错内容并且返回一个错误的promise
  ElementUI.Message({
    message: errorMsg,
    dangerouslyUseHTMLString: true,
    type: 'error'
  });
  return Promise.reject(error);
});
Vue.prototype.axios = axios;
