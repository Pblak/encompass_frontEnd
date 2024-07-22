import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";


export const  lessonInstanceState = createGlobalState(() => {
    const LessonInstanceList = useStorage("instrumentList", [], undefined, {serializer: StorageSerializers.object})

    return {
        LessonInstanceList,
    };

});
