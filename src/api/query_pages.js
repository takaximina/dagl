import $http from '@/libs/axios';

export const queryForm = async ( data, api ) => {
  await $http.request({
    api: api,
    data,
    noSpin: true,
    url: '/context/services',
    method: 'post'
  }).then(res=>{
    data = res
  });
  return data;
};

export const queryPages = (data, url, api) => {
  return $http.request({
    api: api,
    url: url,
    noSpin: true,
    data,
    method: 'post'
  })
};
