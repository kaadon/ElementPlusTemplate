import axios from 'axios';

import useRequestError from "@/utils/request/error.js";

// 提取基础 URL，便于后续维护
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 创建 axios 实例
const service = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器：自动在请求头添加 token
service.interceptors.request.use(
    (config) => {
        // 获取 token（如果存在），统一加入 Authorization
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 根据请求方法设置不同的 header
        const method = config.method ? config.method.toLowerCase() : '';
        switch (method) {
            case 'post':
                // POST 请求：通常使用 JSON 格式传输数据
                config.headers['Content-Type'] = 'application/json';
                // 你也可以加入其他专属于 POST 的 header
                break;
            case 'get':
                // GET 请求：通常只需要接受 JSON 数据
                config.headers['Accept'] = 'application/json';
                break;
            case 'options':
                // OPTIONS 请求：可自定义处理逻辑
                config.headers['X-Options-Header'] = 'your-options-value';
                break;
            case 'delete':
                // DELETE 请求：示例添加特定 header
                config.headers['X-Delete-Header'] = 'your-delete-value';
                break;
            default:
                // 对于其他请求方法，如 PUT、PATCH，可在这里添加相应逻辑
                break;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// 响应拦截器：统一处理响应错误
service.interceptors.response.use(
    (response) => {
        const { code, message, data } = response.data;
        if (code !== 200) {
            return Promise.reject(response.data);
        }
        return data;
    },
    (error) => {
        useRequestError(error);
        return Promise.reject(error);
    }
);

export default service;
