import $http from '@/libs/axios'

// 查询客户
export const listByVagueParameter = async (data) => {
  return $http.request({
    api: 'customer',
    url: '/customer/listByVagueParameter',
    data,
    method: 'post'
  })
};
// 查询客户
export const customerList = async (data) => {
  return $http.request({
    noSpin: 1,
    api: 'customer',
    url: '/customer/filter',
    data,
    method: 'post'
  })
};
