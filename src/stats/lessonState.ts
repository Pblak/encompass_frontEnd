import {createGlobalState} from "@vueuse/core";
import {type Ref, ref} from "vue";
import type {LessonInstanceType} from "@/stats/lessonInstanceState";

export interface LessonType {
    id: number,
    instances: LessonInstanceType[],
    price: number,
    payed_price: number,

    [key: string]: any
}

export const lessonState = createGlobalState(() => {
    const LessonList: Ref<LessonType[]> = ref([])
    const withTrashLesson = ref(false)
    const LessonsSelected: Ref<LessonType[]> = ref([])


    return {
        LessonList,
        LessonsSelected,
        withTrashLesson,
    };

});
