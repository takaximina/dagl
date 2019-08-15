import $http from '@/libs/axios'
/*
 * 新增工序
 */
export const addProcedure = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productProcess/add',
    data,
    method: 'post'
  })
};
/*
 * 新增工序列表
 */
export const addBatchProcedure = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productProcessBom/addBatch',
    data,
    method: 'post'
  })
};
/*
 * 删除工序
 */
export const removeProcedure = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productProcess/remove',
    data,
    method: 'post'
  })
};
/*
 * 修改工序
 */
export const updateProcedure = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productProcess/update',
    data,
    method: 'post'
  })
};
/*
 * ID查询工序
 */
export const queryByIdProcedure = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productProcess/queryById',
    data,
    method: 'post'
  })
};
/*
 * ID查询工序及工序BOM
 */
export const queryByProductMesId = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productProcess/queryByProductMesId',
    data,
    method: 'post'
  })
};
