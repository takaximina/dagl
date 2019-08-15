import $http from '@/libs/axios'

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
export const ListPersonnel = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/personnel/listByDept',
    data,
    method: 'post'
  })
};

/* 往来单位查询
 * @id AppId
 */
export const listIntercourseEnt = (data) => {
  return $http.request({
    api: 'product',
    url: '/partner/queryByPartnerType',
    data,
    method: 'post'
  })
};

/* 仓库列表
 * @id AppId
 */
export const listWarehouse = ( ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/warehouse/queryAll',
    method: 'post'
  })
};

/* 新增入库单
 * @id AppId
 */
export const addEnterBill = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/enterbill/add',
    method: 'post',
    data
  })
};

/* 根据ID查询入库单
 * @id AppId
 */
export const queryById = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/enterbill/queryById',
    method: 'post',
    data
  })
};

/* 提交订单
 * @id AppId
 */
export const enterBillSubmit = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/enterbill/submit',
    method: 'post',
    data
  })
};

/* 订单作废
 * @id AppId
 */
export const enterBillRemove = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/enterbill/remove',
    method: 'post',
    data
  })
};

/* 订单更新
 * @id AppId
 */
export const enterBillUpdate = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/enterbill/update',
    method: 'post',
    data
  })
};

/* 订单更新
 * @id AppId
 */
export const addBatch = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/enterbill/addBatch',
    method: 'post',
    data
  })
};

/* 修改发票
 * @id AppId
 */
export const updateInvoiceNo = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/enterbill/updateInvoiceNo',
    method: 'post',
    data
  })
};
