import {createGlobalState, StorageSerializers, useStorage} from "@vueuse/core";

export interface StudentType {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    parent_id: number;
    infos?: Infos
    created_at?: string;
    updated_at?: string;
}

interface Infos {
    phone1: string;
    phone2: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    },
    gender?: 'man' | 'female';
    allergies?: string;
    birthday?: string;
}

export const studentState = createGlobalState(() => {
    const StudentList = useStorage("studentList", [], undefined, {serializer: StorageSerializers.object})

    return {
        StudentList,
    };

});
