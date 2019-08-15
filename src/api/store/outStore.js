import $http from '@/libs/axios'

/* 新增出库单
 * @id AppId
 */
export const addOutBill = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/outbill/add',
    method: 'post',
    data
  })
};

/* 根据ID查询出库单
 * @id AppId
 */
export const queryById = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/outbill/queryById',
    method: 'post',
    data
  })
};

/* 提交订单
 * @id AppId
 */
export const outBillSubmit = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/outbill/submit',
    method: 'post',
    data
  })
};

/* 订单作废
 * @id AppId
 */
export const outBillRemove = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/outbill/remove',
    method: 'post',
    data
  })
};

/* 订单更新
 * @id AppId
 */
export const outBillUpdate = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/outbill/update',
    method: 'post',
    data
  })
};
/* 业务查询出库单
 * @id AppId
 */
export const queryByServiceKey = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/outbill/queryByServiceKey',
    method: 'post',
    data
  })
};
/* 根据sn查询sku明细
 * @id AppId
 */
export const skuInfoQueryBySn = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/invsn/skuInfoQueryBySn',
    method: 'post',
    data
  })
};

