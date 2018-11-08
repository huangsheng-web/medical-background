/*
 * vue全局方法
 */
import Vue from 'vue';
import Moment from 'moment';

// 全局过滤方法
Vue.prototype.moment = Moment;

// 全局过滤方法
Vue.prototype.filterColumn = function (value, row, column) {
  let propt = null;
  if (column && column.property && row[column.property]) {
    propt = row[column.property] + '';
  } else {
    return false;
  }
  if (value) {
    return propt === value + '';
  }
  return false;
};
/**
 * @summary 表格列过滤
 * @param {Array} tableColumns 列数组对象（详情请console）
 * @param {Array} data 需要过滤的数据
 * @param {Array} columns 需要过滤的列名
 * @param {Object} desData 列名转义对象 e.g. {'1': '不横切', '2': '一切二', '3': '一切三'}
 * */
Vue.prototype.setFilterDatas = function (tableColumns = [], data = [], columns = [], desData = {}) {
  let objs = {};
  // 过滤数据，得到对象 {order_no: {'001': '001'}, ...}
  for (let fitem of data) {
    for (let fsitem of columns) {
      if (!objs[fsitem]) {
        objs[fsitem] = {};
      }
      if (fitem[fsitem] || fitem[fsitem] === 0) {
        objs[fsitem][fitem[fsitem]] = fitem[fsitem];
      }
    }
  }
  for (let [k_, v_] of Object.entries(objs)) {
    // k_ 为字段名；v_ 为{"0PAA10":"0PAA10","0PAA12":"0PAA12"}
    // objs[k_] = [];
    let aItem = [];
    for (let v2_ of Object.values(v_)) {
      let _test = v2_;
      // code -> name
      if (desData && desData[k_]) { _test = desData[k_][v2_]; }
      aItem.push({
        value: v2_,
        text: _test
      });
    }
    // 为列加入filters 并自定义 filterReset
    for (let tcitem of tableColumns) {
      if (tcitem.property === k_) {
        tcitem.filters = aItem;
        tcitem.filterReset = true;
        break;
      }
    }
  }
};
/**
 * 去掉字符前后中间所有空格
 */
Vue.prototype.Trim = function (str, isGlobal) {
  if (str === null) {
    return false;
  }
  let result;
  result = str.replace(/(^\s+)|(\s+$)/g, '');
  if (isGlobal.toLowerCase() === 'g') {
    result = result.replace(/\s/g, '');
  }
  return result;
};
