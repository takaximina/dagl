import $http from '@/libs/axios'

/* 查询
 *
 */
export const list = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/list',
    data,
    method: 'post'
  })
};

/* 新增
 *
 */
export const add = (data) => {
  return $http.request({
    api: 'user',
    url: '/tenant/add',
    data,
    method: 'post'
  })
};

/* 根据角色设置用户
 *
 */
export const setUsersToRole = (data) => {
  return $http.request({
    api: 'user',
    url: '/tenant/setUsersToRole',
    data,
    method: 'post'
  })
};
/* 根据用户设置角色
 *
 */
export const setRolesToUser = (data) => {
  return $http.request({
    api: 'user',
    url: '/tenant/setRolesToUser',
    data,
    method: 'post'
  })
};
/* 根据用户查询角色
 *
 */
export const listRoleByUser = (data) => {
  return $http.request({
    api: 'user',
    url: '/user/listRoleByUser',
    data,
    method: 'post'
  })
};
