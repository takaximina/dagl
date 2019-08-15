import http from "@/libs/axios";
export const loadAllData=()=>{
    return http.request({
        url:'/archiveclass/findAll',
        api:'FILE',
        method:'post'
    })
}
export const addMlData=(data)=>{
    return http.request({
        url:'/archiveclass/add',
        api:'FILE',
        data,
        method:'post'
    })
}
export const ediMlData=(data)=>{
    return http.request({
        url:'/archiveclass/update',
        api:'FILE',
        data,
        method:'post'
    })
}