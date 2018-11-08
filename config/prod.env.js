'use strict'
// 自定义BUILD_ENV，区分测试/生产环境
let build_env = process.argv.splice(2)[0] || 'prod';
console.log('BUILD_ENV argy', build_env);
module.exports = {
  NODE_ENV: '"production"',
  BUILD_ENV: '"' + build_env + '"'
}
