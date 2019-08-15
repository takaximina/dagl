import http from '@/libs/axios';
export const queryPerson = (data) => {
    return http.request({
        method: 'post',
        api: 'FILE',
        data: {
            "condition": {
            },
            "pageIndex": 0,
            "pageSize": 10,
            "searchText":data
        },
        url: '/archiveman/queryByFilter'
    })
}
export const loadTreeData=(data)=>{
    return http.request({
        api:'FILE',
        data,
        url:'/archiveman/findItemByManId',
        method:'post'
    })
}
/**
 * 找出管理部门中的所有人提供给 前台选择批准人 
 * */ 
export const loadAdmin=()=>{
    return http.request({
        api:'FILE',
        data:{
            "condition": "1438c34c-8ccf-4e17-b8e0-bad5e7e5e1f9",
            "pageIndex": 0,
            "pageSize": 999,
            "searchText": ""
          },
        url:'/ent/personnel/listByDept',
        method:'post'
    })
}
export const borrow=(data)=>{
    return http.request({
        api:'FILE',
        data,
        url:'/archiveborrow/add',
        method:'post'
    })
}