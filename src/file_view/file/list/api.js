import http from "@/libs/axios";
//新增人员api
export const addPerson=(data)=>{
    return http.request({
        api:'FILE',
        url:'/archiveman/add',
        data,
        method:'post'
    })
}
//更新人员api
export const updatePerson=(data)=>{
    return http.request({
        api:'FILE',
        url:'/archiveman/update',
        data,
        method:'post'
    })
}
//删除人员api
export const deletePerson=(data)=>{
    return http.request({
        api:'FILE',
        url:'/archiveman/remove',
        data,
        method:'post'
    })
}
//获取所有人员的档案列表
export const loadTreeData=(data)=>{
    return http.request({
        api:'FILE',
        data,
        url:'/archiveman/findItemByManId',
        method:'post'
    })
}
export const saveFile=(data)=>{
    return http.request({
        api:'FILE',
        data,
        url:'/archiveman/addArchiveItem',
        method:'post'
    })
}
export const deleteFile=(data)=>{
    return http.request({
        api:'FILE',
        url:'/archiveman/removeArchiveItem',
        data,
        method:'post'
    })
};
//获取单个人员详细资料
export const loadPersonData=(data)=>{
    return http.request({
        api:'FILE',
        url:'/archiveman/queryById',
        data,
        method:'post'
    })
}