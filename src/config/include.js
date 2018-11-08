/*
* 通用引入，包含element-ui等
* */
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 2.0
// 项目公用样式
import '@/assets/css/style.css';
// import 全局filter
import '@/utils/filter.js';
// import 全局方法
import '@/utils/method.js';
// 富文本编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
// use element-ui 2.0
Vue.use(ElementUI);
