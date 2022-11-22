import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import AntDesign from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css'
import './assets/main.css'

const app = createApp(App)

app.use(AntDesign)
app.use(createPinia())
app.use(router)
app.mount('#app')

import './plugins/axios'
import './plugins/routerGuard'
