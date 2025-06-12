// src/shims-vue.d.ts

import { ComponentCustomProperties } from 'vue';

declare module '@vue/runtime-core' {
    /**
     * $rules('required', 'First Name')
     * $rules('required|max:255', 'First Name')
     */
    interface ComponentCustomProperties {
        $rules: (rule: string, fieldName: string) => Array<(v: any) => boolean | string>;
    }
}

declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

