import http from "@/libs/axios";
export const loadTreeData=(data)=>{
    return http.request({
        api:'FILE',
        data,
        url:'/archiveman/findItemByManId',
        method:'post'
    })
}
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
export const saveFile=(data)=>{
    return http.request({
        api:'FILE',
        data,
        url:'/archiveman/addArchiveItem',
        method:'post'
    })
}