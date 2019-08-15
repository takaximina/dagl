import $http from '@/libs/axios'

/* 序列号查询基础信息
 * @id AppId
 */
export const queryProductInfoBySerialNo = (data) => {
  return $http.request({
    api: 'MES',
    url: '/traceability/queryProductInfoBySerialNo',
    method: 'post', data
  });
};
/* 序列号查询物料信息
 * @id AppId
 */
export const queryBomRecordBySerialNo = (data) => {
  return $http.request({
    api: 'MES',
    url: '/traceability/queryBomRecordBySerialNo',
    method: 'post', data
  });
};
/* 序列号查询工位信息
 * @id AppId
 */
export const queryFlowInfoBySerialNo = (data) => {
  return $http.request({
    api: 'MES',
    url: '/traceability/queryFlowInfoBySerialNo',
    method: 'post', data
  });
};
/* 序列号查询微信信息
 * @id AppId
 */
export const queryRepairInfoBySerialNo = (data) => {
  return $http.request({
    api: 'MES',
    url: '/traceability/queryRepairInfoBySerialNo',
    method: 'post', data
  });
};
