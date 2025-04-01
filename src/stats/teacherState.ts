import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";
import type {StudentType} from "@/stats/studentState";
import {type Ref, ref} from "vue";

export interface TeacherType {
    id: number;
    first_name: string;
    last_name: string;
    name?: string;
    email: string;
    password: string;
    parent_id: number;
    infos: Infos
    students?: StudentType[];
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

interface Infos {
    phone1: string;
    phone2?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    },
    gender?: 'male' | 'female';
    allergies?: string;
    birthday?: string;
    avatar?: string;
}
export const  teacherState = createGlobalState(() => {
    // const TeacherList = useStorage("TeacherList", [], undefined, {serializer: StorageSerializers.object})
    const TeacherList :Ref<TeacherType[]> = ref([])

    return {
        TeacherList,
    };

});
