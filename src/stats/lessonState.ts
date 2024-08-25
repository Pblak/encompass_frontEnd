import {createGlobalState, useStorage, StorageSerializers, type RemovableRef} from "@vueuse/core";
import {type Ref, ref} from "vue";

export interface LessonType {
    id: number,
    [key: string]: any
}

export const lessonState = createGlobalState(() => {
    const LessonList :Ref<LessonType[]> = ref([])
    const LessonsSelected :Ref<LessonType[]> = ref([])
    return {
        LessonList,
        LessonsSelected
    };

});
