
import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";


export const  lessonState = createGlobalState(() => {
    const LessonList = useStorage("LessonList", [], undefined, {serializer: StorageSerializers.object})
    const LessonsSelected = useStorage("LessonsSelected", [], undefined, {serializer: StorageSerializers.object})
    return {
        LessonList,
        LessonsSelected
    };

});
