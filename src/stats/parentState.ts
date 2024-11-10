import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";
import type {StudentType} from "@/stats/studentState";
import {type Ref, ref} from "vue";
import type {LessonType} from "@/stats/lessonState";
export interface ParentType {
    id: number;
    first_name: string;
    last_name: string;
    name?: string,
    email: string;
    password: string;
    parent_id: number;
    infos: Infos
    students?: StudentType[];
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

export const  parentState = createGlobalState(() => {
    // const ParentList= useStorage<ParentType[]>("parentList", [], undefined, {serializer: StorageSerializers.object})
    const ParentList:Ref<ParentType[]> = ref([])
    const withTrashParent = ref(false)
    return {
        ParentList,
        withTrashParent,
    };

});
