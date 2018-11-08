import main from '@/components/main.vue';
const _import = path => {
  // console.log(`${path}.vue`)
  return r => require.ensure([], () => r(require(`@/views/${path}.vue`)));
}
export default {
  // CTX
  setCtx (state, options) {
    state.ctx = options.ctx;
  },
  // 登录状态token
  setToken (state, options) {
    state.token = options.token;
  },
  // 面包屑
  setBreadcrumb (state, options) {
    state.breadcrumb = options.breadcrumb;
  },
  setTestStore (state, options) {
    state.testStore = options.testStore;
  },
  // 设置基础路径
  setBaseUrl (state, options) {
    state.ajaxCtx = options.ajaxCtx;
    state.imgBaseUrl = options.imgBaseUrl;
    state.fileBaseUrl = options.fileBaseUrl;
    state.fileUploadUrl = options.fileUploadUrl;
    state.fileDownloadUrl = options.fileDownloadUrl;
  },
  // 设置侧边栏index
  setActiveMenu (state, options) {
    state.activeMenuId = options;
  },
  ADD_MENU: (state, menu) => {
    let userRouters = [];
    if (menu.length === 0) {
      state.routers = []
    } else {
      let mainRouter = {
        path: '/main',
        name: 'main',
        component: main,
        meta: { requireAuth: true },
        children: []
      };
      userRouters = GetData('00000002-0002-0001-0001-000000000001', menu, mainRouter.children);

      const recordDetail = {path: 'recordDetail', name: 'record-detail', index: null, component: _import('index/components/user-manage/record-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_4-2', header: false}}
      const adviceDispose = {path: 'adviceDispose', name: 'advice-dispose', index: null, component: _import('index/components/disease-classify/advice-dispose'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_5-2', header: false}}
      const infoAdd = {path: 'infoAdd', name: 'info-add', index: null, component: _import('index/components/disease-classify/info-add'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_5-1', header: false}}
      const diseaseAdd = {path: 'diseaseAdd', name: 'disease-add', index: null, component: _import('index/components/medical-base/disease-add'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_1-1', header: false}}
      const notAcceptedDetail = {path: 'notAcceptedDetail', name: 'not-accepted-detail', index: null, component: _import('index/components/dispute-mediation/not-accepted/not-accepted-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-1', header: false}}
      const hospitalInHandDetail = {path: 'hospitalInHandDetail', name: 'hospital-in-hand-detail', index: null, component: _import('index/components/dispute-mediation/hospital-in-hand/hospital-in-hand-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-2', header: false}}
      const hospitalInHandProtocol = {path: 'hospitalInHandProtocol', name: 'hospital-in-hand-protocol', index: null, component: _import('index/components/dispute-mediation/hospital-in-hand/hospital-in-hand-protocol'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-2', header: false}}
      const hospitalInHandRequisition = {path: 'hospitalInHandRequisition', name: 'hospital-in-hand-requisition', index: null, component: _import('index/components/dispute-mediation/hospital-in-hand/hospital-in-hand-requisition'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-2', header: false}}
      const printAgreement = {path: 'printAgreement', name: 'print-agreement', index: null, component: _import('index/components/dispute-mediation/hospital-in-hand/print-agreement'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-2', header: false}}
      const printRequisition = {path: 'printRequisition', name: 'print-requisition', index: null, component: _import('index/components/dispute-mediation/hospital-in-hand/print-requisition'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-2', header: false}}
      const hospitalNotInHandDetail = {path: 'hospitalNotInHandDetail', name: 'hospital-not-in-hand-detail', index: null, component: _import('index/components/dispute-mediation/hospital-not-in-hand/hospital-not-in-hand-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-3', header: false}}
      const acceptanceSheet = {path: 'acceptanceSheet', name: 'acceptance-sheet', index: null, component: _import('index/components/dispute-mediation/hospital-not-in-hand/acceptance-sheet'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-3', header: false}}
      const printAcceptanceSheet = {path: 'printAcceptanceSheet', name: 'print-acceptance-sheet', index: null, component: _import('index/components/dispute-mediation/hospital-not-in-hand/print-acceptance-sheet'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-3', header: false}}
      const inHandProcessBook = {path: 'inHandProcessBook', name: 'in-hand-process-book', index: null, component: _import('index/components/dispute-mediation/hospital-not-in-hand/in-hand-process-book'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-3', header: false}}
      const hospitalProcessedDetail = {path: 'hospitalProcessedDetail', name: 'hospital-processed-detail', index: null, component: _import('index/components/dispute-mediation/hospital-processed/hospital-processed-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-4', header: false}}
      const processedProcessBook = {path: 'processedProcessBook', name: 'processed-process-book', index: null, component: _import('index/components/dispute-mediation/hospital-processed/processed-process-book'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-4', header: false}}
      const hospitalNotProcessedDetail = {path: 'hospitalNotProcessedDetail', name: 'hospital-not-processed-detail', index: null, component: _import('index/components/dispute-mediation/hospital-not-processed/hospital-not-processed-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-5', header: false}}
      const processedNotProcessBook = {path: 'processedNotProcessBook', name: 'processed-not-process-book', index: null, component: _import('index/components/dispute-mediation/hospital-not-processed/processed-not-process-book'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-5', header: false}}
      const processedNotAdviceNote = {path: 'processedNotAdviceNote', name: 'processed-not-advice-note', index: null, component: _import('index/components/dispute-mediation/hospital-not-processed/processed-not-advice-note'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-5', header: false}}
      const hospitalPublicizedDetail = {path: 'hospitalPublicizedDetail', name: 'hospital-publicized-detail', index: null, component: _import('index/components/dispute-mediation/hospital-publicized/hospital-publicized-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-6', header: false}}
      const publicizedDetail = {path: 'publicizedDetail', name: 'publicized-detail', index: null, component: _import('index/components/dispute-mediation/hospital-publicized/publicized-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-6', header: false}}
      const publicizedAdviceNote = {path: 'publicizedAdviceNote', name: 'publicized-advice-note', index: null, component: _import('index/components/dispute-mediation/hospital-publicized/publicized-advice-note'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-6', header: false}}
      const publicizedProcessBook = {path: 'publicizedProcessBook', name: 'publicized-process-book', index: null, component: _import('index/components/dispute-mediation/hospital-publicized/publicized-process-book'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-6', header: false}}
      const hospitalNotPublicizedDetail = {path: 'hospitalNotPublicizedDetail', name: 'hospital-not-publicized-detail', index: null, component: _import('index/components/dispute-mediation/hospital-not-publicized/hospital-not-publicized-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-7', header: false}}
      const publicityNotDetail = {path: 'publicityNotDetail', name: 'publicity-not-detail', index: null, component: _import('index/components/dispute-mediation/hospital-not-publicized/publicity-not-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-7', header: false}}
      const publicizedNotAdviceNote = {path: 'publicizedNotAdviceNote', name: 'publicized-not-advice-note', index: null, component: _import('index/components/dispute-mediation/hospital-not-publicized/publicized-not-advice-note'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-7', header: false}}
      const publicizedNotProcessBook = {path: 'publicizedNotProcessBook', name: 'publicized-not-process-book', index: null, component: _import('index/components/dispute-mediation/hospital-not-publicized/publicized-not-process-book'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-7', header: false}}
      const performanceDetail = {path: 'performanceDetail', name: 'performance-detail', index: null, component: _import('index/components/dispute-mediation/performance/performance-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-8', header: false}}
      const performanceAdviceNote = {path: 'performanceAdviceNote', name: 'performance-advice-note', index: null, component: _import('index/components/dispute-mediation/performance/performance-advice-note'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-8', header: false}}
      const performanceProcessBook = {path: 'performanceProcessBook', name: 'performance-process-book', index: null, component: _import('index/components/dispute-mediation/performance/performance-process-book'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_2-8', header: false}}
      const contractDetail = {path: 'contractDetail', name: 'contract-detail', index: null, component: _import('index/components/slow-disease/contract-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_3-1', header: false}}
      const hpTeamDetail = {path: 'hpTeamDetail', name: 'hp-team-detail', index: null, component: _import('index/components/slow-disease/hp-team-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_3-2', header: false}}
      const hcTeamDetail = {path: 'hcTeamDetail', name: 'hc-team-detail', index: null, component: _import('index/components/slow-disease/hc-team-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_3-4', header: false}}
      const sebServiceDetail = {path: 'sebServiceDetail', name: 'seb-service-detail', index: null, component: _import('index/components/slow-disease/seb-service-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_3-8', header: false}}
      const sebProtocolList = {path: 'sebProtocolList', name: 'seb-protocol-list', index: null, component: _import('index/components/slow-disease/seb-protocol-list'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_3-9', header: false}}
      const sebTeamDetail = {path: 'sebTeamDetail', name: 'seb-team-detail', index: null, component: _import('index/components/slow-disease/seb-team-detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_3-10', header: false}}
      const organDetail = {path: 'organization-detail', name: 'organization-detail', index: null, component: _import('index/components/system/organization/detail'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_10-5', header: false}}
      const userList = {path: 'userList', name: 'userList', index: null, component: _import('index/components/system/user/user-list'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_10-6', header: false}}
      const userCreate = {path: 'userCreate', name: 'userCreate', index: null, component: _import('index/components/system/user/user-create'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_10-7', header: false}}
      const groupList = {path: 'groupList', name: 'groupList', index: null, component: _import('index/components/system/user/group-list'), meta: {requireAuth: true, menu: null, title: null, side: false, style: 'level_10-8', header: false}}
      const addRouterData = [
        {addRouter: organDetail, path: 'user', type: 1},
        {addRouter: userList, path: 'user', type: 2},
        {addRouter: userCreate, path: 'user', type: 1},
        {addRouter: groupList, path: 'user', type: 2},
        {addRouter: recordDetail, path: 'recordList', type: 1},
        {addRouter: adviceDispose, path: 'adviceList', type: 1},
        {addRouter: infoAdd, path: 'infoList', type: 1},
        {addRouter: diseaseAdd, path: 'diseaseList', type: 1},
        {addRouter: notAcceptedDetail, path: 'notAcceptedList', type: 1},
        {addRouter: hospitalInHandDetail, path: 'hospitalInHandList', type: 1},
        {addRouter: hospitalInHandProtocol, path: 'hospitalInHandList', type: 1},
        {addRouter: hospitalInHandRequisition, path: 'hospitalInHandList', type: 1},
        {addRouter: printAgreement, path: 'hospitalInHandList', type: 1},
        {addRouter: printRequisition, path: 'hospitalInHandList', type: 1},
        {addRouter: hospitalNotInHandDetail, path: 'hospitalNotInHandList', type: 1},
        {addRouter: acceptanceSheet, path: 'hospitalNotInHandList', type: 1},
        {addRouter: printAcceptanceSheet, path: 'hospitalNotInHandList', type: 1},
        {addRouter: inHandProcessBook, path: 'hospitalNotInHandList', type: 1},
        {addRouter: hospitalProcessedDetail, path: 'hospitalProcessedList', type: 1},
        {addRouter: processedProcessBook, path: 'hospitalProcessedList', type: 1},
        {addRouter: hospitalNotProcessedDetail, path: 'hospitalNotProcessedList', type: 1},
        {addRouter: processedNotProcessBook, path: 'hospitalNotProcessedList', type: 1},
        {addRouter: processedNotAdviceNote, path: 'hospitalNotProcessedList', type: 1},
        {addRouter: hospitalPublicizedDetail, path: 'hospitalPublicizedList', type: 1},
        {addRouter: publicizedDetail, path: 'hospitalPublicizedList', type: 1},
        {addRouter: publicizedAdviceNote, path: 'hospitalPublicizedList', type: 1},
        {addRouter: publicizedProcessBook, path: 'hospitalPublicizedList', type: 1},
        {addRouter: hospitalNotPublicizedDetail, path: 'hospitalNotPublicizedList', type: 1},
        {addRouter: publicityNotDetail, path: 'hospitalNotPublicizedList', type: 1},
        {addRouter: publicizedNotAdviceNote, path: 'hospitalNotPublicizedList', type: 1},
        {addRouter: publicizedNotProcessBook, path: 'hospitalNotPublicizedList', type: 1},
        {addRouter: performanceDetail, path: 'performanceList', type: 1},
        {addRouter: performanceAdviceNote, path: 'performanceList', type: 1},
        {addRouter: performanceProcessBook, path: 'performanceList', type: 1},
        {addRouter: contractDetail, path: 'contractList', type: 1},
        {addRouter: hpTeamDetail, path: 'hpTeamList', type: 1},
        {addRouter: hcTeamDetail, path: 'hcTeamList', type: 1},
        {addRouter: sebServiceDetail, path: 'sebServiceList', type: 1},
        {addRouter: sebProtocolList, path: 'sebProtocolDetail', type: 1},
        {addRouter: sebTeamDetail, path: 'sebTeamList', type: 1}
      ]

      mainRouter.redirect = {name: mainRouter.children[0] && mainRouter.children[0].name};

      for (let i of addRouterData) {
        operationRouter(mainRouter.children, i.addRouter, i.path, i.type);
      }
      console.log(mainRouter, 'mainRouter')
      // 手动设置1级菜单的重定向路由
      for (let a of mainRouter.children) {
        if (a.children.length > 0) {
          if (!a.children.find(f => f.meta.side)) {
            a.redirect = { name: a.children.find(f => !f.meta.side).name }
          } else {
            a.redirect = { name: a.children.find(f => f.meta.side).name }
          }
        }
      }
      // 添加404页面路由到最后
      const notFound = {path: '*', name: 'notFound', index: null, component: _import('index/components/not-found'), meta: {requireAuth: false, menu: null, title: null, side: false, style: 'level_111', header: false}}
      state.routers = [mainRouter, notFound]
    }
    state.isAddRouter = true
  },
  REMOVE_MENU: (state) => {
    localStorage.removeItem('Vehicle-Menu')
    state.routers = [];
    state.isAddRouter = false
  },
  ADD_ROLE_LIST: (state, list) => {
    state.roleAuthList = generateRoleList(list)
  }
}
// 把与2级菜单相关联的路由手动添加进来的公共方法
// arr:原数组
// addRouter:添加的路由
// path:路由
// type:1-同级路由，2-子级路由
function operationRouter (arr, addRouter, path, type) {
  arr.map((item, index) => {
    if (item.path === path) {
      if (type === 1) {
        arr.push(addRouter)
      } else {
        arr[index].children.push(addRouter)
      }
      return false;
    } else {
      if (item.children && item.children.length > 0) {
        operationRouter(item.children, addRouter, path, type);
      } else {
        return false;
      }
    }
  })
}
function generateRoleList (list) {
  let arry = []
  if (list.length > 0) {
    list.forEach(item => {
      arry.push(item.uid)
    })
  }
  return arry
}
// 根据菜单主键id获取下级菜单
// id：菜单主键id
// arry：菜单数组信息
function GetParentArry (id, arry) {
  var newArry = [];
  for (var i in arry) {
    if (arry[i].resourceName === '智慧医疗后台根节点') {
      continue
    }
    if (arry[i].parentUid === id || (!id && !arry[i].parentUid)) {
      newArry.push(arry[i]);
    }
  }
  return newArry;
}
function GetData (id, arry, router = []) {
  var childArry = GetParentArry(id, arry);
  if (childArry.length > 0) {
    childArry.forEach((page, index) => {
      let child = {
        path: page.path,
        name: page.routeName,
        index: page.uid,
        component: _import(page.component),
        meta: {
          requireAuth: page.requireAuth,
          menu: page.uid,
          title: page.resourceName,
          side: page.side,
          style: page.style,
          header: page.header
        },
        children: []
      }
      // page.redirect && (child.redirect = {name: page.redirect})
      router.push(child)
      GetData(page.uid, arry, child.children)
    })
  }
  return router
}
