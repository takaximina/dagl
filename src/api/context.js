import $http from '@/libs/axios'

/* 查询
 * @id menuType
 */
export const contextMenu = (data) => {
  return $http.request({
    api: 'user',
    url: '/context/enums/'+ data,
    method: 'get'
  })
};
/* 查询
 * @id menuType
 */
export const contextEnums = async (api) => {
  let data ;
  await $http.request({
    api: api,
    url: '/context/enums',
    method: 'get'
  }).then(res => {
    data = res
  });
  return data
};
/* 查询
 * @id menuType
 */
export const contextEnumsByApiType = async (api,type) => {
  return $http.request({
    api: api,
    url: '/context/enums/' + type,
    method: 'get'
  })
};
