import apiConfig from '@/config/config.json';
import { getToken } from '@/libs/util'
import $http from '@/libs/axios'

export const getFileUrl = () => {
  // let sever = process.env.VUE_APP_API === 'mysTest' ? 'mys' : 'aly';
  let sever = process.env.VUE_APP_API || 'aly';
  return apiConfig[sever]['fileUrl']
};

export const getUploadUrl = ( api, url ) => {
  /*let sever = process.env.VUE_APP_API === 'mys' ? 'mys'
    : process.env.VUE_APP_API === 'mysTest' ? 'test'
      : 'aly';*/
  let sever = process.env.VUE_APP_API || 'aly';
  return apiConfig[sever][api] + url
};

export const getUploadHeader = ()=> {
  let token = getToken();
  return { Authorization: 'Bearer ' + token }
};

/* 删除文件
 * @id AppId
 */
export const removeFile = ( data ) => {
  return $http.request({
    api: 'BUSINESS',
    url: '/upload/remove',
    method: 'post',
    data
  })
};

