import $http from '@/libs/axios'

/* 新增
 * @id AppId
 */
export const Add = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/initbill/add',
    method: 'post',
    data
  })
};

/* 根据ID查询
 * @id AppId
 */
export const queryById = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/initbill/queryById',
    method: 'post',
    data
  })
};

/* 提交订单
 * @id AppId
 */
export const Submit = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/initbill/submit',
    method: 'post',
    data
  })
};

/* 订单作废
 * @id AppId
 */
export const Remove = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/initbill/remove',
    method: 'post',
    data
  })
};

/* 订单更新
 * @id AppId
 */
export const Update = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/initbill/update',
    method: 'post',
    data
  })
};

/* 期末结转
 *
 */
export const carryOver = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/initbill/carryOver',
    method: 'post',
    data
  })
};

/* 查询会计月
 *
 */
export const queryNextAccountMonth = ( ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/initbill/queryNextAccountMonth',
    method: 'post',
  })
};

