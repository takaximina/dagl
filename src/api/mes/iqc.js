import $http from '@/libs/axios'
/*
 * 新增IQC
 */
export const addIqc = (data) => {
  return $http.request({
    api: 'MES',
    url: '/incomingCheck/add',
    data,
    method: 'post'
  })
};
/*
 * 查询IQC
 */
export const queryById = (data) => {
  return $http.request({
    api: 'MES',
    url: '/incomingCheck/queryById',
    data,
    method: 'post'
  })
};
/*
 * 删除IQC
 */
/*export const removeIncomingQualityItem = (data) => {
  return $http.request({
    api: 'MES',
    url: '/incomingCheck/removeIncomingQualityItem',
    data,
    method: 'post'
  })
};*/
export const removeIncomingCheckItem = (data) => {
  return $http.request({
    api: 'MES',
    url: '/incomingCheck/removeIncomingCheckItem',
    data,
    method: 'post'
  })
};
/*
 * 修改IQC
 */
export const updateIqc = (data) => {
  return $http.request({
    api: 'MES',
    url: '/incomingCheck/update',
    data,
    method: 'post'
  })
};
