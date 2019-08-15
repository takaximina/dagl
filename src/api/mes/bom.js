import $http from '@/libs/axios'
/*
 * 新增BOM
 */
export const addBom = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productBom/add',
    data,
    method: 'post'
  })
};
/*
 * 删除BOM
 */
export const removeBom = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productBom/remove',
    data,
    method: 'post'
  })
};
/*
 * 修改BOM
 */
export const updateBom = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productBom/update',
    data,
    method: 'post'
  })
};
/*
 * id查询BOM
 */
export const queryByIdBom = (data) => {
  return $http.request({
    api: 'MES',
    url: '/productBom/queryById',
    data,
    method: 'post'
  })
};
/*
 * id查询BOM
 */
export const queryAllBom = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/productBom/queryByFilter',
    data,
    method: 'post'
  })
};
/*
 * 查询所有BOM
 */
export const queryByProMesIdOrName = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/productBom/queryByProMesIdOrName',
    data,
    method: 'post'
  })
};
