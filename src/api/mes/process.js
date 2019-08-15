import $http from '@/libs/axios'
/*
 * 查询所有流程
 */
export const getWorkflowList = () => {
  return $http.request({
    api: 'MES',
    noSpin: 1,
    url: '/Task/getWorkflowList',
    method: 'post'
  })
};
/*
 * 新增流程
 */
export const addWorkflow = (data) => {
  return $http.request({
    api: 'MES',
    url: '/Task/addWorkflow',
    method: 'post',
    data
  })
};
/*
 * 新增流程节点
 */
export const addWorkflowNode = (data) => {
  return $http.request({
    api: 'MES',
    url: '/Task/addWorkflowNode',
    method: 'post',
    data
  })
};
/*
 * 查询流程节点
 */
export const getWorkflowNodeList = (data) => {
  return $http.request({
    api: 'MES',
    url: '/Task/getWorkflowNodeList',
    method: 'post',
    noSpin: 1,
    data
  })
};
