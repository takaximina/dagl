import $http from '@/libs/axios'
/*
 * 新增故障码
 */
export const addFault = (data) => {
  return $http.request({
    api: 'MES',
    url: '/troubleCode/add',
    data,
    method: 'post'
  })
};
/*
 * 删除故障码
 */
export const removeFault = (data) => {
  return $http.request({
    api: 'MES',
    url: '/troubleCode/remove',
    data,
    method: 'post'
  })
};
/*
 * 修改故障码
 */
export const updateFault = (data) => {
  return $http.request({
    api: 'MES',
    url: '/troubleCode/update',
    data,
    method: 'post'
  })
};
/*
 * ID查询故障码
 */
export const queryById = (data) => {
  return $http.request({
    api: 'MES',
    url: '/troubleCode/queryById',
    data,
    method: 'post'
  })
};
