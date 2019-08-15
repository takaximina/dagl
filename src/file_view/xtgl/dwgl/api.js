import http from "@/libs/axios";
export const loadUnitData = (data) => {
    return http.request({
        url: '/unit/findAll',
        api: 'FILE',
        data,
        method: 'post'
    })
}
export const addUnitData = (data) => {
    return http.request({
        url: '/unit/add',
        api: 'FILE',
        data,
        method: 'post'
    })
}
export const updateUnitData = (data) => {
    return http.request({
        url: '/unit/update',
        api: 'FILE',
        data,
        method: 'post'
    })
}
export const delUnitData = (data) => {
    return http.request({
        url: '/unit/remove',
        api: 'FILE',
        data,
        method: 'post'
    })
}