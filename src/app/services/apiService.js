import axios from 'axios';

const apiService = axios.create({
  baseURL: 'http://localhost:5000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});
// apiService.interceptors.request.use((config) => {
//   if (!config.url) {
//     return config;
//   }

//   const currentUrl = new URL(config.url, config.baseURL);
//   // parse pathName to implement variables
//   Object.entries(config.urlParams || {}).forEach(([k, v]) => {
//     currentUrl.pathname = currentUrl.pathname.replace(`:${k}`, encodeURIComponent(v));
//   });

//   const authPart =
//     currentUrl.username && currentUrl.password
//       ? `${currentUrl.username}:${currentUrl.password}`
//       : '';
//   return {
//     ...config,
//     baseURL: `${currentUrl.protocol}//${authPart}${currentUrl.host}`,
//     url: currentUrl.pathname,
//   };
// });

// // use like :
// apiService.get('/issues/:uuid', {
//    urlParams : {
//        uuid: '123456789'
//    }
// })
export default apiService;
