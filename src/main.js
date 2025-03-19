import App from './App.vue'
import {createApp} from 'vue'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createHead } from '@vueuse/head'

const app = createApp(App);
app.use(ElementPlus,{
    locale: zhCn,
});
const head = createHead()
import router from './router'
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(head);
app.use(router);
app.mount('#app')


