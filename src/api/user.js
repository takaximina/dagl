import $http from '@/libs/axios'
// 登陆
export const login = ( data ) => {
  return $http.request({
    api: 'user',
    url: '/user/login',
    data,
    method: 'post'
  })
}
export const resetPwd=(data)=>{
  return $http.request({
    api: 'user',
    url: '/user/changePassword',
    data,
    method: 'post'
  })
}
export const getUserInfo = (data) => {
  return $http.request({
    api: 'user',
    noSpin: 1,
    url: '/user/getMyUserInfo',
    data,
    method: 'get'
  })
}

export const getTenants = (data) => {
  return $http.request({
    api: 'user',
    noSpin: 1,
    url: '/user/listMyTenants',
    data,
    method: 'get'
  })
}

export const logout = (data) => {
  return $http.request({
    api: 'user',
    noSpin: 1,
    url: 'logout',
    method: 'post'
  })
}

// 获取用户菜单
export const listMyMenu = () => {
  return $http.request({
    api: 'user',
    url: '/user/listMyMenu',
    method: 'get'
  })
}

