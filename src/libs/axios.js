import axios from 'axios'
import { Message , Spin } from 'iview'
import { getToken } from '@/libs/util'
import apiConfig from '@/config/config.json'
// axios实例
let instance = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {'Content-Type': 'application/json'}
});
//
const getApi = async (api)=>{
  // let json = '';
  // await axios.get('').then( res => {
  //   json = res;
  // });
  /*let sever = process.env.VUE_APP_API === 'mys' ? 'mys'
    : process.env.VUE_APP_API === 'mysTest' ? 'test'
      : 'aly';*/
  let sever = process.env.VUE_APP_API || 'aly';

  return apiConfig[sever][api];
};
// 添加请求拦截器
instance.interceptors.request.use(async function (config) {
  // 在发送请求之前做些什么
  // 获取实际请求地址，
  // token
  if( config.dashboard ){
    let api = await getApi(config.api);
    config.url = api + config.url;
    delete config.api;
    delete config.dashboard;
    return config;
  }
  let token = getToken();
  // 登陆超时
  if (token === 0) {
    window.localStorage.clear();
    window.sessionStorage.clear();
    alert('登陆超时，请重新登陆');
    window.location.reload();
    return false;
  }
  if(!config.noSpin){
    Spin.show();
  }else{
    delete config.noSpin;
  }
  let api = await getApi(config.api);
  config.url = api + config.url;
  delete config.api;

  if (token && token != '') {
    config.headers['Authorization'] = 'Bearer ' + token
  } else {
    delete config.headers['Authorization']
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  Spin.hide();
  Message.error('请求错误');
  console.log(error);
  return Promise.reject(error);
});
// 添加响应拦截器
instance.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  Spin.hide();
  let res_ = res.data;
  if(res_.code != '0'){
    Message.error({ content: (!res_.message || res_.message=='null')?  '服务器异常，请联系管理员': res_.message });
    return false;
  }
  if( typeof res_.data === 'boolean'){
    return res_.data
  }
  if( !res_.data ){
    return true
  }
  return res_.data;
}, function (error) {
  // 对响应错误做点什么
  Spin.hide();
  Message.error('无法响应该请求，请联系管理员');
  console.log(error);
  return Promise.reject(error);
});

export default instance
