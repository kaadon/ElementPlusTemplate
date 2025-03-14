// error.js
import { showToast, showDialog } from 'vant';

/**
 * 处理 axios 请求错误，根据不同的错误状态显示不同的提示信息
 * @param {Object} error - axios 捕获到的错误对象
 */
function useRequestError(error) {
    if (error.response) {
        const { status, data } = error.response;
        switch (status) {
            case 400:
                showToast(data.message || '请求参数错误');
                break;
            case 401:
                showDialog({
                    title: '未授权',
                    message: '登录状态已过期，请重新登录'
                }).then(() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                });
                break;
            case 403:
                showToast('没有权限访问');
                break;
            case 404:
                showToast('请求资源不存在');
                break;
            case 500:
                showToast('服务器内部错误');
                break;
            default:
                showToast(data.message || `请求错误，状态码：${status}`);
                break;
        }
    } else {
        // 当 error 中没有 response 时，可能是网络错误或请求超时
        showToast('网络连接异常，请稍后再试');
    }
    // 输出错误日志，便于调试
    console.error('请求错误：', error);
}

export default useRequestError;
