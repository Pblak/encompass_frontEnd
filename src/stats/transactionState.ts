import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";
import {ref, type Ref} from "vue";
import type {LessonType} from "@/stats/lessonState";

export interface TransactionType {
    id?: number,
    amount: number,
    lesson_id: number,
    currency?: string,
    status?: string,
    payment_method: string,
    notes?: string,
    [key: string]: any,
    created_at?: string,
    updated_at?: string,
}

export const  transactionState = createGlobalState(() => {
    const TransactionList :Ref<TransactionType[]> = ref([])
    
    return {
        TransactionList,
    };
});
