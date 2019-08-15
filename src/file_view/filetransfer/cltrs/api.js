import http from "@/libs/axios";
export const getUserList=(data)=>{
    return http.request({
        api:'FILE',
        url:'/archiveman/queryByFilter',
        data,
        method:'post'
    })
}
export const addArchive=(data)=>{
    return http.request({
        api:'FILE',
        url:'/archiveMove/addArchiveItem',
        data,
        method:'post'
    })
}