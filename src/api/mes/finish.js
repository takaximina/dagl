import $http from '@/libs/axios'

/* 编码查询订单
 * @id
 */
export const queryOrder = (data) => {
  return $http.request({
    noSpin: 1,
    api: 'MES',
    url: '/ProductionOrder/queryByChassisCode',
    method: 'post', data
  });
};

/* 编码查询工单
 * @id
 */
export const queryWork = (data) => {
  return $http.request({
    noSpin: 1,
    api: 'MES',
    url: '/WorkOrder/queryByChassisCode',
    method: 'post', data
  });
};

/* 编码查询工单
 * @id
 */
export const queryProduct = (data) => {
  return $http.request({
    noSpin: 1,
    api: 'MES',
    url: '/repair/querySkuByChassisCode',
    method: 'post', data
  });
};
