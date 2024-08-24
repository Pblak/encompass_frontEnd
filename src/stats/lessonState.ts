import {createGlobalState, useStorage, StorageSerializers, type RemovableRef} from "@vueuse/core";
import {type Ref, ref} from "vue";

export interface LessonType {
    id: number,
    [key: string]: any
}

export const lessonState = createGlobalState(() => {
    // LessonList contains all the lessons
    // const LessonList: RemovableRef<Lesson[]> = useStorage("LessonList", [], undefined, {serializer: StorageSerializers.object})
    // const LessonsSelected: RemovableRef<Lesson> = useStorage("LessonsSelected", [], undefined, {serializer: StorageSerializers.object})

    const LessonList :Ref<LessonType[]> = ref([])
    const LessonsSelected :Ref<LessonType[]> = ref([])
    return {
        LessonList,
        LessonsSelected
    };

});
