import $http from '@/libs/axios'

/* 查询用户列表
 * @
 */
export const userList = (data) => {
  return $http.request({
    api: 'user',
    url: '/user/list',
    method: 'get'
  })
};

/* 新增用户
 * @
 */
export const addUser = (data) => {
  return $http.request({
    api: 'user',
    url: '/user/add',
    data,
    method: 'post'
  })
};
/* 删除用户
 * @
 */
export const delUser = (data) => {
  return $http.request({
    api: 'user',
    url: '/user/delete',
    data,
    method: 'post'
  })
};
