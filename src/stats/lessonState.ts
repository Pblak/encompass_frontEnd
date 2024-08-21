import {createGlobalState, useStorage, StorageSerializers, type RemovableRef} from "@vueuse/core";
import {type Ref, ref} from "vue";

export interface Lesson {
    id: number,
    [key: string]: any
}

export const lessonState = createGlobalState(() => {
    // LessonList contains all the lessons
    // const LessonList: RemovableRef<Lesson[]> = useStorage("LessonList", [], undefined, {serializer: StorageSerializers.object})
    // const LessonsSelected: RemovableRef<Lesson> = useStorage("LessonsSelected", [], undefined, {serializer: StorageSerializers.object})

    const LessonList :Ref<Lesson[]> = ref([])
    const LessonsSelected :Ref<Lesson[]> = ref([])
    return {
        LessonList,
        LessonsSelected
    };

});
