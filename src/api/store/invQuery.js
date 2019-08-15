import $http from '@/libs/axios'

/* /inventory/queryAll
 *
 */
export const queryAll = () => {
  return $http.request({
    api: 'BUSINESS',
    noSpin: true,
    url: '/inventory/queryAll',
    method: 'post'
  })
};

/* /inventory/queryBySkuId
 *
 */
export const queryBySkuId = (data) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/inventory/queryBySkuId',
    method: 'post',
    data
  })
};
