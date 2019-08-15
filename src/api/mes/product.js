import $http from '@/libs/axios'
/*
 * 新增产品
 */
export const addProduct = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productMes/add',
    data,
    method: 'post'
  })
};
/*
 * 删除产品
 */
export const removeProduct = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productMes/remove',
    data,
    method: 'post'
  })
};
/*
 * 修改产品
 */
export const updateProduct = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productMes/update',
    data,
    method: 'post'
  })
};
/*
 * id查询产品
 */
export const queryByIdProduct = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productMes/queryById',
    data,
    method: 'post'
  })
};
/*
 * 查询所有流程
 */
export const getWorkflowList = () => {
  return $http.request({
    api: 'MES',
    url: '/Task/getWorkflowList',
    method: 'post'
  })
};
