import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 创建 axios 实例
const instance = axios.create({
    baseURL: BASE_URL, // 你的 API 地址
    timeout: 10000, // 超时时间
    headers: { 'Content-Type': 'application/json' },
})

// 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        console.log('请求发送:', config)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    (response) => {
        console.log('响应数据:', response.data)
        return response.data
    },
    (error) => {
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// **封装 axios hook**
export function useAxios(url, method = 'get', requestData = null, options = {}) {
    const data = ref(null)
    const error = ref(null)
    const loading = ref(false)

    const fetchData = async () => {
        loading.value = true
        try {
            const response = await instance({ url, method, data: requestData, ...options })
            data.value = response
        } catch (err) {
            error.value = err
        } finally {
            loading.value = false
        }
    }

    // 立即执行请求
    fetchData()

    return { data, error, loading, refetch: fetchData }
}
