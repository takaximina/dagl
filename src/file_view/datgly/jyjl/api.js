import http from "@/libs/axios";
export const loadBrowsById=(data)=>{
    return http.request({
        api:'FILE',
        data,
        url:'/archiveborrow/findItemByBorrowId',
        method:'post'
    })
}