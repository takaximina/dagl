import $http from '@/libs/axios'

/* 查询机箱码信息
 * @id AppId
 */
export const queryEntIdByChassisCode = (data) => {
  return $http.request({
    api: 'MES',
    url: '/repair/queryEntIdByChassisCode',
    method: 'post', data
  });
};

/* ID查询往来单位
 * @id AppId
 */
export const queryPartner = (data) => {
  return $http.request({
    api: 'product',
    url: '/partner/queryById',
    method: 'post', data
  });
};

/* 查询部门
 * @id AppId
 */
export const listDept = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/dept/' + data,
    method: 'get'
  });
};

/* 根据部门查询人员
 * @id AppId
 */
export const listPersonnel = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/personnel/listByDept',
    data,
    method: 'post'
  })
};

/* 新增维修单
 * @form
 */
export const addRepair = (data) => {
  return $http.request({
    api: 'MES',
    url: '/repair/add',
    method: 'post', data
  })
};

/* 新增维修单
 * @id AppId
 */
export const removeRepair = (data) => {
  return $http.request({
    api: 'MES',
    url: '/repair/remove',
    method: 'post', data
  })
};

/* 修改维修单
 * @id AppId
 */
export const updateRepair = (data) => {
  return $http.request({
    api: 'MES',
    url: '/repair/update',
    method: 'post', data
  })
};
/* 查看维修单
 * @id AppId
 */
export const queryRepair = (data) => {
  return $http.request({
    api: 'MES',
    url: '/repair/queryById',
    method: 'post', data
  })
};
/* 确认维修
 * @id AppId
 */
export const doRepair = (id, type) => {
  return $http.request({
    api: 'MES',
    url: '/repair/doRepair/'+ id + '/' + type,
    method: 'get'
  })
};
/* 确认维修
 * @id AppId
 */
export const repairComplete = (data) => {
  return $http.request({
    api: 'MES',
    url: '/repair/repairComplete',
    method: 'post', data
  })
};

