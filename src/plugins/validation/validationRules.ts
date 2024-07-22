import {type App} from 'vue';
import __ from './core';

export default {
    install(app: App) {
        app.config.globalProperties.$rules = __;
    }
};