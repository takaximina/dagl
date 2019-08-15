import $http from '@/libs/axios'

/* 查询所有维修记录
 * @id AppId
 */
export const queryAllRepairStationRecord = (data) => {
  return $http.request({
    api: 'MES',
    url: '/Task/queryAllRepairStationRecord',
    method: 'post', data
  });
};
