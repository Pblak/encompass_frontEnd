import {createGlobalState} from "@vueuse/core";
import type {LessonType} from "@/stats/lessonState";
import {type Ref, ref, watch} from "vue";

export interface StudentType {
    id: number;
    first_name: string;
    last_name: string;
    username:string;
    name?: string,
    email: string;
    password: string;
    parent_id: number;
    infos: Infos,
    lessons?: LessonType[],
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

interface Infos {
    username: string;
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
    [key: string]: any;
}

export const studentState = createGlobalState(() => {
    const StudentList: Ref<StudentType[]> = ref([])
    const withTrashStudent = ref(false)


    return {
        StudentList,
        withTrashStudent,
    };

});
