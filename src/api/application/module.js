import $http from '@/libs/axios'

/* 查询
 * @id APPid
 */
export const listAppPower = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/listAppPower',
    data,
    method: 'post'
  })
};
/* 保存
 * @appId     APPid
 * @code      权限编码
 * @name      权限名称
 * @id        权限id
 * @parentId  权限父级id
 */
export const saveAppPower = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/saveAppPower',
    data,
    method: 'post'
  })
};
/* 保存
 * @id        权限id
 */
export const deleteAppPower = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/deleteAppPower',
    data,
    method: 'post'
  })
};
/* 排序
 * @id        权限id
 * @sort      排序
 */
export const powerSort = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/power/sort',
    data,
    method: 'post'
  })
};
