import $http from '@/libs/axios'
/*
 * 查询所有流程
 */
export const getWorkflowList = (data) => {
  return $http.request({
    api: 'MES',
    url: '/Task/getWorkflowList',
    data,
    method: 'post'
  })
};
/*
 * id查询流程节点
 */
export const getWorkflowNodeList = (data) => {
  return $http.request({
    api: 'MES',
    url: '/Task/getWorkflowNodeList',
    data,
    method: 'post'
  })
};
