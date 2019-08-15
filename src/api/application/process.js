import $http from '@/libs/axios'

const api = 'WORK';

/*  查询流程
 *
 */
export const queryByFilter = (data) => {
  return $http.request({
    api,
    url: '/workorderconfig/queryByFilter',
    data,
    method: 'post'
  })
};
/*  查询流程
 *  TypeDict
 */
export const queryByTypeDict = (data) => {
  return $http.request({
    api,
    url: '/workorderconfig/queryByTypeDict',
    data,
    method: 'post'
  })
};
/*  新增流程
 *
 */
export const addPsc = (data) => {
  return $http.request({
    api,
    url: '/workorderconfig/add',
    data,
    method: 'post'
  })
};
/* 新增流程
 *
 */
export const updatePsc = (data) => {
  return $http.request({
    api,
    url: '/workorderconfig/update',
    data,
    method: 'post'
  })
};
/* 删除流程
 *
 */
export const deletePsc = (data) => {
  return $http.request({
    api,
    url: '/workorderconfig/delete',
    data,
    method: 'post'
  })
};
