
import {createGlobalState, useStorage, StorageSerializers, type RemovableRef} from "@vueuse/core";

export interface Lesson {
    id:number,
    [key: string]: any
}
export const  lessonState = createGlobalState(() => {
    // LessonList contains all the lessons
    const LessonList:RemovableRef<Lesson[]> = useStorage("LessonList", [], undefined, {serializer: StorageSerializers.object})
    const LessonsSelected:RemovableRef<Lesson> = useStorage("LessonsSelected", [], undefined, {serializer: StorageSerializers.object})
    return {
        LessonList,
        LessonsSelected
    };

});
