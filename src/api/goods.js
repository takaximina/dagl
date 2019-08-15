import $http from '@/libs/axios'

export const listProductClassTree = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/listProductClassTree',
    data,
    method: 'post'
  })
};

export const listProductClassAttrByClassId = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/listProductClassAttrByClassId',
    data,
    method: 'post'
  })
};

export const listProductClassAttrValueByAttributeId = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/listProductClassAttrValueByAttributeId',
    data,
    method: 'post'
  })
};

export const listProductBrandByClassId = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/listProductBrandByClassId',
    data,
    method: 'post'
  })
};

export const getProductClassAttrByAttributeId = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/getProductClassAttrByAttributeId',
    data,
    method: 'post'
  })
};

export const removeProductClassAttr = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/removeProductClassAttr',
    data,
    method: 'post'
  })
};

export const saveProductClassAttr = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/saveProductClassAttr',
    data,
    method: 'post'
  })
};

export const getProductClassAttrValueById = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/getProductClassAttrValueById',
    data,
    method: 'post'
  })
};

export const removeProductClassAttrValue = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/removeProductClassAttrValue',
    data,
    method: 'post'
  })
};

export const saveProductClassAttrValue = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/saveProductClassAttrValue',
    data,
    method: 'post'
  })
};

export const getProductBrandByBrandId = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/getProductBrandByBrandId',
    data,
    method: 'post'
  })
};

export const removeProductBrand = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/removeProductBrand',
    data,
    method: 'post'
  })
};

export const saveProductBrand = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/saveProductBrand',
    data,
    method: 'post'
  })
};

export const saveProductClass = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/saveProductClass',
    data,
    method: 'post'
  })
};

export const removeProductClass = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/removeProductClass',
    data,
    method: 'post'
  })
};
//商品
export const listProductAndOther = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/queryProductByFilter',
    data,
    method: 'post'
  })
};

export const listProductAttrAndAttrValue = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/queryProductAttrByClassId',
    data,
    method: 'post'
  })
};

export const listProductAttrEditByProductId = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/listProductAttrEditByProductId',
    data,
    method: 'post'
  })
};

export const removeProduct = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/removeProduct',
    data,
    method: 'post'
  })
};

export const updateProduct = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/updateProduct',
    data,
    method: 'post'
  })
};

export const saveProduct = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/saveProduct',
    data,
    method: 'post'
  })
};

export const listProductSKU = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/listProductSKU',
    data,
    method: 'post'
  })
};

// sku 分页
export const listSkuBySkuName = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/listSkuBySkuName',
    data,
    method: 'post'
  })
};

// sku 修改品类父级
export const updateParent = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/updateParent',
    data,
    method: 'post'
  })
};

// sku 修改
export const updateSku = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/updateSku',
    data,
    method: 'post'
  })
};

// sku 删除
export const removeSku = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/removeSku',
    data,
    method: 'post'
  })
};

// sku检查可否删除
export const isCanRemoveSku = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/isCanRemoveSku',
    data,
    method: 'post'
  })
};

// spu检查可否删除
export const isCanRemoveSpu = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/isCanRemoveSpu',
    data,
    method: 'post'
  })
};

/* 往来单位 */
// 新增
export const addPartner = (data) => {
  return $http.request({
    api: 'product',
    url: '/partner/add',
    data,
    method: 'post'
  })
};
// 删除
export const removePartner = (data) => {
  return $http.request({
    api: 'product',
    url: '/partner/remove',
    data,
    method: 'post'
  })
};
// 修改
export const updatePartner = (data) => {
  return $http.request({
    api: 'product',
    url: '/partner/update',
    data,
    method: 'post'
  })
};
// 根据ID 查询
export const queryByPartnerId = (data) => {
  return $http.request({
    api: 'product',
    url: '/partner/queryById',
    data,
    method: 'post'
  })
};
/* 往来单位 end */



// idList查询sku
export const querySkuByView = (data) => {
  return $http.request({
    api: 'product',
    url: '/product/querySkuByView',
    data,
    method: 'post'
  })
};


