import $http from '@/libs/axios'

/* 查询字典
 * @id APPid
 */
export const listAppDict = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/listAppDict',
    data,
    method: 'post'
  })
};

/* 保存字典
 * @appId
 * @id
 * @name
 * @code
 * @remark
 * @scope
 */
export const saveDict = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/saveDict',
    data,
    method: 'post'
  })
};

/* 删除字典
 * @id dictId
 */
export const deleteDict = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/deleteDict',
    data,
    method: 'post'
  })
};
/* 查询字典值列表
 * @id dictId
 */
export const listAppDictValue = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/listAppDictValue',
    data,
    method: 'post'
  })
};
/* 查询字典值列表 BY code
 * @id dictId
 */
export const listAppDictValueByCode = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/listAppDictValueByCode',
    data,
    method: 'post'
  })
};
/* 保存字典值列表
 *
 */
export const saveDictValue = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/saveDictValue',
    data,
    method: 'post'
  })
};
/* 删除字典值列表
 * @id dictValId
 */
export const deleteDictValue = (data) => {
  return $http.request({
    api: 'user',
    url: '/app/deleteDictValue',
    data,
    method: 'post'
  })
};

