import $http from '@/libs/axios'

// 查询所有仓库
export const queryAll = () => {
  return $http.request({
    api: 'BUSINESS',
    url: '/warehouse/queryAll',
    method: 'post'
  })
};
/* 仓库列表
 *
 */
export const listWarehouse = () => {
  return $http.request({
    api: 'BUSINESS',
    url: '/warehouse/queryAll',
    method: 'post'
  })
};
/* 新增仓库
 *
 */
export const addWarehouse = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/warehouse/add',
    method: 'post',
    data
  })
};
/* 删除仓库
 *
 */
export const removeWarehouse = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/warehouse/remove',
    method: 'post',
    data
  })
};
/* 修改仓库
 *
 */
export const updateWarehouse = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/warehouse/update',
    method: 'post',
    data
  })
};
/* 查看仓库
 *
 */
export const queryWarehouse = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/warehouse/queryById',
    method: 'post',
    data
  })
};
