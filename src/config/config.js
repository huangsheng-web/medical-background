// 是否使用本地API接口
export const localAPI = false;
// 是否使用线上API接口
export const publicAPI = false;

export const ctx = 'web-medical-background';

/*
 * 域名地址
 * dev 开发环境
 * test 测试环境
 * prod 生产环境
 * */
const oDomains = {
  // ajax地址`
  domain: {
    // 开发
    // 'http://10.16.3.35:8081'
    // 测试
    // 'http://10.16.4.15:8082'
    // 冉毅
    // dev: 'http://10.116.64.235:8081',
    // 龙志海
    // dev: 'https://10.116.64.127:9528',
    // 戴德储
    dev: 'http://10.116.64.249:8081',
    // dev: 'http://10.116.64.249:8081',
    // 龙靖凌
    // dev: 'http://10.116.64.92:9527',
    // dev: 'https://med.aorise.org/service',
    test: 'https://med.aorise.org/p2/service',
    prod: 'https://med.aorise.org/service'
  },
  // 用户服务中心
  authServiceDomain: {
    dev: 'http://10.16.4.41:8084',
    test: 'http://10.16.4.41:8084',
    prod: 'http://10.16.4.41:8084'
  },
  // 文件/图片/CDN地址
  fileDomain: {
    dev: 'http://swift.aorise.org:8090/v1/AUTH_a415edee1cbd404795977372009b51dd/travel-pub',
    test: 'http://swift.aorise.org:8090/v1/AUTH_a415edee1cbd404795977372009b51dd/travel-pub',
    prod: 'http://swift.aorise.org:8090/v1/AUTH_a415edee1cbd404795977372009b51dd/travel-pub'
  },
  // 上传地址
  uploadDomain: {
    dev: 'https://med.aorise.org',
    test: 'https://med.aorise.org',
    prod: 'https://med.aorise.org'
  }
};
let sENV = 'dev';
if (process.env.NODE_ENV === 'production') {
  let buildEnv = process.env.BUILD_ENV;
  if (buildEnv && buildEnv.toLowerCase() === 'test') {
    // npm run build -- test
    sENV = 'test';
  } else {
    // npm run build / npm run build -- prod
    sENV = 'prod';
  }
} else if (process.env.NODE_ENV === 'development') {
  sENV = 'dev';
}
console.log('environment', sENV);
// ajax default
export const ajaxCtx = oDomains.domain[sENV] + '/api/yl';
// ajax url starts with S2/...
export const ajaxCtx2 = oDomains.authServiceDomain[sENV] + '/api';
// ajax url starts with S0/...
export const ajaxCtx0 = oDomains.domain[sENV] + '/api/yl';
// 文件上传地址
export const fileUploadUrl = oDomains.uploadDomain[sENV];
// 图片所在域名地址
export const imgBaseUrl = oDomains.fileDomain[sENV] + '/';
// 文件所在域名地址
export const fileBaseUrl = oDomains.fileDomain[sENV] + '/';

// cookie名
export const cookieUserId = 'xinsteel.ytg_Authorization';
export const cookieUserName = 'xinsteel.ytg_userName';
// cookie默认有效时间（小时）
export const cookieTime = 24;
