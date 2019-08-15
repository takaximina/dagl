import $http from '@/libs/axios'

/* 查询
 * @id AppId
 */
export const listAppRole = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/listAppRole',
    data,
    method: 'post'
  })
};

/* 保存角色
 * @id APPid
    {
      "appId": "string",
      "code": "string",
      "id": "string",   // 保存 / 新增
      "name": "string",
      "tenantId": "string"
    }
 */
export const saveAppRole = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/saveAppRole',
    data,
    method: 'post'
  })
};

/* 删除
 * @id
 */
export const deleteAppRole = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/deleteAppRole',
    data,
    method: 'post'
  })
};

/* 设置角色权限
 * @Array
 */
export const setRolePowers = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/setRolePowers',
    data,
    method: 'post'
  })
};

/* 查询角色权限
 * @Array
 */
export const listAppPowerByRoleId = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/listAppPowerByRoleId',
    data,
    method: 'post'
  })
};

