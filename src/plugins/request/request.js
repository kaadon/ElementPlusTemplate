import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送前处理
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 根据业务逻辑判断请求是否成功
    if (res.code && res.code !== 200) {
      // 根据不同错误码处理不同情况
      if (res.code === 401) {
        // 未授权，跳转登录页或其他处理
      }
      // 显示错误消息
      const msg = res.message || '请求失败'
      ElMessage({
        message: msg,
        type: 'error',
        duration: 3000
      })
      return Promise.reject(new Error(msg))
    }
    return res
  },
  error => {
    // 处理HTTP错误状态码
    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '未授权，请登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `请求失败 ${error.response.status}`
      }
    } else if (error.request) {
      message = '无响应，请检查网络'
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 3000
    })
    
    return Promise.reject(error)
  }
)

/**
 * 封装的useRequest方法
 * @param {Function} api - API请求函数
 * @param {Object} options - 配置选项
 * @returns {Object} - 返回请求状态和方法
 */
export function useRequest(api, options = {}) {
  // 默认配置
  const defaultOptions = {
    immediate: false, // 是否立即请求
    initialData: null, // 初始数据
    formatResult: data => data, // 格式化结果函数
    onSuccess: () => {}, // 成功回调
    onError: () => {}, // 错误回调
    onFinally: () => {} // 最终回调
  }

  // 合并配置
  const { immediate, initialData, formatResult, onSuccess, onError, onFinally } = {
    ...defaultOptions,
    ...options
  }

  // 响应式状态
  const state = reactive({
    data: initialData, // 响应数据
    loading: false, // 加载状态
    error: null, // 错误信息
    params: null // 请求参数
  })

  // 执行请求的方法
  const run = async (params = {}) => {
    state.loading = true
    state.error = null
    state.params = params

    try {
      const response = await api(params)
      const formattedData = formatResult(response)
      state.data = formattedData
      onSuccess(formattedData, params)
      return formattedData
    } catch (error) {
      state.error = error
      onError(error, params)
      return Promise.reject(error)
    } finally {
      state.loading = false
      onFinally(params)
    }
  }

  // 重新执行请求
  const refresh = () => {
    return run(state.params)
  }

  // 取消加载状态
  const cancel = () => {
    state.loading = false
  }

  // 重置状态
  const reset = () => {
    state.data = initialData
    state.error = null
    state.loading = false
    state.params = null
  }

  // 立即执行
  if (immediate) {
    run()
  }

  return {
    ...toRefs(state),
    run,
    refresh,
    cancel,
    reset
  }
}

// 导出请求实例和HTTP方法封装
export default {
  // 提供axios实例
  service,
  
  // 基础请求方法
  request(config) {
    return service(config)
  },
  
  // GET请求
  get(url, params, config = {}) {
    return service({
      method: 'get',
      url,
      params,
      ...config
    })
  },
  
  // POST请求
  post(url, data, config = {}) {
    return service({
      method: 'post',
      url,
      data,
      ...config
    })
  },
  
  // PUT请求
  put(url, data, config = {}) {
    return service({
      method: 'put',
      url,
      data,
      ...config
    })
  },
  
  // DELETE请求
  delete(url, params, config = {}) {
    return service({
      method: 'delete',
      url,
      params,
      ...config
    })
  }
}
