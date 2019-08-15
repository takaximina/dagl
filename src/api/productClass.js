import $http from '@/libs/axios'

// 前台分类
export const listProductClass = (data) => {
  return $http.request({
    api: 'product',
    url: '/viewclass/listViewProductClass',
    data,
    method: 'post'
  })
};

export const saveProductClass = (data) => {
  return $http.request({
    api: 'product',
    url: '/viewclass/saveViewProductClass',
    data,
    method: 'post'
  })
};

export const removeProductClass = (data) => {
  return $http.request({
    api: 'product',
    url: '/viewclass/removeViewProductClass',
    data,
    method: 'post'
  })
};

export const listBackProductClass = (data) => {
  return $http.request({
    api: 'product',
    url: '/productClass/listProductClassTree',
    data,
    method: 'post'
  })
};

export const listBackProductClassById = (data) => {
  return $http.request({
    api: 'product',
    url: '/viewclass/listClassByViewClassId',
    data,
    method: 'post'
  })
};

export const saveBackProduct = (data) => {
  return $http.request({
    api: 'product',
    url: '/viewclass/saveViewClassAndClass',
    data,
    method: 'post'
  })
};
