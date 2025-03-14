import { ref, watchEffect, onUnmounted } from 'vue';
import axios from 'axios';

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios 拦截器（可选）
axiosInstance.interceptors.response.use(
    response => response.data,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// **封装 useAxios 组合式 API**
export function useAxios(url, options = {}) {
    const data = ref(null);
    const error = ref(null);
    const loading = ref(false);
    const controller = new AbortController(); // 用于取消请求

    // 发送请求的核心函数
    const fetchData = async (newOptions = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await axiosInstance({
                url,
                method: options.method || 'GET',
                ...options,
                ...newOptions,
                signal: controller.signal, // 绑定取消控制
            });
            data.value = response;
        } catch (err) {
            error.value = err.response?.data || err.message;
        } finally {
            loading.value = false;
        }
    };

    // 自动请求（如果 `options.immediate = true`）
    if (options.immediate !== false) {
        watchEffect(fetchData);
    }

    // 组件卸载时取消请求
    onUnmounted(() => controller.abort());

    return { data, error, loading, fetchData };
}
