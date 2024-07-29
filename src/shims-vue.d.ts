// src/shims-vue.d.ts
declare module '@vue/runtime-core' {
    /**
     * $rules('required', 'First Name')
     * $rules('required|max:255', 'First Name')
     */
    interface ComponentCustomProperties {

        $rules: (rule: string, fieldName: string) => Array<(v: any) => boolean | string>;
    }
}
