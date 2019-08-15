import $http from '@/libs/axios'
/*
 * 新增工位
 */
export const addAssembleStation = (data) => {
  return $http.request({
    api: 'MES',
    url: '/assembleStation/add',
    data,
    method: 'post'
  })
};
/*
 * 删除工位
 */
export const removeAssembleStation = (data) => {
  return $http.request({
    api: 'MES',
    url: '/assembleStation/remove',
    data,
    method: 'post'
  })
};
/*
 * 修改工位
 */
export const updateAssembleStation = (data) => {
  return $http.request({
    api: 'MES',
    url: '/assembleStation/update',
    data,
    method: 'post'
  })
};
/*
 * id查询工位
 */
export const queryByIdAssembleStation = (data) => {
  return $http.request({
    api: 'MES',
    url: '/assembleStation/queryById',
    data,
    method: 'post'
  })
};
/*
 * 分页查询工位
 */
export const queryByFilterAssembleStation = (data) => {
  return $http.request({
    api: 'MES',
    url: '/assembleStation/queryByFilter',
    noSpin: true,
    data,
    method: 'post'
  })
};
