import {defineStore} from 'pinia';
import {computed, ref} from 'vue';

export const useUserStore = defineStore('user', () => {
    // 用户状态
    const user = ref(null);
    const wallet = ref(null);
    const token = ref('');

    // 计算属性：判断是否已登录
    const isLoggedIn = computed(() => !!token.value);

    // 登录方法
    function login(userData, userToken) {
        user.value = userData;
        token.value = userToken;
    }

    // 退出登录方法
    function logout() {
        user.value = null;
        token.value = '';
    }

    return {user, token, isLoggedIn,wallet,  /*function*/ login, logout};
}, {
    persist: {
        key: 'userStore', // 存储 key
        storage: localStorage, // 持久化到 localStorage
    }
});
