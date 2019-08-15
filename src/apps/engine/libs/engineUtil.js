/**
 * Engine Version 5.0 公共方法
 * build by lijj 2019-01-02
 */
import $http from "@/libs/axios"
import store from '@/store'
//根据id获取存储的引擎模型
export const loadEngineById = (id) => {
  let data = id
  return $http.request({
    api: "user",
    url: "/engine/getEngineById",
    data,
    method: "post"
  })
}
/*保存一个引擎模型*/
export const saveEngine = (data) => {
  return $http.request({
    api: "user",
    url: "/engine/saveEngine",
    data,
    method: "post"
  })
}
/*请求执行查询sql返回值*/
export const loadSqlResult = (sql) => {

  /** Replace the context params */
  let userInfo = store.getters.userInfo;
  sql = sql.replace(/@userId/g, userInfo.userId);
  sql = sql.replace(/@userName/g, userInfo.userName);
  sql = sql.replace(/@userType/g, userInfo.userType);
  sql = sql.replace(/@tenantId/g, userInfo.tenantId);
  sql = sql.replace(/@entId/g, userInfo.entId);
  sql = sql.replace(/@deptId/g, userInfo.deptId);
  sql = sql.replace(/@personnelId/g, userInfo.personnelId);
  sql = sql.replace(/@appId/g, userInfo.appId);
  /**Replace the url params */
  let search = location.search;
  let urlPars = [];
  if (search && search.indexOf('?') != -1) {
    let parArr = search.replace('?', '').split('&');
    for (let temp of parArr) {
      if (temp.indexOf('=') != -1) {
        urlPars.push({
          key: temp.split('=')[0],
          value: temp.split('=')[1]
        });
      }
    }
  }
  for (let p of urlPars) {
    sql = sql.replace(new RegExp("@@" + p.key, "g"), p.value);
  }
  let Base64 = require("js-base64").Base64;
  let data = {
    sql: Base64.encode(sql)
  }
  /**exchange 0 and 1 char simple encryption */
  let arr = data.sql.split('');
  let a = arr[0];
  let b = arr[1];
  arr[0] = b;
  arr[1] = a;
  data.sql = arr.join('');
  console.log(data.sql);
  return $http.request({
    api: "user",
    url: "/engine/getSourceData",
    data,
    noSpin: 1,
    maxContentLength: 20 * 1024,
    method: "post"
  })
}
/*返回克隆对象*/
export const cloneObject = (object) => {
  return JSON.parse(JSON.stringify(object))
}
