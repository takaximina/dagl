import $http from '@/libs/axios'

// 新增打包品
export const saveProductPack = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/saveProductPack',
    data,
    method: 'post'
  })
};
// 根据ID查询打包品
export const getProductPackAndItemByProductPackId = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/getProductPackAndItemByProductPackId',
    data,
    method: 'post'
  })
};
// 根据ID 分页 查询打包品
export const queryPackItem = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/queryPackItem',
    data,
    method: 'post'
  })
};
// 删除打包品
export const removeProductPack = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/removeProductPack',
    data,
    method: 'post'
  })
};
// 打包品审核
export const auditProductPack = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/auditProductPack',
    data,
    method: 'post'
  })
};
// 打包品取消审核
export const cancelAuditProductPack = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/cancelAuditProductPack',
    data,
    method: 'post'
  })
};
// 打包品上架
export const productPackNoSaleToCanSale = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/productPackNoSaleToCanSale',
    data,
    method: 'post'
  })
};
// 打包品下架
export const productPackCanSaleToNoSale = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/productPackCanSaleToNoSale',
    data,
    method: 'post'
  })
};
