import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";
import {type Ref, ref} from "vue";
import type {Lesson} from "@/stats/lessonState";


export const  lessonInstanceState = createGlobalState(() => {
    // const LessonInstanceList = useStorage("instrumentList", [], undefined, {serializer: StorageSerializers.object})
    const LessonInstanceList:Ref<Lesson[]> = ref([])

    return {
        LessonInstanceList,
    };

});
