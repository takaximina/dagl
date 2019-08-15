import $http from '@/libs/axios'
/*
 * 新增订单
 */
export const addOrder = (data) => {
  return $http.request({
    api: 'MES',
    url: '/ProductionOrder/add',
    data,
    method: 'post'
  })
};
/*
 * 删除订单
 */
export const removeOrder = (data) => {
  return $http.request({
    api: 'MES',
    url: '/ProductionOrder/delete',
    data,
    method: 'post'
  })
};
/*
 * 修改订单
 */
export const updateOrder = (data) => {
  return $http.request({
    api: 'MES',
    url: '/ProductionOrder/update',
    data,
    method: 'post'
  })
};
/*
 * id查询订单
 */
export const queryByIdOrder = (data) => {
  return $http.request({
    api: 'MES',
    url: '/ProductionOrder/queryById',
    data,
    method: 'post'
  })
};
/*
 * 查询往来单位 - 客户
 */
export const queryByPartnerType = (data) => {
  return $http.request({
    api: 'product',
    url: '/partner/queryByPartnerType',
    data,
    method: 'post'
  })
};

/****************   工单   ******************/
/*
 * 新增工单
 */
export const addWorkOrder = (data) => {
  return $http.request({
    api: 'MES',
    url: '/WorkOrder/add',
    data,
    method: 'post'
  })
};
/*
 * 删除工单
 */
export const removeWorkOrder = (data) => {
  return $http.request({
    api: 'MES',
    url: '/WorkOrder/delete',
    data,
    method: 'post'
  })
};
/*
 * 修改工单
 */
export const updateWorkOrder = (data) => {
  return $http.request({
    api: 'MES',
    url: '/WorkOrder/update',
    data,
    method: 'post'
  })
};
/*
 * id查询工单
 */
export const queryByIdWorkOrder = (data) => {
  return $http.request({
    api: 'MES',
    url: '/WorkOrder/queryById',
    data,
    method: 'post'
  })
};
/*
 * 订单id查询工单
 */
export const getWorkOrderListByProductionOrderId = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/WorkOrder/getWorkOrderListByProductionOrderId',
    data,
    method: 'post'
  })
};
/*
 * 工单状态提交
 */
export const updateWorkOrderStatus = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/WorkOrder/updateWorkOrderStatus',
    data,
    method: 'post'
  })
};
/*
 * 查询所有线别
 */
export const queryByDeletedAndTenantId = () => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/lineType/queryByDeletedAndTenantId',
    method: 'post'
  })
};
/*
 * 查询所有线别工位
 */
export const queryAss = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/assembleStation/queryByDeletedAndTenantIdAndLineTypeDo',
    method: 'post',data
  })
};
/*
 * 查询所有工序
 */
export const prsQueryById = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/productProcess/queryByProductMesId',
    method: 'post',
    data
  })
};

/*
 * 查询产品码
 */
export const queryChassisCodeByWorkOrderId = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/WorkOrder/queryChassisCodeByWorkOrderId',
    method: 'post',
    data
  })
};
/*
 * 自动生成产品码
 */
export const saveAutoChassisCode = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/WorkOrder/saveAutoChassisCode',
    method: 'post',
    data
  })
};
/*
 * 保存手动输入的产品码
 */
export const saveChassisCode = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/WorkOrder/saveChassisCode',
    method: 'post',
    data
  })
};
/*
 * 快速生成工单
 */
export const autoAddWorkOrder = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/WorkOrder/autoAddWorkOrder',
    method: 'post',
    data
  })
};
/*
 * 删除工单条码
 */
export const deletedChassisCodeByWorkOrderId = (data) => {
  return $http.request({
    api: 'MES',
    noSpin: true,
    url: '/WorkOrder/deletedChassisCodeByWorkOrderId',
    method: 'post',
    data
  })
};

/**/

