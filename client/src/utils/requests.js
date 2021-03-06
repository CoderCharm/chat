import axios from 'axios'
import concatUrl from '@/utils/url';
import { Toast } from 'vant';

// 创建axios实例
const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // baseURL: 'http://127.0.0.1:5000/api', // url = base url + request url
    timeout: 50000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});


// axios request拦截器
service.interceptors.request.use(
    async config => {
        // do something before request is sent
        window.console.log("请求拦截");
        // 1.当发送网络请求时, 在页面中添加一个loading组件, 作为动画

        // 2.某些请求要求用户必须登录, 判断用户是否有token, 如果没有token跳转到login页面
        let authInfo = JSON.parse(localStorage.getItem("authInfo"));
        if(authInfo){
            config.headers.token = authInfo.token
        }else{
            window.console.log("没有获取到token")
        }

        // 3.对请求的参数进行序列化(看服务器是否需要序列化)
        // config.data = qs.stringify(config.data)
        // console.log(config);
        return config
    },
    error => {
        // do something with request error
        window.console.log(error); // for debug
        return Promise.reject(error)
    }
);

// axios response 拦截器
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */
    response => {
        const res = response.data;
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200) {
            // window.console.log(res)
            Toast.fail(res.message);
            // throw new Error(res.message)
            return false
            // Promise.reject(res.message)
            // return Promise.reject(error.response.data)
        } else {
            return res.data
        }
    },
    error => {
        window.console.log('err' + error); // for debug
        // tip("网络错误!", "error");
        Toast.fail(`网络错误:${error}`)
        return Promise.reject(error)
    }
);


export const requests = (url, method = 'POST', data = {}) => {
    let requestUrl = concatUrl(url);

    window.console.log('请求链接: ',requestUrl);

    // 参数配置 如果是get方法就 设置成params 参数， 其他则设置成data参数
    let reConfig = method.toLocaleUpperCase() === "GET" ? {
        method,
        url: requestUrl,
        params: data
    } : {
        method,
        url: requestUrl,
        data
    };

    return service(reConfig);
};


export default requests
