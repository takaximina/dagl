import $http from '@/libs/axios'

/* 查询应用
 * @id APPid
 */
export const listApp = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/listApp',
    method: 'get'
  })
};

/* 保存应用
 * {
  "id": "string",
  "name": "string"
}
 */
export const saveApp = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/saveApp',
    data,
    method: 'post'
  })
};

/* 删除应用
 * @ id
 */
export const deleteApp = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/deleteApp',
    data,
    method: 'post'
  })
};

/* 切换应用
 * @ id
 */
export const changeApp = (data) => {
  return $http.request({
    api: 'user',
    url: '/user/changeApp',
    data: data || {appId: ''},
    method: 'post'
  })
};
