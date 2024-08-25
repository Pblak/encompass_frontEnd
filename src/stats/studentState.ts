import {createGlobalState} from "@vueuse/core";
import type {LessonType} from "@/stats/lessonState";
import {type Ref, ref} from "vue";

export interface StudentType {
    id: number;
    first_name: string;
    last_name: string;
    name?:string,
    email: string;
    password: string;
    parent_id: number;
    infos: Infos,
    lessons?:LessonType[],
    created_at?: string;
    updated_at?: string;
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
}

export const studentState = createGlobalState(() => {
    const StudentList :Ref<StudentType[]> = ref([])

    return {
        StudentList,
    };

});
