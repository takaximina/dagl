import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual
} from '@/libs/util'
import beforeClose from '@/router/before-close'
import router from '@/router'
import routers from '@/router/routers'

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    local: ''
  },
  getters: {
    menuList: (state, getters, rootState) =>  getMenuByRouter(routers, rootState.user.access)
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    //加入方法，简单暴力，根据路由的name来关闭某页签 - lijj 2019-01-09
    closeTagByName(state,name){
      let tag = state.tagNavList.filter(item => item.name === name)
      let route = tag[0] ? tag[0] : null
      if(route)closePage(state, route)
    },
    //加入方法，简单暴力，根据路由来设置title - lijj 2019-01-09
    //示例：changeTagTitleByName({route:route,title:'title'})
    changeTagTitleByName(state,route){
      let tag = state.tagNavList.findIndex(item => routeEqual(item, route.route))
      let thisRoute = state.tagNavList[tag]
      //let thisRoute = tag[0] ? tag[0] : null
      if(thisRoute&&thisRoute.meta){
        thisRoute.meta.title =route.title;
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      if (!routeHasExist(state.tagNavList, route)) {
        if (type === 'push') state.tagNavList.push(route)
        else {
          if (route.name === 'home') state.tagNavList.unshift(route)
          else state.tagNavList.splice(1, 0, route)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      state.local = lang
    }
  }
}
