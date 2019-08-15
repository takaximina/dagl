import $http from '@/libs/axios'
/*
 * 新增线别
 */
export const addLine = (data) => {
  return $http.request({
    api: 'MES',
    url: '/lineType/add',
    data,
    method: 'post'
  })
};
/*
 * 删除线别
 */
export const removeLine = (data) => {
  return $http.request({
    api: 'MES',
    url: '/lineType/remove',
    data,
    method: 'post'
  })
};
/*
 * 激活/停用线别
 */
export const doActive = (data) => {
  return $http.request({
    api: 'MES',
    url: '/lineType/doActive',
    data,
    method: 'post'
  })
};
/*
 * 修改线别
 */
export const updateLine = (data) => {
  return $http.request({
    api: 'MES',
    url: '/lineType/update',
    data,
    method: 'post'
  })
};
/*
 * id查询线别
 */
export const queryByIdLine = (data) => {
  return $http.request({
    api: 'MES',
    url: '/lineType/queryById',
    data,
    method: 'post'
  })
};
