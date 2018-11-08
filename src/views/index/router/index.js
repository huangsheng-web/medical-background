import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store.js'
import axios from 'axios';
// 主要
import main from '@/components/main.vue'

// 登录
import login from '@/views/index/components/login.vue'
import notFound from '@/views/index/components/not-found.vue'
// 用户管理
import userManage from '@/views/index/components/user-manage/user-manage.vue'
import registerList from '@/views/index/components/user-manage/register-list.vue'
import recordList from '@/views/index/components/user-manage/record-list.vue'
import recordDetail from '@/views/index/components/user-manage/record-detail.vue'
// 个人中心-账号管理
import personalCenter from '@/views/index/components/personal-center/personal-center.vue'
import modifyPassword from '@/views/index/components/personal-center/modify-password.vue'
import modifyTelephone from '@/views/index/components/personal-center/modify-telephone.vue'
// 综合管理
import diseaseClassify from '@/views/index/components/disease-classify/disease-classify.vue'
import adviceDispose from '@/views/index/components/disease-classify/advice-dispose.vue'
import adviceList from '@/views/index/components/disease-classify/advice-list.vue'
import infoList from '@/views/index/components/disease-classify/info-list.vue'
import infoAdd from '@/views/index/components/disease-classify/info-add.vue'
// 医疗知识库
import medicalBase from '@/views/index/components/medical-base/medical-base.vue'
import diseaseList from '@/views/index/components/medical-base/disease-list.vue'
import diseaseAdd from '@/views/index/components/medical-base/disease-add.vue'
import sectionList from '@/views/index/components/medical-base/section-list.vue'
// 医疗服务
import medicalService from '@/views/index/components/medical-service/medical-service.vue'
import diseaseStatistics from '@/views/index/components/medical-service/disease-statistics.vue'
import hospitalizationBusinessSummary from '@/views/index/components/medical-service/hospitalization-business-summary.vue'
import hospitalizationExpensesDetailed from '@/views/index/components/medical-service/hospitalization-expenses-detailed.vue'
import hospitalizationPrescriptionDetailed from '@/views/index/components/medical-service/hospitalization-prescription-detailed.vue'
import outpatientBusinessSummary from '@/views/index/components/medical-service/outpatient-business-summary.vue'
import outpatientExpensesDetailed from '@/views/index/components/medical-service/outpatient-expenses-detailed.vue'
import outpatientPrescriptionDetailed from '@/views/index/components/medical-service/outpatient-prescription-detailed.vue'
// 药物管理
import medicineManage from '@/views/index/components/medicine-manage/medicine-manage.vue'
import medicineIncomeSummary from '@/views/index/components/medicine-manage/medicine-income-summary.vue'
import medicineStockDetailed from '@/views/index/components/medicine-manage/medicine-stock-detailed.vue'
import medicineStockSummary from '@/views/index/components/medicine-manage/medicine-stock-summary.vue'
import medicineWarehousingDetailed from '@/views/index/components/medicine-manage/medicine-warehousing-detailed.vue'
/* 医疗矛盾 start */
import disputeMediation from '@/views/index/components/dispute-mediation/dispute-mediation.vue'
// 未受理
import notAcceptedList from '@/views/index/components/dispute-mediation/not-accepted/not-accepted-list.vue'
import notAcceptedDetail from '@/views/index/components/dispute-mediation/not-accepted/not-accepted-detail.vue'
// 处理中
import hospitalInHandList from '@/views/index/components/dispute-mediation/hospital-in-hand/hospital-in-hand-list.vue'
import hospitalInHandDetail from '@/views/index/components/dispute-mediation/hospital-in-hand/hospital-in-hand-detail.vue'
import hospitalInHandProtocol from '@/views/index/components/dispute-mediation/hospital-in-hand/hospital-in-hand-protocol.vue'
import hospitalInHandRequisition from '@/views/index/components/dispute-mediation/hospital-in-hand/hospital-in-hand-requisition.vue'
import printAgreement from '@/views/index/components/dispute-mediation/hospital-in-hand/print-agreement.vue'
import printRequisition from '@/views/index/components/dispute-mediation/hospital-in-hand/print-requisition.vue'
// 非医院处理中
import hospitalNotInHandList from '@/views/index/components/dispute-mediation/hospital-not-in-hand/hospital-not-in-hand-list.vue'
import hospitalNotInHandDetail from '@/views/index/components/dispute-mediation/hospital-not-in-hand/hospital-not-in-hand-detail.vue'
import acceptanceSheet from '@/views/index/components/dispute-mediation/hospital-not-in-hand/acceptance-sheet.vue'
import printAcceptanceSheet from '@/views/index/components/dispute-mediation/hospital-not-in-hand/print-acceptance-sheet.vue'
import inHandProcessBook from '@/views/index/components/dispute-mediation/hospital-not-in-hand/in-hand-process-book.vue'
// 已处理
import hospitalProcessedList from '@/views/index/components/dispute-mediation/hospital-processed/hospital-processed-list.vue'
import hospitalProcessedDetail from '@/views/index/components/dispute-mediation/hospital-processed/hospital-processed-detail.vue'
import processedProcessBook from '@/views/index/components/dispute-mediation/hospital-processed/processed-process-book.vue'
// 非医院已处理
import hospitalNotProcessedList from '@/views/index/components/dispute-mediation/hospital-not-processed/hospital-not-processed-list.vue'
import hospitalNotProcessedDetail from '@/views/index/components/dispute-mediation/hospital-not-processed/hospital-not-processed-detail.vue'
import processedNotProcessBook from '@/views/index/components/dispute-mediation/hospital-not-processed/processed-not-process-book.vue'
import processedNotAdviceNote from '@/views/index/components/dispute-mediation/hospital-not-processed/processed-not-advice-note.vue'
// 已公示
import hospitalPublicizedList from '@/views/index/components/dispute-mediation/hospital-publicized/hospital-publicized-list.vue'
import hospitalPublicizedDetail from '@/views/index/components/dispute-mediation/hospital-publicized/hospital-publicized-detail.vue'
import publicizedDetail from '@/views/index/components/dispute-mediation/hospital-publicized/publicized-detail.vue'
import publicizedAdviceNote from '@/views/index/components/dispute-mediation/hospital-publicized/publicized-advice-note.vue'
import publicizedProcessBook from '@/views/index/components/dispute-mediation/hospital-publicized/publicized-process-book.vue'
// 非医院已公示
import hospitalNotPublicizedList from '@/views/index/components/dispute-mediation/hospital-not-publicized/hospital-not-publicized-list.vue'
import hospitalNotPublicizedDetail from '@/views/index/components/dispute-mediation/hospital-not-publicized/hospital-not-publicized-detail.vue'
import publicityNotDetail from '@/views/index/components/dispute-mediation/hospital-not-publicized/publicity-not-detail.vue'
import publicizedNotAdviceNote from '@/views/index/components/dispute-mediation/hospital-not-publicized/publicized-not-advice-note.vue'
import publicizedNotProcessBook from '@/views/index/components/dispute-mediation/hospital-not-publicized/publicized-not-process-book.vue'
// 绩效考核
import performanceList from '@/views/index/components/dispute-mediation/performance/performance-list.vue'
import performanceDetail from '@/views/index/components/dispute-mediation/performance/performance-detail.vue'
import performanceAdviceNote from '@/views/index/components/dispute-mediation/performance/performance-advice-note.vue'
import performanceProcessBook from '@/views/index/components/dispute-mediation/performance/performance-process-book.vue'
// 短信通知人设置
import notifierSetting from '@/views/index/components/dispute-mediation/notifier-setting/notifier-setting.vue'
/* 医疗矛盾 end */

// 财务监管
import superviseBureau from '@/views/index/components/supervise/supervise-bureau.vue';
import superviseHospital from '@/views/index/components/supervise/supervise-hospital.vue';

/* 慢病 start */
import slowDisease from '@/views/index/components/slow-disease/slow-disease.vue';
// 医院、卫生院端、卫计局端 公用模块
import contractList from '@/views/index/components/slow-disease/contract-list.vue';
import contractDetail from '@/views/index/components/slow-disease/contract-detail.vue';
// 医院端
import hpTeamList from '@/views/index/components/slow-disease/hp-team-list.vue';
import hpTeamDetail from '@/views/index/components/slow-disease/hp-team-detail.vue';
import hpGuide from '@/views/index/components/slow-disease/hp-guide.vue';
// 卫生院端
import hcTeamList from '@/views/index/components/slow-disease/hc-team-list.vue';
import hcTeamDetail from '@/views/index/components/slow-disease/hc-team-detail.vue';
import hcGuide from '@/views/index/components/slow-disease/hc-guide.vue';
import hcService from '@/views/index/components/slow-disease/hc-service.vue';
// 卫计局端
import sebGuide from '@/views/index/components/slow-disease/seb-guide.vue';
import sebServiceList from '@/views/index/components/slow-disease/seb-service-list.vue';
import sebServiceDetail from '@/views/index/components/slow-disease/seb-service-detail.vue';
import sebProtocolList from '@/views/index/components/slow-disease/seb-protocol-list.vue';
import sebProtocolDetail from '@/views/index/components/slow-disease/seb-protocol-detail.vue';
import sebTeamList from '@/views/index/components/slow-disease/seb-team-list.vue';
import sebTeamDetail from '@/views/index/components/slow-disease/seb-team-detail.vue';
/* 慢病 end */
// 统计
import statistics from '@/views/index/components/statistics/statistics.vue';
// 挂号管理
import registration from '@/views/index/components/register/register.vue';

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
    /* 注释 */
    // {
    //   path: '/main',
    //   name: 'main',
    //   component: main,
    //   beforeEnter (to, from, next) {
    //     if (sessionStorage.getItem('loginId')) {
    //       let params = sessionStorage.getItem('loginId');
    //       axios.get('/hisServices/users/userAndRole?account=' + params + '&accountType=0').then(res => {
    //         if (res) {
    //           // 写入本地cookie
    //           let userInfo = res.data;
    //           // 设置登录状态
    //           store.commit('setToken', {
    //             token: userInfo
    //           });
    //           next();
    //         }
    //       })
    //     } else {
    //       next();
    //     }
    //   },
    //   redirect: {name: 'login'},
    //   children: [
    //     // 用户管理
    //     { path: 'userManage',
    //       name: 'user-manage',
    //       component: userManage,
    //       meta: {requireAuth: true},
    //       redirect: {name: 'register-list'},
    //       children: [
    //         {path: 'registerList', name: 'register-list', component: registerList},
    //         {path: 'recordList', name: 'record-list', component: recordList},
    //         {path: 'recordDetail', name: 'record-detail', component: recordDetail}
    //       ]
    //     },
    //     // 个人中心-账号管理
    //     { path: 'personalCenter',
    //       name: 'personal-center',
    //       component: personalCenter,
    //       meta: {requireAuth: true},
    //       redirect: {name: 'modify-telephone'},
    //       children: [
    //         {path: 'modifyTelephone', name: 'modify-telephone', component: modifyTelephone},
    //         {path: 'modifyPassword', name: 'modify-password', component: modifyPassword}
    //       ]
    //     },
    //     // 综合管理
    //     { path: 'diseaseClassify',
    //       name: 'disease-classify',
    //       component: diseaseClassify,
    //       meta: {requireAuth: true},
    //       redirect: {name: 'info-list'},
    //       children: [
    //         {path: 'infoList', name: 'info-list', component: infoList},
    //         {path: 'infoAdd', name: 'info-add', component: infoAdd},
    //         {path: 'adviceList', name: 'advice-list', component: adviceList},
    //         {path: 'adviceDispose', name: 'advice-dispose', component: adviceDispose}
    //       ]
    //     },
    //     // 医疗服务
    //     { path: 'medicalService',
    //       name: 'medical-service',
    //       component: medicalService,
    //       meta: {requireAuth: true},
    //       redirect: {name: 'outpatient-business-summary'},
    //       children: [
    //         {path: 'outpatientBusinessSummary', name: 'outpatient-business-summary', component: outpatientBusinessSummary},
    //         {path: 'outpatientPrescriptionDetailed', name: 'outpatient-prescription-detailed', component: outpatientPrescriptionDetailed},
    //         {path: 'outpatientExpensesDetailed', name: 'outpatient-expenses-detailed', component: outpatientExpensesDetailed},
    //         {path: 'hospitalizationBusinessSummary', name: 'hospitalization-business-summary', component: hospitalizationBusinessSummary},
    //         {path: 'hospitalizationPrescriptionDetailed', name: 'hospitalization-prescription-detailed', component: hospitalizationPrescriptionDetailed},
    //         {path: 'hospitalizationExpensesDetailed', name: 'hospitalization-expenses-detailed', component: hospitalizationExpensesDetailed},
    //         {path: 'diseaseStatistics', name: 'disease-statistics', component: diseaseStatistics}
    //       ]
    //     },
    //     // 药物管理
    //     { path: 'medicineManage',
    //       name: 'medicine-manage',
    //       component: medicineManage,
    //       meta: {requireAuth: true},
    //       redirect: {name: 'medicine-income-summary'},
    //       children: [
    //         {path: 'medicineIncomeSummary', name: 'medicine-income-summary', component: medicineIncomeSummary},
    //         {path: 'medicineStockDetailed', name: 'medicine-stock-detailed', component: medicineStockDetailed},
    //         {path: 'medicineStockSummary', name: 'medicine-stock-summary', component: medicineStockSummary},
    //         {path: 'medicineWarehousingDetailed', name: 'medicine-warehousing-detailed', component: medicineWarehousingDetailed}
    //       ]
    //     },
    //     // 医疗知识库
    //     { path: 'medical',
    //       name: 'medical-base',
    //       component: medicalBase,
    //       meta: {requireAuth: true},
    //       redirect: {name: '疾病维护'},
    //       children: [
    //         {path: 'diseaseList', name: '疾病维护', component: diseaseList},
    //         {path: 'diseaseAdd', name: '疾病维护详情', component: diseaseAdd},
    //         {path: 'sectionList', name: '科室维护', component: sectionList}
    //       ]
    //     },
    //     // 医疗纠纷
    //     { path: 'dispute',
    //       name: 'dispute-mediation',
    //       component: disputeMediation,
    //       meta: {requireAuth: true},
    //       children: [
    //         {path: 'notAcceptedList', name: 'not-accepted-list', component: notAcceptedList},
    //         {path: 'notAcceptedDetail', name: 'not-accepted-detail', component: notAcceptedDetail},
    //         {path: 'hospitalInHandList', name: 'hospital-in-hand-list', component: hospitalInHandList},
    //         {path: 'hospitalInHandDetail', name: 'hospital-in-hand-detail', component: hospitalInHandDetail},
    //         {path: 'hospitalInHandProtocol', name: 'hospital-in-hand-protocol', component: hospitalInHandProtocol},
    //         {path: 'hospitalInHandRequisition', name: 'hospital-in-hand-requisition', component: hospitalInHandRequisition},
    //         {path: 'printAgreement', name: 'print-agreement', component: printAgreement},
    //         {path: 'printRequisition', name: 'print-requisition', component: printRequisition},
    //         {path: 'hospitalNotInHandList', name: 'hospital-not-in-hand-list', component: hospitalNotInHandList},
    //         {path: 'hospitalNotInHandDetail', name: 'hospital-not-in-hand-detail', component: hospitalNotInHandDetail},
    //         {path: 'acceptanceSheet', name: 'acceptance-sheet', component: acceptanceSheet},
    //         {path: 'printAcceptanceSheet', name: 'print-acceptance-sheet', component: printAcceptanceSheet},
    //         {path: 'inHandProcessBook', name: 'in-hand-process-book', component: inHandProcessBook},
    //         {path: 'hospitalProcessedList', name: 'hospital-processed-list', component: hospitalProcessedList},
    //         {path: 'hospitalProcessedDetail', name: 'hospital-processed-detail', component: hospitalProcessedDetail},
    //         {path: 'processedProcessBook', name: 'processed-process-book', component: processedProcessBook},
    //         {path: 'hospitalNotProcessedList', name: 'hospital-not-processed-list', component: hospitalNotProcessedList},
    //         {path: 'hospitalNotProcessedDetail', name: 'hospital-not-processed-detail', component: hospitalNotProcessedDetail},
    //         {path: 'processedNotProcessBook', name: 'processed-not-process-book', component: processedNotProcessBook},
    //         {path: 'processedNotAdviceNote', name: 'processed-not-advice-note', component: processedNotAdviceNote},
    //         {path: 'hospitalPublicizedList', name: 'hospital-publicized-list', component: hospitalPublicizedList},
    //         {path: 'hospitalPublicizedDetail', name: 'hospital-publicized-detail', component: hospitalPublicizedDetail},
    //         {path: 'publicizedDetail', name: 'publicized-detail', component: publicizedDetail},
    //         {path: 'publicizedAdviceNote', name: 'publicized-advice-note', component: publicizedAdviceNote},
    //         {path: 'publicizedProcessBook', name: 'publicized-process-book', component: publicizedProcessBook},
    //         {path: 'hospitalNotPublicizedList', name: 'hospital-not-publicized-list', component: hospitalNotPublicizedList},
    //         {path: 'hospitalNotPublicizedDetail', name: 'hospital-not-publicized-detail', component: hospitalNotPublicizedDetail},
    //         {path: 'publicityNotDetail', name: 'publicity-not-detail', component: publicityNotDetail},
    //         {path: 'publicizedNotAdviceNote', name: 'publicized-not-advice-note', component: publicizedNotAdviceNote},
    //         {path: 'publicizedNotProcessBook', name: 'publicized-not-process-book', component: publicizedNotProcessBook},
    //         {path: 'performanceList', name: 'performance-list', component: performanceList},
    //         {path: 'performanceDetail', name: 'performance-detail', component: performanceDetail},
    //         {path: 'performanceAdviceNote', name: 'performance-advice-note', component: performanceAdviceNote},
    //         {path: 'performanceProcessBook', name: 'performance-process-book', component: performanceProcessBook},
    //         {path: 'notifierSetting', name: 'notifier-setting', component: notifierSetting}
    //       ]
    //     },
    //     // 慢病
    //     { path: 'disease',
    //       name: 'slow-disease',
    //       component: slowDisease,
    //       meta: {requireAuth: true},
    //       children: [
    //         {path: 'contractList', name: 'contract-list', component: contractList},
    //         {path: 'contractDetail', name: 'contract-detail', component: contractDetail},
    //         {path: 'hpTeamList', name: 'hp-team-list', component: hpTeamList},
    //         {path: 'hpTeamDetail', name: 'hp-team-detail', component: hpTeamDetail},
    //         {path: 'hpGuide', name: 'hp-guide', component: hpGuide},
    //         {path: 'hcTeamList', name: 'hc-team-list', component: hcTeamList},
    //         {path: 'hcTeamDetail', name: 'hc-team-detail', component: hcTeamDetail},
    //         {path: 'hcGuide', name: 'hc-guide', component: hcGuide},
    //         {path: 'hcService', name: 'hc-service', component: hcService},
    //         {path: 'sebGuide', name: 'seb-guide', component: sebGuide},
    //         {path: 'sebServiceList', name: 'seb-service-list', component: sebServiceList},
    //         {path: 'sebServiceDetail', name: 'seb-service-detail', component: sebServiceDetail},
    //         {path: 'sebProtocolList', name: 'seb-protocol-list', component: sebProtocolList},
    //         {path: 'sebProtocolDetail', name: 'seb-protocol-detail', component: sebProtocolDetail},
    //         {path: 'sebTeamList', name: 'seb-team-list', component: sebTeamList},
    //         {path: 'sebTeamDetail', name: 'seb-team-detail', component: sebTeamDetail}
    //       ]
    //     },
    //     // 财务监管
    //     {path: '/supervise-bureau', name: 'supervise-bureau', component: superviseBureau, meta: {requireAuth: true}},
    //     {path: '/supervise-hospital', name: 'supervise-hospital', component: superviseHospital, meta: {requireAuth: true}},
    //     // 统计
    //     {path: '/statistics', name: 'statistics', component: statistics, meta: {requireAuth: true}},
    //     // 挂号管理
    //     {path: '/registration', name: 'registration', component: registration, meta: {requireAuth: true}}
    //   ]
    // },
    // {
    //   path: '*',
    //   name: 'notFound',
    //   component: notFound
    // }
    /* 注释 */
  ],
  // 路由跳转，让页面滚动到顶部
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
// 直接地址栏输入url进入需要登入的模块，未登录时直接跳登录页
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requireAuth)) {
//     if (sessionStorage.getItem('loginId')) {
//       next();
//     } else {
//       next({path: '/login'})
//     }
//   } else {
//     next();
//   }
// });

export default router;
