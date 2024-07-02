import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";


export const  teacherState = createGlobalState(() => {
    const TeacherList = useStorage("TeacherList", [], undefined, {serializer: StorageSerializers.object})

    return {
        TeacherList,
    };

});
