import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import "@/assets/css/_icons.css"
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, fa } from 'vuetify/iconsets/fa'

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'fa',
        aliases,
        sets: {
            fa,
        },
    },
})
const app = createApp(App)
app.use(Vue3Toastify, {
    autoClose: 5000,
    position: 'bottom-right',
} as ToastContainerOptions);
app.use(router)
app.use(vuetify)
app.mount('#app')
