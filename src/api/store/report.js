import $http from '@/libs/axios'

/* 查看进销存报表
 * @id AppId
 */
export const queryJXCByProduct = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/inventory/queryJXCByProduct',
    method: 'post',
    data
  })
};
/* 查看进销存报表明细
 * @id AppId
 */
export const queryJXCDetail = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/inventory/queryJXCDetail',
    method: 'post',
    data
  })
};
