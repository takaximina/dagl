import http from "@/libs/axios";
//获取所有的档案室数据
export const loadAllRoom=()=>{
    return http.request({
        url:'/archiveroom/findAll',
        api:'FILE',
        method:'post'
    })
}
//根据柜子id查找柜子实际存储情况，传输的参数为柜子的id
export const loadAmount=(data)=>{
    return http.request({
        url:'/archiveroom/findUseById',
        api:'FILE',
        data,
        method:'post'
    })
}
//查找具体存储的人员信息，参数为柜子id一级行列代码r，c
export const loadAmountByRC=(data)=>{
    return http.request({
        url:'/archiveman/queryByFilter',
        api:'FILE',
        data,
        method:'post'
    })
}
export const add=(data)=>{
    return http.request({
        url:'/archiveroom/add',
        api:'FILE',
        data,
        method:'post'
    })
}
export const update=(data)=>{
    return http.request({
        url:'/archiveroom/update',
        api:'FILE',
        data,
        method:'post'
    })
}
export const remove=(data)=>{
    return http.request({
        url:'/archiveroom/remove',
        api:'FILE',
        data,
        method:'post'
    })
}
