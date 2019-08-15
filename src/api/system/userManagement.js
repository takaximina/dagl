import $http from '@/libs/axios'

// 查询企业部门
export const dept = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/dept/' + data,
    method: 'get'
  })
};
// 查询部门人员
export const listByDept = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/personnel/listByDept',
    data,
    method: 'post'
  })
};
// 保存企业部门
/*{
  "entId": "string",
  "id": "string",
  "name": "string",
  "parentId": "string"
}*/
export const saveEntDept = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/saveEntDept',
    data,
    method: 'post'
  })
};
// 删除企业部门
/*{
  "entId": "string",
  "id": "string",
  "name": "string",
  "parentId": "string"
}*/
export const deptDel = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/dept/del/'+ data,
    method: 'post'
  })
};
// 保存人员
/*{
  "deptId": "string",
  "email": "string",
  "name": "string",
  "sex": "Male",
  "tel": "string"
}*/
export const savePersonnel = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/savePersonnel',
    data,
    method: 'post'
  })
};
// 删除人员
export const personnelDel = (data) => {
  return $http.request({
    api: 'user',
    url: '/ent/deletePersonnel',
    data,
    method: 'post'
  })
};
