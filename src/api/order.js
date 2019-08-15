import $http from '@/libs/axios'

// 保存订单
export const saveOrder = (data) => {
  return $http.request({
    api: 'order',
    url: '/order/saveOrder',
    data,
    method: 'post'
  })
};

// 提交订单
export const orderSubmit = (data) => {
  return $http.request({
    api: 'order',
    url: '/order/orderSubmit',
    data,
    method: 'post'
  })
};

// 查询订单
export const queryById = (data) => {
  return $http.request({
    api: 'order',
    url: '/order/queryById',
    data,
    method: 'post'
  })
};

// 订单删除
export const orderDelete = (data) => {
  return $http.request({
    api: 'order',
    url: '/order/orderDelete',
    data,
    method: 'post'
  })
};

// 订单撤销
export const orderCancel = (data) => {
  return $http.request({
    api: 'order',
    url: '/order/orderCancel',
    data,
    method: 'post'
  })
};

