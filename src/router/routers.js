import Main from '@/components/main'
import parentView from '@/components/parent-view'
import {  getMenuByRouter, getMenuMyUser } from '@/libs/util'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

const login = () => import('@/view/login/login.vue');
const home = () => import('@/view/single-page/home');
//const dashboard = () => import('@/mes_view/dashboard');

let route = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: login
  },
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   meta: {
  //     title: '看板',
  //     hideInMenu: true
  //   },
  //   component: dashboard
  // },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: home
      }
    ]
  },
  /*{
    path: '/components',
    name: 'components',
    meta: {
      hideInMenu: true,
      icon: 'logo-buffer',
      title: '组件'
    },
    component: Main,
    children: [
      {
        path: 'count_to_page',
        name: 'count_to_page',
        meta: {
          icon: 'md-trending-up',
          title: '数字渐变'
        },
        component: () => import('@/view/components/count-to/count-to.vue')
      },
      {
        path: 'drag_list_page',
        name: 'drag_list_page',
        meta: {
          icon: 'ios-infinite',
          title: '拖拽列表'
        },
        component: () => import('@/view/components/drag-list/drag-list.vue')
      },
      {
        path: 'tables_page',
        name: 'tables_page',
        meta: {
          icon: 'md-grid',
          title: '多功能表格'
        },
        component: () => import('@/view/components/tables/tables.vue')
      },
      {
        path: 'split_pane_page',
        name: 'split_pane_page',
        meta: {
          icon: 'md-pause',
          title: '分割窗口'
        },
        component: () => import('@/view/components/split-pane/split-pane.vue')
      },
      {
        path: 'markdown_page',
        name: 'markdown_page',
        meta: {
          icon: 'logo-markdown',
          title: 'Markdown编辑器'
        },
        component: () => import('@/view/components/markdown/markdown.vue')
      },
      {
        path: 'editor_page',
        name: 'editor_page',
        meta: {
          icon: 'ios-create',
          title: '富文本编辑器'
        },
        component: () => import('@/view/components/editor/editor.vue')
      },
      {
        path: 'icons_page',
        name: 'icons_page',
        meta: {
          icon: '_bear',
          title: '自定义图标'
        },
        component: () => import('@/view/components/icons/icons.vue')
      }
    ]
  },
  {
    path: '/update',
    name: 'update',
    meta: {
      hideInMenu: true,
      icon: 'md-cloud-upload',
      title: '数据上传'
    },
    component: Main,
    children: [
      {
        path: 'update_table_page',
        name: 'update_table_page',
        meta: {
          icon: 'ios-document',
          title: '上传Csv'
        },
        component: () => import('@/view/update/update-table.vue')
      },
      {
        path: 'update_paste_page',
        name: 'update_paste_page',
        meta: {
          icon: 'md-clipboard',
          title: '粘贴表格数据'
        },
        component: () => import('@/view/update/update-paste.vue')
      }
    ]
  },
  {
    path: '/excel',
    name: 'excel',
    meta: {
      hideInMenu: true,
      icon: 'ios-stats',
      title: 'EXCEL导入导出'
    },
    component: Main,
    children: [
      {
        path: 'upload-excel',
        name: 'upload-excel',
        meta: {
          icon: 'md-add',
          title: '导入EXCEL'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'export-excel',
        name: 'export-excel',
        meta: {
          icon: 'md-download',
          title: '导出EXCEL'
        },
        component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/tools_methods',
    name: 'tools_methods',
    meta: {
      hideInMenu: true,
      hide: true
    },
    component: Main,
    children: [
      /!*{
        path: 'tools_methods_page',
        name: 'tools_methods_page',
        meta: {
          icon: 'ios-hammer',
          title: '工具方法',
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/tools-methods/tools-methods.vue')
      },*!/
      {
        path: 'test_comp',
        name: 'test_comp',
        meta: {
          icon: 'ios-hammer',
          title: '测试模板',
        },
        component: () => import('@/apps/components/visComponents')
      },
    ]
  },
  {
    path: '/directive',
    name: 'directive',
    meta: {
      hideInMenu: true,
      hide: true
    },
    component: Main,
    children: [
      {
        path: 'directive_page',
        name: 'directive_page',
        meta: {
          icon: 'ios-navigate',
          title: '指令'
        },
        component: () => import('@/view/directive/directive.vue')
      }
    ]
  },
  {
    path: '/multilevel',
    name: 'multilevel',
    meta: {
      hideInMenu: true,
      icon: 'md-menu',
      title: '多级菜单'
    },
    component: Main,
    children: [
      {
        path: 'level_2_1',
        name: 'level_2_1',
        meta: {
          icon: 'md-funnel',
          title: '二级-1'
        },
        component: () => import('@/view/multilevel/level-2-1.vue')
      },
      {
        path: 'level_2_2',
        name: 'level_2_2',
        meta: {
          access: ['super_admin', 'dev'],
          icon: 'md-funnel',
          showAlways: true,
          title: '二级-2'
        },
        component: parentView,
        children: [
          {
            path: 'level_2_2_1',
            name: 'level_2_2_1',
            meta: {
              icon: 'md-funnel',
              title: '三级'
            },
            component: () => import('@/view/multilevel/level-2-2/level-3-1.vue')
          }
        ]
      },
      {
        path: 'level_2_3',
        name: 'level_2_3',
        meta: {
          icon: 'md-funnel',
          title: '二级-3'
        },
        component: () => import('@/view/multilevel/level-2-3.vue')
      },
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: '动态路由',
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: '带参路由',
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },*/

  // 平台管理员
  {
    path: '/platform',
    name: 'platform',
    meta: {
      icon: 'ios-apps',
      access: ['PlatformAdmin'],
      title: '平台',
    },
    component: Main,
    children: [
      {
        path: 'account',
        name: 'account',
        meta: {
          icon: 'ios-list-box',
          title: '账号管理',
        },
        component: () =>
          import ('@/apps/platform/account')
      },
      {
        path: 'configure',
        name: 'configure',
        meta: {
          icon: 'ios-list-box',
          title: '配置管理',
        },
        component: () =>
          import ('@/view/single-page/home')
      },
      {
        path: 'engineList',
        name: 'engineList',
        meta: {
          icon: 'ios-nuclear-outline',
          title: '渲染定义列表',
        },
        component: () =>
          import ('@/apps/engine/engineList')
      },
      {
        path: 'engineEdit/:id?',
        name: 'engineEdit',
        meta: {
          hideInMenu: true,
          hide: true,
          icon: 'ios-nuclear-outline',
          title: "编辑定义"
        },
        component: () =>
          import ('@/apps/engine/engineEdit')
      },
      {
        path: 'engineView/:id?',
        name: 'engineView',
        meta: {
          hideInMenu: true,
          hide: true,
          icon: 'ios-nuclear-outline',
          title: "预览定义"
        },
        component: () =>
          import ('@/apps/engine/engineView')
      }
    ]
  },

  // 应用管理员
  {
    path: '/app',
    name: 'app',
    meta: {
      icon: 'ios-apps',
      access: ['ApplicationAdmin'],
      title: '应用',
    },
    component: Main,
    children: [
      {
        path: 'application',
        name: 'application',
        meta: {
          icon: 'ios-list-box',
          title: '应用管理',
        },
        component: () =>
          import ('@/apps/application/application')
      },
      {
        path: 'module',
        name: 'module',
        meta: {
          icon: 'ios-list-box',
          title: '模块',
        },
        component: () =>
          import ('@/apps/application/module')
      },
      {
        path: 'dictionary',
        name: 'dictionary',
        meta: {
          icon: 'ios-list-box',
          title: '字典',
        },
        component: () =>
          import ('@/apps/application/dictionary')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          icon: 'ios-list-box',
          title: '角色',
        },
        component: () =>
          import ('@/apps/application/role')
      },
      {
        path: 'tenant',
        name: 'tenant',
        meta: {
          icon: 'ios-list-box',
          title: '租户',
        },
        component: () =>
          import ('@/apps/application/tenant')
      },
      {
        path: 'permissions',
        name: 'permissions',
        meta: {
          icon: 'ios-list-box',
          title: '权限',
        },
        component: () =>
          import ('@/view/single-page/home')
      },
    ]
  },

  // 租户\用户
  /*{
    path: '/platform_v1',
    name: 'platform_v1',
    meta: {
      icon: 'logo-windows',
      title: '平台 v1',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'app',
        name: 'app_manage',
        meta: {
          icon: 'ios-appstore-outline',
          title: '应用管理'
        },
        component: () => import ('@/apps/platform/appmgr.vue')
      },
      {
        path: 'ent',
        name: 'ent_manage',
        meta: {
          icon: 'ios-people',
          title: '企业管理',
        },
        component: () => import ('@/apps/platform/entmgr.vue')
      },
      {
        path: 'userinfo',
        name: 'userinfo',
        meta: {
          title: '个人资料',
          hideInMenu: true,
        },
        component: () => import ('@/apps/platform/userinfo.vue')
      },
      {
        path: 'query_page_test',
        name: 'query_page_test',
        meta: {
          icon: 'ios-send',
          title: '查询页面调试',//<Icon type="ios-send" />
        },
        component: () => import ('@/apps/queryPageTest')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-settings',
      showAlways: true,
      title: '系统'
    },
    component: Main,
    children: [{
      path: 'person',
      name: 'person',
      meta: {
        icon: 'md-person',
        title: '用户管理'
      },
      component: () =>
        import ('@/apps/system/personmgr.vue')
    }]
  },
  {
    path: '/goods',
    name: 'goods',
    meta: {
      icon: 'ios-build',
      showAlways: true,
      title: '商品'
    },
    component: Main,
    children: [{
      path: 'goodType',
      name: 'goodType',
      meta: {
        icon: 'ios-list-box',
        title: '品类管理'
      },
      component: () =>
        import ('@/apps/goods/goodType.vue')
    }, {
      path: 'goodItem',
      name: 'goodItem',
      meta: {
        icon: 'ios-cart',
        title: '商品管理'
      },
      component: () =>
        import ('@/apps/goods/goodItem.vue')
    }, {
      path: 'frontClass',
      name: 'frontClass',
      meta: {
        icon: 'ios-cart',
        title: '前台分类'
      },
      component: () =>
        import ('@/apps/goods/frontClass')
    }, {
      path: 'package',
      name: 'package',
      meta: {
        icon: 'ios-cart',
        title: '打包品'
      },
      component: () =>
        import ('@/apps/goods/package')
    }]
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      icon: 'ios-people',
      showAlways: true,
      title: '订单管理'
    },
    component: Main,
    children: [{
      path: 'orderPage',
      name: 'orderPage',
      meta: {
        icon: 'ios-list-box',
        title: '订单管理'
      },
      component: () =>
        import ('@/apps/order')
    }]
  },*/
  /**
   * Engine Full View Routers START
   * 渲染引擎全屏路由
   * add by lijj 2019-011-17
   *  */
  {
    path: '/views',
    name: 'views',
    meta: {
      icon: 'ios-apps',
      title: '平台',
      hideInMenu: true,
    },
    component: Main,
    children: [
      {
        path: 'engineView_/:id?',
        name: 'engineView_',
        meta: {
          hideInMenu: true,
          hide: true,
          icon: 'ios-nuclear-outline',
          title: "预览定义"
        },
        component: () =>
          import ('@/apps/engine/engineView')
      }
    ]
  },
  {
    path: '/engineViewFull/:id?',
    name: 'engineViewFull',
    meta: {
      hideInMenu: true
    },
    component: () =>
      import ('@/apps/engine/engineView.vue')
  },
  {
    path: '/engineListFull',
    name: 'engineListFull',
    meta: {
      hideInMenu: true,
    },
    component: () =>
      import ('@/apps/engine/engineList.vue')
  },
  /**
   * Engine Full View Routers END
   */
  // 404
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },

];
if(localStorage.routeMenuList){
  let res = JSON.parse(localStorage.getItem('userRoutes'));
  let routes = getMenuMyUser(res, Main);
  route = route.concat(routes);
}

export default route
